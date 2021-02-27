import { Context } from "./Server";

export type Method = "GET" | "POST" | "PUT" | "DELETE";

export type RoutePath = string;

export type RouteHandler = (ctx: Context) => Promise<any>;

export type Routes = Map<RoutePath, RouteHandler>;

export type RouterExportData = {
  GET: IterableIterator<[string, RouteHandler]>;
  POST: IterableIterator<[string, RouteHandler]>;
  PUT: IterableIterator<[string, RouteHandler]>;
  DELETE: IterableIterator<[string, RouteHandler]>;
};

export class Router {
  private rootPath: RoutePath;
  private GET: Routes;
  private POST: Routes;
  private PUT: Routes;
  private DELETE: Routes;

  constructor(rootPath: RoutePath = "") {
    this.rootPath = rootPath;
    this.GET = new Map();
    this.POST = new Map();
    this.PUT = new Map();
    this.DELETE = new Map();
  }

  public get(path: RoutePath, func: RouteHandler): this {
    if (this.GET.has(`${this.rootPath}${path}`)) {
      console.warn("The route is busy!");
    } else {
      this.GET.set(`${this.rootPath}${path}`, func);
    }
    return this;
  }

  public post(path: RoutePath, func: RouteHandler): this {
    if (this.POST.has(`${this.rootPath}${path}`)) {
      console.warn("The route is busy!");
    } else {
      this.POST.set(`${this.rootPath}${path}`, func);
    }
    return this;
  }

  public put(path: RoutePath, func: RouteHandler): this {
    if (this.PUT.has(`${this.rootPath}${path}`)) {
      console.warn("The route is busy!");
    } else {
      this.PUT.set(`${this.rootPath}${path}`, func);
    }
    return this;
  }

  public delete(path: RoutePath, func: RouteHandler): this {
    if (this.DELETE.has(`${this.rootPath}${path}`)) {
      console.warn("The route is busy!");
    } else {
      this.DELETE.set(`${this.rootPath}${path}`, func);
    }
    return this;
  }

  public import(routerExportData: RouterExportData): this {
    this.GET = new Map([...this.GET.entries(), ...routerExportData.GET]);
    this.POST = new Map([...this.POST.entries(), ...routerExportData.POST]);
    this.PUT = new Map([...this.PUT.entries(), ...routerExportData.PUT]);
    this.DELETE = new Map([...this.DELETE.entries(), ...routerExportData.DELETE]);
    return this;
  }

  get export(): RouterExportData {
    return {
      GET: this.GET.entries(),
      POST: this.POST.entries(),
      PUT: this.PUT.entries(),
      DELETE: this.DELETE.entries(),
    };
  }
}

module.exports = { Router };
