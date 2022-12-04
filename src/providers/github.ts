import {Provider} from "./providers"

export class GithubProvider extends Provider {
  constructor(name: string, data: Partial<Provider>) {
    super(name, data)
  }
}
