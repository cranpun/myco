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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    //await Conf.init();
                    console.log("hogehoge0");
                    return [4 /*yield*/, pagesdb_1.Pagesdb.init()];
                case 1:
                    _a.sent();
                    console.log("hogehoge2");
                    return [4 /*yield*/, pagesdb_1.Pagesdb.putPage("hogehoge")];
                case 2:
                    _a.sent();
                    console.log("hogehoge3");
                    return [4 /*yield*/, pagesdb_1.Pagesdb.noPage("hogehoge", function () {
                            console.log("hoge-no");
                        })];
                case 3:
                    _a.sent();
                    console.log("hogehoge4");
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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = __webpack_require__(2);
//sqlite3.verbose();
var Pagesdb = (function () {
    function Pagesdb() {
    }
    Pagesdb.init = function () {
        console.log("init1");
        return new Promise(function (resolve) {
            console.log("init2");
            sqlite3.verbose();
            var db = new sqlite3.Database(Pagesdb.filename);
            var exists = 0;
            db.serialize(function () {
                db.all("SELECT * FROM sqlite_master WHERE name='" + Pagesdb.tabname + "' AND type='table'", function (err, rows) {
                    exists = rows.length;
                    if (exists <= 0) {
                        db.run("CREATE TABLE " + Pagesdb.tabname + " (url TEXT PRIMARY KEY, created TEXT)", function (e) {
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
    };
    Pagesdb.exec = function (func) {
        var db = new sqlite3.Database(Pagesdb.filename);
        func(db);
        db.close();
    };
    Pagesdb.putPage = function (url) {
        return new Promise(function (resolve) {
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
    };
    Pagesdb.noPage = function (url, callback) {
        return new Promise(function (resolve) {
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
    };
    return Pagesdb;
}());
Pagesdb.tabname = "pages";
Pagesdb.filename = "pages.db";
exports.Pagesdb = Pagesdb;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("sqlite3");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);