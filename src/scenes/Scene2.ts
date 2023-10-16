import Phaser from 'phaser'
import { AlertInfo } from '~/classes/AlertInfo';
import SceneBase, { Enemy, EnemyBullet, Player } from './SceneBase';

export default class Scene2 extends SceneBase {
  public enemies: Phaser.GameObjects.Group;
  constructor() {
    super('scene_2');
  }

  preload() {
    this.load.spritesheet('enemy_2', 'img/spritesheets/enemy_2.png', {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  create() {
    super.create();
    this.sceneInfo = {
      lvl: 2,
      duration: 25,
      playerLives: 3,
      score: 0
    };
    this.updateSceneInfo(this.sceneInfo);
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const enemy: Enemy = this.enemies.create(x * 60 + 100, y * 60 + 100, 'enemy_2', 0);;
        this.enemyBulletsOverlapPlayer(this.player, enemy.bullets);
        this.enemyBulletsOverlapPlayerBullets(enemy.bullets, this.player.bullets);
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
      this.scene.start('scene_3');
    }, this);
  };

  update(time: number, delta: number): void {
  }
};