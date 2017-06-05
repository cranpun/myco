import { Conf } from "./conf";
import { Site } from "./site";
import * as client from "cheerio-httpcli";
import { Pagesdb } from "./pagesdb";
import { Page } from "./page";

export class Sites {
    static site_id: number;

    static async init() {
        Sites.site_id = 0;
        Conf.init();
        Page.init(); // ダウンロード設定
        //Conf.procLog("sites", "start init");
        await Pagesdb.init();

        //Conf.procLog("sites", "inits : ");
        // 最初の一発目
        Sites.nextSite();
        //Conf.procLog("sites", "end init");
    }

    static async nextSite() {
        Conf.procLog("sites", "next : " + Sites.site_id + "/" + Conf.params["sites"].length);
        if (Sites.site_id < Conf.params["sites"].length) {
            Conf.procLog("sites", "start : " + Conf.params["sites"][Sites.site_id]["title"]);
            Site.download(Conf.params["sites"][Sites.site_id]);
            Sites.site_id++;
        } else {
            if (Site.hasPage() == false) {
                if (client.download.state.queue <= 0) {
                    // 全部終わったのでクローズ。
                    //Pagesdb.close();
                    Conf.procLog("sites", "end...program done");
                } 
            }
        }
    }

    static test() {
        console.log(client.download.parallel);
        client.download.parallel = 100;
    }
}