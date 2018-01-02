// may be used elsewhere
	
function parsepath(path) {
    path = path || []
    return typeof path === 'string' ? path.split(/\.|\[|\]/).filter(i=>i!=="") : path.slice()
}

function getfragment(state, path) {
    return path.reduce((s,step)=>s[step], state)
}

function setfragment(state, path, value) {
    if (path.length==0) {
        Object.assign(clear(state), value)
    } else {
        var s = getfragment(state, path.slice(0,-1))			
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
        return Object.keys(obj).reduce(function(d,k) {
            d[k] = deepcopy(obj[k]); 
            return d
        },{})
    default:
        return obj
    }
}

function copy(obj) {
    switch (toType(obj)) {
    case 'array':
        return obj.slice()
    case 'object':
        return Object.assign({},obj)
    default:
        return obj
    }
}

function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

module.exports = {deepcopy, copy, setfragment, getfragment, parsepath}