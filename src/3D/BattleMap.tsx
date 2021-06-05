import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Mesh,
  PerspectiveCamera,
  PlaneBufferGeometry,
  PlaneGeometry,
  PMREMGenerator,
  ShaderMaterial,
} from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { useAppDispatch } from '../hooks/reduxHooks';
import { cloudMaterial, mapSize, sun, sunParameters, waterConfig } from '../other/battleMapConfigs';

const BattleMap = () => {
  const { scene, camera: threeCamera, gl: renderer } = useThree();
  const camera = threeCamera as PerspectiveCamera;

  const dispatch = useAppDispatch();

  const water = useMemo(() => {
    const waterGeometry = new PlaneGeometry(mapSize, mapSize);
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
    skyUniforms.rayleigh.value = 3;
    skyUniforms.mieCoefficient.value = 0.005;
    skyUniforms.mieDirectionalG.value = 0.7;

    scene.add(mapSky);
    return mapSky;
  }, [scene]);

  renderer.toneMappingExposure = 1;
  renderer.setClearColor(0x000000, 1);

  const pmremGenerator = new PMREMGenerator(renderer);

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
    waterMaterial.uniforms.time.value += 1.0 / 100.0;
  });

  useEffect(() => {
    const cloudGeo = new PlaneBufferGeometry(2000, 2000);
    let cloud = new Mesh(cloudGeo, cloudMaterial);
    cloud.position.set(0, 200, 0);
    cloud.rotation.x = 1.555;
    cloud.rotation.z = Math.random() * 360;
    // @ts-ignore
    cloud.material.opacity = 0.13;
    scene.add(cloud);
    renderer.setPixelRatio(window.devicePixelRatio);

    return () => {
      scene.remove(water);
      scene.remove(sky);
    };
  }, [scene, sky, water, camera, dispatch, renderer]);

  return null;
};

export default BattleMap;
