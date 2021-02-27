import { error, log } from "console";
import Cookies from "cookies";
import { existsSync, statSync } from "fs";
import { IncomingMessage, ServerResponse } from "node:http";
import { Http2ServerRequest, Http2ServerResponse } from "node:http2";
import { join } from "path";
import { match } from "path-to-regexp";
import { parse } from "url";
import { Method, RouteHandler, RoutePath, Router, RouterExportData } from "./Router";
import { Params, State } from "./State";
import { Storage } from "./Storage";
import { Render, Write } from "./Write";

export type Request = Http2ServerRequest & IncomingMessage;
export type Response = Http2ServerResponse & ServerResponse;
export type RequestHandler = (req: Request, res: Response) => Promise<any>;
export type IfindRoute = [boolean, { params: Params; func: RouteHandler }];

export type Context = { state: State; storage: Storage; write: Write };

export class Server {
  private errorHandler404: RouteHandler;
  private errorHandler500: RouteHandler;
  private router: Router;
  // Server config
  private cookiesOptions: Cookies.Option;
  private render: Render;

  constructor(cookiesOptions?: Cookies.Option, renderOptions?: Render) {
    // Server config
    this.cookiesOptions = cookiesOptions || {};
    this.render = renderOptions || {};

    // Default
    this.router = new Router();
    this.errorHandler404 = async ({write: {error}}) => {
      return error(404, "Not Found[");
    };
    this.errorHandler500 = async ({write: {error}}) => {
      return error(500, "Internal Server Error");
    };
    log("Create at:", new Date().toLocaleString("ru"));
  }

  public get(path: RoutePath, func: RouteHandler): this {
    this.router.get(path, func);
    return this;
  }
  public post(path: RoutePath, func: RouteHandler): this {
    this.router.post(path, func);
    return this;
  }
  public put(path: RoutePath, func: RouteHandler): this {
    this.router.put(path, func);
    return this;
  }
  public delete(path: RoutePath, func: RouteHandler): this {
    this.router.delete(path, func);
    return this;
  }
  public import(routerExportData: RouterExportData): this {
    this.router.import(routerExportData);
    return this;
  }
  public error404(func: RouteHandler): this {
    this.errorHandler404 = func;
    return this;
  }
  public error500(func: RouteHandler): this {
    this.errorHandler500 = func;
    return this;
  }
  public get requestHandler(): RequestHandler {
    return this.rootHandler.bind(this);
  }
  private async rootHandler(req: Request, res: Response): Promise<any> {
    const requestTime = Date.now();
    const { method } = req;
    const { pathname, query } = parse(req.url, true);
    const [routeFound, { params, func: routeHandler }] = this.findRoute(<Method>method, pathname);

    let func: RouteHandler;
    if (!routeFound) func = routeHandler;
    else func = this.errorHandler404;

    const state = new State(req, { method, pathname, query, params }); // readonly
    const storage = new Storage(req, res, this.cookiesOptions); // read / write
    const write = new Write(res, this.render); // write

    const ctx = { state, storage, write };

    try {
      await func(ctx);
    } catch (e) {
      error(e);
      await this.errorHandler500(ctx);
    }

    res.writeHead(200, {
      "Content-Type": "text/html; charset=UTF-8",
    });
    res.end("OK");
    log(method, pathname, `Completed in ${Date.now() - requestTime} ms`);
  }
  private findRoute(method: Method, pathname: RoutePath): IfindRoute {
    let router = this.router.export[method];
    let params = {};
    let func: RouteHandler;

    if (typeof router === "undefined") return [false, { params, func }];

    for (const iterator of this.router.export["GET"]) {
      let p2ex = match(iterator[0])(pathname);
      if (p2ex) {
        params = p2ex.params;
        func = iterator[1];
        break;
      }
      continue;
    }

    if (typeof func === "undefined") return [false, { params, func }];

    return [true, { params, func }];
  }
  public share(path: string, dir: string): this {
    async function func({ state, write }: Context): Promise<void> {
      const filePath = join(dir, [...state.params.f].join("/").replace(path, "/"));
      if (!existsSync(filePath)) return write.error(404);
      if (statSync(filePath).isDirectory()) return write.error(403);
      return write.file(filePath);
    }

    this.get(`${path}/:f+`, func);
    return this;
  }
}
