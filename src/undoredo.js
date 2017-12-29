// undo/redo implemented on an object
module.exports = function(state, onSet) {
	var now = {}
	onSet = onSet || function(){}
	state = {root: state}

	function $(path) {
		path = ['root'].concat(parsepath(path))
		
		var $$ = {
			save: function() {
				now.path = path.slice()
				now.fragment = $$.get()
				now.forward = {back: now}
				now = now.forward
				return $$
			},
			get: () => deepcopy(getfragment(state, path)),
			set: function(v) {
				setfragment(state, path, v)
				onSet(path)
				return $$
			},
			merge: function(v) {
				Object.assign(getfragment(state, path), v)
				onSet(path)
				return $$
			}		
		}

		$.undo = () => moveto(now.back)
		$.redo = () => moveto(now.forward)
		$.can = {
			undo: () => !!now.back,
			redo: () => !!now.forward
		}

		$$.undo = $.undo
		$$.redo = $.redo
		$$.can = $.can

		return $$
	}

	return $

	
	function parsepath(path) {
		path = path || []
		return typeof path === 'string' ? path.split(/\.|\[|\]/).filter(i=>i!=="") : path.slice()
	}
	
	function moveto(node) {
		if (node) {
			now.path = node.path
			now.fragment = getfragment(state, node.path)
			setfragment(state, node.path, node.fragment)
			delete node.path
			delete node.fragment
			now = node
		}
	}

	function getfragment(state, path) {
		return path.reduce((s,step)=>s[step], state)
	}
	
	function setfragment(state, path, value) {
		var s = getfragment(state,path.slice(0,-1))			
		s[path.slice(-1)[0]] = value
	}
	
	function deepcopy(obj) {
		switch (toType(obj)) {
		case 'array':
			return obj.map(v=>deepcopy(v))
		case 'object':
			return Object.keys(obj).reduce(function(d,k) {
				d[k] = deepcopy(obj[k]); 
				return d
			},{})
		default:
			return obj
		}
	}
	
	function toType(obj) {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
	}

}