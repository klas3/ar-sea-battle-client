import { connect } from 'react-redux';
import React from 'react';
// @ts-ignore
import { AFrameRenderer, Marker } from 'react-web-ar';
import { arCoordsСoefficient } from '../other/constants';
import { ShipConfig } from '../other/types';
import { RootState } from '../redux/store';

interface IProps {
  shipsConfigs: ShipConfig[];
  planes: THREE.Mesh[];
}

class FriendlyARBattlefield extends React.Component<IProps> {
  private scene: any;

  componentWillUnmount() {
    this.scene.renderer.dispose();
    const videos = document.querySelectorAll('[id=arjs-video]');
    if (videos.length) {
      videos.forEach((video) => video.remove());
    }
  }

  getRenderedShips() {
    const { shipsConfigs } = this.props;
    const renderedShips = shipsConfigs.map((config, index) => {
      const position = `${config.position[0] / arCoordsСoefficient} ${0} ${
        config.position[2] / arCoordsСoefficient
      }`;
      const [scaleX, scaleY, scaleZ] = config.scale;
      const scale = `${scaleX / arCoordsСoefficient} ${scaleY / arCoordsСoefficient} ${
        scaleZ / arCoordsСoefficient
      }`;
      const rotation = `0 ${config.rotation} 0`;
      return (
        // @ts-ignore
        <a-entity
          key={index}
          gltf-model={config.path}
          position={position}
          scale={scale}
          rotation={rotation}
        />
      );
    });
    return renderedShips;
  }

  getRenderedPlanes() {
    const { planes } = this.props;
    const renderedPlanes = planes.map((plane) => {
      const { index } = plane.userData;
      const { x, z } = plane.position;
      const position = `${x / arCoordsСoefficient} ${0} ${z / arCoordsСoefficient}`;
      return (
        // @ts-ignore
        <a-box
          material="transparent: true; opacity: 0.2"
          key={index}
          position={position}
          depth="0.2"
          height="0.01"
          width="0.2"
        />
      );
    });
    return renderedPlanes;
  }

  render() {
    const renderedShips = this.getRenderedShips();
    return (
      <AFrameRenderer
        arToolKit={{ debugUIEnabled: false, sourceType: 'webcam' }}
        getSceneRef={(ref: any) => (this.scene = ref)}
      >
        <Marker parameters={{ preset: 'hiro' }}>
          {/* @ts-ignore */}
          <a-entity
            gltf-model="models/sea.glb"
            scale="0.013 0.013 0.013"
            position="0.2 -0.1 -0.2"
          />
          {renderedShips}
        </Marker>
      </AFrameRenderer>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  shipsConfigs: state.ships.configs,
  planes: state.ships.planes,
});

export default connect(mapStateToProps)(FriendlyARBattlefield);
