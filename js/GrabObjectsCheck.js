var canvas = document.getElementById("renderCanvas");
var scene, camera;
var cubes = [];

var selectedMesh;

var createScene = function () {
    scene = new BABYLON.Scene(engine);
    scene.debugLayer.show();
    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 6, 0), scene);

    createGround();
    createCubes();


    var VRHelper = scene.createDefaultVRExperience();
    VRHelper.enableInteractions();
    VRHelper.enableTeleportation({
            floorMeshName: "ground1"
    });

    VRHelper.onControllerMeshLoaded.add((webVRController)=>{
        webVRController.onTriggerStateChangedObservable.add((stateObject)=>{
                //grab
                if(stateObject.value > 0.01){
                    if(selectedMesh !=null){
                        webVRController.mesh.addChild(selectedMesh);
                    }

                //ungrab   
                }else{
                    if(selectedMesh !=null){
                        webVRController.mesh.removeChild(selectedMesh);
                    }
                }
        });
    });

    VRHelper.onNewMeshSelected.add(function(mesh) {
        selectedMesh = mesh;
    });

    VRHelper.onSelectedMeshUnselected.add(function() {
        selectedMesh=null;
    });


    return scene;
};

var createGround = function () {
    var ground = BABYLON.Mesh.CreateGround("ground1", 12, 36, 2, scene);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
    groundMaterial.diffuseTexture.uScale = 6;
    groundMaterial.diffuseTexture.vScale = 6;
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    ground.material = groundMaterial;
};

var createCubes = function () {
    for (var i = 0; i < 4; i++) {
        cubes.push(new BABYLON.Mesh.CreateBox("cube" + i, 2, scene));
        cubes[i].position.y = 1;
        cubes[i].material = new BABYLON.StandardMaterial("cubeMat", scene);
    }
    cubes[0].position.z = 8;
    cubes[1].position.x = 8;
    cubes[2].position.x = -8;
    cubes[3].position.z = -8;
};

var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
var scene = createScene();

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});
