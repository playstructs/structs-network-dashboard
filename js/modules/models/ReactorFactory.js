import {Reactor} from "./Reactor.js";

export class ReactorFactory {

    /**
     * @param {Reactor} reactor
     * @return {string}
     */
    determineGuildId(reactor) {
        return reactor.guildId !== "0" ? reactor.guildId : `Reactor ${reactor.id}`;
    }

    /**
     * @param obj {object}
     * @return {Reactor}
     */
    makeFromObject(obj) {
        const reactor = new Reactor();
        Object.assign(reactor, obj);
        reactor.guildId = this.determineGuildId(reactor);
        reactor.energy = parseInt(reactor.energy);
        reactor.fuel = parseInt(reactor.fuel);
        reactor.load = parseInt(reactor.load);
        return reactor;
    }
}
