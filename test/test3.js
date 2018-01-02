const assert = require('assert');
var UR = require('../src/undoredo.js')
var {deepEQ, makestate} = require('./common.js')

var state = makestate()

exports.test3 = function() {
    var $ = UR(state)
    assert($.can.undo()==false)
    assert($.can.redo()==false)
    $.save('b')
    assert($.can.undo()==true)
    assert($.can.redo()==false)
    state.b = {}
    $.undo()
    assert($.can.undo()==false)
    assert($.can.redo()==true)
    assert(deepEQ(state.b, makestate().b)) 
     $.redo()
    assert($.can.undo()==true)
    assert($.can.redo()==false)
    assert(deepEQ(state.b,{})) 
}