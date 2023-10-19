import {Guild} from "./Guild.js";
import {GuildPaletteManager} from "../GuildPaletteManager.js";

export class GuildFactory {

    constructor() {
        this.guildPaletteManager = new GuildPaletteManager();
    }

    /**
     * @param obj {object}
     * @return {Guild}
     */
    makeFromObject(obj) {
        const guild = new Guild();
        Object.assign(guild, obj);
        guild.name = guild['endpoint']; // Endpoint is being used as name for now
        guild.color = this.guildPaletteManager.getRandomColor();
        return guild;
    }
}
