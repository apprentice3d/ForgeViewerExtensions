///////////////////////////////////////////////////////////////////////////////
// Editor extension gives an editing area to experiment with extension development
// by Denis Grigor, October 2018
//
///////////////////////////////////////////////////////////////////////////////

class EditorExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.ui = null;
        this.panel = null;

        this.editor = null;

        this.createUI = this.createUI.bind(this);
        this.setExtensionParams = this.setExtensionParams.bind(this);

        this.waitForToolbarCreation = this.waitForToolbarCreation.bind(this);
    }

    load() {
        console.log('EditorExtension is loaded!');

        this.viewer.setTheme('light-theme');

        if (this.viewer.toolbar) {
            this.createUI();
        } else {
            this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
                this.waitForToolbarCreation);
        }

        return true;
    }
    unload() {
        console.log('EditorExtension is now unloaded!');
        return true;
    }

    waitForToolbarCreation() {
        this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
            this.waitForToolbarCreation);
        this.createUI();
    }

    createUI() {

        this.ui = document.createElement("div");
        this.ui.id = "editor_area";
        this.ui.classList.add("docking-panel-container-solid-color-a");
        this.ui.innerHTML = `
            <div id="editor">// code placeholder</div>
            <div id="buttonContainer">
                <button id="load" class="codeButton">Load</button>
                <button id="unload" style="color:gray;" class="codeButton">Unload</button>
            </div>
            
        `;

        // document.body.appendChild(this.ui);


        let panel = this.panel;
        let viewer = this.viewer;
        // check https://forge.autodesk.com/blog/extension-skeleton-toolbar-docking-panel
        let toolbarButtonEditor = new Autodesk.Viewing.UI.Button('extensionEditor');

        if (panel == null) {
            panel = new ExtensionEditorPanel(viewer, viewer.container,
                'editorPanel', 'Extension Editor Panel', {"innerDiv":this.ui});
        }

        toolbarButtonEditor.onClick = (e) => {

            panel.setVisible(!panel.isVisible());
        };

        toolbarButtonEditor.addClass('toolbarButtonEditor');
        toolbarButtonEditor.setToolTip('Show/Hide Extension editor');

        // SubToolbar
        this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('ExtensionEditorAppToolbar');
        this.subToolbar.addControl(toolbarButtonEditor);

        this.viewer.toolbar.addControl(this.subToolbar);


        this.editor = ace.edit("editor");
        this.editor.setTheme("ace/theme/xcode");
        this.editor.session.setMode("ace/mode/javascript");
        this.editor.setOptions({
            // fontFamily: "tahoma",
            fontSize: "12pt"
        });


    }

    setExtensionParams(extensionName, extensionLocation) {

        const editArea = document.getElementById("editor");
        let relativeLocation = document.location.origin;
        // if (document.location.hostname !== "localhost") {
            // designed for GitHub pages
            // relativeLocation += "/SD226781-Samples"
        // }
        relativeLocation += extensionLocation;

        console.log("loading " + extensionName + " extension from: ", relativeLocation);
        fetch(relativeLocation)
            .then(result => result.text())
            .then(content =>{
                this.editor.setValue(content, 1);
            })
            .catch(eroare => {console.log("Could not fetch the file:", eroare);});

        const loadButton = document.getElementById("load");
        const unloadButton = document.getElementById("unload");

        let viewer = this.viewer;

        let unloadExtension = (extensionName) => {
            viewer.unloadExtension(extensionName);
            Autodesk.Viewing.theExtensionManager.unregisterExtension(extensionName);
        };

        loadButton.onclick = () => {
            if(viewer.getExtension(extensionName)) {
                unloadExtension(extensionName)
            }
            eval(this.editor.getValue());
            viewer.loadExtension(extensionName);
            loadButton.style.color = "green";
            loadButton.innerText = "Extension active";
            unloadButton.style.color = "white";
        };

        unloadButton.onclick = () => {
            unloadExtension(extensionName);
            loadButton.style.color = "white";
            loadButton.innerText = "Load";
            unloadButton.style.color = "gray";
        };
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('EditorExtension',
    EditorExtension);




// check https://forge.autodesk.com/blog/extension-skeleton-toolbar-docking-panel

// *******************************************
// Extension Editor Panel
// *******************************************
function ExtensionEditorPanel(viewer, container, id, title, options) {
    this.viewer = viewer;

    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

    // the style of the docking panel
    // use this built-in style to support Themes on Viewer 4+
    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.id = "editorContainer";

    this.container.appendChild(options.innerDiv);

}
ExtensionEditorPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
ExtensionEditorPanel.prototype.constructor = ExtensionEditorPanel;










/* some configuration ideas */

//    let stage = [
//        {
//            "name": "simplest extension",
//            "extensions": ["TemplateExtension"],
//
//            "documentId": 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bmlhZ2FyYS1wb2MvQk9mZmljZV9uZXdfUm9vbXMubndk',
//            "tokenFetchingUrl": "https://9irt90dm6j.execute-api.us-east-1.amazonaws.com/prod"
//        }
//        ];