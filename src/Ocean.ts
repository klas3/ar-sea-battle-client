import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { PerspectiveCamera, ShaderMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water.js';

const Ocean = () => {
  const { scene, camera: threeCamera, gl: renderer } = useThree();

  const camera = threeCamera as PerspectiveCamera;

  const sun = new THREE.Vector3();

  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    alpha: 1.0,
    sunDirection: sun,
    sunColor: 0xffffff,
    waterColor: 0x1c2842,
    distortionScale: 3.7,
    fog: !!scene.fog,
  });

  water.rotation.x = -Math.PI / 2;

  scene.add(water);

  const waterMaterial = water.material as ShaderMaterial;

  // Skybox

  const sky = new Sky();
  sky.scale.setScalar(10000);
  scene.add(sky);

  const skyUniforms = sky.material.uniforms;

  skyUniforms['turbidity'].value = 10;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;

  const parameters = {
    inclination: 0.5,
    azimuth: 0.205,
  };

  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  const updateSun = () => {
    const theta = Math.PI * (parameters.inclination - 0.5);
    const phi = 2 * Math.PI * (parameters.azimuth - 0.5);

    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms['sunPosition'].value.copy(sun);
    waterMaterial.uniforms['sunDirection'].value.copy(sun).normalize();

    // @ts-ignore
    scene.environment = pmremGenerator.fromScene(sky).texture;
  };

  updateSun();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 10, 0);
  controls.minDistance = 40.0;
  controls.maxDistance = 200.0;
  controls.update();

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', onWindowResize);

  useFrame(() => {
    waterMaterial.uniforms['time'].value += 1.0 / 130.0;
    renderer.render(scene, camera);
  });

  return null;
};

export default Ocean;
