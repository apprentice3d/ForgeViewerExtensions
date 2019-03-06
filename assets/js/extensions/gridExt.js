///////////////////////////////////////////////////////////////////////////////
// Grid extension to add a nice grid to viewer
// by Denis Grigor, March 2019
//
///////////////////////////////////////////////////////////////////////////////

class GridExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.grid = null;

        this.customize = this.customize.bind(this);
        this.changeVerticalPosition = this.changeVerticalPosition.bind(this);
        this.changeSizeAndDensity = this.changeSizeAndDensity.bind(this);
    }

    load() {
        console.log('GridExtension is loaded!');
        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        return true;
    }
    unload() {
        console.log('GridExtension is now unloaded!');

        return true;
    }

    customize() {
        this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        // add grid
        this.grid = new THREE.GridHelper(200, 10);
        this.grid.material.opacity = 0.5;
        this.grid.material.transparent = true;
        this.viewer.impl.scene.add(this.grid);

    }

    changeVerticalPosition(yPosition) {
        this.grid.position.y = yPosition;
        this.viewer.impl.sceneUpdated(true);
    }

    changeSizeAndDensity(size, density) {
        this.viewer.impl.scene.remove(this.grid);
        this.grid = new THREE.GridHelper(size, density);
        this.grid.material.opacity = 0.5;
        this.grid.material.transparent = true;
        this.viewer.impl.scene.add(this.grid);
        this.viewer.impl.sceneUpdated(true);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('GridExtension',
    GridExtension);