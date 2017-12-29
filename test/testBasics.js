const assert = require('assert');
var UR = require('../src/undoredo.js')

function deepEQ(a,b) {
    return EQ(a,b)&&EQ(b,a)

    function EQ(a,b) {
        if (typeof a !== 'object') return a===b
        return Object.keys(a).reduce( (accum, v, k)=>(accum && deepEQ(a[k],b[k])), 
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
    var s = $().get()
    assert(s!==state && deepEQ(s,state))
}

exports.testSet = function() {
    $('a').set(5)
    assert(state.a===5)
    state.a = 3 // undo 

    var b = $('b').get() // save b
    $('b[0]').set(1000)
    assert(state.b[0]===1000)
    $('b').set({x:10,y:'y'})
    assert(deepEQ(state.b, {x:10,y:'y'}))
    $('b').set(b)
    assert(deepEQ(state.b, b)) // undo 

    b = $('c.e') // save c.e
    $('c.e').set([1,2,3])
    assert(deepEQ(state.c.e, [1,2,3]))
    state.c.e = b // undo
}

exports.testSaveUndo = function() {
    assert($.can.undo()==false)
    $('b[0]').save()
    assert($.can.undo()==true)
    $('b[0]').set(300)
    assert($('b[0]').get()==300)
    $.undo()
    assert($.can.undo()==false)
    assert($.can.redo()==true)
    assert($('b[0]').get()==1) 
    assert(deepEQ($().get(),state))
    $.redo()
    assert($.can.undo()==true)
    assert($.can.redo()==false)
    assert($('b[0]').get()==300) 
}