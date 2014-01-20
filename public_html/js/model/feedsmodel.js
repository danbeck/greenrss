function FeedsModel() {
    console.log("creating feedsmodel obj");
    this.cloudService = new Feedly();
}

FeedsModel.prototype.authenticateWithCloud = function(success) {
    this.cloudService.loginUser(success);
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