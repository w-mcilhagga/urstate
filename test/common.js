exports.deepEQ = function deepEQ(a,b) {
    return EQ(a,b) && EQ(b,a)

    function EQ(a,b) {
        if (typeof a !== 'object') return a===b
        return Object.keys(a).reduce( (accum, v, k)=>(accum && deepEQ(a[k],b[k])), 
            Array.isArray(a)===Array.isArray(b))
    }
}

exports.makestate = function() {
    return {
        a: 3,
        b: [1,2,3,{x:100,y:1000}],
        c: {
            d: 10,
            e: []
        }
    }
}
