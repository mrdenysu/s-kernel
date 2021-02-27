import * as ejs from "ejs";
import { Response } from "./Server";
export declare type RenderEngine = (path: string, data: object, options: object, cb: (err: any, html: string) => any) => any;
export interface Render {
    options?: ejs.Options;
    viewPath?: string;
}
export declare class Write {
    private Response;
    private MinifyOptions;
    private renderEngine;
    private renderOptions;
    private renderViewPath;
    constructor(res: Response, render: Render);
    send(chunk: any): void;
    json(object: object | string | number | boolean): void;
    error(status?: number, message?: string, data?: any): void;
    render(path: string, data?: object): void;
    file(filepath: string): void;
}
