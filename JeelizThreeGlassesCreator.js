"use strict";

/*
  Build 3D glasses.
  spec properties: 
     * <string> envMapURL: url of the envMap
     * <string> frameMeshURL: url of the mesh used for the glasses frames
     * <string> lensesMeshURL: url of the mesh of the lenses
     * <string> occluderURL: url of the occluder
*/
const JeelizThreeGlassesCreator = function(spec){
  const threeGlasses = new THREE.Object3D();
  // envMap texture:
  const textureEquirec = new THREE.TextureLoader().load( spec.envMapURL );
  const textureNormal = new THREE.TextureLoader().load( spec.normalMapURL )
  textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  textureEquirec.magFilter = THREE.LinearFilter;
  textureEquirec.minFilter = THREE.LinearMipMapLinearFilter;
  let frameMat = new THREE.MeshPhysicalMaterial({
    color: 0x007084,
    metalness: 0.95,
    roughness: 0.4,
    transmission: 5,
    thickness: 5,
    reflectivity: 4,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    envMap: textureEquirec,
    envMapIntensity: 1,
  })

  // MATERIALS
  const mat_AzureBlue = new THREE.MeshPhysicalMaterial({
    color: 0x007084,
    metalness: 0.95,
    roughness: 0.3,
    transmission: 5,
    thickness: 5,
    reflectivity: 4,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    envMap: textureEquirec,
    envMapIntensity: 1,
  })
  const mat_PowerPink = new THREE.MeshPhysicalMaterial({
    color: 0xff0a54,
    metalness: 0.99,
    roughness: 0.3,
    transmission: 5,
    thickness: 5,
    reflectivity: 4,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
    envMap: textureEquirec,
    envMapIntensity: 1.5,
  })
  const mat_ClearFrost = new THREE.MeshPhysicalMaterial({
    color: 0xCCCCC2,
    metalness: 1,
    roughness: 0.3,
    transmission: 3,
    reflectivity: 55,
    ior: 55,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    envMap: textureEquirec,
    envMapIntensity: 1.5,
  })

  // LENSES
  new THREE.GLTFLoader().load(spec.lensesMeshURL, function(lenses){
    const lenseMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf0f0f0,
      metalness: 0.5,
      roughness: 0,
      transmission: 1.0,
      reflectivity: 1,
      opacity: 0.3,
      ior: 2,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: false,
      envMap: textureEquirec,
      envMapIntensity: 1,
    })
    lenses.scene.traverse((e) => {
      if (e.isMesh) e.material = lenseMaterial;
    });
    threeGlasses.add(lenses.scene);
  })

  // FRAMES
  new THREE.GLTFLoader().load(spec.frameMeshURL, function(frames){
    frames.scene.traverse((o) => {
      if (o.isMesh) o.material = frameMat;
    });
    const btns = document.querySelectorAll('.color-btn')
    btns.forEach(btn => {
      btn.addEventListener('click', function(){
        let matName = this.getAttribute('id')
        let mat = ""
        switch (matName) {
          case "AzureBlue":
            mat = mat_AzureBlue
            break;
          case "PowerPink":
            mat = mat_PowerPink
            break;
          case "ClearFrost":
            mat = mat_ClearFrost
            break;
          default:
            mat = mat_AzureBlue
            break;
        }
        frames.scene.traverse((o) => {
          if (o.isMesh) o.material = mat;
        });
      })
    })
    threeGlasses.add(frames.scene);
  })

  const occluderMesh = JeelizThreeHelper.create_threejsOccluder(spec.occluderURL);
  
  

  return {
    glasses: threeGlasses,
    occluder: occluderMesh
  };
}