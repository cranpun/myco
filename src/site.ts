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
        return new Promise(resolve => {
            client.set("timeout", Conf.timeout);
            let p = client.fetch(this.site["url"]);
            let me = this;
            let id = 0;
            p.then((result: client.FetchResult) => {
                Conf.procLog("site", "end : " + this.site.title);
                result.$("a").each(function (idx) {
                    try {
                        let pageurl: string = result.$(this).url({ invalid: false }).toString();
                        url.parse(pageurl);
                        Conf.procLog("site", "each : " + pageurl);
                        // ダウンロード済みなら実行しない
                        if(Pagesdb.noPage(pageurl)) {
                            Pagesdb.putPage(pageurl);
                            Conf.procLog("site", "page start : " + pageurl);
                            id++;
                            // let page = new Page(me.site["title"], pageurl, id);
                            //await page.download();
                        }
                    } catch (e) {
                        // do nothing。不正なリンクなので無視。
                    }
                });
                Conf.procLog("site", "end : each");
                resolve();
            });
        });
    }

}