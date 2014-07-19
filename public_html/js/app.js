/**
 * Hier beginnt die Ausführung nach dem Laden des Dokuments.*/
$(document).ready(function () {


    useIndexDBPolyfill();

    //----------------------------------
    var indexedDBService = new IndexeddbService();
    var applicationModel = new ApplicationModel(indexedDBService);
    
    var appView = new AppView(applicationModel, window.location.href);
    appView.registerModelChangeListeners();
    appView.registerGuiEventListeners();
    appView.showInitialPage();
    appView.start();

//    presentationModel.loadFromStorage();

    $("#testDatabase").click(function () {
        console.log("here we go!");
        indexedDBService.saveSSOAuthorizationCode("mycode", function () {
                console.log("saved it");
            },
            function () {
                console.log("could not save it");
            }
        );
    });
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