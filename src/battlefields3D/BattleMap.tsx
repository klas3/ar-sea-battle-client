import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { PerspectiveCamera, ShaderMaterial } from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { mapSize, sun, sunParameters, waterConfig } from '../other/battleMapConfigs';

const BattleMap = () => {
  const { scene, camera: threeCamera, gl: renderer } = useThree();

  const camera = threeCamera as PerspectiveCamera;

  const waterGeometry = new THREE.PlaneGeometry(mapSize, mapSize);

  const water = new Water(waterGeometry, waterConfig);

  water.rotation.x = -Math.PI / 2;

  scene.add(water);

  const waterMaterial = water.material as ShaderMaterial;

  const sky = new Sky();
  sky.scale.setScalar(mapSize);
  scene.add(sky);

  const skyUniforms = sky.material.uniforms;

  skyUniforms.turbidity.value = 10;
  skyUniforms.rayleigh.value = 2;
  skyUniforms.mieCoefficient.value = 0.005;
  skyUniforms.mieDirectionalG.value = 0.8;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  const updateSun = () => {
    const theta = Math.PI * (sunParameters.inclination - 0.5);
    const phi = 2 * Math.PI * (sunParameters.azimuth - 0.5);

    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms.sunPosition.value.copy(sun);
    waterMaterial.uniforms.sunDirection.value.copy(sun).normalize();

    // @ts-ignore
    scene.environment = pmremGenerator.fromScene(sky).texture;
  };

  updateSun();

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', onWindowResize);

  useFrame(() => {
    waterMaterial.uniforms.time.value += 1.0 / 130.0;
    renderer.render(scene, camera);
  });

  return null;
};

export default BattleMap;
