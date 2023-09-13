import {STRUCTS_API} from "../Constants.js";
import {JsonAjaxer} from "../vendor/JsonAjaxer.js";
import {ReactorFactory} from "../modules/models/ReactorFactory.js";
import {GuildFactory} from "../modules/models/GuildFactory.js";
import {PlayerFactory} from "../modules/models/PlayerFactory.js";

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

    /**
     * @return {Promise<Map<string, Guild>>}
     */
    getGuildsMap() {
        return this.ajax.get(`${this.scheme}${this.domain}/structs/guild`)
            .then(data => {
                const guildFactory = new GuildFactory();
                /** @var {Array} rawGuilds */
                const rawGuilds = data['Guild'];
                let guilds = new Map();

                for (let i = 0; i < rawGuilds.length; i++) {
                    const guild = guildFactory.makeFromObject(rawGuilds[i]);
                    guilds.set(guild.id, guild);
                }

                return guilds;
            });
    }

    /**
     * @return {Promise<Map<string, number>>}
     */
    getGuildMemberCountsMap() {
        return this.ajax.get(`${this.scheme}${this.domain}/structs/player`)
            .then(data => {
                const playerFactory = new PlayerFactory();
                /** @var {Array} rawGuilds */
                const rawPlayers = data['Player'];
                let guildMemberCounts = new Map();

                for (let i = 0; i < rawPlayers.length; i++) {
                    const player = playerFactory.makeFromObject(rawPlayers[i]);

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
            });
    }
}
