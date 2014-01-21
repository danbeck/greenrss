function FeedsModel() {
    console.log("creating feedsmodel obj");
    this.cloudService = new Feedly();
    this.loggedInListeners = new ChangeListeners();
}



FeedsModel.prototype.registerLoggedInListener = function(func) {
    this.loggedInListeners.add(func);
};

FeedsModel.prototype.useFeedlySynchronization = function() {
    this.cloudService = new Feedly();
};
FeedsModel.prototype.useTheOlderReaderSynchronization = function() {
    this.cloudService = new TheOldReader();
};
FeedsModel.prototype.useTinyTinySynchronization = function() {
    this.cloudService = new TinyTiny();
};
FeedsModel.prototype.useNoSynchronization = function() {
    this.cloudService = new GoogleFeedService();
};
FeedsModel.prototype.authenticateWithCloud = function(success) {
    this.cloudService.loginUser(success);
};

FeedsModel.prototype.retrieveAuthorizationCodeFromURL = function(url) {
    var that = this;
    var regex = /http:\/\/.*?code=((\w|\-)*)/;
    if (regex.test(url)) {
        var code = url.match(regex)[1];
        this.cloudService.retrieveAccessToken(code, function() {
            that.loggedInListeners.notifyChangeListeners();
        });
    }
};

FeedsModel.prototype.ssoLoginURL = function() {
    return this.cloudService.ssoLoginURL();
};

function User() {
}
User.prototype.login = function() {
};
function Feed() {
}

function FeedItem() {
}

function Tag() {
}