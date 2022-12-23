import {Provider} from "./providers";

export class GitlabProvider extends Provider {

    public constructor (name: string, data: Partial<Provider>) {
        super(name, data);
    }

}
