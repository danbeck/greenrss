/**
 * ApplicationModel = {
 *   categories: [category_1, category_2, category3]
 *   cloudService: Feedly or theOldreader or ...
 * }
 *
 * Category: {
 *   name: "categoryname,
 *   Feed: [feed_1, feed2, feed3]
 * }
 * Feed = {
 *  category: category1,
 *     feedUrl: "www.kde.org",
 *  title: "KDE latest news",
 *  description: "some news and so",
 *  author: "Diego",
 *  entries: [entry_1, entry_2, entry_3]
 * }
 *
 * Entry = {
 *     Feed: feed,
 *  title: "This is the first KDE feed",
 *  link: "www.kde.org/myfeed/1.html",
 *  content: "body of the HTML. Since this value can contain tags, it should be displayed with element.innerHTML=content"
 *  contentSnippet: "A snippet < 120 chars. No HTML Tags contained"
 *  publishedDate: "13 Apr 2007 12:40:07 -0700". Can be parsed with new Date(entry.publishedDate).
 * }
 */


function FeedsModel(indexeddbService) {
    console.log("creating feedsmodel obj");
    this.loggedInListeners = new ChangeListeners();
    this.cloudService = new Feedly(this);
    this.feeds = [];
    this.indexeddbService = indexeddbService;
    ;
    this.loadFromDatabase();
}

FeedsModel.prototype.setAccessToken = function(accessToken) {
    this.accessToken = accessToken;
    this.saveSSOAuthorizationCode();
};

FeedsModel.prototype.saveSSOAuthorizationCode = function() {
    this.indexeddbService.saveSSOAuthorizationCode(this.accessToken);
};


FeedsModel.prototype.syncServiceConfigured = function() {
    return this.cloudService.syncServiceConfigured();
};

FeedsModel.prototype.loadFromDatabase = function() {
    console.log("load FeedModel from database");
    //  this.indexeddbService.loadFeed(this);
};

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


FeedsModel.prototype.extractSSOAuthorizationFromURL = function(url, success) {
    var regex = /http:\/\/.*?code=((\w|\-)*)/;
    if (regex.test(url)) {
        this.code = url.match(regex)[1];

        var indexOfNewParameter = this.code.indexOf("&");
        if (indexOfNewParameter !== -1) {
            this.code = this.code.substring(0, indexOfNewParameter);
        }

        return this.code;
//        this.cloudService.setSSOAuthorization(success);
//        return this.code;
    }
};

FeedsModel.prototype.retrieveAccessToken = function(code, success) {
    this.cloudService.retrieveAccessToken(code, success);
};


FeedsModel.prototype.retrieveFeeds = function(success, error) {
    this.cloudService.retrieveSubscriptions(saveFeeds, error);

    function saveFeeds() {
        console.log("save feeds in indexeddb");
        success();
    }
};


FeedsModel.prototype.subscribeFeed = function(url, success) {
    return this.cloudService.subscribeFeed(url, success);
};


FeedsModel.prototype.ssoLoginURL = function() {
    return this.cloudService.ssoLoginURL();
};

function User() {
}
User.prototype.login = function() {
};
function Feed(props) {
    this.id = props.id;
    this.category = props.category;
    this.feedUrl = props.feedUrl;
    this.htmlLink = props.htmlLink;
    this.title = props.title;
    this.description = props.description;
    this.author = props.author;
    this.entry = props.entries;
}

function FeedItem() {
}

function Tag() {
}
