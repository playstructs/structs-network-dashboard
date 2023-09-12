import {StructsApi} from "../api/StructsApi.js";
import {Guild} from "./models/Guild.js";

export class DataAggregator {

    constructor() {
        this.structsApi = new StructsApi();
    }

    /**
     * @param {Reactor[]} reactors
     * @param {string} attribute
     * @return {Map<string, number>}
     */
    sumReactorAttributeByGuild(reactors, attribute) {
        let sums = new Map();
        reactors.forEach(reactor => {
            const previousSum = sums.has(reactor.guildId) ? sums.get(reactor.guildId) : 0;
            sums.set(reactor.guildId, previousSum + reactor[attribute]);
        });
        return sums;
    }

    /**
     * @param {Reactor[]} reactors
     * @return {Map<string, number>}
     */
    getEnergyPerGuild(reactors) {
        return this.sumReactorAttributeByGuild(reactors, 'energy');
    }

    /**
     * @param reactors {Reactor[]}
     */
    getFuelPerGuild(reactors) {
        return this.sumReactorAttributeByGuild(reactors, 'fuel');
    }

    /**
     * @param reactors {Reactor[]}
     */
    getLoadPerGuild(reactors) {
        return this.sumReactorAttributeByGuild(reactors, 'load');
    }

    /**
     * Return all guilds with aggregated energy, fuel and load data.
     *
     * @return {Promise<Guild[]>}
     */
     async fetchAggregateGuildData() {
        const guilds = [];
        await this.structsApi.getReactors().then(async reactors => {

            const energyPerGuild = this.getEnergyPerGuild(reactors);
            const fuelPerGuild = this.getFuelPerGuild(reactors);
            const loadPerGuild = this.getLoadPerGuild(reactors);

            await this.structsApi.getGuildsMap().then(guildsMap => {

                // Each unaffiliated reactor is treated as its own guild
                const guildIdsFromReactors = fuelPerGuild.keys();

                guildIdsFromReactors.forEach(guildId => {
                    let guild = new Guild();
                    guild.id = guildId;
                    guild.name = guildId;

                    if (guildsMap.has(guild.id)) {
                        guild = guildsMap.get(guild.id);
                    }

                    guild.energy = energyPerGuild.get(guild.id);
                    guild.fuel = fuelPerGuild.get(guild.id);
                    guild.load = loadPerGuild.get(guild.id);

                    guilds.push(guild)
                });
            });
        });

        return guilds;
    }
}
