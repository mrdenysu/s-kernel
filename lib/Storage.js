"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const cookies_1 = require("cookies");
class Storage {
    constructor(req, res, cookiesOptions) {
        this.cookies = new cookies_1.default(req, res, cookiesOptions);
    }
}
exports.Storage = Storage;
//# sourceMappingURL=Storage.js.map