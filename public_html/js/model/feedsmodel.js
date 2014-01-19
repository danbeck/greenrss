function FeedsModel() {
    console.log("creating feedsmodel obj");
    this.cloudService = new Feedly();
}

FeedsModel.prototype.authenticateWithCloud = function(success) {
    this.cloudService.loginUser(success);
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