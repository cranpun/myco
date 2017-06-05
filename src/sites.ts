import { Conf } from "./conf";
import { Site } from "./site";
import * as client from "cheerio-httpcli";

export class Sites {
    static site_id: number;

    static async next() {
        if(Sites.site_id < Conf.params["sites"].length) {
            Conf.procLog("sites", "start : " + Conf.params["sites"][Sites.site_id]["title"]);
            await Site.download(Conf.params["sites"][Sites.site_id]);
            Site.next();
            Sites.site_id++;
        } else {
            Conf.procLog("sites", "end");
        }
    }

    static test() {
        console.log(client.download.parallel);
        client.download.parallel = 100;
    }
}