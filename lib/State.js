"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const formidable_1 = require("formidable");
class State {
    constructor(req, params) {
        this.Method = params.method;
        this.Pathname = params.pathname;
        this.Params = params.params;
        this.Query = params.query;
    }
    get method() {
        return this.Method;
    }
    get pathname() {
        return this.Pathname;
    }
    get params() {
        return this.Params;
    }
    get query() {
        return this.Query;
    }
    async parseBody() {
        if (this.Body)
            return this.Body;
        const body = await new Promise((resolve, reject) => {
            const form = new formidable_1.IncomingForm({ multiples: true });
            form.parse(this.Request, (err, fields, files) => {
                if (err)
                    return reject(err);
                return resolve({ fields, files });
            });
        });
        return (this.Body = body);
    }
}
exports.State = State;
//# sourceMappingURL=State.js.map