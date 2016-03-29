function Image (iname,path) {
    this.imageName = iname;
    this.path = path;
    this.nClicks = 0;
    this.nViews = 0;
    this.displayTag = function () {
        return '<img src="' + this.path + '" />';
    }
}

function populateImages() {
    var r = threeUniqueRandoms();
    imgLeft = r[0];
    imgCenter = r[1];
    imgRight = r[2];
    leftDiv.setAttribute('src',images[imgLeft].path);
    centerDiv.setAttribute('src',images[imgCenter].path);
    rightDiv.setAttribute('src',images[imgLeft].path);
    images[imgLeft].nViews++;
    images[imgCenter].nViews++;
    images[imgright].nViews++;
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
},false);



// global variables holding display element divs:
var leftDiv = document.getElementById('imgLeft')
var centertDiv = document.getElementById('imgCenter')
var rightDiv = document.getElementById('imgRight')
var imgLeft, imgCenter, imgRight = 0;



// Creating and populating array of image objects
images = [];
for (var i=0; imageData.length;i++) {
    images[i] = new Image(imageData[0],imageData[1]);
}
