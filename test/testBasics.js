const assert = require('assert');
var UR = require('../src/undoredo.js')

function deepEQ(a,b) {
    return EQ(a,b)&&EQ(b,a)

    function EQ(a,b) {
        if (typeof a !== 'object') return a===b
        return Object.keys(a).reduce( (accum, v, k)=>accum && deepEQ(a[k],b[k]), 
            Array.isArray(a)===Array.isArray(b))
    }
}


var state = {
    a: 3,
    b: [1,2,3,{x:100,y:1000}],
    c: {
        d: 10,
        e: []
    }
}
var $ = UR(state)

exports.testGet = function() {
    assert($('a').get()===3)
    assert($('b').get()!==state.b)
    assert(deepEQ($('b').get(),state.b))
    assert($('c').get()!==state.c)
    assert(deepEQ($('c').get(), state.c))
}

exports.testSet = function() {

}

exports.testUndo2 = function() {

}