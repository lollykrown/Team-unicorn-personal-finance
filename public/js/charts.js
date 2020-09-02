    /*var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Colors',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });*/
    import { getDailyIncomeByRangeForCharts } from './../../src/controllers/budgetController.js';

    async function getData() {
    
      let result = await getDailyIncomeByRangeForCharts(); // wait until the promise resolves (*)
    
      return result; 
    }
    console.log(getData())
    google.charts.load('current', { 'packages': ['corechart'] });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);
    // google.charts.setOnLoadCallback(drawSecondChart);
    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
        // Create the data table.
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Expenses');
        data.addColumn('number', 'Amount');
        data.addRows([
            ['Electricity', 4000],
            ['Groceries', 11000],
            ['Internet', 9500],
            ['Transportation', 5000],
            ['Water', 2000],
            ['Netflix', 3500],
            ['Philanthropy', 20000]
        ]);

        // Set chart options
        const options = {
            'legend': 'left',
            'title': 'How Much Money i spend monthly',
            'curveType': 'function',
            'width': 400,
            'height': 300
        };

        // Instantiate and draw our chart, passing in some options.
        //const chart = new google.visualization.ColumnChart(document.getElementById('div1'));
        const chart = new google.visualization.LineChart(document.getElementById('myAreaChart'));
        chart.draw(data, options);
    }

    // function drawSecondChart() {
    //     // Create the data table.
    //     const data = new google.visualization.DataTable();
    //     data.addColumn('string', 'Expenses');
    //     data.addColumn('number', 'Amount');
    //     data.addRows([
    //         ['Electricity', 4000],
    //         ['Groceries', 11000],
    //         ['Internet', 9500],
    //         ['Transportation', 5000],
    //         ['Water', 2000],
    //         ['Netflix', 3500],
    //         ['Philantropy', 20000]
    //     ]);

    //     // Set chart options
    //     const options = {
    //         'legend': 'left',
    //         'title': 'How Much Money i spend monthly', 'pieHole': 0.4, 'is3D': true,
    //         'width': 400,
    //         'height': 300
    //     };

    //     // Instantiate and draw our chart, passing in some options.
    //     const chart = new google.visualization.PieChart(document.getElementById('div2'));
    //     chart.draw(data, options);
    // }

