///////////////////////////////////////////////////////////////////////////////
// Material Extension, illustrating custom material assigned to an existing
// component
// by Denis Grigor, September 2018
//
///////////////////////////////////////////////////////////////////////////////

class HighLightExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.tree = null;

        this.colorPresets = [
            '#73CEFF',
            '#92CF00',
            '#FFF365',
            '#FFA923',
            '#FF1600'
        ];

        this.originalMaterial = {};

        this.customize = this.customize.bind(this);
        this.createMaterial = this.createMaterial.bind(this);
        this.highlight = this.highlight.bind(this);
        this.unhighlight = this.unhighlight.bind(this);
    }

    load() {
        console.log('HighLightExtension is loaded!');

        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        return true;
    }
    unload() {
        console.log('HighLightExtension is now unloaded!');

        return true;
    }


    highlight(roomID, color) {
        let viewer = this.viewer;
        let myMaterial = this.createMaterial(color);
        this.tree.enumNodeFragments(roomID, (fragId) => {

            //save the reference to original material
            this.originalMaterial[fragId] = viewer.model.getFragmentList().getMaterial(fragId);

            viewer.model.getFragmentList().setMaterial(fragId, myMaterial);
        });


        viewer.impl.invalidate(true);
    }


    unhighlight(roomID) {
        this.tree.enumNodeFragments(roomID, (fragId) => {

            if (this.originalMaterial[fragId]) {
                viewer.model.getFragmentList().setMaterial(fragId, this.originalMaterial[fragId]);
            }


        });
        viewer.impl.invalidate(true);
    }

    customize() {

        //Start custom code here ...

        this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        this.tree = this.viewer.model.getData().instanceTree;

    }


    createMaterial(color) {

        const material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            reflectivity: 0.0,
            flatShading: true,
            transparent: true,
            opacity: 0.5,
            color
        });

        const materials = this.viewer.impl.matman();

        materials.addMaterial(
            "MyCustomMaterial" + color.toString(),
            material,
            true);

        return material;
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('HighLightExtension',
    HighLightExtension);





