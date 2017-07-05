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

    static async download(site) {
        Site.site = site;
        Site.page_id = 0;
        Site.page_urls = [];
        try {
            let p = client.fetch(Site.site["url"]);
            p.then(async (result: client.FetchResult) => {
                //Conf.procLog("site", "dl : " + Site.site.title);
                let as = result.$("a");

                for (let i = 0; i < as.length; i++) {
                    try {
                        let a = as[i];
                        let href = a.attribs["href"];
                        if (href !== undefined) {
                            let pageurl_org = url.resolve(Site.site["url"], href);
                            // #以下は除く
                            let pageurl = pageurl_org.split("#")[0];
                            let flag = await Site.ignoreUrl(pageurl);
                            if(flag) {
                                // 無視するURLが含まれていたため次へ。
                                continue;
                            }

                            Conf.procLog("site", "for: " + pageurl);
                            await Pagesdb.putPage(pageurl);
                            Site.page_urls.push(pageurl);
                        }
                    } catch (e) {
                        // do nothing : ill url (ex. javascript)
                        Conf.pdException("site", e);
                    }
                }

                Conf.procLog("site", "end : for");

                // 最初の一つ目のページを処理
                Site.nextPage();
            });
        } catch (e) {
            Conf.pdException("site", e);
            Sites.nextSite();
        }
    }
    static async ignoreUrl(url: string) {
        for(let u of Conf.params["ignoreUrls"]) {
            //Conf.procLog("site", "check url : " + u + " -> " + url);
            if(url.indexOf(u) >= 0) {
                // 無視するURLが含まれていた。
                Conf.procLog("site", "ignore url : " + url);
                return true;
            }
        }
        if (await Pagesdb.noPage(url) == false) {
            // 登録済ならignore
            Conf.procLog("site", "same url : " + url);
            return true;
        }
        return false;
    }

    static nextPage() {
        if (Site.page_urls != undefined) {
            if (Site.hasPage()) {
                let page_url = Site.page_urls[Site.page_id];
                Conf.procLog("site", "next : " + Site.page_id + "/" + Site.page_urls.length + " " + page_url);
                Site.page_id++;
                Page.download(Site.site["title"], page_url, Site.page_id);
            } else {
                // 全部終わったので次のサイトへ。
                Conf.procLog("site", "end");
                Sites.nextSite();
            }
        } else {
            Site.page_id++; // エラーなので進めるだけ。
        }
    }
    static hasPage(): boolean {
        if (Site.page_urls != undefined) {
            // urlがあれば数を確認。
            return Site.page_id < Site.page_urls.length;
        } else {
            return false;
        }
    }

}