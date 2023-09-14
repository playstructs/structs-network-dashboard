import {DataAggregator} from "./DataAggregator.js";
import {DataSorter} from "./DataSorter.js";
import {GuildAttributesDTO} from "./DTO/GuildAttributesDTO.js";
import {ConfigDTO} from "../vendor/models/ConfigDTO.js";
import {RadarDatasetBuilder} from "./RadarDatasetBuilder.js";
import {ChartConfigsDTO} from "./DTO/ChartConfigsDTO.js";

export class ChartBuilder {
    constructor() {
        this.dataAggregator = new DataAggregator();
        this.dataSorter = new DataSorter();
        this.radarDatasetBuilder = new RadarDatasetBuilder();
    }

    /**
     * @param {Guild[]} guilds
     * @return {GuildAttributesDTO}
     */
    findMaxAttributeValues(guilds) {
        const max = new GuildAttributesDTO();
        guilds.forEach(guild => {
            max.energy = Math.max(max.energy, guild.energy);
            max.fuel = Math.max(max.fuel, guild.fuel);
            max.load = Math.max(max.load, guild.load);
            max.membersCount = Math.max(max.membersCount, guild.membersCount);
        });
        return max;
    }

    /**
     * @param {Guild[]} sortedGuilds
     * @param {GuildAttributesDTO} maxAttributes
     * @return {ConfigDTO}
     */
    buildTopGuildsChartConfig(sortedGuilds, maxAttributes) {
        const topGuilds = sortedGuilds.slice(0, 3);
        const chartConfig = new ConfigDTO();
        chartConfig.type = 'radar';
        chartConfig.data.labels = [
            'Alpha Matter Infused',
            'Players',
            'Load',
            'Energy Output',
        ];
        chartConfig.options = {
            responsive: true,
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }

        topGuilds.forEach(guild => {
            chartConfig.data.datasets.push(
                this.radarDatasetBuilder.buildRadarDatasetFromGuild(guild, maxAttributes)
            );
        });

        return chartConfig;
    }

    /**
     * @return {Promise<ChartConfigsDTO>}
     */
    async buildCharts() {
        const chartConfigs = new ChartConfigsDTO();

        await this.dataAggregator.fetchAggregateGuildData().then(guilds => {

            console.log('fetchAggregateGuildData', guilds);

            const maxGuildAttributes = this.findMaxAttributeValues(guilds);
            const guildsSortedForLeaderboard = this.dataSorter.sortGuildsForLeaderboard([...guilds]);

            chartConfigs.topGuildsChartConfig = this.buildTopGuildsChartConfig(
                guildsSortedForLeaderboard,
                maxGuildAttributes
            );
        });

        return chartConfigs;
    }
}