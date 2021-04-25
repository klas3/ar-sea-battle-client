import { connect } from 'react-redux';
import React from 'react';
import { arCoordsСoefficient } from '../other/constants';
// @ts-ignore
import { AFrameRenderer, Marker } from 'react-web-ar';
import gameService from '../services/gameService';
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
    const renderedShips = gameService.ships.map((ship) => {
      const shipConfig = shipsConfigs[ship.userData.index];
      const { x, z } = ship.position;
      const position = `${x / arCoordsСoefficient} ${0} ${z / arCoordsСoefficient}`;
      const [scaleX, scaleY, scaleZ] = shipConfig.scale;
      const scale = `${scaleX / arCoordsСoefficient} ${scaleY / arCoordsСoefficient} ${
        scaleZ / arCoordsСoefficient
      }`;
      const rotation = `0 ${shipConfig.rotation} 0`;
      return (
        // @ts-ignore
        <a-entity
          key={ship.userData.index}
          gltf-model={shipConfig.path}
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
    const renderedPlanes = this.getRenderedPlanes();
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
          {renderedPlanes}
          {renderedShips}
        </Marker>
      </AFrameRenderer>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  shipsConfigs: state.shipsConfigs,
  planes: state.planes,
});

export default connect(mapStateToProps)(FriendlyARBattlefield);
