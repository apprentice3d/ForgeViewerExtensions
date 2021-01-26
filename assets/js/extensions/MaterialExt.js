///////////////////////////////////////////////////////////////////////////////
// Material Extension, illustrating custom material assigned to an existing
// component
// by Denis Grigor, September 2018
//
///////////////////////////////////////////////////////////////////////////////

class MaterialExtension extends Autodesk.Viewing.Extension {
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

        this.customize = this.customize.bind(this);
        this.createMaterial = this.createMaterial.bind(this);
    }

    load() {
        console.log('MaterialExtension is loaded!');
        // this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
        this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            this.customize);


        return true;
    }
    unload() {
        console.log('MaterialExtension is now unloaded!');

        return true;
    }

    customize() {
        // this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
        this.viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            this.customize);
        //Start custom code here ...
        this.tree = this.viewer.model.getData().instanceTree;
        let viewer = this.viewer;
        const roomID = 412;

        // const matman = this.viewer.impl.matman();
        let myMaterial = this.createMaterial(this.colorPresets[0]);

        // used to rescale and remove the z-fighting
        let scaleRatio = 0.995; // this was determined as optimal through visual inspection


        this.tree.enumNodeFragments(roomID, (fragId) => {
            viewer.model.getFragmentList().setMaterial(fragId, myMaterial);

            let fragProxy = viewer.impl.getFragmentProxy(viewer.model, fragId);

            /* important technique if you want to remove z-fighting */
            fragProxy.scale = new THREE.Vector3(scaleRatio,scaleRatio,scaleRatio);
            fragProxy.updateAnimTransform();
            // fragProxy.setMaterial(myMaterial);


        });

        // viewer.impl.invalidate(true);
        viewer.impl.sceneUpdated(true);
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

        const materialName = "MyCustomMaterial" + color.toString();
        materials.addMaterial(materialName
            ,
            material,
            true);

        return material;
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('MaterialExtension',
    MaterialExtension);





