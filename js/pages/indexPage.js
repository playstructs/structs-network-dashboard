import {ChartBuilder} from "../modules/ChartBuilder.js";

Chart.defaults.font.family = 'DirectiveZero';
Chart.defaults.color = 'rgb(194, 239, 221)';

const chartBuilder = new ChartBuilder();

const topGuildsChartElm = document.getElementById('topGuildsChart');
const guildRatingsChartElm = document.getElementById('guildRatingsChart');
const fuelChartElm = document.getElementById('fuelChart');
const guildMembersChartElm = document.getElementById('guildMembersCountChart');
const loadChartElm = document.getElementById('loadChart');
const energyChartElm = document.getElementById('energyChart');

chartBuilder.buildCharts().then(chartConfigs => {
    new Chart(topGuildsChartElm, chartConfigs.topGuildsChartConfig);
    new Chart(guildRatingsChartElm, chartConfigs.guildRatingsChartConfig);
    new Chart(fuelChartElm, chartConfigs.fuelChartConfig);
    new Chart(guildMembersChartElm, chartConfigs.memberCountChartConfig);
    new Chart(loadChartElm, chartConfigs.loadChartConfig);
    new Chart(energyChartElm, chartConfigs.energyChartConfig);
});
