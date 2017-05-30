import { Conf } from "./conf";
import { Site } from "./site";

export class Sites {

    static parse() {
        for (let siteConf of Conf.params["sites"]) {
            let site = new Site(siteConf);
            site.download();
        }
    }
}