
let dbg_viewerApp = null;

function setupViewer(divId, documentId, tokenFetchingUrl, exrtensionArray) {

    let viewerApp = new Autodesk.Viewing.ViewingApplication(divId);
    dbg_viewerApp = viewerApp;

    let options = {
        env: 'AutodeskProduction',
        getAccessToken: (onGetAccessToken) => {
            fetch(tokenFetchingUrl)
                .then(response => response.json())
                .then(data => {

                    let accessToken = data["access_token"];
                    let expireTimeSeconds = data["expires_in"];
                    onGetAccessToken(accessToken, expireTimeSeconds);
                })


        },
        useADP: false,
    };

    let config3d = {
        extensions: extensionArray
    };


    Autodesk.Viewing.Initializer(options, function onInitialized() {
        viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D, config3d);
        viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    });

    // Init after the viewer is ready
    function onDocumentLoadSuccess() {
        let viewables = viewerApp.bubble.search({
            'type': 'geometry'
        });
        if (viewables.length === 0) {
            console.error('Document contains no viewables.');
            return;
        }
        // Choose any of the available viewables
        viewerApp.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFail);

    }

    function onDocumentLoadFailure(viewerErrorCode) {
        console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
    }

    function onItemLoadSuccess(active_viewer, item) {
        console.log('Document loaded successfully');
    }
    function onItemLoadFail(errorCode) {
        console.error('onItemLoadFail() - errorCode:' + errorCode);
    }


    return viewerApp.getCurrentViewer();
}
