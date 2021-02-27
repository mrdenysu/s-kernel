"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const console_1 = require("console");
const fs_1 = require("fs");
const path_1 = require("path");
const path_to_regexp_1 = require("path-to-regexp");
const url_1 = require("url");
const Router_1 = require("./Router");
const State_1 = require("./State");
const Storage_1 = require("./Storage");
const Write_1 = require("./Write");
class Server {
    constructor(cookiesOptions, renderOptions) {
        this.cookiesOptions = cookiesOptions || {};
        this.render = renderOptions || {};
        this.router = new Router_1.Router();
        this.errorHandler404 = async () => {
            return "";
        };
        this.errorHandler500 = async () => {
            return "";
        };
        console_1.log("Create at:", new Date().toLocaleString("ru"));
    }
    get(path, func) {
        this.router.get(path, func);
        return this;
    }
    post(path, func) {
        this.router.post(path, func);
        return this;
    }
    put(path, func) {
        this.router.put(path, func);
        return this;
    }
    delete(path, func) {
        this.router.delete(path, func);
        return this;
    }
    import(routerExportData) {
        this.router.import(routerExportData);
        return this;
    }
    error404(func) {
        this.errorHandler404 = func;
        return this;
    }
    error500(func) {
        this.errorHandler500 = func;
        return this;
    }
    get requestHandler() {
        return this.rootHandler.bind(this);
    }
    async rootHandler(req, res) {
        const requestTime = Date.now();
        const { method } = req;
        const { pathname, query } = url_1.parse(req.url, true);
        const [routeFound, { params, func: routeHandler }] = this.findRoute(method, pathname);
        let func;
        if (!routeFound)
            func = routeHandler;
        else
            func = this.errorHandler404;
        const state = new State_1.State(req, { method, pathname, query, params });
        const storage = new Storage_1.Storage(req, res, this.cookiesOptions);
        const write = new Write_1.Write(res, this.render);
        const ctx = { state, storage, write };
        try {
            await func(ctx);
        }
        catch (e) {
            console_1.error(e);
            await this.errorHandler500(ctx);
        }
        res.writeHead(200, {
            "Content-Type": "text/html; charset=UTF-8",
        });
        res.end("OK");
        console_1.log(method, pathname, `Completed in ${Date.now() - requestTime} ms`);
    }
    findRoute(method, pathname) {
        let router = this.router.export[method];
        let params = {};
        let func;
        if (typeof router === "undefined")
            return [false, { params, func }];
        for (const iterator of this.router.export["GET"]) {
            let p2ex = path_to_regexp_1.match(iterator[0])(pathname);
            if (p2ex) {
                params = p2ex.params;
                func = iterator[1];
                break;
            }
            continue;
        }
        if (typeof func === "undefined")
            return [false, { params, func }];
        return [true, { params, func }];
    }
    share(path, dir) {
        async function func({ state, write }) {
            const filePath = path_1.join(dir, [...state.params.f].join("/").replace(path, "/"));
            if (!fs_1.existsSync(filePath))
                return write.error(404);
            if (fs_1.statSync(filePath).isDirectory())
                return write.error(403);
            return write.file(filePath);
        }
        this.get(`${path}/:f+`, func);
        return this;
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map