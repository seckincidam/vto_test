let THREECAMERA = null;

// callback: launched if a face is detected or lost.
function detect_callback(faceIndex, isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK:
function init_threeScene(spec) {
  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);

  // improve WebGLRenderer settings:
  threeStuffs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  threeStuffs.renderer.outputEncoding = THREE.sRGBEncoding;

  // CREATE THE GLASSES AND ADD THEM
  const r = JeelizThreeGlassesCreator({
    envMapURL: "./assets/hdri1.png",
    lensesMeshURL: "./assets/lens.gltf",
    frameMeshURL: "./assets/f1.gltf",
    occluderURL: "./models3D/face.json",
    AOMapURL: "./assets/aomap.jpg",
    normalMapURL: "./assets/frameNormal.png",
  });
  // vertical offset:
  const dy = 0.1;

  // create and add the occluder:
  r.occluder.rotation.set(0.3, 0, 0);
  r.occluder.position.set(0, 0 + dy,-0.03);
  r.occluder.scale.multiplyScalar(0.0082);
  threeStuffs.faceObject.add(r.occluder);
  
  // create and add the glasses mesh:
  const threeGlasses = r.glasses;
  // threeGlasses.rotation.set(0.15,0,0); //X neg -> rotate branches down
  threeGlasses.position.set(0, dy, 0.4);
  threeGlasses.scale.multiplyScalar(0.088);
  threeStuffs.faceObject.add(threeGlasses);
  
  // add a debug cube:
  // const sc = 0.1;
  // const debugCube = new THREE.Mesh(new THREE.BoxGeometry(sc,sc,sc), new THREE.MeshNormalMaterial());
  // threeStuffs.faceObject.add(debugCube);

  // CREATE THE CAMERA:
  THREECAMERA = JeelizThreeHelper.create_camera();
} // end init_threeScene()

// entry point:
function main(){
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings){
      init_faceFilter(bestVideoSettings);
    }
  })
}

function init_faceFilter(videoSettings){
  JEELIZFACEFILTER.init({
    followZRot: true,
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: './neuralNets/', // path of NN_DEFAULT.json file
    maxFacesDetected: 1,
    callbackReady: function(errCode, spec){
      if (errCode){
      console.log('AN ERROR HAPPENS. ERR =', errCode);
      return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    },

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      JeelizThreeHelper.render(detectState, THREECAMERA);
    }
  }); //end JEELIZFACEFILTER.init call
}
