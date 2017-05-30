import * as sqlite3 from "sqlite3";
import * as moment from "moment";
//sqlite3.verbose();
export class Pagesdb {
    private static tabname = "pages";
    private static filename = "pages.db";

    static init() {
        console.log("init1");
        return new Promise(resolve => {
        console.log("init2");
            
            sqlite3.verbose();
            let db = new sqlite3.Database(Pagesdb.filename);
            let exists = 0;

            db.serialize(() => {
                db.all("SELECT * FROM sqlite_master WHERE name='" + Pagesdb.tabname + "' AND type='table'", (err: Error, rows: any[]) => {
                    exists = rows.length;
                    if (exists <= 0) {
                        db.run("CREATE TABLE " + Pagesdb.tabname + " (url TEXT PRIMARY KEY, created TEXT)", (e) => {
                            if (e != null) {
                                console.log("cannot create table");
                                console.log(e);
                            }
                            db.close();
                        });
                    }
                    resolve();
                });
            });
        });
    }

    private static async exec(func: (db: sqlite3.Database) => void) {
        let db = new sqlite3.Database(Pagesdb.filename);
        await func(db);
        db.close();
    }

    static putPage(url: string) {
        return new Promise(resolve => {
            console.log("hogehoge");
            resolve();
            // Pagesdb.exec((db: sqlite3.Database) => {
            //     db.serialize(() => {
            //         // 登録なのでstateはpre
            //         let q = "INSERT INTO " + Pagesdb.tabname + " (url, created) VALUES ('" + url + "', '" + moment().format("YYYY-MM-DD HH:mm:ss") + "')";
            //         db.run(q, (e) => {
            //             if (e != null) {
            //                 console.log("err ins : " + e + "  " + q);
            //             }
            //         });
            //     });
            // });
        });
    }

    static noPage(url: string, callback: () => void) {
        return new Promise(resolve => {
            console.log("hoge-nohoge-");
            resolve();
            // Pagesdb.exec((db: sqlite3.Database) => {
            //     db.serialize(() => {
            //         db.get("SELECT * FROM " + Pagesdb.tabname + " WHERE url = '" + url + "'", (err, row) => {
            //             if (err == null) {
            //                 if (row == undefined) {
            //                     callback();
            //                 } else {
            //                     console.log("hasPage : " + url);
            //                 }
            //             } else {
            //                 console.log("err noPage : " + err);
            //             }
            //         });
            //     });
            // });
        });
    }


}