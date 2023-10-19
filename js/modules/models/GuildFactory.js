import {Guild} from "./Guild.js";
import {GuildPaletteManager} from "../GuildPaletteManager.js";
import {MAX_GUILD_NAME_LENGTH} from "../../Constants.js";

export class GuildFactory {

    constructor() {
        this.guildPaletteManager = new GuildPaletteManager();
    }

    /**
     * @param {string} name
     * @return {string}
     */
    truncateName(name) {
        if (name.length > MAX_GUILD_NAME_LENGTH) {
            name = name.substring(0, MAX_GUILD_NAME_LENGTH - 3) + '...';
        }
        return name;
    }

    /**
     * @param obj {object}
     * @return {Guild}
     */
    makeFromObject(obj) {
        const guild = new Guild();
        Object.assign(guild, obj);
        guild.name = this.truncateName(guild['endpoint']); // Endpoint is being used as name for now
        guild.color = this.guildPaletteManager.getRandomColor();
        return guild;
    }
}
