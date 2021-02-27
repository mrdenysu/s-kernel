import { Context } from "./Server";
export declare type Method = "GET" | "POST" | "PUT" | "DELETE";
export declare type RoutePath = string;
export declare type RouteHandler = (ctx: Context) => Promise<any>;
export declare type Routes = Map<RoutePath, RouteHandler>;
export declare type RouterExportData = {
    GET: IterableIterator<[string, RouteHandler]>;
    POST: IterableIterator<[string, RouteHandler]>;
    PUT: IterableIterator<[string, RouteHandler]>;
    DELETE: IterableIterator<[string, RouteHandler]>;
};
export declare class Router {
    private rootPath;
    private GET;
    private POST;
    private PUT;
    private DELETE;
    constructor(rootPath?: RoutePath);
    get(path: RoutePath, func: RouteHandler): this;
    post(path: RoutePath, func: RouteHandler): this;
    put(path: RoutePath, func: RouteHandler): this;
    delete(path: RoutePath, func: RouteHandler): this;
    import(routerExportData: RouterExportData): this;
    get export(): RouterExportData;
}
