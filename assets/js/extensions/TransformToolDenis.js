
///////////////////////////////////////////////////////////////////
// Transform Tool viewer extension
// by Philippe Leefsma, August 2015
// updated by Denis Grigor, February 2019
//
///////////////////////////////////////////////////////////////////

class TransformTool extends Autodesk.Viewing.Extension {
    constructor (viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this._hitPoint = null;

        this._isDragging = false;

        this._transformMesh = null;

        this._modifiedFragIdMap = {};

        this._selectedFragProxyMap = {};

        this._transformControlTx = null;

        this._tool = null;

        this.getTransformMap = this.getTransformMap.bind(this);
        this.getNames = this.getNames.bind(this);
        this.getName = this.getName.bind(this);
        this.activate = this.activate.bind(this);
        this.deactivate = this.deactivate.bind(this);
        this.handleButtonDown = this.handleButtonDown.bind(this);
        this.handleButtonUp = this.handleButtonUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

    }

    ///////////////////////////////////////////////////////
    // extension load callback
    //
    ///////////////////////////////////////////////////////
    load() {

        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.activate);


        console.log('Autodesk.ADN.Viewing.Extension.TransformTool loaded');

        return true;
    };

    ///////////////////////////////////////////////////////
    // extension unload callback
    //
    ///////////////////////////////////////////////////////
    unload() {

        this.viewer.toolController.deactivateTool(this.tool.getName());

        console.log('Autodesk.ADN.Viewing.Extension.TransformTool unloaded');

        return true;
    };


        ///////////////////////////////////////////////////////////////////////////
        // Creates a dummy mesh to attach control to
        //
        ///////////////////////////////////////////////////////////////////////////
        createTransformMesh() {

            let material = new THREE.MeshPhongMaterial(
                { color: 0xff0000 });

            this.viewer.impl.matman().addMaterial(
                guid(),
                material,
                true);

            let sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.0001, 5),
                material);

            sphere.position.set(0, 0, 0);

            return sphere;
        }



        ///////////////////////////////////////////////////////////////////////////
        // on translation change
        //
        ///////////////////////////////////////////////////////////////////////////
        onTxChange() {

            for(let fragId in _selectedFragProxyMap) {

                let fragProxy = _selectedFragProxyMap[fragId];

                let position = new THREE.Vector3(
                    this._transformMesh.position.x - fragProxy.offset.x,
                    this._transformMesh.position.y - fragProxy.offset.y,
                    this._transformMesh.position.z - fragProxy.offset.z);

                fragProxy.position = position;

                fragProxy.updateAnimTransform();
            }

            this.viewer.impl.sceneUpdated(true);
        }

        ///////////////////////////////////////////////////////////////////////////
        // on camera changed
        //
        ///////////////////////////////////////////////////////////////////////////
        onCameraChanged() {

            this._transformControlTx.update();
        }

        ///////////////////////////////////////////////////////////////////////////
        // item selected callback
        //
        ///////////////////////////////////////////////////////////////////////////
        onItemSelected(event) {

            this._selectedFragProxyMap = {};

            //component unselected

            if(!event.fragIdsArray.length) {

                this._hitPoint = null;

                this._transformControlTx.visible = false;

                this._transformControlTx.removeEventListener(
                    'change', this.onTxChange);

                viewer.removeEventListener(
                    Autodesk.Viewing.CAMERA_CHANGE_EVENT,
                    this.onCameraChanged);

                return;
            }


            if(this._hitPoint) {

                this._transformControlTx.visible = true;

                this._transformControlTx.setPosition(this._hitPoint);

                this._transformControlTx.addEventListener(
                    'change', this.onTxChange);

                this.viewer.addEventListener(
                    Autodesk.Viewing.CAMERA_CHANGE_EVENT,
                    this.onCameraChanged);

                event.fragIdsArray.forEach(function (fragId) {

                    let fragProxy = this.viewer.impl.getFragmentProxy(
                        this.viewer.model,
                        fragId);

                    fragProxy.getAnimTransform();

                    let offset = {

                        x: _hitPoint.x - fragProxy.position.x,
                        y: _hitPoint.y - fragProxy.position.y,
                        z: _hitPoint.z - fragProxy.position.z
                    };

                    fragProxy.offset = offset;

                    this._selectedFragProxyMap[fragId] = fragProxy;

                    this._modifiedFragIdMap[fragId] = {};
                });

                this._hitPoint = null;
            }
            else {

                this._transformControlTx.visible = false;
            }
        }

        ///////////////////////////////////////////////////////////////////////////
        // normalize screen coordinates
        //
        ///////////////////////////////////////////////////////////////////////////
        normalize(screenPoint) {

            let viewport = this.viewer.navigation.getScreenViewport();

            let n = {
                x: (screenPoint.x - viewport.left) / viewport.width,
                y: (screenPoint.y - viewport.top) / viewport.height
            };

            return n;
        }

        ///////////////////////////////////////////////////////////////////////////
        // get 3d hit point on mesh
        //
        ///////////////////////////////////////////////////////////////////////////
        getHitPoint(event) {

            let screenPoint = {
                x: event.clientX,
                y: event.clientY
            };

            let n = normalize(screenPoint);

            let hitPoint = this.viewer.utilities.getHitPoint(n.x, n.y);

            return hitPoint;
        }

        ///////////////////////////////////////////////////////////////////////////
        // returns all transformed meshes
        //
        ///////////////////////////////////////////////////////////////////////////
        getTransformMap() {

            let transformMap = {};

            for(let fragId in this._modifiedFragIdMap){

                let fragProxy = this.viewer.impl.getFragmentProxy(
                    this.viewer.model,
                    fragId);

                fragProxy.getAnimTransform();

                transformMap[fragId] = {
                    position: fragProxy.position
                };

                fragProxy = null;
            }

            return transformMap;
        };

        ///////////////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////////////
        getNames(){

            return ['Dotty.Viewing.Tool.TransformTool'];
        };

        getName(){

            return 'Dotty.Viewing.Tool.TransformTool';
        };

        ///////////////////////////////////////////////////////////////////////////
        // activates tool
        //
        ///////////////////////////////////////////////////////////////////////////
        activate(){

            this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
                this.activate);

            this.viewer.select([]);
            let bbox = this.viewer.model.getBoundingBox();

            this.viewer.impl.createOverlayScene(
                'Dotty.Viewing.Tool.TransformTool');


            let TransformControls = THREE.TransformControls;

            // console.log(THREE);

            this._transformControlTx = TransformControls(
                this.viewer.impl.camera,
                this.viewer.impl.canvas,
                "translate");

            this._transformControlTx.setSize(
                bbox.getBoundingSphere().radius * 5);
            //
            this._transformControlTx.visible = false;
            //
            this.viewer.impl.addOverlay(
                'Dotty.Viewing.Tool.TransformTool',
                this._transformControlTx);

            this._transformMesh = createTransformMesh();
            //
            this._transformControlTx.attach(this._transformMesh);

            this.viewer.addEventListener(
                Autodesk.Viewing.SELECTION_CHANGED_EVENT,
                this.onItemSelected);
        };

        ///////////////////////////////////////////////////////////////////////////
        // deactivate tool
        //
        ///////////////////////////////////////////////////////////////////////////
        deactivate(){

            this.viewer.impl.removeOverlay(
                'Dotty.Viewing.Tool.TransformTool',
                this._transformControlTx);

            this._transformControlTx.removeEventListener(
                'change',
                this.onTxChange);

            this._transformControlTx = null;

            this.viewer.impl.removeOverlayScene(
                'Dotty.Viewing.Tool.TransformTool');

            this.viewer.removeEventListener(
                Autodesk.Viewing.CAMERA_CHANGE_EVENT,
                this.onCameraChanged);

            this.viewer.removeEventListener(
                Autodesk.Viewing.SELECTION_CHANGED_EVENT,
                this.onItemSelected);
        };

        ///////////////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////////////
        update(t){

            return false;
        };

        handleSingleClick(event, button){


            return false;
        };

        handleDoubleClick(event, button){

            return false;
        };


        handleSingleTap(event){

            return false;
        };


        handleDoubleTap(event){

            return false;
        };

        handleKeyDown(event, keyCode){

            return false;
        };

        handleKeyUp(event, keyCode){

            return false;
        };

        handleWheelInput(delta){

            return false;
        };

        ///////////////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////////////
        handleButtonDown(event, button){

            this._hitPoint = getHitPoint(event);

            this._isDragging = true;

            if (this._transformControlTx.onPointerDown(event))
                return true;

            //return _transRotControl.onPointerDown(event);
            return false;
        };

        ///////////////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////////////
        handleButtonUp(event, button){

            this._isDragging = false;

            if (_transformControlTx.onPointerUp(event))
                return true;

            //return _transRotControl.onPointerUp(event);
            return false;
        };

        ///////////////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////////////
        handleMouseMove(event){

            if (this._isDragging) {

                return !!this._transformControlTx.onPointerMove(event);


            }

            if (this._transformControlTx && this._transformControlTx.onPointerHover(event))
                return true;

            //return _transRotControl.onPointerHover(event);
            return false;
        };

        ///////////////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////////////
        handleGesture(event) {

            return false;
        };

        handleBlur(event) {

            return false;
        };

        handleResize() {

        };

    ///////////////////////////////////////////////////////
    // new random guid
    //
    ///////////////////////////////////////////////////////
    guid() {

        let d = new Date().getTime();

        return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(
            /[xy]/g,
            function (c) {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
    }






}


Autodesk.Viewing.theExtensionManager.registerExtension(
    'TransformTool',
    TransformTool);

