import {Guild} from "./Guild.js";
import {ColorBuilder} from "../ColorBuilder.js";

export class GuildFactory {

    constructor() {
        this.colorBuilder = new ColorBuilder();
    }

    /**
     * @param obj {object}
     * @return {Guild}
     */
    makeFromObject(obj) {
        const guild = new Guild();
        Object.assign(guild, obj);
        guild.name = guild['endpoint']; // Endpoint is being used as name for now
        guild.color = this.colorBuilder.buildRandom();
        return guild;
    }
}
