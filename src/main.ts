import { Sites } from "./sites";
import { Conf } from "./conf";
import { Page } from "./page";
import { Pagesdb } from "./pagesdb";
import * as sqlite3 from "sqlite3";

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
    await Pagesdb.init();
    await Pagesdb.putPage("https://www.google.co.jp/intl/ja/optionssssss/");
    console.log(0);
    let hoge = await Pagesdb.noPage("https://www.google.co.jp/intl/ja/optionssssss/");
    console.log(hoge);
    await Pagesdb.close();
}
async function main() {
    try {
        await Conf.init();
        await Pagesdb.init();
        console.log("parse start");
        await Sites.parse();
        console.log("parse end");
        Pagesdb.close();
        console.log("parse close");
    } catch (e) {
        console.log(e);
    }
}
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