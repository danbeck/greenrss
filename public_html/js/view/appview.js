function AppView(presentationModel) {

    var that = this;
    this.presentationModel = presentationModel;

    registerEventHandler();


    function registerEventHandler() {
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
}

AppView.prototype.showInitialPage = function() {
    console.log("show initial page");
};