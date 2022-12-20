import * as pulumi from "@pulumi/pulumi";
import * as util from "../utils";

export interface IProvider {
    name: string;
    type: string;
    token: string;
    baseUrl: string;
}

export interface IProviders {
    [key: string]: IProvider;
}

export class Provider implements IProvider {

    public name: string;

    public type: string;

    public token: string;

    public baseUrl: string;

    public constructor (name: string, data: Partial<IProvider>) {

        const config = new pulumi.Config();
        this.name = name;
        this.type = "";
        this.token = "";
        this.baseUrl = "";
        Object.assign(this, data);

        if (this.token === "") {

            this.token = util.getValue(
                this.name,
                config.requireObject<{[key: string]: string}>(this.name)
            );

        }

    }

}
