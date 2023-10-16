import Phaser from 'phaser'
import { SceneInfo } from '../classes/SceneInfo.class';
import { AlertInfo } from '~/classes/AlertInfo';
import SceneBase, { Enemy, EnemyBullet, Player } from './SceneBase';

export default class Scene1 extends SceneBase {
  public enemies: Phaser.GameObjects.Group;
  constructor() {
    super('scene_1');
  }

  preload() {
    super.preload();
    this.load.spritesheet('enemy_1', 'img/spritesheets/enemy_1.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  create() {
    super.create();
    this.sceneInfo = new SceneInfo();
    this.updateSceneInfo(this.sceneInfo);
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const enemy: Enemy = this.enemies.create(x * 60 + 100, y * 60 + 100, 'enemy_1', 0);;
        this.physics.add.overlap(this.player, enemy.bullets, (player: Player, bullet: EnemyBullet) => {
          bullet.destroy();
          player.killedAudio.play();
        })
      }
    };
    this.physics.add.overlap(this.player.bullets, this.enemies, (bullet, enemy: Enemy) => {
      const { score } = this.sceneInfo;
      this.sceneInfo = { ...this.sceneInfo, score: score + 10 }
      this.updateSceneInfo(this.sceneInfo);
      enemy.killedAudio.play()
      enemy.destroy();
      bullet.destroy();
      if (this.enemies.getLength() == 0) {
        let alertInfo: AlertInfo = {
          message: '¡Bien Hecho! ¿Siguiente Nivel?',
          action: 'next'
        };
        this.scene.pause();
        this.showAlert(alertInfo);
      }
    });
    this.sceneHud.events.on('restart', (val: number) => {
      this.scene.restart();
    }, this);
    this.sceneHud.events.on('next', (val: number) => {
      this.scene.start('scene_2');
    }, this);
  };

  update(time: number, delta: number): void {
  }
}