var FeedsSearch = {
    searchSubscriptions: function(query, findDone) {
        if (!google)
            findDone();
        google.feeds.findFeeds(query, findDone);
    }
};