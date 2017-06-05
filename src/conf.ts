import * as fs from "fs";
import * as url from "url";
import * as path from "path";
import * as moment from "moment";

export class Conf {
    static params: string[];
    static today: string; // 保存する日付ディレクトリの日付。日をまたいでも変えない。
    static timeout: number = 3 * 1000; // msec
    static ignorelength: number = 300 * 1000; // バイト

    static init(): void {
        let json: string = fs.readFileSync('./conf.json').toString();
        Conf.params = JSON.parse(json);
        Conf.today = moment().format("YYMMDD");

        // サイトのDLフォルダは先に作成
        for (let site of Conf.params["sites"]) {
            // サイトフォルダの作成
            try {
                fs.mkdirSync(path.join(Conf.params["dldirpath"], site["title"]));
            } catch (e) {
                // do nothing
            }
        }
    }

    /**
     * @return [dldirpath]/[site]/[pagename]
     */
    static dldatedir(site): string {
        let p = path.join(Conf.params["dldirpath"], site, Conf.today);
        // ページフォルダの作成
        try {
            fs.mkdirSync(p);
        } catch (e) {
            // do nothing
        }
        return p;
    }

    static dlpagedir(site: string, page: string): string {
        let p = path.join(Conf.dldatedir(site), page);
        // ページフォルダの作成
        try {
            fs.mkdirSync(p);
        } catch (e) {
            // do nothing
        }
        return p;
    }

    static dlfile(site, page, ext, id): string {
        let zero = ("000" + id).slice(-3);
        let p = path.join(Conf.dlpagedir(site, page), zero + "." + ext);
        return p;
    }

    static genPagedirname(page: string, id: number) {
        let pagefix: string = page;
        pagefix = pagefix.replace(" ", "");
        if (pagefix.length > 15) {
            pagefix = pagefix.substr(0, 13);
        }
        let zero = ("000" + id).slice(-3);
        pagefix = Conf.sanitpath(zero + "_" + pagefix);
        //pagefix = Conf.sanitpath(now);

        return pagefix;
    }

    static extUrl(url: string) {
        var ret = "";
        try {
            var u = new URL(url);
            var file = u.pathname;
            var ext = path.extname(file);
            if (ext == ".jpg" || ext == ".jpeg") {
                return "jpg";
            }
            else if (ext == ".png") {
                return "png";
            }
        }
        catch (e) {
            Conf.pdException("conf", e);
        }
        return ret;
    }

    static extType(type: string): string {
        let ret = "";
        if (type == "image/png") {
            ret = "png";
        } else if (type == "image/jpeg") {
            ret = "jpg";
        }
        return ret;
    }

    static sanitpath(str) {
        let ret = str;
        let xchars: string[] = [
            " ",
            "\\\\",
            "\\/",
            "\:",
            "\\*",
            "\\?",
            "\"",
            "<",
            ">",
            "\\|",
            "\\.",
            "\\,",
            "\\r",
            "\\n",
        ];
        for (let x of xchars) {
            ret = ret.replace(new RegExp(x, 'g'), "");
        }
        if (ret != str) {
            Conf.procLog("replace", str + " -> " + ret);
        }
        return ret;
    }

    static pdException(tag: string, e) {
        let tags = [
            "sites",
            "site",
            "page",
            "pagesdb",
            "img",
        ];
        if (tags.indexOf(tag) >= 0) {
            console.log("【ERR】[" + tag + "]" + e);
        }
    }

    static procLog(tag: string, mes: string) {
        let tags = [
            "sites",
            "site",
            "page",
            //"pagesdb",
            "img",
        ];
        if (tags.indexOf(tag) >= 0) {
            console.log("[" + tag + "]" + mes);
        }
    }

}