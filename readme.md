# State Management

This implements a persistent state.

## Usage
```javascript
var $ = state({...}, onset)
```
The argument ```{...}``` is the plain javascript object that is to be managed. ```onset``` is an optional callback function.

The returned object ```$``` is a function which takes a path string or array e.g.

```javascript
var fragment = $('a.b[3].c')
var fragment2 = $(['a', 'b', 3, 'c'])
```
and returns an object with the following methods:

* ```save()``` saves a snapshot of the fragment for undoing later
* ```get()``` gets a copy of the fragment
* ```set(v)``` sets a new value ```v``` for the fragment, triggering the ```onset``` callback
* ```merge(v)``` merges the properties of v with the fragment
* ```$(path)``` drills down into a subpart of the fragment, returning a new fragment
* ```parent()``` returns the fragment which is the parent of the current fragment
* ```undo()``` undoes all changes since the previous ```save```
* ```redo()``` redoes those changes
* ```can.undo()``` true if undo is possible
* ```can.redo()``` true if redo is possible.

Note that ```undo```, ```redo```, ```can.undo```, and ```can.redo``` are also properties of ```$```.

These methods are mostly chainable.