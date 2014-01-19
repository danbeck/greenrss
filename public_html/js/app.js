var APP_DATA = {
    feedsModel: null,
    presentationModel: null,
//    appview: angezeigteListe: null
};

/** 
 * Hier beginnt die Ausführung nach dem Laden des Dokuments.*/
$(document).ready(function() {

//    (function() {
//        function authInFeedly() {
//            var url = "http://sandbox.feedly.com/v3/auth/auth";
//            var newData = {
//                response_type: "code",
//                client_id: "sandbox187",
//                redirect_uri: "http://localhost:8080",
//                scope: "https://cloud.feedly.com/subscriptions"
//            };
//
//            $.get(url, newData).success(function(returned) {
//                alert(returned);
//            });
//        }
//        jQuery(document).ready(function() {
//            if (/http:\/\/.*?code=.*/.test(window.location.href)) {
//                alert("got the code");
//            } else {
//                authInFeedly();
//            }
//        });
//    })();


    //----------------------------------
    APP_DATA.feedsModel = new FeedsModel();
    APP_DATA.presentationModel = new PresentationModel(APP_DATA.feedsModel);

    var appView = new AppView(APP_DATA.presentationModel);

//    appView.registerModelChangeListeners();
//    appView.registerGuiEventListeners();

    APP_DATA.presentationModel.loadFromStorage();

    appView.showInitialPage();

});
