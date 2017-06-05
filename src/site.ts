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
            try {
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
                                    if (await Pagesdb.noPage(pageurl)) {
                                        await Pagesdb.putPage(pageurl);
                                        await Page.download(me.site["title"], pageurl, i);
                                    }
                                }
                            }
                        } catch (e) {
                            // do nothing : ill url (ex. javascript)
                            Conf.pdException("site", e);
                        }
                    }

                    Conf.procLog("site", "end : for");
                    resolve();
                });
            } catch (e) {
                Conf.pdException("site", e);
            }
        });
    }

}