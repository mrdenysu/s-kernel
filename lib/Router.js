"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
class Router {
    constructor(rootPath = "") {
        this.rootPath = rootPath;
        this.GET = new Map();
        this.POST = new Map();
        this.PUT = new Map();
        this.DELETE = new Map();
    }
    get(path, func) {
        if (this.GET.has(`${this.rootPath}${path}`)) {
            console.warn("The route is busy!");
        }
        else {
            this.GET.set(`${this.rootPath}${path}`, func);
        }
        return this;
    }
    post(path, func) {
        if (this.POST.has(`${this.rootPath}${path}`)) {
            console.warn("The route is busy!");
        }
        else {
            this.POST.set(`${this.rootPath}${path}`, func);
        }
        return this;
    }
    put(path, func) {
        if (this.PUT.has(`${this.rootPath}${path}`)) {
            console.warn("The route is busy!");
        }
        else {
            this.PUT.set(`${this.rootPath}${path}`, func);
        }
        return this;
    }
    delete(path, func) {
        if (this.DELETE.has(`${this.rootPath}${path}`)) {
            console.warn("The route is busy!");
        }
        else {
            this.DELETE.set(`${this.rootPath}${path}`, func);
        }
        return this;
    }
    import(routerExportData) {
        this.GET = new Map([...this.GET.entries(), ...routerExportData.GET]);
        this.POST = new Map([...this.POST.entries(), ...routerExportData.POST]);
        this.PUT = new Map([...this.PUT.entries(), ...routerExportData.PUT]);
        this.DELETE = new Map([...this.DELETE.entries(), ...routerExportData.DELETE]);
        return this;
    }
    get export() {
        return {
            GET: this.GET.entries(),
            POST: this.POST.entries(),
            PUT: this.PUT.entries(),
            DELETE: this.DELETE.entries(),
        };
    }
}
exports.Router = Router;
module.exports = { Router };
//# sourceMappingURL=Router.js.map