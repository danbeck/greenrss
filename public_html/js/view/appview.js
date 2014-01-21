function AppView(presentationModel) {
    this.presentationModel = presentationModel;
}

AppView.prototype.registerModelChangeListeners = function() {
    console.log("show initial page");
};


AppView.prototype.registerGuiEventListeners = function() {

    var that = this;
    registerConnectToFeedlyEventHandler();


    function registerConnectToFeedlyEventHandler() {
        $("#connectToFeedly").click(function() {

            var url = that.presentationModel.ssoLoginURL();
            $.mobile.changePage(url, {showLoadMsg: true});

//            that.presentationModel.authenticateWithCloud(function(response) {
//
//                $.mobile.changePage('#showOAuthLogin', 'pop');
//
////                $.mobile.loadPage( response );
////                var html = $.parseHTML(response);
////                var responseDom$ = $('style', html).remove();
//
//                $("#showOAuthLogin div").html(response);

//            });
        });

    }
};


AppView.prototype.showInitialPage = function() {
    console.log("show initial page");
};
