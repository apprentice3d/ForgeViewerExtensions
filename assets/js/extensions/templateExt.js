///////////////////////////////////////////////////////////////////////////////
// Template extension to be used as a reference for extension development
// by Denis Grigor, July 2018
//
///////////////////////////////////////////////////////////////////////////////

class TemplateExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.tree = null;

        this.customize = this.customize.bind(this);
    }

    load() {
        console.log('TemplateExtension is loaded!');
        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        return true;
    }
    unload() {
        console.log('TemplateExtension is now unloaded!');

        return true;
    }

    customize() {
        this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        //Start coding here ...
    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('TemplateExtension',
    TemplateExtension);