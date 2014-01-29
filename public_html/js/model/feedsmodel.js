
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


function FeedsModel() {
    console.log("creating feedsmodel obj");
    this.cloudService = new Feedly();
    this.loggedInListeners = new ChangeListeners();
    this.feeds = [];
    this.indexeddbService = new IndexeddbService();
    this.loadFromDatabase();
}


FeedsModel.prototype.syncServiceConfigured = function() {
    return false;
};

FeedsModel.prototype.loadFromDatabase = function() {
    console.log("load FeedModel from database");
    this.indexeddbService.loadFeed(this);
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

FeedsModel.prototype.saveTestFeed = function(callback) {
//    return this.cloudService.ssoLoginURL();

    var that = this;

    var request = indexedDB.open("Feed Database", 1);
    var feed1 = new Feed({
        title: "this is the first feed",
        feedUrl: "www.kde.org"});
    var feed2 = new Feed({
        title: "this is the second feed",
        feedUrl: "www.gnome.org"});
    this.feeds.push(feed1);
    this.feeds.push(feed2);

    request.onsuccess = function(event) {
        var objectStore = event.result.objectStore("feeds");
        for (var i = 0; i < that.feeds.length; i++) {
            var feed = feeds[i];
            objectStore.add(feed).onsuccess = function(event) {
//                document.getElementById("display").textContent += user.name + " with id " + event.result;
            };
        }
    };
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
    this.title = props.title;
    this.description = props.description;
    this.author = props.author;
    this.entry = props.entries;
}

function FeedItem() {
}

function Tag() {
}
