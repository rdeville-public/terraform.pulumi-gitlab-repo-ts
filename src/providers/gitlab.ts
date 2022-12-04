import {Provider} from "./providers"

export class GitlabProvider extends Provider {
  constructor(name: string, data: Partial<Provider>) {
    super(name, data)
  }
}
