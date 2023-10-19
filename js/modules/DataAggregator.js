import {StructsApi} from "../api/StructsApi.js";
import {Guild} from "./models/Guild.js";
import {GuildPaletteManager} from "./GuildPaletteManager.js";

export class DataAggregator {

    constructor() {
        this.structsApi = new StructsApi();
        this.guildPaletteManager = new GuildPaletteManager();
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
            await this.structsApi.getGuildMemberCountsMap().then(async guildMemberCounts => {
                await this.structsApi.getGuildsMap().then(guildsMap => {

                    const energyPerGuild = this.getEnergyPerGuild(reactors);
                    const fuelPerGuild = this.getFuelPerGuild(reactors);
                    const loadPerGuild = this.getLoadPerGuild(reactors);

                    // Each unaffiliated reactor is treated as its own guild
                    fuelPerGuild.forEach((value, guildId) => {
                        let guild = new Guild();

                        // Default id and name if guild is just a reactor
                        guild.id = guildId;
                        guild.name = guildId;
                        guild.color = this.guildPaletteManager.getRandomColor();

                        // If the guild is an actual guild, pull in the real data
                        if (guildsMap.has(guild.id)) {
                            guild = guildsMap.get(guild.id);
                        }

                        guild.energy = energyPerGuild.get(guild.id);
                        guild.fuel = fuelPerGuild.get(guild.id);
                        guild.load = loadPerGuild.get(guild.id);
                        guild.membersCount = guildMemberCounts.has(guild.id)
                            ? guildMemberCounts.get(guild.id)
                            : 0;

                        guilds.push(guild)
                    });
                });
            });
        });

        return guilds;
    }
}
