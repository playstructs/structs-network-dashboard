import {DataAggregator} from "../modules/DataAggregator.js";
import {DataSorter} from "../modules/DataSorter.js";

// API Test
const dataAggregator = new DataAggregator();
const dataSorter = new DataSorter();
dataAggregator.fetchAggregateGuildData().then(guilds => {
    console.log('fetchAggregateGuildData', guilds);
    console.log('sortByEnergy', dataSorter.sortGuildsByEnergy([...guilds]));
    console.log('sortByFuel', dataSorter.sortGuildsByFuel([...guilds]));
    console.log('sortByLoad', dataSorter.sortGuildsByLoad([...guilds]));
    console.log('sortByMemberCounts', dataSorter.sortGuildsByMemberCounts([...guilds]));
});

const ctx = document.getElementById('leaderboard');

new Chart(ctx, {
    type: 'radar',
    data: {
        labels: [
            'Alpha Matter Infused',
            'Players',
            'Energy Output',
            'Load',
        ],
        datasets: [{
            label: "Jerry's Lawncare",
            data: [65, 59, 90, 81],
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }, {
            label: 'Bit-Sifters',
            data: [28, 48, 40, 19],
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
    },
    options: {
        responsive: true,
        elements: {
            line: {
                borderWidth: 3
            }
        }
    }
});