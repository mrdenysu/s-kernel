"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const Cookies = require("cookies");
class Storage {
    constructor(req, res, cookiesOptions) {
        this.cookies = new Cookies(req, res, cookiesOptions);
    }
}
exports.Storage = Storage;
//# sourceMappingURL=Storage.js.map