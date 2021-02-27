import Cookies from "cookies";
import { Request, Response } from "./Server";

export class Storage {
  public cookies: Cookies
  constructor(req: Request, res: Response, cookiesOptions: Cookies.Option) {
    this.cookies = new Cookies(req, res, cookiesOptions);
  }

  // todo: Работа с сессиями
}