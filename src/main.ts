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

async function main() {
    try {
        //await Conf.init();
console.log("hogehoge0");
        await Pagesdb.init();
console.log("hogehoge2");

        await Pagesdb.putPage("hogehoge");
console.log("hogehoge3");
        await Pagesdb.noPage("hogehoge", () => {
            console.log("hoge-no");
        });
console.log("hogehoge4");
    } catch (e) {
        console.log(e);
    }
}
main();
//Sites.parse();

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