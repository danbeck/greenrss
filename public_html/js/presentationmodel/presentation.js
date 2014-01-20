function PresentationModel(feedsmodel) {
    this.feedsmodel = feedsmodel;
}

PresentationModel.prototype.loadFromStorage = function() {
}
PresentationModel.prototype.authenticateWithCloud = function(success) {
    this.feedsmodel.authenticateWithCloud(success);
};

PresentationModel.prototype.ssoLoginURL = function() {
    return this.feedsmodel.ssoLoginURL();
};