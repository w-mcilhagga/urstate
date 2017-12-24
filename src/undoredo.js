// undo/redo implemented on an object
function undoredo(state) {
	var now = {}
	
	return {
		save: function(path) {
			now.path = parsepath(path)
			var frag = getfragment(state,now.path)
			now.fragment = deepcopy(frag)
			now.forward = {back: now}
			now = now.forward
			return frag
		},
		undo: () => moveto(now.back),
		redo: () => moveto(now.forward),
		can: {
			undo: function() {return !!now.back},
			redo: function() {return !!now.forward}
		}
	}
	
	function parsepath(path) {
		return typeof path === 'string' ? path.split(/\.|\[|\]/).filter(i=>i!=="") : path.slice()
	}
	
	function moveto(node) {
		if (node) {
			now.path = node.path
			now.fragment = getfragment(state,node.path)
			setfragment(state,node.path, node.fragment)
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
	
	function map(obj, f) {
		var m = {}
		Object.keys(obj).forEach(function(k) {m[k] = f(obj[k], k, obj)})
		return m
	}
	
	function deepcopy(obj) {
		switch (toType(obj)) {
		case 'array':
			return obj.map(v=>deepcopy(v))
		case 'object':
			return map(obj, deepcopy)
		default:
			return obj
		}
	}
	
	function toType(obj) {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
	}

}