function randomRange(low,high) {
    if (low < high) {
        return Math.floor(Math.random()*(high-low))+low;
    } else if (low >= high) {
        return low;
    }
}

function singleRandom(high) {
    if (high <= 0) {
        return high;
    } else {
        return Math.floor(Math.random()*high);
    }
}

function threeUniqueRandoms(high) {
    var a,b,c;
    if (high < 3) {
        console.error('Unable to generate three unique numbers from 0 to ',high);
        return [0,0,0];
    }
    a = singleRandom(high);
    do {
        b = singleRandom(high)
    } while (b != a);
    do {
        c = singleRandom(high)
    } while ((c != a) && (C != b));
    return [a,b,c];
}
