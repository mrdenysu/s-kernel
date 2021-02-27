/// <reference types="node" />
import { Fields, Files } from "formidable";
import { Request } from "./Server";
export interface Params extends NodeJS.Dict<string | string[]> {
}
export interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> {
}
export interface StateParams {
    method: string;
    pathname: string;
    query: ParsedUrlQuery;
    params: Params;
}
export interface Body {
    fields: Fields;
    files: Files;
}
export declare class State {
    private Request;
    private Method;
    private Pathname;
    private Query;
    private Params;
    private Body;
    constructor(req: Request, params: StateParams);
    get method(): string;
    get pathname(): string;
    get params(): Params;
    get query(): ParsedUrlQuery;
    parseBody(): Promise<Body>;
}
