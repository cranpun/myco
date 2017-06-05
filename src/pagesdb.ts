import * as sqlite3 from "sqlite3";
import * as moment from "moment";
import { Conf } from "./conf";

//sqlite3.verbose();
export class Pagesdb {
    private static tabname = "pages";
    private static filename = "pages.db";
    private static db;

    static init() {
        return new Promise(resolve => {
            sqlite3.verbose();
            this.db = new sqlite3.Database(Pagesdb.filename);
            let db = this.db;
            let exists = 0;

            db.serialize(() => {
                db.all("SELECT * FROM sqlite_master WHERE name='" + Pagesdb.tabname + "' AND type='table'", (err: Error, rows: any[]) => {
                    exists = rows.length;
                    if (exists <= 0) {
                        db.run("CREATE TABLE " + Pagesdb.tabname + " (url TEXT PRIMARY KEY, created TEXT)", (e) => {
                            if (e != null) {
                                Conf.procLog("pagesdb", "cannot create table");
                                Conf.pdException("pagesdb", e);
                            }
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            });
        });
    }

    static putPage(url: string) {
        return new Promise(resolve => {
            let db = this.db;
            db.serialize(() => {
                // 登録なのでstateはpre
                let q = "INSERT INTO " + Pagesdb.tabname + " (url, created) VALUES ('" + url + "', '" + moment().format("YYYY-MM-DD HH:mm:ss") + "')";
                db.run(q, (e) => {
                    if (e != null) {
                        Conf.pdException("pagesdb", "err ins : " + e + "  " + q);
                    }
                    Conf.procLog("pagesdb", "ins : " + q);
                    resolve();
                });
            });
        });
    }

    static noPage(url: string) {
        return new Promise(resolve => {
            let db = this.db;
            let q = "SELECT * FROM " + Pagesdb.tabname + " WHERE url = '" + url + "'";
            db.serialize(() => {
                db.get(q, (err: Error, row: any) => {
                    Conf.procLog("pagesdb", "has ? " + q);
                    if (err == null) {
                        if (row == undefined) {
                            resolve(true); // 行が見つからなかったので初めて。
                        } else {
                            resolve(false); // 行が見つかったので既知。
                        }
                    } else {
                        Conf.pdException("pagesdb", err);
                        resolve(false); // エラーは既知扱い
                    }
                });
            });
        });
    }
    static close() {
        this.db.close();
    }
}