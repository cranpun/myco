import { Conf } from "./conf";
import { Site } from "./site";
import * as client from "cheerio-httpcli";

export class Sites {
    static async parse() {
        return new Promise(async resolve => {
            for (let siteConf of Conf.params["sites"]) {
                try {
                    let site = new Site(siteConf);
                    Conf.procLog("sites", "start : " + siteConf.title);
                    await site.download();
                    Conf.procLog("sites", "end : " + siteConf.title);
                } catch (e) {
                    Conf.pdException("sites", e);
                }
            }
            resolve();
        });
    }

    static test() {
        console.log(client.download.parallel);
        client.download.parallel = 100;
    }
}