import * as pulumi from "@pulumi/pulumi"
import * as util from '../utils'

export interface IProvider {
  name: string;
  type: string;
  token: string;
  base_url: string;
}

export interface IProviders {
  [key: string]: IProvider;
}

export class ProviderError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ProviderError.prototype);
  }
}

export class Provider implements IProvider {
  public name: string;
  public type: string;
  public token: string;
  public base_url: string;

  constructor(name: string, data: Partial<Provider>) {
    const config = new pulumi.Config();
    this.name = name
    this.type = ""
    this.token = ""
    this.base_url = ""
    Object.assign(this, data);
    if (!this.token) {
      this.token = util.getValue(this.name, config.requireObject<{[key: string]: string}>(this.name))
    }
  }
}
