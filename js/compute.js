function randomRange(low,high) {
    if (low < high) {
        return Math.floor(Math.random()*(high-low))+low;
    } else if (low >= high) {
        return low;
    }
}
exports.randomRange = randomRange;

function singleRandom(high) {
    if (high <= 0) {
        return high;
    } else {
        return Math.floor(Math.random()*high);
    }
}

exports.singleRandom = singleRandom;

function threeUniqueRandoms(high) {
    var a,b,c;
    if (high < 2) {
        console.error('Unable to generate three unique numbers from 0 to '+high+' as ',high, 'is too low');
        return [0,0,0];
    }
    a = singleRandom(high);
    // a=2;
    do {
        b = singleRandom(high);
    } while (b === a);

    do {
        c = singleRandom(high);
    } while ((c === a) || (c === b));
    return [a,b,c];
}
exports.threeUniqueRandoms = threeUniqueRandoms;


function textHistogram(num) {
    var out='';
    for (var i=0;i<num;i++) {
        out = out + '#####';
    }
    return out;
}
