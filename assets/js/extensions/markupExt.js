// MarkupExt.js




class MarkUp3DExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.tree = null;

        this.customize = this.customize.bind(this);


        // Extension specific vars
        this.raycaster = new THREE.Raycaster();
        this.raycaster.params.PointCloud.threshold = 5; // hit-test markup size.  Change this if markup 'hover' doesn't work
        this.size = 50.0; // markup size.  Change this if markup size is too big or small
        this.lineColor = 0xffffff; // white
        this.labelOffset = new THREE.Vector3(10, 10, 10); // label offset 3D line offset position
        this.xDivOffset = -0.1; // x offset position of the div label wrt 3D line.
        this.yDivOffset = 0.3; // y offset position of the div label wrt 3D line.

        this.scene = this.viewer.impl.scene; // change this to viewer.impl.sceneAfter with transparency, if you want the markup always on top.
        this.markupItems = []; // array containing markup data
        this.pointCloud; // three js point-cloud mesh object
        this.line3d; // three js point-cloud mesh object
        this.camera = this.viewer.impl.camera;
        this.hovered; // index of selected pointCloud id, based on markupItems array
        this.selected; // index of selected pointCloud id, based on markupItems array
        this.label; // x,y div position of selected pointCloud. updated on mouse-move
        this.offset; // global offset

        // Binding methods
        this.update_DivLabel = this.update_DivLabel.bind(this);
        this.initMesh_PointCloud = this.initMesh_PointCloud.bind(this);
        this.setMarkupData = this.setMarkupData.bind(this);
        this.initMesh_Line = this.initMesh_Line.bind(this);
        this.update_Line = this.update_Line.bind(this);
        this.update_DivLabel = this.update_DivLabel.bind(this);
        this.setupUI = this.setupUI.bind(this);

        // Shaders
        this.vertexShader = `
        uniform float size;
        varying vec3 vColor;
        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_PointSize = size * ( size / (length(mvPosition.xyz) + 1.0) );
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

        this.fragmentShader = `
        uniform sampler2D tex;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4( vColor.x, vColor.x, vColor.x, 1.0 );
            gl_FragColor = gl_FragColor * texture2D(tex, vec2((gl_PointCoord.x+vColor.y*1.0)/4.0, 1.0-gl_PointCoord.y));
            if (gl_FragColor.w < 0.5) discard;
        }
    `;


        // Sample data
        this.sampleData = [{
                "name": "Root",
                "picture": "",
                "icon": "",
                "position": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
            },
            {
                "name": "Technical Support",
                "picture": "https://www.cnetsys.com/wp-content/uploads/2016/02/it-support-network-room.jpg",
                "icon": 0,
                "position": {
                    "x": 14.101705551147461,
                    "y": -18.72539520263672,
                    "z": 5
                },
            },
            {
                "name": "Kitchen",
                "picture": "https://d2t1xqejof9utc.cloudfront.net/screenshots/pics/3c43a21b29d27fd5282521241c713bb8/large.jpg",
                "icon": 0,
                "position": {
                    "x": 43.20276641845703,
                    "y": -15.255839347839355,
                    "z": 5
                },
            },
            {
                "name": "Meeting room",
                "picture": "https://d1l6lhgof63zdh.cloudfront.net/autodesk-office-oWyVhgiDVD-full-width.jpg",
                "icon": 0,
                "position": {
                    "x": 28.3897762298584,
                    "y": -18.08563995361328,
                    "z": 5
                },
            },
        ];


    }

    load() {
        console.log('MarkUp3DExtension was loaded!');
        this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            this.customize);

        return true;
    }
    unload() {
        console.log('MarkUp3DExtension is now unloaded!');

        return true;
    }

    customize() {
        // var self = this;
        this.viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            this.customize);


        // Specific code goes here
        this.offset = this.viewer.model.getData().globalOffset; // use global offset to align pointCloud with lmv scene

        this.setupUI();
        this.setMarkupData(this.sampleData);

        // hide rooms bodies, to not hinder markup icon clicking
        this.viewer.hide(370);
        this.viewer.disableSelection(true);
        this.viewer.disableHighlight(true);


        return true;

    }

    setupUI() {

        let label = document.createElement('div');
        label.id = "label";
        label.style.cssText = `
            display: none;
            position: fixed;
            z-index: 2;
            border: 2px solid #ccc;
            background-color: #ffffff;
            border-radius: 5px;
            padding: 10px;`;


        document.body.appendChild(label);

        function moveLabel(p) {
            label.style.left = ((p.x + 1) / 2 * window.innerWidth) + 'px';
            label.style.top = (-(p.y - 1) / 2 * window.innerHeight) + 'px';
        }
        // listen for the 'Markup' event, to re-position our <DIV> POPUP box
        window.addEventListener("onMarkupMove", e => {
            moveLabel(e.detail)
        }, false);
        window.addEventListener("onMarkupClick", e => {
            label.style.display = "block";
            moveLabel(e.detail);
            label.innerHTML = `<img style="width:150px;" src="${(e.detail.imgSrc)}"><br><h4>${e.detail.id}</h4>`;
        }, false);


        // setup listeners for new data and mouse events
        window.addEventListener("newData", e => {
            this.setMarkupData(e.detail)
        }, false);
        document.addEventListener('mousedown', e => {
            this.onClick(e)
        }, true);
        document.addEventListener('touchstart', e => {
            this.onClick(e.changedTouches[0])
        }, false);
        document.addEventListener('mousemove', e => {
            this.onMouseMove(e)
        }, false);
        document.addEventListener('touchmove', e => {
            this.onMouseMove(e.changedTouches[0])
        }, false);
        document.addEventListener('mousewheel', e => {
            this.onMouseMove(e)
        }, true);
    }

    updateHitTest(event) {
        // on mouse move event, check if ray hit with pointcloud, move selection cursor
        // https://stackoverflow.com/questions/28209645/raycasting-involving-individual-points-in-a-three-js-pointcloud
        if (!this.pointCloud) return;
        let x = (event.clientX / window.innerWidth) * 2 - 1;
        let y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Use this approach if the above one fails - usually for non-fullscreen viewer.
        // let w_pos = this.viewer.canvas.getBoundingClientRect();
        // let x = ((event.clientX - w_pos.x) / this.viewer.canvas.width) * 2 - 1;
        // let y = -((event.clientY - w_pos.y)/ this.viewer.canvas.height) * 2 + 1;

        let vector = new THREE.Vector3(x, y, 0.5).unproject(this.camera);
        this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
        let nodes = this.raycaster.intersectObject(this.pointCloud);
        if (nodes.length > 0) {
            if (this.hovered)
                this.geometry.colors[this.hovered].r = 1.0;
            this.hovered = nodes[0].index;
            this.geometry.colors[this.hovered].r = 2.0;
            this.geometry.colorsNeedUpdate = true;
            this.viewer.impl.invalidate(true);
        }
    }

    // Load markup points into Point Cloud
    setMarkupData(data) {
        this.markupItems = data;
        this.geometry = new THREE.Geometry();
        data.map(item => {
            let point = (new THREE.Vector3(item.position.x, item.position.y, item.position.z));
            this.geometry.vertices.push(point);
            this.geometry.colors.push(new THREE.Color(1.0, 0, 0)); // icon = 0..2 position in the horizontal icons.png sprite sheet
        });
        this.initMesh_PointCloud();
        this.initMesh_Line();
    };


    initMesh_PointCloud() {
        if (this.pointCloud)
            this.scene.remove(this.pointCloud); //replace existing pointCloud Mesh
        else {
            // create new point cloud material
            let texture = THREE.ImageUtils.loadTexture("./assets/img/icons.png");
            let material = new THREE.ShaderMaterial({
                vertexColors: THREE.VertexColors,
                fragmentShader: this.fragmentShader,
                vertexShader: this.vertexShader,
                depthWrite: true,
                depthTest: true,
                uniforms: {
                    size: {
                        type: "f",
                        value: this.size
                    },
                    tex: {
                        type: "t",
                        value: texture
                    }
                }
            });
            const materialManager = this.viewer.impl.matman();
            materialManager.addMaterial('pointCloudMaterial', material, true /* skip material heuristics */);
            this.pointCloud = new THREE.PointCloud(this.geometry, material);
            this.pointCloud.position.sub(this.offset);
            this.scene.add(this.pointCloud);
        }

    }


    initMesh_Line() {
        let geom = new THREE.Geometry();
        geom.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1), );
        this.line3d = new THREE.Line(geom, new THREE.LineBasicMaterial({
            color: this.lineColor,
            linewidth: 30.0,
        }));
        this.line3d.position.sub(this.offset);
        this.scene.add(this.line3d);
    }

    update_Line() {
        let position = this.pointCloud.geometry.vertices[this.selected].clone();
        this.line3d.geometry.vertices[0] = position;
        this.line3d.geometry.vertices[1].set(position.x + this.labelOffset.x * Math.sign(position.x), position.y + this.labelOffset.y, position.z + this.labelOffset.z);
        this.line3d.geometry.verticesNeedUpdate = true;
    }

    update_DivLabel(eventName) {
        let position = this.line3d.geometry.vertices[1].clone().sub(this.offset);
        this.label = position.project(this.camera);
        
        if(this.selected) {
            let selectedData = this.sampleData[this.selected];
            window.dispatchEvent(new CustomEvent(eventName, {
                'detail': {
                    id: selectedData.name,
                    imgSrc: selectedData.picture,
                    x: this.label.x + this.xDivOffset,
                    y: this.label.y + this.yDivOffset,
                }
            }));
        }
        
    }

    // Dispatch Message when a point is clicked
    onMouseMove(event) {
        this.update_DivLabel('onMarkupMove');
        this.updateHitTest(event);
    }

    onClick() {
        this.updateHitTest(event);
        if (!this.hovered) return;
        this.selected = this.hovered;
        console.log("Selected marker: ", this.selected);
        this.update_Line();
        this.update_DivLabel('onMarkupClick');
        this.viewer.impl.invalidate(true);
        this.viewer.clearSelection();
    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('MarkUp3DExtension',
    MarkUp3DExtension);