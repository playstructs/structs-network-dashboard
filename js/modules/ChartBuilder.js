import {DataAggregator} from "./DataAggregator.js";
import {DataSorter} from "./DataSorter.js";
import {GuildAttributesDTO} from "./DTO/GuildAttributesDTO.js";
import {ConfigDTO} from "../vendor/models/ConfigDTO.js";
import {RadarDatasetBuilder} from "./RadarDatasetBuilder.js";
import {ChartConfigsDTO} from "./DTO/ChartConfigsDTO.js";
import {BarDatasetDTO} from "../vendor/models/BarDatasetDTO.js";
import {GuildAppraiserFactory} from "./GuildAppraiserFactory.js";
import {ColorBuilder} from "./ColorBuilder.js";
import {DoughnutDatasetDTO} from "../vendor/models/DoughnutDatasetDTO.js";
import {CHART_MAX_GUILDS} from "../Constants.js";

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
        const topGuilds = sortedGuilds.slice(0, CHART_MAX_GUILDS.RADAR);
        const chartConfig = new ConfigDTO();
        chartConfig.type = 'radar';
        chartConfig.data.labels = [
            'Alpha Matter Infused',
            'Guild Members',
            'Load',
            'Energy Output',
        ];
        chartConfig.options = {
            responsive: true,
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    ticks: {
                        backdropColor: 'rgb(28, 52, 68)'
                    },
                    grid: {
                        color: () => 'rgb(42, 127, 79)'
                    }
                }
            },
            layout: {
                padding: 40
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
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: () => 'rgb(42, 127, 79)'
                    },
                    ticks: {
                        padding: 10
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: () => 'rgb(42, 127, 79)'
                    },
                    ticks: {
                        padding: 10
                    }
                }
            },
            layout: {
                padding: 40
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
     * @param {Guild[]} guilds
     * @param {string} attribute
     * @param {string }datasetLabel
     */
    buildGuildAttributeDoughnutChartConfig(guilds, attribute, datasetLabel = '') {
        let sortedGuilds = this.dataSorter.sortGuildsByNumericAttribute(guilds, attribute);
        sortedGuilds.length = Math.min(sortedGuilds.length, CHART_MAX_GUILDS.DOUGHNUT);
        const dataset = new DoughnutDatasetDTO();
        dataset.label = datasetLabel;
        const chartConfig = new ConfigDTO();
        chartConfig.type = 'doughnut';

        sortedGuilds.forEach(guild => {
            chartConfig.data.labels.push(guild.name);
            dataset.data.push(guild[attribute]);
            const guildFillColor = this.colorBuilder.createFillColorFromLineColor(guild.color);
            dataset.backgroundColor.push(guildFillColor.toCSS());
            dataset.borderColor.push(guild.color.toCSS());
        });

        chartConfig.data.datasets.push(dataset);
        chartConfig.options = {
            layout: {
                padding: 20
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }

        return chartConfig;
    }

    /**
     * @return {Promise<ChartConfigsDTO>}
     */
    async buildCharts() {
        const chartConfigs = new ChartConfigsDTO();

        await this.dataAggregator.fetchAggregateGuildData().then(guilds => {

            const maxGuildAttributes = this.findMaxAttributeValues(guilds);
            let guildsSortedForLeaderboard = this.dataSorter.sortGuildsForLeaderboard([...guilds], maxGuildAttributes);
            guildsSortedForLeaderboard.length = Math.min(guildsSortedForLeaderboard.length, CHART_MAX_GUILDS.BAR);

            chartConfigs.topGuildsChartConfig = this.buildTopGuildsChartConfig(
                guildsSortedForLeaderboard,
                maxGuildAttributes
            );

            chartConfigs.guildRatingsChartConfig = this.buildGuildRatingsChartConfig(
                guildsSortedForLeaderboard,
                maxGuildAttributes
            );

            chartConfigs.fuelChartConfig = this.buildGuildAttributeDoughnutChartConfig(
                guilds,
                'fuel',
                'Alpha Matter Infused'
            );

            chartConfigs.memberCountChartConfig = this.buildGuildAttributeDoughnutChartConfig(
                guilds,
                'membersCount',
                'Guild Members'
            );

            chartConfigs.loadChartConfig = this.buildGuildAttributeDoughnutChartConfig(
                guilds,
                'load',
                'Load'
            );

            chartConfigs.energyChartConfig = this.buildGuildAttributeDoughnutChartConfig(
                guilds,
                'energy',
                'Energy Output'
            );
        });

        return chartConfigs;
    }
}