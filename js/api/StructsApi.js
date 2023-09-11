import {STRUCTS_API} from "../Constants.js";
import {JsonAjaxer} from "../vendor/JsonAjaxer.js";
import {ReactorFactory} from "../modules/models/ReactorFactory.js";

export class StructsApi {
    /**
     * @param {string} scheme example https://
     * @param {string} domain example structs.so
     * @param {Object} ajax AJAX handling class
     */
    constructor(ajax = null, scheme= STRUCTS_API.SCHEME, domain = STRUCTS_API.DOMAIN) {
        this.scheme = scheme;
        this.domain = domain;
        this.ajax = (ajax !== null) ? ajax: new JsonAjaxer();
    }

    /**
     * @returns {Promise<Reactor[]>}
     */
    getReactors() {
        return this.ajax.get(`${this.scheme}${this.domain}/structs/reactor`)
            .then(data => {
                const reactorFactory = new ReactorFactory();
                /** @var {Array} rawReactors */
                const rawReactors = data['Reactor'];
                let reactors = [];

                for (let i = 0; i < rawReactors.length; i++) {
                    reactors[i] = reactorFactory.makeFromObject(rawReactors[i]);
                }

                return reactors;
            });
    }
}
