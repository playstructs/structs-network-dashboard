import {Guild} from "./models/Guild.js";
import {GuildAppraiser} from "./GuildAppraiser.js";

export class GuildAppraiserFactory {

    /**
     * @param {Guild} guild
     * @param {GuildAttributesDTO} maxGuildAttributes
     */
    /**
     * @return {GuildAppraiser}
     */
    make(guild, maxGuildAttributes) {
        const appraiser = new GuildAppraiser();
        appraiser.guild = guild;
        appraiser.maxGuildAttributes = maxGuildAttributes;
        appraiser.appraise();
        return appraiser;
    }
}
