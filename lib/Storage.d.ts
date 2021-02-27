import Cookies from "cookies";
import { Request, Response } from "./Server";
export declare class Storage {
    cookies: Cookies;
    constructor(req: Request, res: Response, cookiesOptions: Cookies.Option);
}
