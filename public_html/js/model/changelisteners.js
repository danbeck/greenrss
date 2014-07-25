function ChangeListeners() {
    this.changeListeners = [];
}

ChangeListeners.prototype.add = function(changeListener) {
    this.changeListeners.push(changeListener);
};


ChangeListeners.prototype.notify = function(object) {
    this.changeListeners.forEach(function(listener) {
        listener(object);
    });
};