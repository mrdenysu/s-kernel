import * as ejs from "ejs";
import { createReadStream, readFile } from "fs";
import { minify } from "html-minifier";
import { contentType, lookup } from "mime-types";
import { extname, join } from "path";
import { Response } from "./Server";

export type RenderEngine = (path: string, data: object, options: object, cb: (err: any, html: string) => any) => any;

export interface Render {
  options?: ejs.Options;
  viewPath?: string;
}

export class Write {
  private Response: Response;
  private MinifyOptions: object;
  private renderEngine: RenderEngine;
  private renderOptions: object;
  private renderViewPath: string;

  constructor(res: Response, render: Render) {
    this.Response = res;
    // render Engine
    this.renderEngine = ejs.renderFile;
    this.renderOptions = render?.options ?? {};
    this.renderViewPath = render?.viewPath ?? "views";
    // Minify
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

  /**
   * Send status 200 and any chunk
   */
  public send(chunk: any): void {
    this.Response.writeHead(200, { "Content-Type": "text/plain" });
    this.Response.end(chunk);
  }

  /**
   * Send status 200 and any JSON
   */
  public json(object: object | string | number | boolean): void {
    this.Response.writeHead(200, { "Content-Type": "text/plain" });
    this.Response.end(JSON.stringify(object));
  }

  /**
   * Send any status and Error message
   */
  public error(status: number = 400, message: string = "Error", data: any = {}): void {
    this.Response.writeHead(status, { "Content-Type": " application/json" });
    this.Response.end(
      JSON.stringify({
        status: status,
        message: message,
        data: data,
      })
    );
  }

  /**
   * Render
   */
  public render(path: string, data: object = {}) {
    let _path = join(this.renderViewPath, path);
    const cb = async (error: any, html: Promise<string>) => {
      if (error) return this.error(500, "Render error", error);
      this.Response.writeHead(200, {
        "Content-Type": "text/html; charset=UTF-8",
      });
      this.Response.end(minify(await html, this.MinifyOptions));
    };
    if (this.renderEngine) {
      this.renderEngine(_path, data, this.renderOptions, cb.bind(this));
    } else {
      this.error(500, "The rendering engine does not exist");
    }
  }

  /**
   * Send file
   */
  public file(filepath: string): void {
    // ?: Compression - soon
    const ext = extname(filepath);
    const file_type = `${lookup(ext)}`;
    const content_type = `${contentType(ext)}`;
    let supportsMinifying = ["application/javascript", "text/css", "text/html", "text/markdown", "application/json"];
    readFile(filepath, "utf-8", (err, file) => {
      if (err) return this.error(500, "Error on send file");
      this.Response.writeHead(200, {
        "Content-Type": content_type,
      });
      if (supportsMinifying.includes(file_type)) {
        this.Response.end(minify(file, this.MinifyOptions));
      } else {
        createReadStream(filepath).pipe(this.Response);
      }
    });
  }
}
