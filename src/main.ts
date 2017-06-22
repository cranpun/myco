import { Sites } from "./sites";
import { Conf } from "./conf";
import { Page } from "./page";
import { Pagesdb } from "./pagesdb";
import * as path from "path";
import * as sqlite3 from "sqlite3";
import * as client from "cheerio-httpcli";
import * as fs from "fs";

async function main_test() {

}
async function main() {
    try {
        if (process.argv.length > 2) {
            if (process.argv[2] == "count") {
                main_count();
            } else {
                // SQLモード
                main_sqlcmd(process.argv[2], process.argv[3]);
            }
        } else {
            console.log("main_start");
            await Sites.init();
            console.log("main_end");
        }
    } catch (e) {
        console.log(e);
    }
}

async function main_sqlcmd(cmd: string, val: string) {
    let q = "";
    await Pagesdb.init();
    if (cmd == "select") {
        q += "SELECT * FROM pages WHERE strftime('%Y-%m-%d', created) = '" + val + "';";
        Pagesdb.all(q);
    } else if (cmd == "delete") {
        q += "DELETE FROM pages WHERE strftime('%Y-%m-%d', created) = '" + val + "';";
        Pagesdb.run(q);
    } else if (cmd == "search") {
        q += "SELECT * FROM pages WHERE url LIKE '%" + val + "%';";
        Pagesdb.all(q);
    } else {
        console.log("error : could not build query.");
    }
}

function main_count() {
    Conf.init();

    let rootpath = Conf.params["dldirpath"];
    let sites = Conf.params["sites"];



    for(let site of sites) {
        let pagecnt = 0;
        let sitepath = path.join(rootpath, site.title);
        // 日付ディレクトリの取得
        let dates = fs.readdirSync(sitepath);
        for(let date of dates) {
            let datepath = path.join(sitepath, date);
            let pages = fs.readdirSync(datepath);
            pagecnt += pages.length;
        }
        console.log("[" + site.title + "] \t" + pagecnt);
    }
}

//let main = main_org;
//main_test();
main();
