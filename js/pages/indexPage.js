import {ChartBuilder} from "../modules/ChartBuilder.js";

const chartBuilder = new ChartBuilder();

const topGuildsChartElm = document.getElementById('topGuildsChart');
const guildRatingsChartElm = document.getElementById('guildRatingsChart');

chartBuilder.buildCharts().then(chartConfigs => {
    new Chart(topGuildsChartElm, chartConfigs.topGuildsChartConfig);
    new Chart(guildRatingsChartElm, chartConfigs.guildRatingsChartConfig);
});
