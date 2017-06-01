import * as client from "cheerio-httpcli";
import { Page } from "./page";
import { Conf } from "./conf";
import { Pagesdb } from "./pagesdb";
import * as url from "url";

export class Site {
    private site;

    constructor(site) {
        this.site = site;
    }

    download() {
        return new Promise(async resolve => {
            client.set("timeout", Conf.timeout);
            let p = client.fetch(this.site["url"]);
            let me = this;
            let id = 0;
            await p.then(async (result: client.FetchResult) => {
                Conf.procLog("site", "dl : " + this.site.title);
                let as = result.$("a");

                for (let i = 0; i < as.length; i++) {
                    try {
                        let a = as[i];
                        let href = a.attribs["href"];
                        if (href !== undefined) {
                            let pageurl = url.resolve(me.site["url"], href);
                            if (pageurl.indexOf("javascript") < 0) {
                                Conf.procLog("site", "for: " + pageurl);
                                if(await Pagesdb.noPage(pageurl)) {
                                    await Pagesdb.putPage(pageurl);
                                }
                            }
                        }
                    } catch (e) {
                        // do nothing : ill url (ex. javascript)
                        Conf.pdException(e);
                    }
                }


                // await result.$("a").each(async function (idx) {
                //     try {
                //         let pageurl: string = result.$(this).url({ invalid: false }).toString();
                //         url.parse(pageurl);
                //         Conf.procLog("site", "each : " + pageurl);
                //         // ダウンロード済みなら実行しない
                //         if(await Pagesdb.noPage(pageurl)) {
                //             await Pagesdb.putPage(pageurl);
                //             Conf.procLog("site", "page start : " + pageurl);
                //             id++;
                //             // let page = new Page(me.site["title"], pageurl, id);
                //             //await page.download();
                //         }
                //     } catch (e) {
                //         // do nothing。不正なリンクなので無視。
                //     }
                // });
                Conf.procLog("site", "end : for");
                resolve();
            });
        });
    }

}