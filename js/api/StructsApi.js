import {API_LOCAL_STORAGE_KEYS, STRUCTS_API} from "../Constants.js";
import {JsonAjaxer} from "../vendor/JsonAjaxer.js";
import {ReactorFactory} from "../modules/models/ReactorFactory.js";
import {GuildFactory} from "../modules/models/GuildFactory.js";
import {PlayerFactory} from "../modules/models/PlayerFactory.js";
import {LocalStorageItemDTO} from "../modules/DTO/LocalStorageItemDTO.js";

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
        this.guildFactory = new GuildFactory();
        this.playerFactory = new PlayerFactory();
        this.reactorFactory = new ReactorFactory();
    }

    /**
     * @param {string} key
     * @param {*} data
     */
    storeData(key, data) {
        localStorage.setItem(key, JSON.stringify(new LocalStorageItemDTO(data)));
    }

    /**
     * @param {string} key
     * @return {*}
     */
    getStorageData(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    /**
     * @param {*} data
     * @return {Reactor[]}
     */
    reactorsResponseHandler(data) {
        /** @var {Array} rawReactors */
        const rawReactors = data['Reactor'];
        let reactors = [];

        for (let i = 0; i < rawReactors.length; i++) {
            reactors[i] = this.reactorFactory.makeFromObject(rawReactors[i]);
        }

        return reactors;
    }

    /**
     * @returns {Promise<Reactor[]>}
     */
    getReactors() {
        const stored = this.getStorageData(API_LOCAL_STORAGE_KEYS.REACTOR);
        if (stored && (Date.now() - stored.timestamp) / 1000 < 900) {
            return new Promise((resolve) => resolve(stored.data))
                .then(this.reactorsResponseHandler.bind(this));
        }

        return this.ajax.get(`${this.scheme}${this.domain}/structs/reactor`)
            .then(data => {
                this.storeData(API_LOCAL_STORAGE_KEYS.REACTOR, data);
                return this.reactorsResponseHandler(data);
            });
    }

    /**
     * @param {*} data
     * @return {Map<string, Guild>}
     */
    guildsMapResponseHandler(data) {
        /** @var {Array} rawGuilds */
        const rawGuilds = data['Guild'];
        let guilds = new Map();

        for (let i = 0; i < rawGuilds.length; i++) {
            const guild = this.guildFactory.makeFromObject(rawGuilds[i]);
            guilds.set(guild.id, guild);
        }

        return guilds;
    }

    /**
     * @return {Promise<Map<string, Guild>>}
     */
    getGuildsMap() {
        const stored = this.getStorageData(API_LOCAL_STORAGE_KEYS.GUILD);
        if (stored && (Date.now() - stored.timestamp) / 1000 < 900) {
            return new Promise((resolve) => resolve(stored.data))
                .then(this.guildsMapResponseHandler.bind(this));
        }

        return this.ajax.get(`${this.scheme}${this.domain}/structs/guild`)
            .then(data => {
                this.storeData(API_LOCAL_STORAGE_KEYS.GUILD, data);
                return this.guildsMapResponseHandler(data);
            });
    }

    /**
     * @param {*} data
     * @return {Map<string, number>}
     */
    guildMembersCountsMapResponseHandler(data) {
        /** @var {Array} rawGuilds */
        const rawPlayers = data['Player'];
        let guildMemberCounts = new Map();

        for (let i = 0; i < rawPlayers.length; i++) {
            const player = this.playerFactory.makeFromObject(rawPlayers[i]);

            // Skip if the player has no guild
            if (player.guildId === '0') {
                continue;
            }

            let count = guildMemberCounts.has(player.guildId)
                ? guildMemberCounts.get(player.guildId) : 0;
            guildMemberCounts.set(player.guildId, count + 1);
        }

        /**
         * Until guildId is fixed in the /structs/reactor endpoint
         */
        console.log('guildMemberCounts', guildMemberCounts);

        return guildMemberCounts;
    }

    /**
     * @return {Promise<Map<string, number>>}
     */
    getGuildMemberCountsMap() {
        const stored = this.getStorageData(API_LOCAL_STORAGE_KEYS.PLAYER);
        if (stored && (Date.now() - stored.timestamp) / 1000 < 900) {
            return new Promise((resolve) => resolve(stored.data))
                .then(this.guildMembersCountsMapResponseHandler.bind(this));
        }

        return this.ajax.get(`${this.scheme}${this.domain}/structs/player`)
            .then(data => {
                this.storeData(API_LOCAL_STORAGE_KEYS.PLAYER, data);
                return this.guildMembersCountsMapResponseHandler(data);
            });
    }
}
