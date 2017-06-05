import { Conf } from "./conf";
import * as moment from "moment";
import * as client from "cheerio-httpcli";
import * as url from "url";
import * as fs from "fs";
import { Pagesdb } from "./pagesdb";
import * as request from "request";

export class Page {
    private static site_title: string;
    private static pageurl: string;
    private static id: number;
    private static imgid: number;
    private static page_title: string;

    static init() {
        // 画像ダウンロード設定
        client.download.parallel = 3;
        client.download
            .on("ready", function (stream: client.Download.Stream) {
                try {
                    //Conf.procLog("img", "dl : " + stream.url.href);
                    if (stream.length < Conf.ignorelength) {
                        stream.end();
                        return; // 無視するサイズ
                    }
                    //let url = stream.url.href;
                    let ext = Conf.extType(stream.type);
                    if (ext == "") {
                        // 違うタイプのファイルは不要
                        stream.end();
                        return;
                    }
                    Page.imgid++; // ID発行
                    let path = Conf.dlfile(Page.site_title, Page.page_title, ext, Page.imgid);
                    Conf.procLog("img", "rdy : " + stream.url.href);
                    stream.pipe(fs.createWriteStream(path));
                    Conf.procLog("img", "save : " + path);
                } catch (e1) {
                    Conf.pdException("page", e1);
                } finally {
                    //stream.end();
                }
            });
        client.download.on("error", function (err) {
            Conf.pdException("page", err);
        });
        client.download.on("end", function () {
            Conf.procLog("img", "end");
        });
    }

    static download(site_title: string, pageurl: string, id: number) {
        return new Promise(async resolve => {
            Page.site_title = site_title;
            Page.pageurl = pageurl;
            Page.id = id;
            Page.imgid = 0;
            let doresolve: boolean = false; // resolveを実行したらtrue
            try {
                //Conf.procLog("page", "start:" + this.pageurl);
                client.set("timeout", Conf.timeout);

                let p = client.fetch(Page.pageurl);
                await p.then(async (result: client.FetchResult) => {
                    try {
                        Page.page_title = Conf.genPagedirname(result.$("title").text(), Page.id);
                        Conf.procLog("page", "dl : " + result.$("title").text());
                        //console.log(result.$("img").length);
                        await result.$("img").download();
                    } catch (e2) {
                        Conf.pdException("page", e2);
                    }
                    doresolve = true;
                    resolve();
                });
                await p.catch((e3: Error) => {
                    Conf.pdException("page", e3);
                });
            } catch (e4) {
                Conf.pdException("page", e4);
            } 
            if(!doresolve) {
                // 最後までいかなかったら
                resolve();
            }
        });
    }

}
