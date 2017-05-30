import * as client from "cheerio-httpcli";
import { Page } from "./page";
import * as url from "url";
import { Conf } from "./conf";
import { Pagesdb } from "./pagesdb";

export class Site {
    private site;

    constructor(site) {
        this.site = site;
    }

    download() {
        client.set("timeout", Conf.timeout);
        let p = client.fetch(this.site["url"]);
        let me = this;
        let id = 0;
        p.then((result) => {
            result.$("a").each(function (idx) {
                let href = result.$(this).attr("href");
                // 相対パスを考慮して変換。
                let pageurl = url.resolve(me.site["url"], href);
                //console.log("page : " + pageurl);

                // ダウンロード済みなら実行しない
                Pagesdb.noPage(pageurl, () => {
                    Pagesdb.putPage(pageurl);
                    let page = new Page(me.site["title"], pageurl, id);
                    page.download();
                    id++;
                });
            });
        });
    }

}