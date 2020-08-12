///////////////////////////////////////////////////////////////////////////////
// CustomGeometry extension is illustrating how to add in Forge Viewer
// custom geometry
// by Denis Grigor, February 2020
//
///////////////////////////////////////////////////////////////////////////////



class CustomGeometryExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.sceneBuilder = null;
        this.modelBuilder = null;
        this.materialID = null;
        this.geomID = null;

        this.customize = this.customize.bind(this);
        this.addCustomGeometry = this.addCustomGeometry.bind(this);
        this.removeCustomGeometry = this.removeCustomGeometry.bind(this);
    }

    load() {
        console.log('CustomGeometryExtension is loaded!');
        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        return true;
    }

    unload() {
        console.log('CustomGeometryExtension is now unloaded!');

        this.removeCustomGeometry();
        return true;
    }

    customize() {
        this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);


        // this.addCustomGeometry();

    }

    addCustomGeometry() {

        // console.log("STARTING ...");
        this.viewer.loadExtension("Autodesk.Viewing.SceneBuilder").then(() => {
            this.sceneBuilder = this.viewer.getExtension("Autodesk.Viewing.SceneBuilder");

            this.sceneBuilder.addNewModel({})
                .then((modelBuilder) => {
                    this.modelBuilder = modelBuilder;
                    window.modelBuilder = modelBuilder;

                    let geom = new THREE.BufferGeometry().fromGeometry(new THREE.BoxGeometry(10,10,10));
                    geom.computeBoundingBox();

                    const phongMaterial = new THREE.MeshPhongMaterial({
                        color: new THREE.Color(1, 0, 0)
                    });

                    const mtx = new THREE.Matrix4().compose(
                        new THREE.Vector3(-15, -15, 0),
                        new THREE.Quaternion(0, 0, 0, 1),
                        new THREE.Vector3(1, 1, 1)
                    );

                    this.materialID = this.modelBuilder.addMaterial("phong", phongMaterial);
                    this.geomID = this.modelBuilder.addGeometry(geom);
                    // let fragmentID = this.modelBuilder.addFragment(geomID,"phong", mtx, geom.boundingBox);

                    // console.table([materialID, geomID, fragmentID]);


                    this._mesh = new THREE.Mesh(geom, phongMaterial);
                    this._mesh.dbId = 128;

                    this._mesh.matrix = new THREE.Matrix4().compose(
                        new THREE.Vector3(-15, -100, 0),
                        new THREE.Quaternion(0, 0, 0, 1),
                        new THREE.Vector3(1, 1, 1)
                    );
                    console.log("ADDED: ", this.modelBuilder.addMesh(this._mesh));

                    console.log(this._mesh);
                    // this.addGeometry(geometry,2);
                    // this.addMaterial("phong", phong);
                    // this.addFragment(2, phong, mtx, sphereBox);
                    // mtx.setPosition(new THREE.Vector3(19, 0, 0));
                    //
                    // this.setCamera();

                    // window.geometry = geometry;
                    // console.log(modelBuilder.model.getFra)

                    // this.addMesh();
                });

        })

    }

    removeCustomGeometry() {

    }


}

Autodesk.Viewing.theExtensionManager.registerExtension('CustomGeometryExtension',
    CustomGeometryExtension);

