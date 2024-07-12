import Base from "./base.js"
import {Config} from "./config.js";

export class Client extends Base {
    public constructor(config: Config = {}) {
        super();
        const domain = config.domain || 'api.wizzl.co';
        const protocol = config.protocol || 'https';
        (global as any).server = `${protocol}://${domain}`
    }
}