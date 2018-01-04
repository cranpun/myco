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
    private static site_tagtype: string;
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
                    let ext = Conf.extType(stream.type);

                    if(Page.ignoreImage(stream, ext)) {
                        // 無視する内容なのでここでおしまい。
                        return;
                    }

                    Page.imgid++; // ID発行
                    let path = Conf.dlfile(Page.site_title, Page.page_title, ext, Page.imgid);
                    Conf.procLog("img", "rdy : " + stream.url.href);
                    stream.toBuffer((err, buffer) => {
                        fs.writeFileSync(path, buffer);
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

    static ignoreImage(stream: client.Download.Stream, ext: string) : boolean {
        if (stream.length < Conf.params["ignorebyte"]) {
            Conf.procLog("info", "small : " + stream.length);
            stream.end();
            return true; // 無視するサイズ
        }
        //let url = stream.url.href;
        if (ext == "") {
            // 違うタイプのファイルは不要
            Conf.procLog("info", "notype : " + ext);
            stream.end();
            return true;
        }
        return false;
    }

    static ignorePage(title: string) {
        for(let word of Conf.params["ignoreWords"]) {
            if(title.indexOf(word) >= 0) {
                Conf.procLog("info", "ignoreWord : " + word + " : " + title);
                return true;
            }
        }
        return false;
    }

    static download(site_title: string, site_tagtype: string,  pageurl: string, id: number) {

        Page.site_title = site_title;
        Page.site_tagtype = site_tagtype;
        Page.pageurl = pageurl;
        Page.id = id;
        Page.imgid = 0;

        try {
            //Conf.procLog("page", "start:" + this.pageurl);
            let p = client.fetch(Page.pageurl);
            p.then(async (result: client.FetchResult) => {
                try {
                    let title_raw : string = result.$("title").text();
                    Page.page_title = Conf.genPagedirname(title_raw, Page.id);
                    Conf.procLog("info", "page.download : " + title_raw + " : " + this.pageurl);

                    if(Page.ignorePage(title_raw)) {
                        // 無視する単語が入っていたのでここで終了。
                        Site.nextPage();
                        return;
                    }

                    // このサイトのタグタイプに従ってurlリストを作成
                    let urllist = [];
                    if(Page.site_tagtype === "a") {
                        urllist = Page.makeUrlListAhref(result);
                    } else if(Page.site_tagtype === "img") {
                        urllist = Page.makeUrlListImgsrc(result);
                    }
                    
                    // 画像数チェック
                    if(urllist.length < Conf.params["skipimgcnt"]) {
                        Site.nextPage();
                        return;
                    }
                    
                    // 取得したURLの画像を全てダウンロード
                    
                    for(let i = 0; i < urllist.length; i++) {
                        const url = urllist[i];
                        if(Conf.isImgUr(url)) {
                            try {
                                let ext = Conf.extType(stream.type);
                                let path = Conf.dlfile(Page.site_title, Page.page_title, ext, i);
                                request
                                    .get(url)
                                    .on("response", function(res) {
                                        // for debug
                                        Conf.procLog("info", "page.download : ");
                                        Conf.procLog("info", res);
                                    })
                                    .pipe(path);
                            } catch(e) {
                                Conf.pdException("page", "download" + e);
                                
                            }
                        }
                    }

                    // 全部終ったので次のページへ。
                    Site.nextPage();
                    
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
    
    static makeUrlListAhref(result) {
        let ret = [];
        let as = result.$("a");
        for (let i = 0; i < as.length; i++) {
            try {
                let a = as[i];
                let href = a.attribs["href"];
                if (href !== undefined) {
                    ret.push(href);
                }
            } catch (e) {
                // do nothing : ill url (ex. javascript)
                Conf.pdException("page.makeUrlListAhref", e);
            }
        }
        return ret;
    }
    
    static makeUrlListImgsrc(result) {
        let ret = [];
        let as = result.$("img");
        for (let i = 0; i < as.length; i++) {
            try {
                let a = as[i];
                let href = a.attribs["src"];
                if (href !== undefined) {
                    ret.push(href);
                }
            } catch (e) {
                // do nothing : ill url (ex. javascript)
                Conf.pdException("page.makeUrlListImgsrc", e);
            }
        }
        return ret;
    }
}
