import {Player} from "./Player.js";

export class PlayerFactory {

    /**
     * @param obj {object}
     * @return {Player}
     */
    makeFromObject(obj) {
        const player = new Player();
        Object.assign(player, obj);
        return player;
    }
}
