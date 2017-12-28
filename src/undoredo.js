// undo/redo implemented on an object
module.exports = function(state, onset) {
	var now = {}
	onset = onset || function(){}

	function $(path) {
		path = parsepath(path)
		var $$ = {
			save: function(path) {
				now.fragment = $$.get()
				now.forward = {back: now}
				now = now.forward
				return $$
			},
			get: function() {
				return deepcopy(getfragment(state, path))
			},
			set: function(v) {
				setfragment(state, path, v)
				onset(path)
				return $$
			},
			parent: function() {
				return $(path.slice(0,-1))
			}		
		}

		$.undo = () => moveto(now.back)
		$.redo = () => moveto(now.forward)
		$.can = {
			undo: function() {return !!now.back},
			redo: function() {return !!now.forward}
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
		if (path.length==0) {
			Object.assign(clear(state), value)
		} else {
			var s = getfragment(state,path.slice(0,-1))			
			s[path.slice(-1)[0]] = value
		}
	}
	
	function clear(obj) {
		Object.keys(obj).forEach(k=>(delete obj[k]))
		return obj
	}
	
	function deepcopy(obj) {
		switch (toType(obj)) {
		case 'array':
			return obj.map(v=>deepcopy(v))
		case 'object':
			//return map(obj, deepcopy)
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