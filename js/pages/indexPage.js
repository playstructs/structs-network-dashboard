import {ChartBuilder} from "../modules/ChartBuilder.js";

const ctx = document.getElementById('leaderboard');
const chartBuilder = new ChartBuilder();
chartBuilder.buildCharts().then(chartConfigs => {
    new Chart(ctx, chartConfigs.topGuildsChartConfig);
});
