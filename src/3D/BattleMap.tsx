import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { PerspectiveCamera, ShaderMaterial } from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { mapSize, sun, sunParameters, waterConfig } from '../other/battleMapConfigs';

const BattleMap = () => {
  const { scene, camera: threeCamera, gl: renderer } = useThree();

  const camera = threeCamera as PerspectiveCamera;

  const water = useMemo(() => {
    const waterGeometry = new THREE.PlaneGeometry(mapSize, mapSize);
    const mapWater = new Water(waterGeometry, waterConfig);
    mapWater.rotation.x = -Math.PI / 2;
    scene.add(mapWater);
    return mapWater;
  }, [scene]);

  const waterMaterial = water.material as ShaderMaterial;
  const sky = useMemo(() => {
    const mapSky = new Sky();
    mapSky.scale.setScalar(mapSize);

    const skyUniforms = mapSky.material.uniforms;

    skyUniforms.turbidity.value = 10;
    skyUniforms.rayleigh.value = 2;
    skyUniforms.mieCoefficient.value = 0.005;
    skyUniforms.mieDirectionalG.value = 0.8;

    scene.add(mapSky);
    return mapSky;
  }, [scene]);

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

  useFrame(() => {
    waterMaterial.uniforms.time.value += 1.0 / 130.0;
    renderer.render(scene, camera);
  });

  useEffect(() => {
    return () => {
      scene.remove(water);
      scene.remove(sky);
    };
  }, [scene, sky, water]);

  return null;
};

export default BattleMap;
