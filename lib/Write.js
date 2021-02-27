"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Write = void 0;
const ejs = require("ejs");
const fs_1 = require("fs");
const html_minifier_1 = require("html-minifier");
const mime_types_1 = require("mime-types");
const path_1 = require("path");
class Write {
    constructor(res, render) {
        this.Response = res;
        this.renderEngine = ejs.renderFile;
        this.renderOptions = render?.options ?? {};
        this.renderViewPath = render?.viewPath ?? "views";
        this.MinifyOptions = {
            removeComments: true,
            removeTagWhitespace: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeEmptyElements: false,
            removeOptionalTags: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true,
        };
    }
    send(chunk) {
        this.Response.writeHead(200, { "Content-Type": "text/plain" });
        this.Response.end(chunk);
    }
    json(object) {
        this.Response.writeHead(200, { "Content-Type": "text/plain" });
        this.Response.end(JSON.stringify(object));
    }
    error(status = 400, message = "Error", data = {}) {
        this.Response.writeHead(status, { "Content-Type": " application/json" });
        this.Response.end(JSON.stringify({
            status: status,
            message: message,
            data: data,
        }));
    }
    render(path, data = {}) {
        let _path = path_1.join(this.renderViewPath, path);
        const cb = async (error, html) => {
            if (error)
                return this.error(500, "Render error", error);
            this.Response.writeHead(200, {
                "Content-Type": "text/html; charset=UTF-8",
            });
            this.Response.end(html_minifier_1.minify(await html, this.MinifyOptions));
        };
        if (this.renderEngine) {
            this.renderEngine(_path, data, this.renderOptions, cb.bind(this));
        }
        else {
            this.error(500, "The rendering engine does not exist");
        }
    }
    file(filepath) {
        const ext = path_1.extname(filepath);
        const file_type = `${mime_types_1.lookup(ext)}`;
        const content_type = `${mime_types_1.contentType(ext)}`;
        let supportsMinifying = ["application/javascript", "text/css", "text/html", "text/markdown", "application/json"];
        fs_1.readFile(filepath, "utf-8", (err, file) => {
            if (err)
                return this.error(500, "Error on send file");
            this.Response.writeHead(200, {
                "Content-Type": content_type,
            });
            if (supportsMinifying.includes(file_type)) {
                this.Response.end(html_minifier_1.minify(file, this.MinifyOptions));
            }
            else {
                fs_1.createReadStream(filepath).pipe(this.Response);
            }
        });
    }
}
exports.Write = Write;
//# sourceMappingURL=Write.js.map