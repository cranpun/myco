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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var conf_1 = __webpack_require__(2);
var pagesdb_1 = __webpack_require__(3);
//console.log("test");
conf_1.Conf.init();
pagesdb_1.Pagesdb.init();
var str = "【無/洋\物】こ*れ|は:抜?け\"る!! ヨーロッパ版のマジックミラー号で街中でハメ撮り";
//str = str.replace(/\//g, "");
str = conf_1.Conf.sanitpath(str);
console.log(str);
//Sites.parse();
//let site = new Page("hogehoge", "http://erogazounosuke.com/archives/date/2014/06");
//site.download();
// import * as fs from "fs";
// try { 
//     fs.mkdirSync("./hoge");
// } catch(e) {
//     // do nothing
//     console.log(e);
// }
// try { 
//     fs.mkdirSync("./hoge/hogehoge");
// } catch(e) {
//     // do nothing
//     console.log(e);
// }
// import * as path from "path";
// let str = path.join("hoho-i", "hoge");
// console.log(str); 


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fs = __webpack_require__(4);
var path = __webpack_require__(5);
var moment = __webpack_require__(0);
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
            Conf.debug(e);
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
        ];
        for (var _i = 0, xchars_1 = xchars; _i < xchars_1.length; _i++) {
            var x = xchars_1[_i];
            ret = ret.replace(new RegExp(x, 'g'), "");
        }
        if (ret != str) {
            console.log("replace : " + str + " -> " + ret);
        }
        return ret;
    };
    Conf.debug = function (e) {
        //console.log(e);
    };
    return Conf;
}());
Conf.timeout = 10 * 1000; // msec
Conf.ignorelength = 300 * 1000; // バイト
exports.Conf = Conf;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = __webpack_require__(6);
var moment = __webpack_require__(0);
//sqlite3.verbose();
var Pagesdb = (function () {
    function Pagesdb() {
    }
    Pagesdb.init = function () {
        var _this = this;
        Pagesdb.db = new sqlite3.Database('pages.db');
        var exists = 0;
        this.db.serialize(function () {
            _this.db.all("SELECT * FROM sqlite_master WHERE name='" + Pagesdb.tabname + "' AND type='table'", function (err, rows) {
                exists = rows.length;
                _this.db.serialize(function () {
                    if (exists <= 0) {
                        _this.db.run("CREATE TABLE " + Pagesdb.tabname + " (url TEXT PRIMARY KEY, created TEXT)");
                    }
                });
            });
        });
    };
    Pagesdb.putPage = function (url) {
        Pagesdb.db.serialize(function () {
            // 登録なのでstateはpre
            var q = "INSERT INTO " + Pagesdb.tabname + " (url, created) VALUES ('" + url + "', '" + moment().format("YYYY-MM-DD HH:mm:ss") + "')";
            Pagesdb.db.run(q, function (e) {
                console.log("err ins : " + e + "  " + q);
            });
        });
    };
    Pagesdb.noPage = function (url, callback) {
        Pagesdb.db.serialize(function () {
            Pagesdb.db.get("SELECT * FROM " + Pagesdb.tabname + " WHERE url = '" + url + "'", function (err, row) {
                if (row == undefined) {
                    callback();
                }
                else {
                    //console.log("hasPage : " + url);
                }
            });
        });
    };
    return Pagesdb;
}());
Pagesdb.tabname = "pages";
exports.Pagesdb = Pagesdb;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("sqlite3");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);