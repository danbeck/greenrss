var APP_DATA = {
    feedsModel: null,
    presentationModel: null
//    appview: angezeigteListe: null
};

/**
 * Hier beginnt die Ausführung nach dem Laden des Dokuments.*/
$(document).ready(function() {

    var regex = /http:\/\/.*?code=((\w|\-)*)/;
    if (regex.test(window.location.href)) {
        var code = window.location.href.match(regex)[1];
        alert("got the code:\n" + code);
    }

    else {
//        authInFeedly();
    }


    //----------------------------------
    APP_DATA.feedsModel = new FeedsModel();
    APP_DATA.presentationModel = new PresentationModel(APP_DATA.feedsModel);

    var appView = new AppView(APP_DATA.presentationModel);
    appView.registerModelChangeListeners();
    appView.registerGuiEventListeners();
    appView.showInitialPage();

    APP_DATA.presentationModel.loadFromStorage();

    APP_DATA.feedsModel.retrieveAuthorizationCodeFromURL(window.location.href);

});

