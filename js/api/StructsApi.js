import {STRUCTS_API} from "../Constants.js";
import {JsonAjaxer} from "../vendor/JsonAjaxer.js";

export class StructsApi {
    /**
     * @param {string} scheme example https://
     * @param {string} domain example coindroids.com
     * @param {Object} ajax AJAX handling class
     */
    constructor(ajax = null, scheme= STRUCTS_API.SCHEME, domain = STRUCTS_API.DOMAIN) {
        this.scheme = scheme;
        this.domain = domain;
        this.ajax = (ajax !== null) ? ajax: new JsonAjaxer();
    }

    /**
     * @param {object} data
     * @return {object}
     */
    reactorsResponseHandler(data) {
        return data;
    }

    /**
     * @returns {Promise<object>}
     */
    getReactors() {
        return this.ajax.get(`${this.scheme}${this.domain}/structs/reactor`)
            .then(this.reactorsResponseHandler.bind(this));
    }
}