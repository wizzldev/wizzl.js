import Base from "./base.js"
import {Config} from "./config.js";
import { global } from "globals";

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
        const domain = config.domain || 'api.wizzl.co';
        const protocol = config.secureProtocol || true;
        global.server = `${protocol ? 'https' : 'http'}://${domain}`
        global.ws_server = `${protocol ? 'wss' : 'ws'}://${domain}/ws`
    }
}