import { Sites } from "./sites";
import { Conf } from "./conf";
import { Page } from "./page";
import { Pagesdb } from "./pagesdb";
import * as sqlite3 from "sqlite3";
import * as client from "cheerio-httpcli";

// function delay(milliseconds: number) {
//     return new Promise<void>(resolve => {
//         resolve();
//         //setTimeout(resolve, milliseconds);
//     });
// }

// async function dramaticWelcome() {
//     console.log("Hello");

//     for (let i = 0; i < 3; i++) {
//         await delay(500);
//         console.log(".");
//     }

//     console.log("World!");
// }

// dramaticWelcome();

// function wait(n: number) {
//     return new Promise(done => setTimeout(() => done(n), n));
// }

// async function main() {
//     console.log("start");
//     for (var i=0; i<10; i++) {
//         await wait(1000);
//         console.log("next");
//     }
// }
async function main_old() {
    await Conf.init();
    await Pagesdb.init();
    Page.init();
    await Page.download("hogehgoe", "https://colopl.co.jp/dreamcollabo/", 1);
}
async function main_org() {
    try {
        await Conf.init();
        await Pagesdb.init();
        Page.init(); // ダウンロード設定
        console.log("parse start");
        await Sites.parse();
        console.log("parse end");
    } catch (e) {
        console.log(e);
    } finally {
        Pagesdb.close();
        console.log("parse close");
    }
}
let main = main_org;
main();


// sqlite3.verbose();
// var db = new sqlite3.Database(':memory:');

// db.serialize(function() {
//   db.run("CREATE TABLE lorem (info TEXT)");

//   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();

//   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//       console.log(row.id + ": " + row.info);
//   });
// });

// db.close();