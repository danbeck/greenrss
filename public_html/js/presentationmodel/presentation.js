
function PresentationModel(feedsmodel) {
    this.feedsmodel = feedsmodel;

    this.loggedInListeners = new ChangeListeners();

    this.feedsmodel.registerLoggedInListener(function() {
        this.loggedInListeners.notifyChangeListeners();
    });
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

PresentationModel.prototype.firstStepsPageMustBeShown = function() {
    return !this.feedsmodel.syncServiceConfigured();
};


PresentationModel.prototype.extractSSOAuthorizationFromURL = function(url) {
    return this.feedsmodel.extractSSOAuthorizationFromURL(url);
};


PresentationModel.prototype.synchronizeFeeds= function() {
    return this.feedsmodel.synchronizeFeeds();
};


//PresentationModel.prototype.saveSSOAuthorizationCode= function() {
//    return this.feedsmodel.saveSSOAuthorizationCode();
//};
