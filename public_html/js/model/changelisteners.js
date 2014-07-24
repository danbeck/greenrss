function ChangeListeners() {
    this.changeListeners = [];
}

ChangeListeners.prototype.add = function(changeListener) {
    this.changeListeners.push(changeListener);
};


ChangeListeners.prototype.notify = function() {
    this.changeListeners.forEach(function(listener) {
        listener.apply(null);
    });
};