const assert = require('assert');
var UR = require('../src/undoredo.js')
var {deepEQ, makestate} = require('./common.js')

var state = makestate()

exports.test1 = function() {
    var $ = UR(state)
    assert($.can.undo()==false)
    assert($.can.redo()==false)
    $.save('b[0]')
    assert($.can.undo()==true)
    assert($.can.redo()==false)
    state.b[0] = 300
    $.undo()
    assert($.can.undo()==false)
    assert($.can.redo()==true)
    assert(state.b[0]==1) 
     $.redo()
    assert($.can.undo()==true)
    assert($.can.redo()==false)
    assert(state.b[0]==300) 
}
