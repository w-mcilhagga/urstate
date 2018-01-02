# urstate

The ```urstate``` library implements a persistent state manager with undo/redo operations in 2Kb. ```urstate``` stands for ```u```ndo ```r```edo ```state```.

## Usage:
```html
<script src="path/to/urstate.min.js"></script>
<script>
var $ = urstate(state_object, onset)
</script>
```
The first argument to ```urstate``` is a plain javascript object that contains the state to be managed. The second argument ```onset``` is an optional callback function that is called every time the state is changed.

The returned object ```$``` is a function which takes a path represented as a string or array.

```javascript
fragment = $('a.b[3].c')
// equivalently, an array can be used to give the path
fragment = $(['a', 'b', 3, 'c'])
```
The return value ```fragment``` is an object with the following methods:

* ```get()``` returns a copy of the fragment object.
* ```set(v)``` sets a new value ```v``` for the fragment, triggering the ```onset``` callback. Returns the fragment object.
* ```save()``` saves a snapshot of the fragment for (possible) undoing later. Returns the fragment object.
* ```undo()``` undoes all changes since the previous ```save```.
* ```redo()``` redoes those changes.
* ```can.undo()``` true if undo is possible.
* ```can.redo()``` true if redo is possible.

Note that ```undo```, ```redo```, ```can.undo```, and ```can.redo``` are also properties of the function returned by ```urstate```. Thus, if we have the following code

```javascript
var $ = urstate(state_object)
var frag = $('a.b')
frag.save()
```
then both ```frag.undo()``` and ```$.undo()``` will apply the undo operation to the ```state_object```.

The methods ```save``` and ```set``` are chainable, since they return the fragment object they are called on.

## Undo/redo:

Undo points are created by calls to ```save```, and this also deletes any future history from the undo/redo timeline. (That is, once you do a ```save```, ```can.redo()``` will return false; this is standard behaviour). Each call to ```urstate``` sets up a separate undo/redo timeline. For that reason, it is probably a good idea ***not*** to call ```urstate``` more than once with the same state object.

The problem with any undo/redo system is to choose when to make an undo point by calling ```save()```. Sometimes, this is easy, as when you save some state and then alter it. For example, the following use of undo is fairly straightforward:

```javascript
var $ = urstate({
    a: 'property a',
    b: [1, 2, {c: {x: 1}}]
})
var frag = $('a.b[2].c')
var foo = frag.save().get()
foo.x = 10 
frag.set(foo) // this changes a.b[2].c.x in the state object
```

Here, a call to ```$.undo()``` will revert ```a.b[2].c.x``` to its original value of 1. (However, because ```foo``` is a *copy* of ```a.b[2].c```, it is not synchronized with these changes, 
and ```foo.x``` will still be 10.) Following the undo, a call to ```$.redo()``` will change ```a.b[2].c.x``` back to 10. 

Sometimes, however, the decision about when to mark an undo point must occur *after* the state has been changed. For example, an app might open a dialog box allowing you to change state properties. The dialog box has two buttons **Save** and **Cancel**. We want to do the following:
* If **Save** is pressed, set an undo point which lets us revert to the previous values of the state.
* If **Cancel** is pressed, undo all changes made in the dialog box, but don't set an undo point.

Because of the requirement for **Cancel** we can't ```save``` state before opening the dialog, because that would create an undo point.

Instead, what we can do here is to get a copy of the state before opening the dialog box, and then save the copy into the undo/redo timeline later.

```javascript
var $ = urstate({...})

var frag = $('a.b')
var saved = frag.get()
// create click handlers for save & cancel
var on_save = function() {
    frag.save(saved) // save takes an optional parameter!
}
var on_cancel = function() {
    frag.set(saved) // revert to previous value
}
```

The ```on_save``` handler makes use of the fact that the ```save``` method accepts an optional parameter which is the value to be saved in the undo/redo timeline (the default is the current value of the fragment). Here we save the value of the fragment of state that existed *before* the dialog box was opened, but save it when the dialog box is closed.

When the dialog box is opened, the handlers are attached to the buttons. In the dialog, we use ```frag.get()``` & ```frag.set()``` to change the fragment values.

Note that a slight change to requirements allows for simpler code. If the **Close** button undoes all changes, but allows for a redo operation, then we *can* save state before opening the dialog box, as follows:

```javascript
var frag = $('a.b')
frag.save()
// create click handlers for save & cancel
var on_save = function() {
    // nothing to do here
}
var on_cancel = function() {
    frag.undo()
}
```

This will *only* work if the app allows for a single dialog box at a time. If more than one is allowed, or other state changes are possible while the dialog is open, then the save point must be when the dialog box is closed, as in the following:

```javascript
var frag = $('a.b')
var saved = frag.get()
// create click handlers for save & cancel
var on_save = function() {
    frag.save(saved)
}
var on_cancel = function() {
    frag.save(saved).save().undo()
}
```

Evn then, there are problems, because the ```saved``` variable needs to be updated every time there is a save from the rest of the app.

### Scenario 1 (Drawing app)
User grabs object with mouse & drags it. Clearly the save occurs on the first move, but not thereafter because the drag is a single act.

### Scenario 2 (Drawing app)
User opens dialog on an object and changes some things, then saves. The undo point is the object before the dialog opens, but needs to be put in place when the dialog closes.

### Scenario 3 (Drawing app)
User opens a dialog on an object. Changes a few things. Then grabs the object with mouse and drags it. Then changes more things in the dialog. Then saves. If savepoints are done as per above then the two savepoints are, in order:
* object partly changed by dialog but before dragging
* object unchanged by dialog
This will cause odd behaviour if an undo takes place. 

### Scenario 4 (Drawing app)
User opens a dialog on an object. Changes a few things. Then grabs a different object with mouse and drags it. Then changes more things in the dialog. Then saves. If savepoints are done as per above then the two savepoints are, in order:
* different object before dragging
* object unchanged by dialog
This ordering is fine, if perhaps a bit puzzling, because the save occurred after the drag so must be undone first. 
