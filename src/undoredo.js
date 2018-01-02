// undo/redo implemented on an object
var {deepcopy, copy, getfragment, setfragment, parsepath} = require("./utils.js")

module.exports = function urmaker(state) {
	var now = {}
		
	return {
		save: function(path) {
			now.path = parsepath(path)
			now.fragment = deepcopy(getfragment(state, now.path))
			now.forward = {back: now}
			now = now.forward
			return this
		},
		undo: () => moveto(now.back),
		redo: () => moveto(now.forward),
		can: {
			undo: () => !!now.back,
			redo: () => !!now.forward
		}	
	}
	
	function moveto(node) {
		if (node) {
			now.path = node.path
			now.fragment = copy(getfragment(state, node.path))
			setfragment(state, node.path, node.fragment)
			delete node.path
			delete node.fragment
			now = node
		}
	}
}