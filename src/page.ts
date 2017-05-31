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
    }

    download() {
        return new Promise(resolve => {
            //Conf.procLog("page", "start:" + this.pageurl);
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
                        Conf.procLog("img", "rdy : " + stream.url.href);
                        Conf.procLog("img", "   -> " + path);
                        stream.pipe(fs.createWriteStream(path));
                        Conf.procLog("img", "save : " + path);
                    } catch (e1) {
                        Conf.pdException(e1);
                    }
                });
            client.download.on("error", function (err) {
                Conf.pdException(err);
            });
            client.download.on("end", function () {
                Conf.procLog("img", "end");
            });

            client.download.parallel = 1;
            let p = client.fetch(this.pageurl, function (err, $, res, body) {
                try {
                    me.page_title = Conf.genPagedirname($("title").text(), me.id);
                    Conf.procLog("page", "end : " + $("title").text());
                    Conf.procLog("page", "    -> " + me.page_title);
                    $("img").download();
                } catch (e2) {
                    Conf.pdException(e2);
                }
            });
            resolve();
        });
    }

}
