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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fs = __webpack_require__(7);
var path = __webpack_require__(8);
var moment = __webpack_require__(2);
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
    Conf.genPagedirname = function (page, id) {
        var pagefix = page;
        pagefix = pagefix.replace(" ", "");
        if (pagefix.length > 15) {
            pagefix = pagefix.substr(0, 13);
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
            Conf.pdException(e);
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
        var xchars = [
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
            "\\,"
        ];
        for (var _i = 0, xchars_1 = xchars; _i < xchars_1.length; _i++) {
            var x = xchars_1[_i];
            ret = ret.replace(new RegExp(x, 'g'), "");
        }
        if (ret != str) {
            Conf.procLog("replace", str + " -> " + ret);
        }
        return ret;
    };
    Conf.pdException = function (e) {
        console.log(e);
    };
    Conf.procLog = function (tag, mes) {
        var tags = [
            "sites",
            "site",
            "page",
            "pagesdb",
            "img",
        ];
        if (tags.indexOf(tag) >= 0) {
            console.log("[" + tag + "]" + mes);
        }
    };
    return Conf;
}());
Conf.timeout = 10 * 1000; // msec
Conf.ignorelength = 300 * 1000; // バイト
exports.Conf = Conf;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = __webpack_require__(9);
var moment = __webpack_require__(2);
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
                                conf_1.Conf.pdException(e);
                            }
                            resolve();
                        });
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    };
    Pagesdb.putPage = function (url) {
        var _this = this;
        return new Promise(function (resolve) {
            var db = _this.db;
            db.serialize(function () {
                // 登録なのでstateはpre
                var q = "INSERT INTO " + Pagesdb.tabname + " (url, created) VALUES ('" + url + "', '" + moment().format("YYYY-MM-DD HH:mm:ss") + "')";
                db.run(q, function (e) {
                    if (e != null) {
                        conf_1.Conf.pdException("err ins : " + e + "  " + q);
                    }
                    conf_1.Conf.procLog("pagesdb", "ins : " + q);
                    resolve();
                });
            });
        });
    };
    Pagesdb.noPage = function (url) {
        var _this = this;
        return new Promise(function (resolve) {
            var db = _this.db;
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
                        conf_1.Conf.pdException(err);
                        resolve(false); // エラーは既知扱い
                    }
                });
            });
        });
    };
    Pagesdb.close = function () {
        this.db.close();
    };
    return Pagesdb;
}());
Pagesdb.tabname = "pages";
Pagesdb.filename = "pages.db";
exports.Pagesdb = Pagesdb;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("moment");

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
var sites_1 = __webpack_require__(5);
var conf_1 = __webpack_require__(0);
var pagesdb_1 = __webpack_require__(1);
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
function main_test() {
    return __awaiter(this, void 0, void 0, function () {
        var hoge;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pagesdb_1.Pagesdb.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, pagesdb_1.Pagesdb.putPage("https://www.google.co.jp/intl/ja/optionssssss/")];
                case 2:
                    _a.sent();
                    console.log(0);
                    return [4 /*yield*/, pagesdb_1.Pagesdb.noPage("https://www.google.co.jp/intl/ja/optionssssss/")];
                case 3:
                    hoge = _a.sent();
                    console.log(hoge);
                    return [4 /*yield*/, pagesdb_1.Pagesdb.close()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
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
                    return [4 /*yield*/, conf_1.Conf.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, pagesdb_1.Pagesdb.init()];
                case 2:
                    _a.sent();
                    console.log("parse start");
                    return [4 /*yield*/, sites_1.Sites.parse()];
                case 3:
                    _a.sent();
                    console.log("parse end");
                    pagesdb_1.Pagesdb.close();
                    console.log("parse close");
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var client = __webpack_require__(6);
var conf_1 = __webpack_require__(0);
var pagesdb_1 = __webpack_require__(1);
var url = __webpack_require__(10);
var Site = (function () {
    function Site(site) {
        this.site = site;
    }
    Site.prototype.download = function () {
        var _this = this;
        return new Promise(function (resolve) {
            client.set("timeout", conf_1.Conf.timeout);
            var p = client.fetch(_this.site["url"]);
            var me = _this;
            var id = 0;
            p.then(function (result) {
                conf_1.Conf.procLog("site", "end : " + _this.site.title);
                result.$("a").each(function (idx) {
                    try {
                        var pageurl = result.$(this).url({ invalid: false }).toString();
                        url.parse(pageurl);
                        conf_1.Conf.procLog("site", "each : " + pageurl);
                        // ダウンロード済みなら実行しない
                        if (pagesdb_1.Pagesdb.noPage(pageurl)) {
                            pagesdb_1.Pagesdb.putPage(pageurl);
                            conf_1.Conf.procLog("site", "page start : " + pageurl);
                            id++;
                            // let page = new Page(me.site["title"], pageurl, id);
                            //await page.download();
                        }
                    }
                    catch (e) {
                        // do nothing。不正なリンクなので無視。
                    }
                });
                conf_1.Conf.procLog("site", "end : each");
                resolve();
            });
        });
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
var Sites = (function () {
    function Sites() {
    }
    Sites.parse = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var _i, _a, siteConf, site;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _i = 0, _a = conf_1.Conf.params["sites"];
                                    _b.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                                    siteConf = _a[_i];
                                    site = new site_1.Site(siteConf);
                                    conf_1.Conf.procLog("sites", "start : " + siteConf.title);
                                    return [4 /*yield*/, site.download()];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return Sites;
}());
exports.Sites = Sites;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("cheerio-httpcli");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("sqlite3");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ })
/******/ ]);