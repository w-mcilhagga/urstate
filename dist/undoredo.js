(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// undo/redo implemented on an object
var _require = require("./utils.js"),
    deepcopy = _require.deepcopy,
    getfragment = _require.getfragment,
    setfragment = _require.setfragment,
    parsepath = _require.parsepath;

module.exports = function urmaker(state) {
	var now = {};

	return {
		save: function save(path) {
			now.path = parsepath(path);
			now.fragment = deepcopy(getfragment(state, now.path));
			now.forward = { back: now };
			now = now.forward;
			return this;
		},
		undo: function undo() {
			return moveto(now.back);
		},
		redo: function redo() {
			return moveto(now.forward);
		},
		can: {
			undo: function undo() {
				return !!now.back;
			},
			redo: function redo() {
				return !!now.forward;
			}
		}
	};

	function moveto(node) {
		if (node) {
			now.path = node.path;
			now.fragment = getfragment(state, node.path);
			setfragment(state, node.path, node.fragment);
			delete node.path;
			delete node.fragment;
			now = node;
		}
	}
};

},{"./utils.js":2}],2:[function(require,module,exports){
'use strict';

// may be used elsewhere

function parsepath(path) {
    path = path || [];
    return typeof path === 'string' ? path.split(/\.|\[|\]/).filter(function (i) {
        return i !== "";
    }) : path.slice();
}

function getfragment(state, path) {
    return path.reduce(function (s, step) {
        return s[step];
    }, state);
}

function setfragment(state, path, value) {
    if (path.length == 0) {
        Object.assign(clear(state), value);
    } else {
        var s = getfragment(state, path.slice(0, -1));
        s[path.slice(-1)[0]] = value;
    }
}

function clear(obj) {
    Object.keys(obj).forEach(function (k) {
        return delete obj[k];
    });
    return obj;
}

function deepcopy(obj) {
    switch (toType(obj)) {
        case 'array':
            return obj.map(function (v) {
                return deepcopy(v);
            });
        case 'object':
            return Object.keys(obj).reduce(function (d, k) {
                d[k] = deepcopy(obj[k]);
                return d;
            }, {});
        default:
            return obj;
    }
}

function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

module.exports = { deepcopy: deepcopy, setfragment: setfragment, getfragment: getfragment, parsepath: parsepath };

},{}]},{},[1]);
