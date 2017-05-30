import { Conf } from "./conf";
import * as moment from "moment";
import * as client from "cheerio-httpcli";
import * as url from "url";
import * as fs from "fs";
import { Pagesdb } from "./pagesdb";
import * as request from "request";

export class Page {
    private site_title: string;
    private pageurl: string;
    private id: number;
    private imgid: number;

    private page_title: string;

    constructor(site_title: string, pageurl: string, id: number) {
        this.site_title = site_title;
        this.pageurl = pageurl;
        this.id = id;
        this.imgid = 0;
        // client.download
        //     .on("ready", function (stream) {
        //         let filename = moment().format("HHmmssSSSS");
        //         stream.pipe(fs.createWriteStream("./dlimgs/" + filename));
        //     });
        //console.log("page:" + pageurl);
    }
    download_a(): void {
        //console.log("[page]start:" + this.pageurl);
        client.set("timeout", Conf.timeout);
        let p = client.fetch(this.pageurl);
        let me = this;
        p.then((res) => {
            this.page_title = Conf.genPagedirname(res.$("title").text(), me.id);
            //console.log("[page]end: " + me.pageurl);
            // MYTODO 除外するタイトル名。
            res.$("a").each(function (idx) {
                let href = res.$(this).attr("href");
                let dlurl = url.resolve(me.pageurl, href);
                //console.log("[img]start: " + dlurl);
                me.downloadImg(dlurl);
            });
        });
    }

    download(): void {
        //console.log("[page]start:" + this.pageurl);
        client.set("timeout", Conf.timeout);
        let me = this;
        client.download
            .on("ready", function (stream: client.Download.Stream) {
                try {
                    if (stream.length < Conf.ignorelength) {
                        return; // 無視するサイズ
                    }
                    //let url = stream.url.href;
                    let ext = Conf.extType(stream.type);
                    if (ext == "") {
                        // 違うタイプのファイルは不要
                        return;
                    }
                    me.imgid++; // ID発行
                    let path = Conf.dlfile(me.site_title, me.page_title, ext, me.imgid);
                    //console.log("[img]rdy : " + stream.type + " : " + stream.length + " : " + ext + " : ");
                    console.log("[img]rdy : " + stream.url.href);
                    console.log("   -> " + path);
                    stream.pipe(fs.createWriteStream(path));
                    console.log("[img]save : " + path);
                } catch (e1) {
                    Conf.debug(e1);
                }
            });
        client.download.on("error", function (err) {
            Conf.debug(err);
        });
        client.download.on("end", function () {
            console.log("end");
        });

        client.download.parallel = 1;
        let p = client.fetch(this.pageurl, function (err, $, res, body) {
            try {
                me.page_title = Conf.genPagedirname($("title").text(), me.id);
                console.log("[page]end : " + $("title").text());
                console.log("    -> " + me.page_title);
                $("img").download();
            } catch (e2) {
                Conf.debug(e2);
            }
        });
    }


    private downloadImg(imgurl: string): void {
        try {
            let ext = Conf.extUrl(imgurl);
            if (ext == "") {
                // 画像ではないので終了
                return;
            }
            console.log("[ext] : " + ext);
            let me = this;
            let path = Conf.dlfile(me.site_title, me.page_title, ext, me.imgid);
            let res = request
                .get(imgurl)
                .on("error", (e2) => {
                    Conf.debug(e2);
                })
                .on("response", () => {
                    console.log("[img] end : " + imgurl);
                })
                .pipe(fs.createWriteStream(path))
                ;
        } catch (e1) {
            Conf.debug(e1);
        }
    }


    private downloadImg_old(imgurl: string): void {
        try {
            let ext = Conf.extUrl(imgurl);
            if (ext == "") {
                // 画像ではないので終了
                return;
            }
            let me = this;
            let res = request
                .get(imgurl)
                .on("response", function (response) {
                    try {
                        let type: string = response.headers["content-type"];
                        if (type == "image/png" || type == "image/jpeg") {
                            let ext = type.replace("image/", "").replace("jpeg", "jpg");
                            let path = Conf.dlfile(me.site_title, me.page_title, ext, me.imgid);
                            console.log("[img]dl : " + path);
                            let dlreq = request
                                .get(imgurl)
                                .on("error", (e4) => {
                                    Conf.debug(e4);
                                });
                            dlreq.pipe(fs.createWriteStream(path));
                        }
                        // 改めてダウンロードしなおすので今回はアボート。
                        res.abort();
                    } catch (e3) {
                        Conf.debug(e3);
                    }
                })
                .on("error", function (e2) {
                    Conf.debug(e2);
                });
        } catch (e1) {
            Conf.debug(e1);
        }
    }

}
