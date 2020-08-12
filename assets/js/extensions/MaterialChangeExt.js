///////////////////////////////////////////////////////////////////////////////
// Change Material extension illustrate how to customize materials
// by Denis Grigor, October 2019
//
///////////////////////////////////////////////////////////////////////////////

class MaterialChangeExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.tree = null;
        this.materialManager = null;

        this.customize = this.customize.bind(this);
        this.createUI = this.createUI.bind(this);
        this.processSelection = this.processSelection.bind(this);
    }

    load() {
        console.log('MaterialChangeExtension is loaded!');
        this.viewer.addEventListener(Autodesk.Viewing.TEXTURES_LOADED_EVENT,
            this.customize);
        this.viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
            this.processSelection);

        return true;
    }
    unload() {
        console.log('MaterialChangeExtension is now unloaded!');
        this.viewer.removeEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
            this.processSelection);

        return true;
    }

    customize() {
        this.viewer.removeEventListener(Autodesk.Viewing.TEXTURES_LOADED_EVENT,
            this.customize);



        //Start coding here ...
        this.materialManager = this.viewer.impl.matman();
        this.tree = this.viewer.model.getInstanceTree();
        this.fragmentList = this.viewer.model.getFragmentList();

        let viewer = this.viewer;
        let materialManager = this.materialManager;

        const rm = "./assets/img/textures/fabric_wire_spec.png";
        const bm = "./assets/img/textures/fabric_wire_bump.png";
        const cm = "./assets/img/textures/P182_Powersurge.jpg";
        fetch(cm).then(data => console.log(data)).catch(err => console.warn(err));
        const prism = {
            "0": {
                "tag": "Prism-149",
                "definition": "PrismOpaque",
                "transparent": false,
                "keywords": [
                    "Wood",
                    "Finished"
                ],
                "categories": [
                    "Wood/Finished"
                ],
                "properties": {
                    "strings": {
                        "AssetLibID": {
                            "values": [
                                "BA5EE55E-9982-449B-9D66-9F036540E140"
                            ]
                        },
                        "BaseSchema": {
                            "values": [
                                "PrismOpaqueSchema"
                            ]
                        },
                        "UIName": {
                            "values": [
                                "WindowInterior_Wood_JeldWenAlder_Standard"
                            ]
                        },
                        "category": {
                            "values": [
                                "Wood/Finished"
                            ]
                        },
                        "description": {
                            "values": [
                                "Wood - pine finished semigloss"
                            ]
                        },
                        "keyword": {
                            "values": [
                                "Wood",
                                "Finished"
                            ]
                        },
                        "opaque_albedo_urn": {
                            "values": [
                                "adsk.raas:asset.name:Texture-wood_pine_color"
                            ]
                        },
                        "opaque_f0_urn": {
                            "values": []
                        },
                        "opaque_luminance_modifier_urn": {
                            "values": []
                        },
                        "opaque_mfp_modifier_urn": {
                            "values": []
                        },
                        "surface_albedo_urn": {
                            "values": []
                        },
                        "surface_anisotropy_urn": {
                            "values": []
                        },
                        "surface_cutout_urn": {
                            "values": []
                        },
                        "surface_normal_urn": {
                            "values": [
                                "adsk.raas:asset.name:Texture-wood_pine_bump"
                            ]
                        },
                        "surface_rotation_urn": {
                            "values": []
                        },
                        "surface_roughness_urn": {
                            "values": [
                                "adsk.raas:asset.name:Texture-wood_pine_varnished_rough"
                            ]
                        },
                        "swatch": {
                            "values": [
                                "Swatch-Torus"
                            ]
                        }
                    },
                    "uris": {
                        "thumbnail": {
                            "values": [
                                "c:/worker/deploy/Material Library/proteinrun/mgr40_gvtg5v1/deserializexsacfz/4a24e120.png"
                            ]
                        }
                    },
                    "booleans": {
                        "Hidden": {
                            "values": [
                                false
                            ]
                        },
                        "opaque_emission": {
                            "values": [
                                false
                            ]
                        },
                        "opaque_translucency": {
                            "values": [
                                false
                            ]
                        }
                    },
                    "integers": {
                        "interior_model": {
                            "values": [
                                0
                            ]
                        },
                        "revision": {
                            "values": [
                                1
                            ]
                        },
                        "version": {
                            "values": [
                                1
                            ]
                        }
                    },
                    "scalars": {
                        "opaque_f0": {
                            "units": "",
                            "values": [
                                0.06027
                            ]
                        },
                        "opaque_luminance": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "opaque_mfp": {
                            "units": "in",
                            "values": [
                                0.5
                            ]
                        },
                        "surface_anisotropy": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "surface_rotation": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "surface_roughness": {
                            "connections": [
                                "1"
                            ],
                            "units": "",
                            "values": [
                                0.2
                            ]
                        }
                    },
                    "colors": {
                        "opaque_albedo": {
                            "connections": [
                                "2"
                            ],
                            "values": [
                                {
                                    "r": 1,
                                    "g": 1,
                                    "b": 1,
                                    "a": 1
                                }
                            ]
                        },
                        "opaque_luminance_modifier": {
                            "values": [
                                {
                                    "r": 1,
                                    "g": 1,
                                    "b": 1,
                                    "a": 1
                                }
                            ]
                        },
                        "opaque_mfp_modifier": {
                            "values": [
                                {
                                    "r": 1,
                                    "g": 1,
                                    "b": 1,
                                    "a": 1
                                }
                            ]
                        },
                        "surface_albedo": {
                            "values": [
                                {
                                    "r": 1,
                                    "g": 1,
                                    "b": 1,
                                    "a": 1
                                }
                            ]
                        }
                    },
                    "textures": {
                        "surface_cutout": {},
                        "surface_normal": {
                            "connections": [
                                "3"
                            ]
                        }
                    },
                    "choicelists": {
                        "surface_ndf_type": {
                            "values": [
                                1
                            ]
                        }
                    },
                    "uuids": {
                        "ExchangeGUID": {
                            "values": [
                                ""
                            ]
                        },
                        "VersionGUID": {
                            "values": [
                                "F68E0B00-437E-4E2E-966D-C304F5E4FDBE"
                            ]
                        }
                    },
                    "references": {}
                }
            },







            "1": {
                "tag": "Texture-wood_pine_varnished_rough",
                "definition": "UnifiedBitmap",
                "keywords": [
                    ""
                ],
                "categories": [
                    "Roughness Map"
                ],
                "properties": {
                    "strings": {
                        "AssetLibID": {
                            "values": [
                                "BA5EE55E-9982-449B-9D66-9F036540E140"
                            ]
                        },
                        "BaseSchema": {
                            "values": [
                                "UnifiedBitmapSchema"
                            ]
                        },
                        "UIName": {
                            "values": [
                                "wood pine varnished rough"
                            ]
                        },
                        "category": {
                            "values": [
                                "Roughness Map"
                            ]
                        },
                        "description": {
                            "values": []
                        },
                        "keyword": {
                            "values": []
                        },
                        "swatch": {
                            "values": []
                        },
                        "unifiedbitmap_Bitmap_urn": {
                            "values": []
                        }
                    },
                    "uris": {
                        "thumbnail": {
                            "values": []
                        },
                        "unifiedbitmap_Bitmap": {
                            "values": [
                                rm
                            ]
                        }
                    },
                    "booleans": {
                        "Hidden": {
                            "values": [
                                false
                            ]
                        },
                        "common_Tint_toggle": {
                            "values": [
                                false
                            ]
                        },
                        "texture_LinkTextureTransforms": {
                            "values": [
                                false
                            ]
                        },
                        "texture_OffsetLock": {
                            "values": [
                                false
                            ]
                        },
                        "texture_ScaleLock": {
                            "values": [
                                true
                            ]
                        },
                        "texture_URepeat": {
                            "values": [
                                true
                            ]
                        },
                        "texture_VRepeat": {
                            "values": [
                                true
                            ]
                        },
                        "unifiedbitmap_Invert": {
                            "values": [
                                false
                            ]
                        }
                    },
                    "integers": {
                        "revision": {
                            "values": [
                                1
                            ]
                        },
                        "texture_MapChannel": {
                            "values": [
                                1
                            ]
                        },
                        "texture_MapChannel_ID_Advanced": {
                            "values": [
                                1
                            ]
                        },
                        "texture_MapChannel_UVWSource_Advanced": {
                            "values": [
                                0
                            ]
                        },
                        "unifiedbitmap_Filtering": {
                            "values": [
                                0
                            ]
                        },
                        "version": {
                            "values": [
                                1
                            ]
                        }
                    },
                    "scalars": {
                        "texture_RealWorldOffsetX": {
                            "units": "in",
                            "values": [
                                0
                            ]
                        },
                        "texture_RealWorldOffsetY": {
                            "units": "in",
                            "values": [
                                0
                            ]
                        },
                        "texture_RealWorldScaleX": {
                            "units": "in",
                            "values": [
                                0.0984252
                            ]
                        },
                        "texture_RealWorldScaleY": {
                            "units": "in",
                            "values": [
                                0.0984
                            ]
                        },
                        "texture_UOffset": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "texture_UScale": {
                            "units": "",
                            "values": [
                                0.1
                            ]
                        },
                        "texture_UVScale": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "texture_VOffset": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "texture_VScale": {
                            "units": "",
                            "values": [
                                0.1
                            ]
                        },
                        "texture_WAngle": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "unifiedbitmap_BlueAmount": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "unifiedbitmap_Blur": {
                            "units": "",
                            "values": [
                                0.01
                            ]
                        },
                        "unifiedbitmap_Blur_Offset": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "unifiedbitmap_GreenAmount": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "unifiedbitmap_RGBAmount": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "unifiedbitmap_RedAmount": {
                            "units": "",
                            "values": [
                                1
                            ]
                        }
                    },
                    "colors": {
                        "common_Tint_color": {
                            "values": [
                                {
                                    "r": 0.315,
                                    "g": 0.315,
                                    "b": 0.315,
                                    "a": 1
                                }
                            ]
                        }
                    },
                    "textures": {},
                    "choicelists": {
                        "common_Shared_Asset": {
                            "values": [
                                0
                            ]
                        }
                    },
                    "uuids": {
                        "ExchangeGUID": {
                            "values": [
                                ""
                            ]
                        },
                        "VersionGUID": {
                            "values": [
                                "9D88CAED-B25D-4BFE-8477-A829A7755C2B"
                            ]
                        }
                    },
                    "references": {}
                }
            },





            "2": {
                "tag": "Texture-wood_pine_color",
                "definition": "UnifiedBitmap",
                "keywords": [
                    ""
                ],
                "categories": [
                    "Color Map"
                ],
                "properties": {
                    "strings": {
                        "AssetLibID": {
                            "values": [
                                "BA5EE55E-9982-449B-9D66-9F036540E140"
                            ]
                        },
                        "BaseSchema": {
                            "values": [
                                "UnifiedBitmapSchema"
                            ]
                        },
                        "UIName": {
                            "values": [
                                "wood pine color"
                            ]
                        },
                        "category": {
                            "values": [
                                "Color Map"
                            ]
                        },
                        "description": {
                            "values": []
                        },
                        "keyword": {
                            "values": []
                        },
                        "swatch": {
                            "values": []
                        },
                        "unifiedbitmap_Bitmap_urn": {
                            "values": []
                        }
                    },
                    "uris": {
                        "thumbnail": {
                            "values": []
                        },
                        "unifiedbitmap_Bitmap": {
                            "values": [
                                cm
                            ]
                        }
                    },
                    "booleans": {
                        "Hidden": {
                            "values": [
                                false
                            ]
                        },
                        "common_Tint_toggle": {
                            "values": [
                                false
                            ]
                        },
                        "texture_LinkTextureTransforms": {
                            "values": [
                                true
                            ]
                        },
                        "texture_OffsetLock": {
                            "values": [
                                false
                            ]
                        },
                        "texture_ScaleLock": {
                            "values": [
                                true
                            ]
                        },
                        "texture_URepeat": {
                            "values": [
                                true
                            ]
                        },
                        "texture_VRepeat": {
                            "values": [
                                true
                            ]
                        },
                        "unifiedbitmap_Invert": {
                            "values": [
                                false
                            ]
                        }
                    },
                    "integers": {
                        "revision": {
                            "values": [
                                1
                            ]
                        },
                        "texture_MapChannel": {
                            "values": [
                                1
                            ]
                        },
                        "texture_MapChannel_ID_Advanced": {
                            "values": [
                                1
                            ]
                        },
                        "texture_MapChannel_UVWSource_Advanced": {
                            "values": [
                                0
                            ]
                        },
                        "unifiedbitmap_Filtering": {
                            "values": [
                                0
                            ]
                        },
                        "version": {
                            "values": [
                                1
                            ]
                        }
                    },
                    "scalars": {
                        "texture_RealWorldOffsetX": {
                            "units": "in",
                            "values": [
                                0
                            ]
                        },
                        "texture_RealWorldOffsetY": {
                            "units": "in",
                            "values": [
                                0
                            ]
                        },
                        "texture_RealWorldScaleX": {
                            "units": "in",
                            "values": [
                                9.84252
                            ]
                        },
                        "texture_RealWorldScaleY": {
                            "units": "in",
                            "values": [
                                9.84
                            ]
                        },
                        "texture_UOffset": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "texture_UScale": {
                            "units": "",
                            "values": [
                                3
                            ]
                        },
                        "texture_UVScale": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "texture_VOffset": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "texture_VScale": {
                            "units": "",
                            "values": [
                                3
                            ]
                        },
                        "texture_WAngle": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "unifiedbitmap_BlueAmount": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "unifiedbitmap_Blur": {
                            "units": "",
                            "values": [
                                0.01
                            ]
                        },
                        "unifiedbitmap_Blur_Offset": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "unifiedbitmap_GreenAmount": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "unifiedbitmap_RGBAmount": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "unifiedbitmap_RedAmount": {
                            "units": "",
                            "values": [
                                1
                            ]
                        }
                    },
                    "colors": {
                        "common_Tint_color": {
                            "values": [
                                {
                                    "r": 0.315,
                                    "g": 0.315,
                                    "b": 0.315,
                                    "a": 1
                                }
                            ]
                        }
                    },
                    "textures": {},
                    "choicelists": {
                        "common_Shared_Asset": {
                            "values": [
                                0
                            ]
                        }
                    },
                    "uuids": {
                        "ExchangeGUID": {
                            "values": [
                                ""
                            ]
                        },
                        "VersionGUID": {
                            "values": [
                                "6A0D28A3-7025-4AB5-8183-474FBFF56FF9"
                            ]
                        }
                    },
                    "references": {}
                }
            },




            "3": {
                "tag": "Texture-wood_pine_bump",
                "definition": "BumpMap",
                "keywords": [
                    ""
                ],
                "categories": [
                    "Bump Map"
                ],
                "properties": {
                    "strings": {
                        "AssetLibID": {
                            "values": [
                                "BA5EE55E-9982-449B-9D66-9F036540E140"
                            ]
                        },
                        "BaseSchema": {
                            "values": [
                                "BumpMapSchema"
                            ]
                        },
                        "UIName": {
                            "values": [
                                "wood pine bump"
                            ]
                        },
                        "bumpmap_Bitmap_urn": {
                            "values": []
                        },
                        "category": {
                            "values": [
                                "Bump Map"
                            ]
                        },
                        "description": {
                            "values": []
                        },
                        "keyword": {
                            "values": []
                        },
                        "swatch": {
                            "values": []
                        }
                    },
                    "uris": {
                        "bumpmap_Bitmap": {
                            "values": [
                                bm
                            ]
                        },
                        "thumbnail": {
                            "values": []
                        }
                    },
                    "booleans": {
                        "Hidden": {
                            "values": [
                                false
                            ]
                        },
                        "common_Tint_toggle": {
                            "values": [
                                false
                            ]
                        },
                        "texture_LinkTextureTransforms": {
                            "values": [
                                false
                            ]
                        },
                        "texture_OffsetLock": {
                            "values": [
                                false
                            ]
                        },
                        "texture_ScaleLock": {
                            "values": [
                                true
                            ]
                        },
                        "texture_URepeat": {
                            "values": [
                                true
                            ]
                        },
                        "texture_VRepeat": {
                            "values": [
                                true
                            ]
                        }
                    },
                    "integers": {
                        "revision": {
                            "values": [
                                1
                            ]
                        },
                        "texture_MapChannel": {
                            "values": [
                                1
                            ]
                        },
                        "texture_MapChannel_ID_Advanced": {
                            "values": [
                                1
                            ]
                        },
                        "texture_MapChannel_UVWSource_Advanced": {
                            "values": [
                                0
                            ]
                        },
                        "version": {
                            "values": [
                                1
                            ]
                        }
                    },
                    "scalars": {
                        "bumpmap_Depth": {
                            "units": "in",
                            "values": [
                                0.003
                            ]
                        },
                        "bumpmap_NormalScale": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "texture_RealWorldOffsetX": {
                            "units": "in",
                            "values": [
                                0
                            ]
                        },
                        "texture_RealWorldOffsetY": {
                            "units": "in",
                            "values": [
                                0
                            ]
                        },
                        "texture_RealWorldScaleX": {
                            "units": "in",
                            "values": [
                                9.84252
                            ]
                        },
                        "texture_RealWorldScaleY": {
                            "units": "in",
                            "values": [
                                9.84
                            ]
                        },
                        "texture_UOffset": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "texture_UScale": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "texture_UVScale": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "texture_VOffset": {
                            "units": "",
                            "values": [
                                0
                            ]
                        },
                        "texture_VScale": {
                            "units": "",
                            "values": [
                                1
                            ]
                        },
                        "texture_WAngle": {
                            "units": "",
                            "values": [
                                0
                            ]
                        }
                    },
                    "colors": {
                        "common_Tint_color": {
                            "values": [
                                {
                                    "r": 0.315,
                                    "g": 0.315,
                                    "b": 0.315,
                                    "a": 1
                                }
                            ]
                        }
                    },
                    "textures": {},
                    "choicelists": {
                        "bumpmap_Type": {
                            "values": [
                                0
                            ]
                        },
                        "common_Shared_Asset": {
                            "values": [
                                0
                            ]
                        }
                    },
                    "uuids": {
                        "ExchangeGUID": {
                            "values": [
                                ""
                            ]
                        },
                        "VersionGUID": {
                            "values": [
                                "B82BD398-A796-4A4F-8FA4-A66722B9EB7C"
                            ]
                        }
                    },
                    "references": {}
                }
            }
        };
        // let mat = {
        //     userassets:["0"],
        //     materials: prism
        // };


        // materialManager.convertOneMaterial(viewer.model, mat, "myTestMaterial");
        // LMV.TextureLoader.loadMaterialTextures(viewer.model, materialManager._materials["myTestMaterial"], viewer.impl);
        // LMV.TextureLoader.loadModelTextures({matman:this.materialManager }, this.viewer.model);

        // materialManager._materials[""].opaque_albedo_map = THREE.ImageUtils.loadTexture('./assets/img/textures/P182_Powersurge.jpg', null, () => viewer.impl.invalidate(true, true))

        // const fl = viewer.model.getFragmentList();
        // fl.setMaterial(1, materialManager._materials["myTestMaterial"]);
        //


        //Change texture for an existing material
        let mat = materialManager._materials["model:1|mat:0"];
        let mat2 = JSON.parse(JSON.stringify(mat));
        mat2.uuid += "denis";

        materialManager.addMaterial("MyCustomMaterial", mat2, true);



        // mat.opaque_albedo_map = THREE.ImageUtils.loadTexture('./assets/img/textures/P182_Powersurge.jpg',
        //     null, () =>  viewer.impl.invalidate(true, true) );
        // Object.assign(mat.opaque_albedo_map, {
        //     matrix: {
        //         elements: [ 0.01,0,0,0,0.01,0,0,0,1]
        //     },
        //     anisotropy: 16,
        //     wrapS: 1000,
        //     wrapT:1000,
        //     clampS: false,
        //     clampT:false});
        //
        //
        //
        // mat.opaque_albedo_map = THREE.ImageUtils.loadTexture('./assets/img/textures/P184_Semiconductor.jpg',
        //     null, () =>  viewer.impl.invalidate(true, true) );
        // Object.assign(mat.opaque_albedo_map, {
        //     matrix: {
        //         elements: [ 0.01,0,0,0,0.01,0,0,0,1]
        //     },
        //     anisotropy: 16,
        //     wrapS: 1000,
        //     wrapT:1000,
        //     clampS: false,
        //     clampT:false});

        // viewer.model.getFragmentList().setMaterial(1, mat);
        viewer.impl.invalidate(true, true);

        // fetch(colorMap).then(data => console.log(data)).catch(err => console.warn(err));

        this.createUI();

    }

    createUI() {
        this.ui = document.createElement("div");
        this.ui.id = "control_area";
        this.ui.classList.add("docking-panel-container-solid-color-a");
        this.ui.innerHTML = `
            <div id="controlsArea">
                <div><span>Texture: </span><img id="thumbnail" width="100px" height="100px"></img></div>
                <div><span>FirstArm: </span><input type="range" min="0" max="360" value="0" class="slider" id="firstArm"></div>
            </div>
        `;

        let panel = this.panel;
        let viewer = this.viewer;
        // check https://forge.autodesk.com/blog/extension-skeleton-toolbar-docking-panel
        let toolbarButtonMaterial = new Autodesk.Viewing.UI.Button('MaterialExplorer');

        if (panel == null) {
            panel = new MaterialExplorerPanel(viewer, viewer.container,
                'controlPanel', 'Material Explorer', {"innerDiv":this.ui});
        }

        panel.setVisible(false);

        toolbarButtonMaterial.onClick = (e) => {

            panel.setVisible(!panel.isVisible());
        };



        toolbarButtonMaterial.addClass('toolbarButtonMaterial');
        toolbarButtonMaterial.setToolTip('Show/Hide Material Explorer');

        // SubToolbar
        this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('ExtensionMaterialExplorerToolbar');
        this.subToolbar.addControl(toolbarButtonMaterial);

        this.viewer.toolbar.addControl(this.subToolbar);
    }


    getMaterialHavingObjectID(id){

        let texture = this.materialManager._materials["model:1|mat:0"].opaque_albedo_map;
        let thumb = document.getElementById("thumbnail");
        thumb.src = this.materialManager._materials["model:1|mat:0"].opaque_albedo_map.image.src;
    }

    processSelection() {
        const selectedElementId = this.viewer.getSelection()[0];

        let frags = [];
        this.tree.enumNodeFragments(selectedElementId, fragId => frags.push(fragId));
        console.log(`Was selected element with id=${(selectedElementId)} which has ${frags.length} fragments`);
        console.log("Associated material: ",this.fragmentList.getMaterial(frags[0]));
        this.getMaterialHavingObjectID(frags[0]);
    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('MaterialChangeExtension',
    MaterialChangeExtension);


// *******************************************
// Material Explorer Panel
// *******************************************
class MaterialExplorerPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        this.viewer = viewer;

        // the style of the docking panel
        // use this built-in style to support Themes on Viewer 4+
        this.container.classList.add('docking-panel-container-solid-color-a');
        this.container.id = "MaterialExplorerPanelContainer";
        this.container.style += `    
        resize: none;
    display: block;
    max-height: 335px;
    max-width: 363px;
    right: 0px;
    top: 30%;
    width: 300px;
    height: 300px;
    left: 1317px;`;
        console.log(options);


        this.container.appendChild(options.innerDiv);
    }
}







const roughnessMap = "../assets/img/textures/fabric_wire_spec.png";
const bumpMap = "../assets/img/textures/fabric_wire_bump.png";
const colorMap = "../assets/img/textures/P182_Powersurge.jpg";

let prismMaterialCollection = {
    "Wood_Finished": {
        "0": {
            "tag": "Prism-141",
            "definition": "PrismOpaque",
            "transparent": false,
            "keywords": [
                "Wood",
                "Finished"
            ],
            "categories": [
                "Wood/Finished"
            ],
            "properties": {
                "strings": {
                    "AssetLibID": {
                        "values": [
                            "BA5EE55E-9982-449B-9D66-9F036540E140"
                        ]
                    },
                    "BaseSchema": {
                        "values": [
                            "PrismOpaqueSchema"
                        ]
                    },
                    "UIName": {
                        "values": [
                            "Mahogany - Semigloss"
                        ]
                    },
                    "category": {
                        "values": [
                            "Wood/Finished"
                        ]
                    },
                    "description": {
                        "values": [
                            "Wood - mahogany finished semigloss"
                        ]
                    },
                    "keyword": {
                        "values": [
                            "Wood",
                            "Finished"
                        ]
                    },
                    "opaque_albedo_urn": {
                        "values": [
                            colorMap
                        ]
                    },
                    "opaque_f0_urn": {
                        "values": []
                    },
                    "opaque_luminance_modifier_urn": {
                        "values": []
                    },
                    "opaque_mfp_modifier_urn": {
                        "values": []
                    },
                    "surface_albedo_urn": {
                        "values": []
                    },
                    "surface_anisotropy_urn": {
                        "values": []
                    },
                    "surface_cutout_urn": {
                        "values": []
                    },
                    "surface_normal_urn": {
                        "values": [
                            bumpMap
                        ]
                    },
                    "surface_rotation_urn": {
                        "values": []
                    },
                    "surface_roughness_urn": {
                        "values": [
                            roughnessMap
                        ]
                    },
                    "swatch": {
                        "values": [
                            "Swatch-Torus"
                        ]
                    }
                },
                "uris": {
                    "thumbnail": {
                        "values": [
                            "c:/worker/deploy/Material Library/proteinrun/mgr40_bqifw8/deserialize1dbs6j/5c0d86c0.png"
                        ]
                    }
                },
                "booleans": {
                    "Hidden": {
                        "values": [
                            false
                        ]
                    },
                    "opaque_emission": {
                        "values": [
                            false
                        ]
                    },
                    "opaque_translucency": {
                        "values": [
                            false
                        ]
                    }
                },
                "integers": {
                    "interior_model": {
                        "values": [
                            0
                        ]
                    },
                    "revision": {
                        "values": [
                            1
                        ]
                    },
                    "version": {
                        "values": [
                            1
                        ]
                    }
                },
                "scalars": {
                    "opaque_f0": {
                        "units": "",
                        "values": [
                            0.06027
                        ]
                    },
                    "opaque_luminance": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "opaque_mfp": {
                        "units": "mm",
                        "values": [
                            0.5
                        ]
                    },
                    "surface_anisotropy": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "surface_rotation": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "surface_roughness": {
                        "connections": [
                            "1"
                        ],
                        "units": "",
                        "values": [
                            0.2
                        ]
                    }
                },
                "colors": {
                    "opaque_albedo": {
                        "connections": [
                            "2"
                        ],
                        "values": [
                            {
                                "r": 1,
                                "g": 1,
                                "b": 1,
                                "a": 1
                            }
                        ]
                    },
                    "opaque_luminance_modifier": {
                        "values": [
                            {
                                "r": 1,
                                "g": 1,
                                "b": 1,
                                "a": 1
                            }
                        ]
                    },
                    "opaque_mfp_modifier": {
                        "values": [
                            {
                                "r": 1,
                                "g": 1,
                                "b": 1,
                                "a": 1
                            }
                        ]
                    },
                    "surface_albedo": {
                        "values": [
                            {
                                "r": 1,
                                "g": 1,
                                "b": 1,
                                "a": 1
                            }
                        ]
                    }
                },
                "textures": {
                    "surface_cutout": {},
                    "surface_normal": {
                        "connections": [
                            "3"
                        ]
                    }
                },
                "choicelists": {
                    "surface_ndf_type": {
                        "values": [
                            1
                        ]
                    }
                },
                "uuids": {
                    "ExchangeGUID": {
                        "values": [
                            ""
                        ]
                    },
                    "VersionGUID": {
                        "values": [
                            "7498D260-DBFA-4B80-B773-51217323A935"
                        ]
                    }
                },
                "references": {}
            }
        },
        "1": {
            "tag": "Texture-wood_mahogany_varnished_rough",
            "definition": "UnifiedBitmap",
            "keywords": [
                ""
            ],
            "categories": [
                "Roughness Map"
            ],
            "properties": {
                "strings": {
                    "AssetLibID": {
                        "values": [
                            "BA5EE55E-9982-449B-9D66-9F036540E140"
                        ]
                    },
                    "BaseSchema": {
                        "values": [
                            "UnifiedBitmapSchema"
                        ]
                    },
                    "UIName": {
                        "values": [
                            "wood mahogany varnished rough"
                        ]
                    },
                    "category": {
                        "values": [
                            "Roughness Map"
                        ]
                    },
                    "description": {
                        "values": []
                    },
                    "keyword": {
                        "values": []
                    },
                    "swatch": {
                        "values": []
                    },
                    "unifiedbitmap_Bitmap_urn": {
                        "values": [
                            roughnessMap
                        ]
                    }
                },
                "uris": {
                    "thumbnail": {
                        "values": []
                    },
                    "unifiedbitmap_Bitmap": {
                        "values": [
                            roughnessMap
                        ]
                    }
                },
                "booleans": {
                    "Hidden": {
                        "values": [
                            false
                        ]
                    },
                    "common_Tint_toggle": {
                        "values": [
                            false
                        ]
                    },
                    "texture_LinkTextureTransforms": {
                        "values": [
                            false
                        ]
                    },
                    "texture_OffsetLock": {
                        "values": [
                            false
                        ]
                    },
                    "texture_ScaleLock": {
                        "values": [
                            true
                        ]
                    },
                    "texture_URepeat": {
                        "values": [
                            true
                        ]
                    },
                    "texture_VRepeat": {
                        "values": [
                            true
                        ]
                    },
                    "unifiedbitmap_Invert": {
                        "values": [
                            false
                        ]
                    }
                },
                "integers": {
                    "revision": {
                        "values": [
                            1
                        ]
                    },
                    "texture_MapChannel": {
                        "values": [
                            1
                        ]
                    },
                    "texture_MapChannel_ID_Advanced": {
                        "values": [
                            1
                        ]
                    },
                    "texture_MapChannel_UVWSource_Advanced": {
                        "values": [
                            0
                        ]
                    },
                    "unifiedbitmap_Filtering": {
                        "values": [
                            0
                        ]
                    },
                    "version": {
                        "values": [
                            1
                        ]
                    }
                },
                "scalars": {
                    "texture_RealWorldOffsetX": {
                        "units": "in",
                        "values": [
                            0
                        ]
                    },
                    "texture_RealWorldOffsetY": {
                        "units": "in",
                        "values": [
                            0
                        ]
                    },
                    "texture_RealWorldScaleX": {
                        "units": "in",
                        "values": [
                            18
                        ]
                    },
                    "texture_RealWorldScaleY": {
                        "units": "in",
                        "values": [
                            36
                        ]
                    },
                    "texture_UOffset": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "texture_UScale": {
                        "units": "",
                        "values": [
                            1
                        ]
                    },
                    "texture_UVScale": {
                        "units": "",
                        "values": [
                            1
                        ]
                    },
                    "texture_VOffset": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "texture_VScale": {
                        "units": "",
                        "values": [
                            1
                        ]
                    },
                    "texture_WAngle": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "unifiedbitmap_Blur": {
                        "units": "",
                        "values": [
                            0.01
                        ]
                    },
                    "unifiedbitmap_Blur_Offset": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "unifiedbitmap_RGBAmount": {
                        "units": "",
                        "values": [
                            1
                        ]
                    }
                },
                "colors": {
                    "common_Tint_color": {
                        "values": [
                            {
                                "r": 0.315,
                                "g": 0.315,
                                "b": 0.315,
                                "a": 1
                            }
                        ]
                    }
                },
                "textures": {},
                "choicelists": {
                    "common_Shared_Asset": {
                        "values": [
                            0
                        ]
                    }
                },
                "uuids": {
                    "ExchangeGUID": {
                        "values": [
                            ""
                        ]
                    },
                    "VersionGUID": {
                        "values": [
                            "UnifiedBitmapSchema"
                        ]
                    }
                },
                "references": {}
            },
            "matrix": {
                "elements": [
                    0.0021872266666666668,
                    0,
                    0,
                    0,
                    0.0010936133333333334,
                    0,
                    0,
                    0,
                    1
                ]
            }
        },
        "2": {
            "tag": "Texture-wood_mahogany_color",
            "definition": "UnifiedBitmap",
            "keywords": [
                ""
            ],
            "categories": [
                "Color Map"
            ],
            "properties": {
                "strings": {
                    "AssetLibID": {
                        "values": [
                            "BA5EE55E-9982-449B-9D66-9F036540E140"
                        ]
                    },
                    "BaseSchema": {
                        "values": [
                            "UnifiedBitmapSchema"
                        ]
                    },
                    "UIName": {
                        "values": [
                            "wood mahogany color"
                        ]
                    },
                    "category": {
                        "values": [
                            "Color Map"
                        ]
                    },
                    "description": {
                        "values": []
                    },
                    "keyword": {
                        "values": []
                    },
                    "swatch": {
                        "values": []
                    },
                    "unifiedbitmap_Bitmap_urn": {
                        "values": [
                            colorMap
                        ]
                    }
                },
                "uris": {
                    "thumbnail": {
                        "values": []
                    },
                    "unifiedbitmap_Bitmap": {
                        "values": [
                            colorMap
                        ]
                    }
                },
                "booleans": {
                    "Hidden": {
                        "values": [
                            false
                        ]
                    },
                    "common_Tint_toggle": {
                        "values": [
                            false
                        ]
                    },
                    "texture_LinkTextureTransforms": {
                        "values": [
                            false
                        ]
                    },
                    "texture_OffsetLock": {
                        "values": [
                            false
                        ]
                    },
                    "texture_ScaleLock": {
                        "values": [
                            true
                        ]
                    },
                    "texture_URepeat": {
                        "values": [
                            true
                        ]
                    },
                    "texture_VRepeat": {
                        "values": [
                            true
                        ]
                    },
                    "unifiedbitmap_Invert": {
                        "values": [
                            false
                        ]
                    }
                },
                "integers": {
                    "revision": {
                        "values": [
                            1
                        ]
                    },
                    "texture_MapChannel": {
                        "values": [
                            1
                        ]
                    },
                    "texture_MapChannel_ID_Advanced": {
                        "values": [
                            1
                        ]
                    },
                    "texture_MapChannel_UVWSource_Advanced": {
                        "values": [
                            0
                        ]
                    },
                    "unifiedbitmap_Filtering": {
                        "values": [
                            0
                        ]
                    },
                    "version": {
                        "values": [
                            1
                        ]
                    }
                },
                "scalars": {
                    "texture_RealWorldOffsetX": {
                        "units": "in",
                        "values": [
                            0
                        ]
                    },
                    "texture_RealWorldOffsetY": {
                        "units": "in",
                        "values": [
                            0
                        ]
                    },
                    "texture_RealWorldScaleX": {
                        "units": "in",
                        "values": [
                            18
                        ]
                    },
                    "texture_RealWorldScaleY": {
                        "units": "in",
                        "values": [
                            36
                        ]
                    },
                    "texture_UOffset": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "texture_UScale": {
                        "units": "",
                        "values": [
                            1
                        ]
                    },
                    "texture_UVScale": {
                        "units": "",
                        "values": [
                            1
                        ]
                    },
                    "texture_VOffset": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "texture_VScale": {
                        "units": "",
                        "values": [
                            1
                        ]
                    },
                    "texture_WAngle": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "unifiedbitmap_Blur": {
                        "units": "",
                        "values": [
                            0.01
                        ]
                    },
                    "unifiedbitmap_Blur_Offset": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "unifiedbitmap_RGBAmount": {
                        "units": "",
                        "values": [
                            1
                        ]
                    }
                },
                "colors": {
                    "common_Tint_color": {
                        "values": [
                            {
                                "r": 0.315,
                                "g": 0.315,
                                "b": 0.315,
                                "a": 1
                            }
                        ]
                    }
                },
                "textures": {},
                "choicelists": {
                    "common_Shared_Asset": {
                        "values": [
                            0
                        ]
                    }
                },
                "uuids": {
                    "ExchangeGUID": {
                        "values": [
                            ""
                        ]
                    },
                    "VersionGUID": {
                        "values": [
                            "UnifiedBitmapSchema"
                        ]
                    }
                },
                "references": {}
            },
            "matrix": {
                "elements": [
                    0.0021872266666666668,
                    0,
                    0,
                    0,
                    0.0010936133333333334,
                    0,
                    0,
                    0,
                    1
                ]
            }
        },
        "3": {
            "tag": "Texture-wood_mahogany_bump",
            "definition": "BumpMap",
            "keywords": [
                ""
            ],
            "categories": [
                "Bump Map"
            ],
            "properties": {
                "strings": {
                    "AssetLibID": {
                        "values": [
                            "BA5EE55E-9982-449B-9D66-9F036540E140"
                        ]
                    },
                    "BaseSchema": {
                        "values": [
                            "BumpMapSchema"
                        ]
                    },
                    "UIName": {
                        "values": [
                            "wood mahogany bump"
                        ]
                    },
                    "bumpmap_Bitmap_urn": {
                        "values": [
                            bumpMap
                        ]
                    },
                    "category": {
                        "values": [
                            "Bump Map"
                        ]
                    },
                    "description": {
                        "values": []
                    },
                    "keyword": {
                        "values": []
                    },
                    "swatch": {
                        "values": []
                    }
                },
                "uris": {
                    "bumpmap_Bitmap": {
                        "values": [
                            "cloud/resource/1/1_mats_wood_mahogany_bump.jpg.jpg"
                        ]
                    },
                    "thumbnail": {
                        "values": []
                    }
                },
                "booleans": {
                    "Hidden": {
                        "values": [
                            false
                        ]
                    },
                    "common_Tint_toggle": {
                        "values": [
                            false
                        ]
                    },
                    "texture_LinkTextureTransforms": {
                        "values": [
                            false
                        ]
                    },
                    "texture_OffsetLock": {
                        "values": [
                            false
                        ]
                    },
                    "texture_ScaleLock": {
                        "values": [
                            true
                        ]
                    },
                    "texture_URepeat": {
                        "values": [
                            true
                        ]
                    },
                    "texture_VRepeat": {
                        "values": [
                            true
                        ]
                    }
                },
                "integers": {
                    "revision": {
                        "values": [
                            1
                        ]
                    },
                    "texture_MapChannel": {
                        "values": [
                            1
                        ]
                    },
                    "texture_MapChannel_ID_Advanced": {
                        "values": [
                            1
                        ]
                    },
                    "texture_MapChannel_UVWSource_Advanced": {
                        "values": [
                            0
                        ]
                    },
                    "version": {
                        "values": [
                            1
                        ]
                    }
                },
                "scalars": {
                    "bumpmap_Depth": {
                        "units": "in",
                        "values": [
                            0.003
                        ]
                    },
                    "bumpmap_NormalScale": {
                        "units": "",
                        "values": [
                            1
                        ]
                    },
                    "texture_RealWorldOffsetX": {
                        "units": "in",
                        "values": [
                            0
                        ]
                    },
                    "texture_RealWorldOffsetY": {
                        "units": "in",
                        "values": [
                            0
                        ]
                    },
                    "texture_RealWorldScaleX": {
                        "units": "in",
                        "values": [
                            18
                        ]
                    },
                    "texture_RealWorldScaleY": {
                        "units": "in",
                        "values": [
                            36
                        ]
                    },
                    "texture_UOffset": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "texture_UScale": {
                        "units": "",
                        "values": [
                            1
                        ]
                    },
                    "texture_UVScale": {
                        "units": "",
                        "values": [
                            1
                        ]
                    },
                    "texture_VOffset": {
                        "units": "",
                        "values": [
                            0
                        ]
                    },
                    "texture_VScale": {
                        "units": "",
                        "values": [
                            1
                        ]
                    },
                    "texture_WAngle": {
                        "units": "",
                        "values": [
                            0
                        ]
                    }
                },
                "colors": {
                    "common_Tint_color": {
                        "values": [
                            {
                                "r": 0.315,
                                "g": 0.315,
                                "b": 0.315,
                                "a": 1
                            }
                        ]
                    }
                },
                "textures": {},
                "choicelists": {
                    "bumpmap_Type": {
                        "values": [
                            0
                        ]
                    },
                    "common_Shared_Asset": {
                        "values": [
                            0
                        ]
                    }
                },
                "uuids": {
                    "ExchangeGUID": {
                        "values": [
                            ""
                        ]
                    },
                    "VersionGUID": {
                        "values": [
                            "BumpMapSchema"
                        ]
                    }
                },
                "references": {}
            },
            "matrix": {
                "elements": [
                    0.0021872266666666668,
                    0,
                    0,
                    0,
                    0.0010936133333333334,
                    0,
                    0,
                    0,
                    1
                ]
            }
        }
    }

};

