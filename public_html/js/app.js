/**
 * Hier beginnt die Ausführung nach dem Laden des Dokuments.*/
$(document).on("pageinit", function() {

//    $.ajaxSetup({
//        xhrFields: {
//            mozSystem: true
//        }
//    });

    $.ajaxSetup({
        xhr: function() {
            return new window.XMLHttpRequest({
                mozSystem: true
            });
        }
    });

    var host = window.location.hostname;
    console.log("host:" + host);
//    useIndexDBPolyfill();

    //----------------------------------
    var indexedDBService = new IndexeddbService();
//    var applicationModel = new ApplicationModel(indexedDBService);
    var cloudService = cloudService();
    var feedsModel = new FeedsModel(indexedDBService, cloudService);
    var appView = new AppView(feedsModel);
    appView.registerModelChangeListeners();
    appView.registerGuiEventListeners();
    appView.showInitialPage(window.location.href);
//    appView.start();


    function cloudService() {
        var cloudServiceConf = localStorage.getItem("cloudService");
        if (cloudServiceConf === "feedly")
            return new Feedly(feedsModel);
        if (cloudServiceConf === "theoldreader")
            return new TheOldReader(feedsModel);
        if (cloudServiceConf === "local")
            return new GoogleFeedService(feedsModel);
        return null;
    }


//    function useIndexDBPolyfill() {
//        // Is there a current implementation of IndexedDB?
//        var requireShim = typeof IDBVersionChangeEvent === 'undefined';
//
//        // Is WebSQL available?
//        var supportsWebSql = typeof openDatabase !== 'undefined';
//
//        if (requireShim && supportsWebSql) {
//            shimIndexedDB.__useShim(); // Use the Polyfills
//        }
//    }
});