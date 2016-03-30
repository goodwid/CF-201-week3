var assert = require('assert');
var compute = require('../js/compute.js');

function test_threeUniquerandoms_Range() {
    describe('Test to be sure that three random unique numbers are returned in the proper range.', function() {
        // it('should check first question', function() {     assert.deepEqual(compute.getQuestion(0), 'first');   });
        it ('Passing 10 to threeUniqueRandoms', function() {
            var n = compute.threeUniqueRandoms(10);
              assert((n[0] <= 10) && (n[1] <= 10) && (n[2] <= 10));
        });
    });   // describe 1
}

for (var i=0;i<100;i++) {
    test_threeUniquerandoms_Range();
}

function test_singleRandom_Range() {
    describe('Test to be sure that singlerandom returns a number between 0 and the parameter.', function() {
        it ('Passing 90 to singleRandoms', function() {
            var n = compute.singleRandom(90);
              assert((n <= 90) && (n >= 0));
        });
        it ('confirming that passing 35 to singleRandom does not return a number outside the range', function() {
            var n = compute.singleRandom(35);
              assert(((n > 35) || (n < 0)) === false);
        });
    });   // describe 1
}

for (var i=0;i<100;i++) {
    test_singleRandom_Range();
}
