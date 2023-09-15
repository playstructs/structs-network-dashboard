import {DataAggregator} from "./DataAggregator.js";
import {DataSorter} from "./DataSorter.js";
import {GuildAttributesDTO} from "./DTO/GuildAttributesDTO.js";
import {ConfigDTO} from "../vendor/models/ConfigDTO.js";
import {RadarDatasetBuilder} from "./RadarDatasetBuilder.js";
import {ChartConfigsDTO} from "./DTO/ChartConfigsDTO.js";
import {BarDatasetDTO} from "../vendor/models/BarDatasetDTO.js";
import {GuildAppraiserFactory} from "./GuildAppraiserFactory.js";
import {ColorBuilder} from "./ColorBuilder.js";

export class ChartBuilder {
    constructor() {
        this.dataAggregator = new DataAggregator();
        this.dataSorter = new DataSorter();
        this.radarDatasetBuilder = new RadarDatasetBuilder();
        this.guildAppraiserFactory = new GuildAppraiserFactory();
        this.colorBuilder = new ColorBuilder();
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
     * @param {Guild[]} guilds
     * @return {GuildAttributesDTO}
     */
    findMinAttributeValues(guilds) {
        const min = new GuildAttributesDTO();
        guilds.forEach(guild => {
            min.energy = Math.min(min.energy, guild.energy);
            min.fuel = Math.min(min.fuel, guild.fuel);
            min.load = Math.min(min.load, guild.load);
            min.membersCount = Math.min(min.membersCount, guild.membersCount);
        });
        return min;
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
                this.radarDatasetBuilder.buildRadarDatasetFromGuild(
                    guild,
                    this.findMinAttributeValues(topGuilds),
                    maxAttributes
                )
            );
        });

        return chartConfig;
    }

    /**
     * @param {Guild[]} sortedGuilds
     * @param {GuildAttributesDTO} maxAttributes
     * @return {ConfigDTO}
     */
    buildGuildRatingsChartConfig(sortedGuilds, maxAttributes) {
        const dataset = new BarDatasetDTO();
        const chartConfig = new ConfigDTO();
        chartConfig.type = 'bar';
        chartConfig.options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        sortedGuilds.forEach(guild => {
            chartConfig.data.labels.push(guild.name);
            const appraiser = this.guildAppraiserFactory.make(guild, maxAttributes);
            dataset.data.push(appraiser.guildRating);
            const guildFillColor = this.colorBuilder.createFillColorFromLineColor(guild.color);
            dataset.backgroundColor.push(guildFillColor.toCSS());
            dataset.borderColor.push(guild.color.toCSS());
        });

        chartConfig.data.datasets.push(dataset);

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
            const guildsSortedForLeaderboard = this.dataSorter.sortGuildsForLeaderboard([...guilds], maxGuildAttributes);

            chartConfigs.topGuildsChartConfig = this.buildTopGuildsChartConfig(
                guildsSortedForLeaderboard,
                maxGuildAttributes
            );

            chartConfigs.guildRatingsChartConfig = this.buildGuildRatingsChartConfig(
                guildsSortedForLeaderboard,
                maxGuildAttributes
            )
        });

        return chartConfigs;
    }
}