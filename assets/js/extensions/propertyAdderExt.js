///////////////////////////////////////////////////////////////////////////////
// Property Adder extension to be used to add properties to components
// by Denis Grigor, March 2019
//
///////////////////////////////////////////////////////////////////////////////

class PropertyAdderExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.tree = null;
        this.data = {"Columns":[]};

        this.customize = this.customize.bind(this);
        this.createUI = this.createUI.bind(this);
    }

    load() {
        console.log('PropertyAdderExtension is loaded!');
        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        return true;
    }
    unload() {
        console.log('PropertyAdderExtension is now unloaded!');

        return true;
    }

    createUI() {
        this.ui = document.createElement("div");
        this.ui.id = "control_area";
        this.ui.classList.add("docking-panel-container-solid-color-a");
        this.ui.innerHTML = `
            <div id="controlsArea">
                <div><span>BGEReinforcement: </span><input type="text" value=0 id="BGEReinforcement"></div>
                <div><span>BGELoadTensionMax: </span><input type="text" value=0 id="BGELoadTensionMax"></div>
                <div><span>BGELoadLiveMax: </span><input type="text" value=0 id="BGELoadLiveMax"></div>
                <div><span>BGELoadDeadMax: </span><input type="text" value=0 id="BGELoadDeadMax"></div>
                <button id="commit">Commit</button>
                <button id="send">send</button>
            </div>
        `;

        let panel = this.panel;
        let viewer = this.viewer;
        // check https://forge.autodesk.com/blog/extension-skeleton-toolbar-docking-panel
        let toolbarButtonPropertyAdder = new Autodesk.Viewing.UI.Button('PropertyAdder');

        if (panel == null) {
            panel = new DataAddingPanel(viewer, viewer.container,
                'controlPanel', 'Control Panel', {"innerDiv":this.ui});
        }

        toolbarButtonPropertyAdder.onClick = () => {

            panel.setVisible(!panel.isVisible());
        };


        toolbarButtonPropertyAdder.addClass('toolbarButtonPropertyAdder');
        toolbarButtonPropertyAdder.setToolTip('Show/Hide property adder dialog');

        // SubToolbar
        this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('ExtensionPropertyAdderToolbar');
        this.subToolbar.addControl(toolbarButtonPropertyAdder);

        this.viewer.toolbar.addControl(this.subToolbar);







        // bindings
        let controller1 = document.getElementById("BGEReinforcement");
        let controller2 = document.getElementById("BGELoadTensionMax");
        let controller3 = document.getElementById("BGELoadLiveMax");
        let controller4 = document.getElementById("BGELoadDeadMax");


    let CommitButton = document.getElementById("commit");

    CommitButton.onclick = () => {
        this.data["Columns"].push({
            "ColumnId": this.viewer.getSelection()[0],
            'BGEReinforcement': controller1.value,
            'BGELoadTensionMax': controller2.value,
            'BGELoadLiveMax': controller3.value,
            'BGELoadDeadMax': controller4.value
        });


    };


    let SendButton = document.getElementById("send");

    SendButton.onclick = () => {
        console.log(this.data);
        fetch("/da4revit/v1/columns",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.data),
            });
        }

    }

    customize() {
        this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        this.tree = this.viewer.model.getData().instanceTree;
        this.createUI();
    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('PropertyAdderExtension',
    PropertyAdderExtension);


// *******************************************
// Data Adding Panel
// *******************************************
function DataAddingPanel(viewer, container, id, title, options) {
    this.viewer = viewer;

    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

    // the style of the docking panel
    // use this built-in style to support Themes on Viewer 4+

    this.container.appendChild(options.innerDiv);
    this.container.style = `
    bottom: 10px;
    right: 10px;
    width: 300px;
    height: 200px;
    resize: none;
    `

}
DataAddingPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
DataAddingPanel.prototype.constructor = DataAddingPanel;