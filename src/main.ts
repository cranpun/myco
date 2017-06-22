import { Sites } from "./sites";
import { Conf } from "./conf";
import { Page } from "./page";
import { Pagesdb } from "./pagesdb";
import * as sqlite3 from "sqlite3";
import * as client from "cheerio-httpcli";

async function main_test() {
    
}
async function main() {
    try {
        if (process.argv.length > 2) {
            // SQLモード
            main_sqlcmd(process.argv[2], process.argv[3]);
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

//let main = main_org;
//main_test();
main();
