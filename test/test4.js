const assert = require('assert');
var UR = require('../src/undoredo.js')
var {deepEQ, makestate} = require('./common.js')

var state = makestate()

exports.test4 = function() {
    var s = state
    var $ = UR(state)
    assert($.can.undo()==false)
    assert($.can.redo()==false)
    $.save()
    assert($.can.undo()==true)
    assert($.can.redo()==false)
    delete state.c
    state.k = [1,2,3]
    $.undo()
    assert($.can.undo()==false)
    assert($.can.redo()==true)
    assert(s===state)
    assert(deepEQ(state, makestate()))
     $.redo()
    assert($.can.undo()==true)
    assert($.can.redo()==false)
    assert(s===state)
    assert(state.c==undefined) 
    assert(deepEQ(state.k,[1,2,3]))
}