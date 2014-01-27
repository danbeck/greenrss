
function PresentationModel(feedsmodel) {
    this.feedsmodel = feedsmodel;

    this.loggedInListeners = new ChangeListeners();

    this.feedsmodel.registerLoggedInListener(loggedInHandler);

    function loggedInHandler() {
        this.loggedInListeners.notifyChangeListeners();
    }
}


PresentationModel.prototype.registerLoggedInListener = function(handler) {
    this.loggedInListeners.add(handler);
};

PresentationModel.prototype.loadFromStorage = function() {
};
PresentationModel.prototype.authenticateWithCloud = function(success) {
    this.feedsmodel.authenticateWithCloud(success);
};

PresentationModel.prototype.ssoLoginURL = function() {
    return this.feedsmodel.ssoLoginURL();
};

PresentationModel.prototype.saveTestFeed = function(callback) {
    return this.feedsmodel.saveTestFeed(callback);
};