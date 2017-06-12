import { Conf } from "./conf";
import * as moment from "moment";
import * as client from "cheerio-httpcli";
import * as url from "url";
import * as fs from "fs";
import { Pagesdb } from "./pagesdb";
import * as request from "request";
import { Site } from "./site";

export class Page {
    private static site_title: string;
    private static pageurl: string;
    private static id: number;
    private static imgid: number;
    private static page_title: string;
    private static imgcnts: number;
    private static pollingcnts: number;

    static init() {
        // 画像ダウンロード設定
        client.download.parallel = Conf.params["parallel"];
        client.set("timeout", Conf.params["timeoutmsec"]);
        client.download
            .on("ready", function (stream: client.Download.Stream) {
                try {
                    // if(client.download.state.queue <= 1) {
                    //     // ダウンロードが完了したので次へ。
                    //     Site.nextPage();
                    // }
                    Conf.procLog("img", "dl(" + Page.page_title + ") " + client.download.state.queue);
                    if (stream.length < Conf.params["ignorebyte"]) {
                        //Conf.procLog("img", "small : " + stream.length);
                        stream.end();
                        return; // 無視するサイズ
                    }
                    //let url = stream.url.href;
                    let ext = Conf.extType(stream.type);
                    if (ext == "") {
                        // 違うタイプのファイルは不要
                        Conf.procLog("img", "notype : " + ext);
                        stream.end();
                        return;
                    }
                    Page.imgid++; // ID発行
                    let path = Conf.dlfile(Page.site_title, Page.page_title, ext, Page.imgid);
                    Conf.procLog("img", "rdy : " + stream.url.href);
                    stream.toBuffer((err, buffer) => {
                        fs.writeFileSync(path, buffer, "binary");
                    });
                    Conf.procLog("img", "save : " + path);

                    let logpath = Conf.logfile(Page.site_title, Page.page_title);
                    Conf.log(logpath, "pageurl : " + Page.pageurl + "\n");

                } catch (e1) {
                    Conf.pdException("img", "e1" + e1);
                    //Site.nextPage();
                }
            });
        client.download.on("error", function (err) {
            Conf.pdException("img", " err : " + err);
            //Site.nextPage(); // エラーが起きたので次。
        });
        client.download.on("end", function () {
            Conf.procLog("img", "end");
            //Site.nextPage(); // このページのダウンロードが終わったので次へ。
        });
    }

    static download(site_title: string, pageurl: string, id: number) {

        Page.site_title = site_title;
        Page.pageurl = pageurl;
        Page.id = id;
        Page.imgid = 0;

        try {
            //Conf.procLog("page", "start:" + this.pageurl);
            let p = client.fetch(Page.pageurl);
            p.then(async (result: client.FetchResult) => {
                try {
                    Page.page_title = Conf.genPagedirname(result.$("title").text(), Page.id);
                    //Conf.procLog("page", "dl : " + result.$("title").text() + " : " + this.pageurl);

                    let imgs = result.$("img");

                    if (imgs.length > Conf.params["skipimgcnt"]) {
                        Page.imgcnts = imgs.length;
                        Page.pollingcnts = 0;
                        Conf.procLog("page", "dlimg " + Page.page_title + " : " + Page.imgcnts);
                        imgs.download();
                        
                        // ダウンロードが終わるまでポーリング
                        let polling = () => {
                            //let cnts = client.download.state.complete + client.download.state.error;
                            let cnts = client.download.state.queue;
                            if(Page.pollingcnts > Conf.params["pollingcnts"]) {
                                // ポーリングが規定回数を超えたら強制的に次へ。
                                Conf.procLog("page", "polling max : " + Page.page_title);
                                Page.imgcnts = 0;
                                Page.pollingcnts = 0;
                                Site.nextPage();
                            } else if (cnts > 0) {
                                // ダウンロード中
                                Conf.procLog("page", "polling " + Page.page_title + " : " + cnts + "/" + Page.imgcnts + " : poll " + Page.pollingcnts + " : " + JSON.stringify(client.download.state));
                                let wait = parseInt(Conf.params["pollingmsec"]);
                                Page.pollingcnts++;
                                setTimeout(polling, wait); // ポーリング
                            } else {
                                // 終わったので次へ
                                Conf.procLog("page", "end : " + Page.page_title + " " + cnts + "/" + Page.imgcnts + JSON.stringify(client.download.state));
                                Page.imgcnts = 0;
                                Page.pollingcnts = 0;
                                Site.nextPage();
                            }
                        };
                        // キューに貯まるのを待つために、ちょっと時間を開ける
                        setTimeout(polling, 5 * 1000);
                        //Site.nextPage(); // for test
                    } else {
                        // 画像がなければ次へ。
                        Conf.procLog("page", "noimg");
                        Site.nextPage();
                    }
                } catch (e2) {
                    Conf.pdException("page", "e2" + e2);
                    Site.nextPage();
                }
            });
            p.catch((e3: Error) => {
                Conf.pdException("page", "e3" + e3);
                // エラーが起きたので次。
                Site.nextPage();
            });
        } catch (e4) {
            Conf.pdException("page", "e4" + e4);
            // エラーが起きたので次。
            Site.nextPage();
        }
    }

    static download_old(site_title: string, pageurl: string, id: number) {

        Page.site_title = site_title;
        Page.pageurl = pageurl;
        Page.id = id;
        Page.imgid = 0;

        try {
            //Conf.procLog("page", "start:" + this.pageurl);
            let p = client.fetch(Page.pageurl);
            p.then(async (result: client.FetchResult) => {
                try {
                    Page.page_title = Conf.genPagedirname(result.$("title").text(), Page.id);
                    //Conf.procLog("page", "dl : " + result.$("title").text() + " : " + this.pageurl);

                    let imgs = result.$("img");

                    if (imgs.length > Conf.params["skipimgcnt"]) {
                        Conf.procLog("page", "dlimg " + Page.page_title + " : " + imgs.length);
                        imgs.download();
                        //Site.nextPage(); // for test
                    } else {
                        // 画像がなければ次へ。
                        Conf.procLog("page", "noimg");
                        Site.nextPage();
                    }
                } catch (e2) {
                    Conf.pdException("page", "e2" + e2);
                    Site.nextPage();
                }
            });
            p.catch((e3: Error) => {
                Conf.pdException("page", "e3" + e3);
                // エラーが起きたので次。
                Site.nextPage();
            });
        } catch (e4) {
            Conf.pdException("page", "e4" + e4);
            // エラーが起きたので次。
            Site.nextPage();
        }
    }

}
