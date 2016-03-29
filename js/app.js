function Image (iname,path) {
    this.imageName = iname;
    this.path = path;
    this.nClicks = 0;
    this.nViews = 0;
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
clickTrap.addEventListener ("click", function (e) {
    globalClickCounter++;
    switch (e.target.id) {
        case "imgLeft": {
            images[imgLeft].nClicks++;
            console.log('left');
            break;
        }
        case "imgCenter": {
            images[imgCenter].nClicks++;
            console.log('center');
            break;
        }
        case 'imgRight': {
            images[imgRight].nClicks++;
            console.log('right');
            break;
        }

    }
    populateImages();
    if (globalClickCounter > 16) {
        unhideButtons();
    }
},false);




function unhideButtons() {
    buttons.setAttribute('style','visibility:visible');
}
function hideButtons() {
    buttons.setAttribute('style','visibility:hidden');

}

// global variables holding display element image tags:
var leftImageEl = document.getElementById('imgLeft');
var centertImageEl = document.getElementById('imgCenter');
var rightImageEl = document.getElementById('imgRight');
var buttons = document.getElementById('buttonstorage');
// these three hold the current object being displayed in each div.
var imgLeft, imgCenter, imgRight = 0;
var globalClickCounter = 0;

// Creating and populating array of image objects
images = [];
for (var i=0; i<imageData.length;i++) {
    images[i] = new Image(imageData[i][0],imageData[i][1]);
}
// initially populating the images.
populateImages();
