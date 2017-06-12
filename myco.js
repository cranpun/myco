/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fs = __webpack_require__(6);
var path = __webpack_require__(9);
var moment = __webpack_require__(7);
var Conf = (function () {
    function Conf() {
    }
    Conf.init = function () {
        var json = fs.readFileSync('./conf.json').toString();
        Conf.params = JSON.parse(json);
        Conf.today = moment().format("YYMMDD");
        // サイトのDLフォルダは先に作成
        for (var _i = 0, _a = Conf.params["sites"]; _i < _a.length; _i++) {
            var site = _a[_i];
            // サイトフォルダの作成
            try {
                fs.mkdirSync(path.join(Conf.params["dldirpath"], site["title"]));
            }
            catch (e) {
                // do nothing
            }
        }
    };
    /**
     * @return [dldirpath]/[site]/[pagename]
     */
    Conf.dldatedir = function (site) {
        var p = path.join(Conf.params["dldirpath"], site, Conf.today);
        // ページフォルダの作成
        try {
            fs.mkdirSync(p);
        }
        catch (e) {
            // do nothing
        }
        return p;
    };
    Conf.dlpagedir = function (site, page) {
        var p = path.join(Conf.dldatedir(site), page);
        // ページフォルダの作成
        try {
            fs.mkdirSync(p);
        }
        catch (e) {
            // do nothing
        }
        return p;
    };
    Conf.dlfile = function (site, page, ext, id) {
        var zero = ("000" + id).slice(-3);
        var p = path.join(Conf.dlpagedir(site, page), zero + "." + ext);
        return p;
    };
    Conf.logfile = function (site, page) {
        var dirpath = Conf.dlpagedir(site, page);
        return path.join(dirpath, "log.txt");
    };
    Conf.log = function (path, mes) {
        // fs.appendFile(path, mes, () => {
        //     // do nothing
        // });
    };
    Conf.genPagedirname = function (page, id) {
        var pagefix = page;
        pagefix = pagefix.replace(" ", "");
        var len = Conf.params["dirnamelen"];
        if (pagefix.length > len) {
            pagefix = pagefix.substr(0, len);
        }
        var zero = ("000" + id).slice(-3);
        pagefix = Conf.sanitpath(zero + "_" + pagefix);
        //pagefix = Conf.sanitpath(now);
        return pagefix;
    };
    Conf.extUrl = function (url) {
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
    };
    Conf.extType = function (type) {
        var ret = "";
        if (type == "image/png") {
            ret = "png";
        }
        else if (type == "image/jpeg") {
            ret = "jpg";
        }
        return ret;
    };
    Conf.sanitpath = function (str) {
        var ret = str;
        for (var _i = 0, _a = Conf.escapes; _i < _a.length; _i++) {
            var x = _a[_i];
            ret = ret.replace(x, "");
        }
        if (ret != str) {
            Conf.procLog("replace", str + " -> " + ret);
        }
        return ret;
    };
    Conf.pdException = function (tag, e) {
        var tags = [
            "sites",
            "site",
            "page",
            "pagesdb",
            "img",
        ];
        if (tags.indexOf(tag) >= 0) {
            console.log("【ERR】[" + tag + "]" + e);
        }
    };
    Conf.procLog = function (tag, mes) {
        var tags = [
            "sites",
            "site",
            "page",
            //"pagesdb",
            "img",
        ];
        if (tags.indexOf(tag) >= 0) {
            console.log("[" + tag + "]" + mes);
        }
    };
    return Conf;
}());
Conf.timeout = 3 * 1000; // msec
//static ignorelength: number = 300 * 1000; // バイト
Conf.ignorelength = 0 * 1000; // バイト
Conf.escapes = [
    new RegExp(" ", 'g'),
    new RegExp("\\\\", 'g'),
    new RegExp("\\/", 'g'),
    new RegExp("\:", 'g'),
    new RegExp("\\*", 'g'),
    new RegExp("\\?", 'g'),
    new RegExp("\"", 'g'),
    new RegExp("<", 'g'),
    new RegExp(">", 'g'),
    new RegExp("\\|", 'g'),
    new RegExp("\\.", 'g'),
    new RegExp("\\,", 'g'),
    new RegExp("\\r", 'g'),
    new RegExp("\\n", 'g'),
    new RegExp("%", 'g'),
    new RegExp("~", 'g'),
    new RegExp("&", 'g'),
];
exports.Conf = Conf;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = __webpack_require__(10);
var moment = __webpack_require__(7);
var conf_1 = __webpack_require__(0);
//sqlite3.verbose();
var Pagesdb = (function () {
    function Pagesdb() {
    }
    Pagesdb.init = function () {
        var _this = this;
        return new Promise(function (resolve) {
            sqlite3.verbose();
            _this.db = new sqlite3.Database(Pagesdb.filename);
            var db = _this.db;
            var exists = 0;
            db.serialize(function () {
                db.all("SELECT * FROM sqlite_master WHERE name='" + Pagesdb.tabname + "' AND type='table'", function (err, rows) {
                    exists = rows.length;
                    if (exists <= 0) {
                        db.run("CREATE TABLE " + Pagesdb.tabname + " (url TEXT PRIMARY KEY, created TEXT)", function (e) {
                            if (e != null) {
                                conf_1.Conf.procLog("pagesdb", "cannot create table");
                                conf_1.Conf.pdException("pagesdb", e);
                            }
                            resolve("init");
                        });
                    }
                    else {
                        resolve("no");
                    }
                });
            });
        });
    };
    Pagesdb.putPage = function (url) {
        return new Promise(function (resolve) {
            var db = Pagesdb.db;
            db.serialize(function () {
                // 登録なのでstateはpre
                var q = "INSERT INTO " + Pagesdb.tabname + " (url, created) VALUES ('" + url + "', '" + moment().format("YYYY-MM-DD HH:mm:ss") + "')";
                db.run(q, function (e) {
                    if (e != null) {
                        conf_1.Conf.pdException("pagesdb", "err ins : " + e + "  " + q);
                    }
                    conf_1.Conf.procLog("pagesdb", "ins : " + q);
                    resolve();
                });
            });
        });
    };
    Pagesdb.noPage = function (url) {
        return new Promise(function (resolve) {
            var db = Pagesdb.db;
            var q = "SELECT * FROM " + Pagesdb.tabname + " WHERE url = '" + url + "'";
            db.serialize(function () {
                db.get(q, function (err, row) {
                    conf_1.Conf.procLog("pagesdb", "has ? " + q);
                    if (err == null) {
                        if (row == undefined) {
                            resolve(true); // 行が見つからなかったので初めて。
                        }
                        else {
                            resolve(false); // 行が見つかったので既知。
                        }
                    }
                    else {
                        conf_1.Conf.pdException("pagesdb", err);
                        resolve(false); // エラーは既知扱い
                    }
                });
            });
        });
    };
    Pagesdb.close = function () {
        Pagesdb.db.close();
    };
    Pagesdb.run = function (q) {
        return new Promise(function (resolve) {
            var db = Pagesdb.db;
            db.serialize(function () {
                db.run(q, function (e) {
                    if (e != null) {
                        conf_1.Conf.pdException("pagesdb", "err ins : " + e + "  " + q);
                    }
                    conf_1.Conf.procLog("pagesdb", "ins : " + q);
                    resolve();
                });
            });
        });
    };
    Pagesdb.all = function (q) {
        return new Promise(function (resolve) {
            var db = Pagesdb.db;
            db.serialize(function () {
                db.all(q, function (err, rows) {
                    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                        var row = rows_1[_i];
                        console.log(row);
                    }
                });
            });
        });
    };
    return Pagesdb;
}());
Pagesdb.tabname = "pages";
Pagesdb.filename = "pages.db";
exports.Pagesdb = Pagesdb;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("cheerio-httpcli");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var conf_1 = __webpack_require__(0);
var client = __webpack_require__(2);
var fs = __webpack_require__(6);
var site_1 = __webpack_require__(4);
var Page = (function () {
    function Page() {
    }
    Page.init = function () {
        // 画像ダウンロード設定
        client.download.parallel = conf_1.Conf.params["parallel"];
        client.set("timeout", conf_1.Conf.params["timeoutmsec"]);
        client.download
            .on("ready", function (stream) {
            try {
                // if(client.download.state.queue <= 1) {
                //     // ダウンロードが完了したので次へ。
                //     Site.nextPage();
                // }
                conf_1.Conf.procLog("img", "dl(" + Page.page_title + ") " + client.download.state.queue);
                if (stream.length < conf_1.Conf.params["ignorebyte"]) {
                    //Conf.procLog("img", "small : " + stream.length);
                    stream.end();
                    return; // 無視するサイズ
                }
                //let url = stream.url.href;
                var ext = conf_1.Conf.extType(stream.type);
                if (ext == "") {
                    // 違うタイプのファイルは不要
                    conf_1.Conf.procLog("img", "notype : " + ext);
                    stream.end();
                    return;
                }
                Page.imgid++; // ID発行
                var path_1 = conf_1.Conf.dlfile(Page.site_title, Page.page_title, ext, Page.imgid);
                conf_1.Conf.procLog("img", "rdy : " + stream.url.href);
                stream.toBuffer(function (err, buffer) {
                    fs.writeFileSync(path_1, buffer, "binary");
                });
                conf_1.Conf.procLog("img", "save : " + path_1);
                var logpath = conf_1.Conf.logfile(Page.site_title, Page.page_title);
                conf_1.Conf.log(logpath, "pageurl : " + Page.pageurl + "\n");
            }
            catch (e1) {
                conf_1.Conf.pdException("img", "e1" + e1);
                //Site.nextPage();
            }
        });
        client.download.on("error", function (err) {
            conf_1.Conf.pdException("page", " img err : " + err);
            //Site.nextPage(); // エラーが起きたので次。
        });
        client.download.on("end", function () {
            conf_1.Conf.procLog("img", "end");
            site_1.Site.nextPage(); // このページのダウンロードが終わったので次へ。
        });
    };
    Page.download = function (site_title, pageurl, id) {
        var _this = this;
        Page.site_title = site_title;
        Page.pageurl = pageurl;
        Page.id = id;
        Page.imgid = 0;
        try {
            //Conf.procLog("page", "start:" + this.pageurl);
            var p = client.fetch(Page.pageurl);
            p.then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                var imgs;
                return __generator(this, function (_a) {
                    try {
                        Page.page_title = conf_1.Conf.genPagedirname(result.$("title").text(), Page.id);
                        imgs = result.$("img");
                        if (imgs.length > conf_1.Conf.params["skipimgcnt"]) {
                            conf_1.Conf.procLog("page", "dlimg : " + imgs.length);
                            imgs.download();
                            //Site.nextPage(); // for test
                        }
                        else {
                            // 画像がなければ次へ。
                            conf_1.Conf.procLog("page", "noimg");
                            site_1.Site.nextPage();
                        }
                    }
                    catch (e2) {
                        conf_1.Conf.pdException("page", "e2" + e2);
                        site_1.Site.nextPage();
                    }
                    return [2 /*return*/];
                });
            }); });
            p.catch(function (e3) {
                conf_1.Conf.pdException("page", "e3" + e3);
                // エラーが起きたので次。
                site_1.Site.nextPage();
            });
        }
        catch (e4) {
            conf_1.Conf.pdException("page", "e4" + e4);
            // エラーが起きたので次。
            site_1.Site.nextPage();
        }
    };
    return Page;
}());
exports.Page = Page;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client = __webpack_require__(2);
var page_1 = __webpack_require__(3);
var conf_1 = __webpack_require__(0);
var pagesdb_1 = __webpack_require__(1);
var sites_1 = __webpack_require__(5);
var url = __webpack_require__(11);
var Site = (function () {
    function Site() {
    }
    Site.download = function (site) {
        var _this = this;
        Site.site = site;
        Site.page_id = 0;
        Site.page_urls = [];
        try {
            var p = client.fetch(Site.site["url"]);
            p.then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                var as, i, a, href, pageurl_org, pageurl, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            conf_1.Conf.procLog("site", "dl : " + Site.site.title);
                            as = result.$("a");
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < as.length)) return [3 /*break*/, 8];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 6, , 7]);
                            a = as[i];
                            href = a.attribs["href"];
                            if (!(href !== undefined)) return [3 /*break*/, 5];
                            pageurl_org = url.resolve(Site.site["url"], href);
                            pageurl = pageurl_org.split("#")[0];
                            if (!(pageurl.indexOf("javascript") < 0)) return [3 /*break*/, 5];
                            conf_1.Conf.procLog("site", "for: " + pageurl);
                            return [4 /*yield*/, pagesdb_1.Pagesdb.noPage(pageurl)];
                        case 3:
                            if (!_a.sent()) return [3 /*break*/, 5];
                            return [4 /*yield*/, pagesdb_1.Pagesdb.putPage(pageurl)];
                        case 4:
                            _a.sent();
                            Site.page_urls.push(pageurl);
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            e_1 = _a.sent();
                            // do nothing : ill url (ex. javascript)
                            conf_1.Conf.pdException("site", e_1);
                            return [3 /*break*/, 7];
                        case 7:
                            i++;
                            return [3 /*break*/, 1];
                        case 8:
                            conf_1.Conf.procLog("site", "end : for");
                            // 最初の一つ目のページを処理
                            Site.nextPage();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (e) {
            conf_1.Conf.pdException("site", e);
            sites_1.Sites.nextSite();
        }
    };
    Site.nextPage = function () {
        if (Site.page_urls != undefined) {
            if (Site.hasPage()) {
                var page_url = Site.page_urls[Site.page_id];
                conf_1.Conf.procLog("site", "next : " + Site.page_id + "/" + Site.page_urls.length + " " + page_url);
                Site.page_id++;
                page_1.Page.download(Site.site["title"], page_url, Site.page_id);
            }
            else {
                // 全部終わったので次のサイトへ。
                conf_1.Conf.procLog("site", "end");
                sites_1.Sites.nextSite();
            }
        }
        else {
            Site.page_id++; // エラーなので進めるだけ。
        }
    };
    Site.hasPage = function () {
        if (Site.page_urls != undefined) {
            // urlがあれば数を確認。
            return Site.page_id < Site.page_urls.length;
        }
        else {
            return false;
        }
    };
    return Site;
}());
exports.Site = Site;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var conf_1 = __webpack_require__(0);
var site_1 = __webpack_require__(4);
var client = __webpack_require__(2);
var pagesdb_1 = __webpack_require__(1);
var page_1 = __webpack_require__(3);
var Sites = (function () {
    function Sites() {
    }
    Sites.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sites.site_id = 0;
                        conf_1.Conf.init();
                        page_1.Page.init(); // ダウンロード設定
                        //Conf.procLog("sites", "start init");
                        return [4 /*yield*/, pagesdb_1.Pagesdb.init()];
                    case 1:
                        //Conf.procLog("sites", "start init");
                        _a.sent();
                        //Conf.procLog("sites", "inits : ");
                        // 最初の一発目
                        Sites.nextSite();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sites.nextSite = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                conf_1.Conf.procLog("sites", "next : " + Sites.site_id + "/" + conf_1.Conf.params["sites"].length);
                if (Sites.site_id < conf_1.Conf.params["sites"].length) {
                    conf_1.Conf.procLog("sites", "start : " + conf_1.Conf.params["sites"][Sites.site_id]["title"]);
                    site_1.Site.download(conf_1.Conf.params["sites"][Sites.site_id]);
                    Sites.site_id++;
                }
                else {
                    if (site_1.Site.hasPage() == false) {
                        if (client.download.state.queue <= 0) {
                            // 全部終わったのでクローズ。
                            //Pagesdb.close();
                            conf_1.Conf.procLog("sites", "end...program done");
                        }
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    Sites.test = function () {
        console.log(client.download.parallel);
        client.download.parallel = 100;
    };
    return Sites;
}());
exports.Sites = Sites;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sites_1 = __webpack_require__(5);
var pagesdb_1 = __webpack_require__(1);
function main_test() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, a;
        return __generator(this, function (_b) {
            for (_i = 0, _a = process.argv; _i < _a.length; _i++) {
                a = _a[_i];
                console.log(a);
            }
            return [2 /*return*/];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!(process.argv.length > 2)) return [3 /*break*/, 1];
                    // SQLモード
                    main_sqlcmd(process.argv[2], process.argv[3]);
                    return [3 /*break*/, 3];
                case 1:
                    console.log("main_start");
                    return [4 /*yield*/, sites_1.Sites.init()];
                case 2:
                    _a.sent();
                    console.log("main_end");
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function main_sqlcmd(cmd, val) {
    return __awaiter(this, void 0, void 0, function () {
        var q;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    q = "";
                    return [4 /*yield*/, pagesdb_1.Pagesdb.init()];
                case 1:
                    _a.sent();
                    if (cmd == "select") {
                        q += "SELECT * FROM pages WHERE strftime('%Y-%m-%d', created) = '" + val + "';";
                        pagesdb_1.Pagesdb.all(q);
                    }
                    else if (cmd == "delete") {
                        q += "DELETE FROM pages WHERE strftime('%Y-%m-%d', created) = '" + val + "';";
                        pagesdb_1.Pagesdb.run(q);
                    }
                    else if (cmd == "search") {
                        q += "SELECT * FROM pages WHERE url LIKE '%" + val + "%';";
                        pagesdb_1.Pagesdb.all(q);
                    }
                    else {
                        console.log("error : could not build query.");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
//let main = main_org;
//main_test();
main();


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("sqlite3");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);


/***/ })
/******/ ]);