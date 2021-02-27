import { Fields, Files, IncomingForm } from "formidable";
import { IncomingMessage } from "node:http";
import { Request } from "./Server";
export interface Params extends NodeJS.Dict<string | string[]> {}

export interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> {}

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

export class State {
  private Request: Request;
  private Method: string;
  private Pathname: string;
  private Query: ParsedUrlQuery;
  private Params: Params;
  private Body: Body;
  constructor(req: Request, params: StateParams) {
    this.Method = params.method;
    this.Pathname = params.pathname;
    this.Params = params.params;
    this.Query = params.query;
  }

  public get method() {
    return this.Method;
  }
  public get pathname() {
    return this.Pathname;
  }
  public get params() {
    return this.Params;
  }
  public get query() {
    return this.Query;
  }
  async parseBody(): Promise<Body> {
    if (this.Body) return this.Body;
    const body: Body = await new Promise((resolve, reject) => {
      // @ts-ignore
      const form = new IncomingForm({ multiples: true });
      form.parse(<IncomingMessage>this.Request, (err, fields, files) => {
        if (err) return reject(err);
        return resolve({ fields, files });
      });
    });
    return (this.Body = body);
  }
}
