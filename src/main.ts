import Phaser from "phaser";
import SceneHudCustom from "./scenes/SceneHudCustom";
import Scene1 from "./scenes/Scene1";
import Scene2 from './scenes/Scene2';
import Scene3 from "./scenes/Scene3";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 320,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			checkCollision: {
				left: true,
				right: true,
				down: true,
				up: true
			}
		}

	},
	scene: [Scene1, Scene2, Scene3, SceneHudCustom],
};

export const game = new Phaser.Game(config);