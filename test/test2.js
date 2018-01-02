const assert = require('assert');
var UR = require('../src/undoredo.js')
var {deepEQ, makestate} = require('./common.js')

var state = makestate()

exports.test2 = function() {
    var $ = UR(state)
    assert($.can.undo()==false)
    assert($.can.redo()==false)
    $.save('c')
    assert($.can.undo()==true)
    assert($.can.redo()==false)
    state.c = 300
    $.undo()
    assert($.can.undo()==false)
    assert($.can.redo()==true)
    assert(deepEQ(state.c, makestate().c)) 
     $.redo()
    assert($.can.undo()==true)
    assert($.can.redo()==false)
    assert(state.c==300) 
}