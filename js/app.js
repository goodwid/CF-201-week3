function Image (iname,path) {  // image object constructor.
    this.imageName = iname;
    this.path = path;
    this.nClicks = 0;
    this.nViews = 0;
}

function CVratio(clicks, views) {  // calculate the click/view ratio.
    if (views === 0) {   // Make sure we never divide by zero!!
        return 0;
    } else {
        return Math.round((clicks/views)*100);
    }
}

function populateImages() {  // changes the images displayed.
    leftImageEl.setAttribute('src',images[state.imgLeft].path);
    centertImageEl.setAttribute('src',images[state.imgCenter].path);
    rightImageEl.setAttribute('src',images[state.imgRight].path);
    images[state.imgLeft].nViews++;
    images[state.imgCenter].nViews++;
    images[state.imgRight].nViews++;
}

function generateChartData() {  // creates arrays for the chart generation function.
    var results = {};
    results.clicks = [];
    results.CVratio = [];
    results.names = [];
    for (var i=0;i < images.length; i++) {
        results.clicks[i] = images[i].nClicks;
        results.CVratio[i] = CVratio(images[i].nClicks,images[i].nViews);
        results.names[i] = images[i].imageName;
    }
    return results;
}

function displayResults() {  // hides the appropriate elements and generates the chart.
    hideButtons();
    unhideChart();
    unhideRestart();
    showChart(generateChartData());
    updateState();
}

function eightMoreVotes() { // configures app for 8 more clicks prior to showing results.
    clickTrap.addEventListener ("click", trapListener, false);
    state.trapListener = true;
    state.cv = true;
    hideButtons();
    state.gcc = 0;
    updateState();
}

function trapListener(e) { // Main routine for monitoring clicks on images.
    if (e.target.childElementCount !== 0) {} else {
        state.gcc++;
        switch (e.target.id) {
            case "imgLeft": {
                images[state.imgLeft].nClicks++;
                break;
            }
            case "imgCenter": {
                images[state.imgCenter].nClicks++;
                break;
            }
            case 'imgRight': {
                images[state.imgRight].nClicks++;
                break;
            }
        }
        var r = threeUniqueRandoms(images.length);
        state.imgLeft = r[0];
        state.imgCenter = r[1];
        state.imgRight = r[2];
        updateState();
        updateImages();
        populateImages();

        if ((state.gcc >= 8) && (state.cv)) {
            clickTrap.removeEventListener ("click", trapListener);
            state.trapListener = false;
            unhideRestart();
            unhideChart();
            displayResults();
            updateState();
        } else if ((state.gcc >= 16) && (!state.cv)) {
            clickTrap.removeEventListener ("click", trapListener);
            state.trapListener = false;
            unhideButtons();
            updateState();
        } else {
            updateState();
        }

    }
}

function showChart(results) {   // uses highcharts to display data, function taken from snippet on highcharts' website and modded.
    $('#results').highcharts({
        chart: {
            zoomType: 'xy',
            backgroundColor: '#ffffff'
        },
        title: {
            text: 'Summary of clicks and clicks/views ratio'
        },
        // subtitle: {
        //     text: 'Source: WorldClimate.com'
        // },
        xAxis: [{
            categories: results.names,
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}%',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Click/View Ratio',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'clicks',
                style: {
                    color: '#EAAB16'
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: '#EAAB16'
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 45,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FAFAFA'
        },
        series: [{
            name: 'clicks',
            type: 'column',
            yAxis: 1,
            data: results.clicks,
            color: '#00041F',
            tooltip: {
                valueSuffix: ''
            }

        }, {
            name: 'Click/View ratio',
            type: 'spline',
            data: results.CVratio,
            color: '#EAAB16',
            tooltip: {
                valueSuffix: '%'
            }
        }]
    });
    $('html, body').animate( {
        scrollTop: $('#results').offset().top
    }, 'slow');

}

function restart() {  // restores the voting process to the initial 16 votes.
    hideRestart();
    hideChart();
    state.gcc = 0;
    state.cv = false;
    state.trapListener = true;
    updateState();
    clickTrap.addEventListener ("click", trapListener, false);
    $('html, body').animate( {
        scrollTop: $('header').offset().top
    }, 'slow');
}

function updateImages() {   // pushes current state of images to local storage
    localStorage.images = JSON.stringify(images);
}

function restoreState() {  // Main initialization routine, restores the state and images from local storage if available, or initializes new data if cached data is not present.

    if (localStorage.images) {
        images = JSON.parse(localStorage.images);
    } else {
        initImageArray();
    }
    if (localStorage.state) {
        state = JSON.parse(localStorage.state);
        if (state.buttonsVis)  { unhideButtons();}
        if (state.chartVis)    { displayResults();}
        if (state.restartVis)  { unhideRestart();}
        if (state.trapListener === false) { clickTrap.removeEventListener ("click", trapListener);}
    } else {
        var r = threeUniqueRandoms(imageData.length);
        state = {
            imgLeft: r[0],
            imgCenter: r[1],
            imgRight: r[2],
            chartVis: false,
            buttonsVis: false,
            restartVis: false,
            trapListener: true,
            displayedImages: [],
            gcc: 0,  // global click counter
            cv: false // continue voting
        };
    }
    populateImages();
}

function updateState() {   // pushes currnet state to local storage.
    localStorage.state = JSON.stringify(state);
}

function initImageArray() {  // uses the constructor to create image objects.
    for (var i=0; i<imageData.length;i++) {
        images[i] = new Image(imageData[i][0],imageData[i][1]);
    }
    updateImages();
}

/*************************************************\
|
|           global variables holding HTML DOM elements
|
\************************************************/

var clickTrap = document.getElementById('clicktrap');
var leftImageEl = document.getElementById('imgLeft');
var centertImageEl = document.getElementById('imgCenter');
var rightImageEl = document.getElementById('imgRight');
var buttonsEl = document.getElementById('buttonstorage');
var restartEl = document.getElementById('restartstorage');
var continueButton = document.getElementById('continue');
var resultsButton = document.getElementById('showresults');
var restartButton = document.getElementById('restart');
var resultsEl = document.getElementById('results');

clickTrap.addEventListener      ("click", trapListener,   false);
resultsButton.addEventListener  ("click", displayResults, false);
continueButton.addEventListener ("click", eightMoreVotes, false);
restartButton.addEventListener  ("click", restart,        false);

/****************************************\
|
|         BEGIN main app logic.
|
\***************************************/

var state = {};
var images = [];
restoreState();
updateState();
