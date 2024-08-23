import Base from "./base.js"
import {Config} from "./config.js";

/* Class representing a Wizzl Bot API Client */
export class Client extends Base {

    /**
     * Create a Client
     * @param config Initial configuration
     * @param {string} config.domain The server's domain name
     * @param {boolean} config.secureProtocol The server is using SSL or not
     */
    public constructor(config: Config = {}) {
        super();
        const domain = config.domain || 'api.wizzl.app';
        const protocol = config.secureProtocol === undefined ? true : config.secureProtocol;
        (global as any).server = `${protocol ? 'https' : 'http'}://${domain}`;
        (global as any).ws_server = `${protocol ? 'wss' : 'ws'}://${domain}/ws`
    }
}