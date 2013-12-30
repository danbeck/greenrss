function ChangeListeners(that){
    this.changeListeners = [];
    this.that = that;
}

ChangeListeners.prototype.add = function(changeListener){
    this.changeListeners.push(changeListener);
};


ChangeListeners.prototype.notifyChangeListeners = function() {
    this.changeListeners.forEach(function(listener) {
        listener.apply(null);
    });
};