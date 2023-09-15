import {Guild} from "./models/Guild.js";
import {GuildAppraiserFactory} from "./GuildAppraiserFactory.js";

export class DataSorter {

    constructor() {
        this.guildAppraiserFactory = new GuildAppraiserFactory();
    }

    /**
     * @param {Guild[]} guilds
     * @return {Guild[]}
     */
    sortGuildsByEnergy(guilds) {
        return guilds.sort((a, b) => b.fuel - a.fuel);
    }

    /**
     * @param {Guild[]} guilds
     * @return {Guild[]}
     */
    sortGuildsByFuel(guilds) {
        return guilds.sort((a, b) => b.fuel - a.fuel);
    }

    /**
     * @param {Guild[]} guilds
     * @return {Guild[]}
     */
    sortGuildsByLoad(guilds) {
        return guilds.sort((a, b) => b.load - a.load);
    }

    /**
     * @param {Guild[]} guilds
     * @return {Guild[]}
     */
    sortGuildsByMemberCounts(guilds) {
        return guilds.sort((a, b) => b.membersCount - a.membersCount);
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
