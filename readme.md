# undoredo

The `undoredo` library implements a space-efficient undo/redo manager on an object in 2Kb. 

## Usage:
```html
<script src="path/to/undoredo.min.js"></script>
<script>
var $ = urmaker(state_object)
</script>
```
The argument to `urmaker` is a plain javascript object that contains the state to be managed. 

The returned object `$` has the following methods:

* `save(path)` saves a snapshot of the state for (possible) undoing later.
* `undo()` undoes all changes since the previous `save`, if any.
* `redo()` redoes those changes, if any.
* `can.undo()` true if undo is possible.
* `can.redo()` true if redo is possible.

## Using undo/redo:

Undo points are created by calls to `save`, and this also deletes any future history from the undo/redo timeline. (That is, once you do a `save(path)`, `can.redo()` will return false; this is standard behaviour). Each call to `urmaker` sets up a separate undo/redo timeline. For that reason, it is probably ***not*** a good idea to call `urmaker` more than once with the same state object.

For example, the following code sets up a state object and creqates an undo/redo timeline for it:
```javascript
var state = {
    a: 3,
    b: [1,2,3,{x:100,y:1000}],
    c: {
        d: 10,
        e: []
    }
}
var $ = urmaker(state)
```
If we want to change parts of state while allowing undo, we can do the following:
```javascript
$.save()
state.a=100
state.b[1] = state.b[0]+10
state.b.pop()
```
Then, to remove all changes subsequent to the `save`, we simply call `$.undo()`. The changes can be redone by calling `$.redo()`.

If we are sure that we're only going to change a part of the state, we can call `save` with a path to that part. For example, if we want to change the value of just `state.b[2]` with undo, we can do the following:
```javascript
$.save('b[2]')
state.b[2].x = 0
```
The call to `save` above used the path `'b[2]'`, to save only the value of `state.b[2]`. However, this means that only changes to `state.b[2]` after the `save` can be undone with a call to `$.undo()`. So, in the following code
```javascript
$.save('b[2]')
state.b[1] = 0
```
the change to `state.b[1]` is not recorded and so cannot be undone.

