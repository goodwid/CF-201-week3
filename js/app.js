function Image (iname,path) {
    this.imageName = iname;
    this.path = path;
    this.nClicks = 0;
    this.nViews = 0;
    this.CVratio = function() {
        if (this.nViews === 0) {   // Make sure we never divide by zero!!
            return 0;
        } else {
            return Math.round((this.nClicks/this.nViews)*100);
        }
    };
}

function populateImages() {
    var r = threeUniqueRandoms(images.length);
    imgLeft = r[0];
    imgCenter = r[1];
    imgRight = r[2];
    leftImageEl.setAttribute('src',images[imgLeft].path);
    centertImageEl.setAttribute('src',images[imgCenter].path);
    rightImageEl.setAttribute('src',images[imgRight].path);
    images[imgLeft].nViews++;
    images[imgCenter].nViews++;
    images[imgRight].nViews++;
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
}

function unhideChart() {
    resultsEl.setAttribute('style','visibility:visible');
}

function hideChart() {
    resultsEl.setAttribute('style','visibility:hidden');
}

function unhideButtons() {
    buttonsEl.setAttribute('style','visibility:visible');
}

function hideButtons() {
    buttonsEl.setAttribute('style','visibility:hidden');
}

function unhideRestart() {
    restartEl.setAttribute('style','visibility:visible');
}

function hideRestart() {
    restartEl.setAttribute('style','visibility:hidden');
}

function eightMoreVotes() {
    // alert("Feature not implemented yet!");
    clickTrap.addEventListener ("click", trapListener, false);
    continueVoting = true;
    hideButtons();
    globalClickCounter = 0;
}

function trapListener (e) {
    if (e.target.childElementCount !== 0) {} else {
        globalClickCounter++;
        switch (e.target.id) {
            case "imgLeft": {
                images[imgLeft].nClicks++;
                break;
            }
            case "imgCenter": {
                images[imgCenter].nClicks++;
                break;
            }
            case 'imgRight': {
                images[imgRight].nClicks++;
                break;
            }
        }
        populateImages();
        if ((globalClickCounter >= 8) && (continueVoting)) {
            clickTrap.removeEventListener ("click", trapListener);
            unhideRestart();
            unhideChart();
            displayResults();
        } else if ((globalClickCounter >= 16) && (!continueVoting)) {
            clickTrap.removeEventListener ("click", trapListener);
            unhideButtons();
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
    globalClickCounter = 0;
    continueVoting = false;
    clickTrap.addEventListener ("click", trapListener, false);
    $('html, body').animate( {
        scrollTop: $('header').offset().top
    }, 'slow');
}



// global variables holding HTML element tags:
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
restartButton.addEventListener  ("click", restart, false);

// these three hold the current object being displayed in each div.
var imgLeft, imgCenter, imgRight = 0;
var globalClickCounter = 0;
var continueVoting = false;

// Creating and populating array of image objects
images = [];
for (var i=0; i<imageData.length;i++) {
    images[i] = new Image(imageData[i][0],imageData[i][1]);
}
// initially populating the images.
populateImages();
