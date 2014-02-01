

/**
 * Hier beginnt die Ausführung nach dem Laden des Dokuments.*/
$(document).ready(function() {


    useIndexDBPolyfill();

    //----------------------------------
    var feedsModel = new FeedsModel();
    var presentationModel = new PresentationModel(feedsModel);

    var appView = new AppView(presentationModel, window.location.href);
    appView.registerModelChangeListeners();
    appView.registerGuiEventListeners();
    appView.showInitialPage();

    presentationModel.loadFromStorage();

    function useIndexDBPolyfill() {
        // Is there a current implementation of IndexedDB?
        var requireShim = typeof IDBVersionChangeEvent === 'undefined';

        // Is WebSQL available?
        var supportsWebSql = typeof openDatabase !== 'undefined';

        if (requireShim && supportsWebSql) {
            shimIndexedDB.__useShim(); // Use the Polyfills
        }
    }
});