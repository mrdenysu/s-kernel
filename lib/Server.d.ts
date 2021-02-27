/// <reference types="node" />
import Cookies from "cookies";
import { IncomingMessage, ServerResponse } from "node:http";
import { Http2ServerRequest, Http2ServerResponse } from "node:http2";
import { RouteHandler, RoutePath, RouterExportData } from "./Router";
import { Params, State } from "./State";
import { Storage } from "./Storage";
import { Render, Write } from "./Write";
export declare type Request = Http2ServerRequest & IncomingMessage;
export declare type Response = Http2ServerResponse & ServerResponse;
export declare type RequestHandler = (req: Request, res: Response) => Promise<any>;
export declare type IfindRoute = [boolean, {
    params: Params;
    func: RouteHandler;
}];
export declare type Context = {
    state: State;
    storage: Storage;
    write: Write;
};
export declare class Server {
    private errorHandler404;
    private errorHandler500;
    private router;
    private cookiesOptions;
    private render;
    constructor(cookiesOptions?: Cookies.Option, renderOptions?: Render);
    get(path: RoutePath, func: RouteHandler): this;
    post(path: RoutePath, func: RouteHandler): this;
    put(path: RoutePath, func: RouteHandler): this;
    delete(path: RoutePath, func: RouteHandler): this;
    import(routerExportData: RouterExportData): this;
    error404(func: RouteHandler): this;
    error500(func: RouteHandler): this;
    get requestHandler(): RequestHandler;
    private rootHandler;
    private findRoute;
    share(path: string, dir: string): this;
}
