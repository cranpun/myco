import { Conf } from "./conf";
import { Site } from "./site";

export class Sites {
    static async parse() {
        return new Promise(async resolve => {
            for (let siteConf of Conf.params["sites"]) {
                let site = new Site(siteConf);
                Conf.procLog("sites", "start : " + siteConf.title);
                await site.download();
            }
        });
    }
}