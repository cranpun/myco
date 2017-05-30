import * as sqlite3 from "sqlite3";
import * as moment from "moment";
//sqlite3.verbose();
export class Pagesdb {
    private static db;
    private static tabname = "pages";

    static init() {
        Pagesdb.db = new sqlite3.Database('pages.db');
        let exists = 0;
        this.db.serialize(() => {
            this.db.all("SELECT * FROM sqlite_master WHERE name='" + Pagesdb.tabname + "' AND type='table'", (err: Error, rows: any[]) => {
                exists = rows.length;
                this.db.serialize(() => {
                    if (exists <= 0) {
                        this.db.run("CREATE TABLE " + Pagesdb.tabname + " (url TEXT PRIMARY KEY, created TEXT)");
                    }
                });
            });
        });
    }

    static putPage(url: string) {
        Pagesdb.db.serialize(() => {
            // 登録なのでstateはpre
            let q = "INSERT INTO " + Pagesdb.tabname + " (url, created) VALUES ('" + url + "', '" + moment().format("YYYY-MM-DD HH:mm:ss") + "')";
            Pagesdb.db.run(q, (e) => {
                console.log("err ins : " + e + "  " + q);
             });
        });
    }

    static noPage(url: string, callback: () => void) {
        Pagesdb.db.serialize(() => {
            Pagesdb.db.get("SELECT * FROM " + Pagesdb.tabname + " WHERE url = '" + url + "'", (err, row) => {
                if (row == undefined) {
                    callback();
                } else {
                    //console.log("hasPage : " + url);
                }
            });
        });
    }


}