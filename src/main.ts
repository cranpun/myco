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
async function main_test() {
    await Conf.init();
    await Pagesdb.init();
    Page.init();
    
    Page.download("hogehoge", "https://www.google.co.jp/setprefs?safeui=on&sig=0_KY3D0pQEFdnsVeipyvcaVk_hiTY%3D&prev=https://www.google.co.jp/search?q%3D%25E6%2597%25A5%25E6%259C%25AC%25E3%2582%25A2%25E3%2583%25AB%25E3%2583%2597%25E3%2582%25B9%26oq%3D%25E6%2597%25A5%25E6%259C%25AC%25E3%2582%25A2%25E3%2583%25AB%25E3%2583%2597%25E3%2582%25B9%26aqs%3Dchrome..69i57j69i60l3j69i65.2169j0j9%26sourceid%3Dchrome%26ie%3DUTF-8", 1);
    //console.log("   ===============================  ");
    //Page.download("hogehoge", "https://colopl.co.jp/dreamcollabo/", 2);
}
async function main() {
    try {
        console.log("main_start");
        await Sites.init();
    } catch (e) {
        console.log(e);
    } 
    console.log("main_end");
}
//let main = main_org;
//main_test();
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