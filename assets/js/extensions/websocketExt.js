///////////////////////////////////////////////////////////////////////////////
// Websocket extension to illustrate how to control viewer through ws channel
// by Denis Grigor, November 2019
//
///////////////////////////////////////////////////////////////////////////////

import anime from "../anime.js";

class WebsocketExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.tree = null;
        this.default_state = null;

        this.ws_address = "ws://localhost:8080/ws";
        this.websocket = null;
        this.retry_connection_counter = 0;
        this.maximum_connection_attempts = 10;

        this.customize = this.customize.bind(this);
        this.setupConnection = this.setupConnection.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);
    }

    load() {
        console.log('WebsocketExtension is loaded!');
        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        return true;
    }

    unload() {
        console.log('WebsocketExtension is now unloaded!');

        return true;
    }

    customize() {
        this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        this.setupConnection(this.ws_address);
        this.default_state = this.viewer.getState();
    }

    setupConnection(url) {
        this.websocket = new WebSocket(url);
        this.websocket.onopen = this.onOpen;
        this.websocket.onclose = this.onClose;
        this.websocket.onmessage = this.onMessage;
        this.websocket.onerror = this.onError;
    }


    onOpen(evt) {
        console.info("Connection opened: ", evt);
        this.retry_connection_counter = 0;

    }

    onClose(evt) {
        console.log("Connection closed: ", evt);

        let reconnect = (timeout) => {
            console.log("TIMEOUT:", timeout);
            setTimeout(() => {
                if (
                    this.retry_connection_counter++ < this.maximum_connection_attempts
                    && this.websocket.type !== "open") {
                    console.log("Retrying connection ...", this.retry_connection_counter);
                    this.setupConnection(this.ws_address);
                } else {
                    console.log("Stopped connecting!");
                }
            },timeout)
        };

        reconnect(1000*this.retry_connection_counter);
    }

    onMessage(evt) {
        let data;
        try {
            data = JSON.parse(evt.data);
        } catch (err) {
            console.log("Received message is not a JSON: ", evt.data);
            return
        }
        console.log("RECEIVED:", data);
        if (data.explode) {

            let scale = {
                explode: this.viewer.getExplodeScale()
            };
            let target_explode_scale = data.explode * 0.01;
            let exploder = anime.timeline({});

            exploder.add({
                targets: scale,
                explode: target_explode_scale,
                duration: 1000,
                easing: 'steps(100)',
                update: () => {
                    this.viewer.explode(scale.explode);
                    console.log(scale);
                }
            })
        }

        if (data.fullscreen !== undefined) {
            this.viewer.setScreenMode(data.fullscreen === "true" ? 2 : 0);
        }

        if (data.focus !== undefined) {
            this.viewer.select(data.focus);
            this.viewer.isolate(data.focus);
            this.viewer.fitToView(data.focus);
        }

        if (data.reset_view !== undefined) {
            // this.viewer.applyCamera(this.viewer.model.getDefaultCamera());
            this.viewer.restoreState(this.default_state);
        }

        if (data.show_model_tree !== undefined) {
            this.viewer.showModelStructurePanel(data.show_model_tree === "true" ? true : false);
        } else {
            console.log(data.show_model_tree);
        }


    }

    onError(evt) {
        console.log("Error received: ", evt);
    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('WebsocketExtension',
    WebsocketExtension);
