import {Guild} from "./models/Guild.js";
import {GuildAppraiserFactory} from "./GuildAppraiserFactory.js";

export class DataSorter {

    constructor() {
        this.guildAppraiserFactory = new GuildAppraiserFactory();
    }

    /**
     * @param {Guild[]} guilds
     * @param {string} attribute
     * @return {Guild[]}
     */
    sortGuildsByNumericAttribute(guilds, attribute) {
        return guilds.sort((a, b) => b[attribute] - a[attribute]);
    }

    /**
     * @param {Guild[]} guilds
     * @param {GuildAttributesDTO} maxAttributes
     * @return {Guild[]}
     */
    sortGuildsForLeaderboard(guilds, maxAttributes) {
        return guilds.sort((a, b) => {
            let aRating = this.guildAppraiserFactory.make(a, maxAttributes);
            let bRating = this.guildAppraiserFactory.make(b, maxAttributes);

            return bRating.guildRating - aRating.guildRating;
        });
    }
}
