import {Guild} from "./Guild.js";

export class GuildFactory {

    /**
     * @param obj {object}
     * @return {Guild}
     */
    makeFromObject(obj) {
        const guild = new Guild();
        Object.assign(guild, obj);
        guild.name = guild['endpoint']; // Endpoint is being used as name for now
        return guild;
    }
}
