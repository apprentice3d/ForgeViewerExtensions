///////////////////////////////////////////////////////////////////////////////
// Grid extension to add a nice grid to viewer
// by Denis Grigor, March 2019
// updated July 2020
///////////////////////////////////////////////////////////////////////////////

class GridExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.grid = null;

        this.customize = this.customize.bind(this);
        this.changeXPosition = this.changeXPosition.bind(this);
        this.changeYPosition = this.changeYPosition.bind(this);
        this.changeZPosition = this.changeZPosition.bind(this);
        this.changeXRotation = this.changeXRotation.bind(this);
        this.changeYRotation = this.changeYRotation.bind(this);
        this.changeZRotation = this.changeZRotation.bind(this);
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
        if (!this.viewer.overlays.hasScene('denix-grid')) {
            this.viewer.overlays.addScene('denix-grid');
        }
        this.viewer.overlays.addMesh(this.grid, 'denix-grid');

    }

    changeXPosition(xPosition) {
        this.grid.position.x = xPosition;
        this.viewer.impl.sceneUpdated(true);
    }

    changeYPosition(yPosition) {
        this.grid.position.y = yPosition;
        this.viewer.impl.sceneUpdated(true);
    }

    changeZPosition(zPosition) {
        this.grid.position.z = zPosition;
        this.viewer.impl.sceneUpdated(true);
    }

    changeXRotation(xRotation) {
        this.grid.rotation.x = xRotation;
        this.viewer.impl.sceneUpdated(true);
    }
    changeYRotation(yRotation) {
        this.grid.rotation.y = yRotation;
        this.viewer.impl.sceneUpdated(true);
    }
    changeZRotation(zRotation) {
        this.grid.rotation.z = zRotation;
        this.viewer.impl.sceneUpdated(true);
    }

    changeSizeAndDensity(size, density) {
        const position = this.grid.position;
        const rotation = this.grid.rotation;
        // this.viewer.impl.scene.remove(this.grid);
        this.viewer.overlays.removeMesh(this.grid, 'denix-grid');
        this.grid = new THREE.GridHelper(size, density);
        this.grid.material.opacity = 0.5;
        this.grid.material.transparent = true;
        this.grid.position.x = position.x;
        this.grid.position.y = position.y;
        this.grid.position.z = position.z;
        this.grid.rotation.x = rotation.x;
        this.grid.rotation.y = rotation.y;
        this.grid.rotation.z = rotation.z;
        // this.viewer.impl.scene.add(this.grid);
        this.viewer.overlays.addMesh(this.grid, 'denix-grid');
        this.viewer.impl.sceneUpdated(true);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('GridExtension',
    GridExtension);