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

    static init() {
        // 画像ダウンロード設定
        client.download.parallel = Conf.params["parallel"];
        client.set("timeout", Conf.params["timeoutmsec"]);
        client.download
            .on("ready", async function (stream: client.Download.Stream) {
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

                } catch (e1) {
                    Conf.pdException("img", "e1" + e1);
                    //Site.nextPage();
                } 
            });
        client.download.on("error", function (err) {
            Conf.pdException("page", " img err : " + err);
            //Site.nextPage(); // エラーが起きたので次。
        });
        client.download.on("end", function () {
            Conf.procLog("img", "end");
            Site.nextPage(); // このページのダウンロードが終わったので次へ。
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
                    Conf.procLog("page", "dl : " + result.$("title").text() + " : " + this.pageurl);
                    //console.log(result.$("img").length);
                    let imgs = result.$("img");
                    if(imgs.length > Conf.params["skipimgcnt"]) {
                        Conf.procLog("page", "dlimg : " + imgs.length);
                        client.download.clearCache();
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
