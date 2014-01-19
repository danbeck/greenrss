function PresentationModel(feedsmodel) {
    this.feedsmodel = feedsmodel;
}

PresentationModel.prototype.loadFromStorage = function() {

};

PresentationModel.prototype.authenticateWithCloud = function(success) {
    this.feedsmodel.authenticateWithCloud(success);
};


