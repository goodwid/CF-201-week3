function Image (iname,path) {
    this.imageName = iname;
    if (localStorage.getItem(iname)) {
        this.nClicks = parseInt(localStorage.getItem(iname+'.nClicks'));
        this.nViews = parseInt(localStorage.getItem(iname+'.nViews'));
    } else {
        this.nClicks = 0;
        this.nViews = 0;
    }
    this.imageName = iname;
    this.path = path;
    this.CVratio = function() {
        if (this.nViews === 0) {   // Make sure we never divide by zero!!
            return 0;
        } else {
            return Math.round((this.nClicks/this.nViews)*100);
        }
    };
}

function populateImages() {

    leftImageEl.setAttribute('src',images[state.imgLeft].path);
    centertImageEl.setAttribute('src',images[state.imgCenter].path);
    rightImageEl.setAttribute('src',images[state.imgRight].path);
    images[state.imgLeft].nViews++;
    images[state.imgCenter].nViews++;
    images[state.imgRight].nViews++;
}

function generateChartData() {
    var results = {};
    results.clicks = [];
    results.CVratio = [];
    results.names = [];
    for (var i=0;i < images.length; i++) {
        results.clicks[i] = images[i].nClicks;
        results.CVratio[i] = images[i].CVratio();
        results.names[i] = images[i].imageName;
    }
    return results;
}

function displayResults() {
    hideButtons();
    unhideChart();
    unhideRestart();
    showChart(generateChartData());
    updateState();
}



function eightMoreVotes() {
    // alert("Feature not implemented yet!");
    clickTrap.addEventListener ("click", trapListener, false);
    state.cv = true;
    hideButtons();
    state.gcc = 0;
}

function trapListener(e) {
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
        storeToLocal();
        populateImages();

        if ((state.gcc >= 8) && (state.cv)) {
            clickTrap.removeEventListener ("click", trapListener);
            unhideRestart();
            unhideChart();
            displayResults();
            updateState();
        } else if ((state.gcc >= 16) && (!state.cv)) {
            clickTrap.removeEventListener ("click", trapListener);
            unhideButtons();
            updateState();
        } else {
            updateState();
        }

    }
}

function showChart(results) {
    $('#results').highcharts({
        chart: {
            zoomType: 'xy'
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
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
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
            y: 40,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: 'clicks',
            type: 'column',
            yAxis: 1,
            data: results.clicks,
            tooltip: {
                valueSuffix: ''
            }

        }, {
            name: 'Click/View ratio',
            type: 'spline',
            data: results.CVratio,
            tooltip: {
                valueSuffix: '%'
            }
        }]
    });
    $('html, body').animate( {
        scrollTop: $('#results').offset().top
    }, 'slow');

}

function restart() {
    hideRestart();
    hideChart();
    state.gcc = 0;
    state.cv = false;
    updateState();
    clickTrap.addEventListener ("click", trapListener, false);
    $('html, body').animate( {
        scrollTop: $('header').offset().top
    }, 'slow');
}


function storeToLocal() {
    for (var i=0;i < images.length;i++) {
        localStorage.setItem(images[i].imageName,true);
        localStorage.setItem(images[i].imageName + '.nClicks',images[i].nClicks);
        localStorage.setItem(images[i].imageName + '.nViews',images[i].nViews);
    }
}

function restoreState() {
    if (localStorage.state) {
        initImageArray();
        state = JSON.parse(localStorage.state);
        if (state.buttonsVis)  { unhideButtons();}
        if (state.chartVis)    { displayResults();}
        if (state.restartVis)  { unhideRestart();}
        if (!state.trapListener) { clickTrap.removeEventListener ("click", trapListener);}
    } else {
        initImageArray();
        r = threeUniqueRandoms(image.length);
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

function updateState() {
    localStorage.state = JSON.stringify(state);
}

function initImageArray() {
    for (var i=0; i<imageData.length;i++) {
        images[i] = new Image(imageData[i][0],imageData[i][1]);
    }
}


// global variables holding HTML DOM elements

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

// these three hold the current object being displayed in each div.

var state = {};
var images = [];
restoreState();
updateState();

// Creating and populating array of image objects

// initially populating the images.
