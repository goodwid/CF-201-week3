function Image (iname,path) {
    this.imageName = iname;
    this.path = path;
    this.nClicks = 0;
    this.nViews = 0;
    this.displayTag = function () {
        return '<img src="' + this.path + '" />';
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
clickTrap.addEventListener ("click", function (e) {
    switch (e.target.id) {
        case "imgLeft": {
            images[imgLeft].nclicks++;
            console.log('left');
            break;
        }
        case "imgCenter": {
            images[imgCenter].nclicks++;
            console.log('center');
            break;
        }
        case 'imgRight': {
            images[imgRight].nclicks++;
            console.log('right');
            break;
        }

    }
    populateImages();
},false);



// global variables holding display element image tags:
var leftImageEl = document.getElementById('imgLeft');
var centertImageEl = document.getElementById('imgCenter');
var rightImageEl = document.getElementById('imgRight');
// these three hold the current object being displayed in each div.
var imgLeft, imgCenter, imgRight = 0;

console.log(leftImageEl, centertImageEl, rightImageEl);

// Creating and populating array of image objects
images = [];
for (var i=0; i<imageData.length;i++) {
    images[i] = new Image(imageData[i][0],imageData[i][1]);
}
populateImages();
