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

var clickTrap = document.getElementById('clicktrap');
var leftImageEl = document.getElementById('imgLeft');
var centertImageEl = document.getElementById('imgCenter');
var rightImageEl = document.getElementById('imgRight');
var buttons = document.getElementById('buttonstorage');
var continueButton = document.getElementById('continue');
var resultsButton = document.getElementById('showresults');

clickTrap.addEventListener ("click", trapListener, false);
resultsButton.addEventListener ("click", displayResults, false);
continueButton.addEventListener ("click" ,eightMoreVotes, false);

function eightMoreVotes() {
    alert("Feature not implemented yet!");
}

function trapListener (e) {
    if (e.target.childElementCount !== 0) {} else {
        console.log ('clicked');
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
        if ((globalClickCounter >= 16) && (!continueVoting)) {
            clickTrap.removeEventListener ("click", trapListener);
            unhideButtons();
        }
    }
}



function generateTextTable() {
    out = '<pre>\n\n';
    out +='    Number of times each item was clicked when displayed.\n\n\n'
    for (var i=0;i<images.length;i++) {
        out += '  ' + images[i].imageName + ' |' + textHistogram(images[i].nClicks);
        out += '  (' + images[i].CVratio() + '%)\n'
        out += '           |\n';
    }
    out +=     '           \----------------------------------------------------- \n';
    out +=     '                1    2    3    4    5    6    7    8    9    10   \n\n';
    out +=     '          (numbers in parentheses are the click/View ratio)\n'
    out += '</pre>\n';
    return out;
}

function displayResults() {
    var resDiv = document.getElementById('results');
    resDiv.innerHTML = generateTextTable();
}

function unhideButtons() {
    buttons.setAttribute('style','visibility:visible');
}
function hideButtons() {
    buttons.setAttribute('style','visibility:hidden');

}

// global variables holding HTML element tags:


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
