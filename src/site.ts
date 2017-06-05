import * as client from "cheerio-httpcli";
import { Page } from "./page";
import { Conf } from "./conf";
import { Pagesdb } from "./pagesdb";
import { Sites } from "./sites";
import * as url from "url";

export class Site {
    private static site;
    private static sites: Sites;
    private static page_id;
    private static page_urls: string[];

    static download(site) {
        Site.site = site;
        Site.page_id = 0;
        Site.page_urls = [];
        client.set("timeout", Conf.timeout);
        try {
            let p = client.fetch(Site.site["url"]);
            p.then(async (result: client.FetchResult) => {
                Conf.procLog("site", "dl : " + Site.site.title);
                let as = result.$("a");

                for (let i = 0; i < as.length; i++) {
                    try {
                        let a = as[i];
                        let href = a.attribs["href"];
                        if (href !== undefined) {
                            let pageurl = url.resolve(Site.site["url"], href);
                            if (pageurl.indexOf("javascript") < 0) {
                                Conf.procLog("site", "for: " + pageurl);
                                if (await Pagesdb.noPage(pageurl)) {
                                    await Pagesdb.putPage(pageurl);
                                    Site.page_urls.push(pageurl);
                                }
                            }
                        }
                    } catch (e) {
                        // do nothing : ill url (ex. javascript)
                        Conf.pdException("site", e);
                    }
                }

                Conf.procLog("site", "end : for");

                // 最初の一つ目のページを処理
                Site.dlPage();
            });
        } catch (e) {
            Conf.pdException("site", e);
        }
    }

    private static dlPage() {
        Conf.procLog("site", "dlPage : " + Site.page_id);
        Page.download(Site.site["title"], Site.page_urls[Site.page_id], Site.page_id);
        Site.page_id++;
    }

    static next() {
        if (Site.page_urls != undefined && Site.page_id < Site.page_urls.length) {
            Site.dlPage();
        } else {
            // 全部終わったので次のサイトへ。
            Conf.procLog("site", "end");
            Sites.next();
        }
    }

}