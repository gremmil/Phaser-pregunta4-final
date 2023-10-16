import Phaser from 'phaser'
import { SceneInfo } from '../classes/SceneInfo.class';
import { AlertInfo } from '~/classes/AlertInfo';
import SceneHudCustom from './SceneHudCustom';

export default class SceneBase extends Phaser.Scene {
  public background: Phaser.GameObjects.TileSprite;
  public player: Player;
  public sceneInfo: SceneInfo;
  public timerEvent: Phaser.Time.TimerEvent;
  public sceneHud: Phaser.Scene;
  public sceneKeys: Array<string> = ['scene_1', 'scene_2', 'scene_3'];
  constructor(key) {
    super(key);
  }

  preload() {
    this.load.image('background', 'img/background_2.png');
    this.load.spritesheet('player', 'img/spritesheets/player.png', {
      frameWidth: 93,
      frameHeight: 126
    })
    this.load.spritesheet('playerBullet', 'img/spritesheets/playerBullet.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('enemyBullet', 'img/spritesheets/enemyBullet.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.audio("playerBulletAudio", "audio/playerShoot.wav");
    this.load.audio("playerKilledAudio", "audio/playerKilled.mp3");
    this.load.audio("enemyBulletAudio", "audio/enemyShoot.wav");
    this.load.audio("enemyKilledAudio", "audio/enemyKilled.wav");
  }
  create() {
    this.background = this.add.tileSprite(0, 0, 0, 0, "background");
    this.background.setPosition(this.game.canvas.width, this.game.canvas.height / 2);
    this.background.setScale(0.5); // Ajusta la escala si es necesario
    // Asegurarse de que el tileSprite se muestre completo
    //this.background.setDisplaySize(this.game.canvas.width, this.game.canvas.height);
    this.player = new Player(this, this.game.canvas.width / 2, 500, 'player');
    this.timerEvent = this.time.addEvent({
      loop: true,
      delay: 1000,
      callback: (val) => {
        if (this.sceneInfo.duration >= 1) {
          this.updateSceneInfo(this.sceneInfo);
        } else {
          this.scene.pause();
          const alertInfo: AlertInfo = {
            message: '¡Se acabo el tiempo! ¿Deseas Reiniciar el Nivel?',
            action: 'restart'
          }
          this.showAlert(alertInfo);
        }
        this.sceneInfo.duration--;
      },
    });

    this.sceneHud = this.scene.get('scene_hud_custom');
    this.sceneHud.events.destroy();
    this.sceneHud.events.on('reload', (val: number) => {
      this.scene.start('scene_1');
    }, this);

    this.sceneHud.events.on('resume', (val: number) => {
      this.scene.resume();
    }, this);

    this.sceneHud.events.on('start', (val: number) => {


    }, this);
    if (this.scene.key === this.sceneKeys[0]) {
      const alertInfo: AlertInfo = {
        message: 'Objetivo: Consigue destruir a todos los enemigos antes que el tiempo se acabe.\n Muevete con la teclas direccionales, y dispara con la Barra Espaciadora',
        action: 'resume'
      }
      this.showAlert(alertInfo);
      this.scene.pause();
    }
  };

  update(time: number, delta: number): void {
  }

  updateSceneInfo(info: SceneInfo) {
    this.events.emit('updateSceneInfo', info);
  }
  showAlert(alertInfo: AlertInfo) {
    this.events.emit('showAlert', alertInfo);
  }
}
export class Player extends Phaser.Physics.Arcade.Sprite {
  public cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  public lastFired: number = 0;
  public lives: number = 3;
  public bullets: Phaser.GameObjects.Group;
  public bulletAudio: Phaser.Sound.BaseSound;
  public killedAudio: Phaser.Sound.BaseSound;


  constructor(scene, x: number, y: number, spriteReference: string) {
    super(scene, x, y, spriteReference);
    /*  scene.sys.displayList.add(this);
     scene.sys.updateList.add(this);
     scene.sys.arcadePhysics.world.enableBody(this, 0); */
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.enableUpdate();
    this.setOrigin(0.5);
    this.setScale(0.5);
    this.setCollideWorldBounds(true);
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.anims.create({
      key: 'running',
      frames: this.anims.generateFrameNumbers(spriteReference, { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1,
    });
    this.bullets = this.scene.physics.add.group({
      classType: PlayerBullet,
      maxSize: 5,
      runChildUpdate: true,
    });
    this.bulletAudio = this.scene.sound.add("playerBulletAudio", { volume: 0.7 });
    this.killedAudio = this.scene.sound.add("playerKilledAudio", { volume: 0.7 });

  }
  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.cursorKeys.down.isDown) {
      // Lógica para mover hacia abajo
    }
    if (this.cursorKeys.up.isDown) {
      // Lógica para mover hacia arriba
    }
    if (this.cursorKeys.left.isDown) {
      // Lógica para mover hacia la izquierda
      this.setVelocityX(-100);
      this.anims.play('running', true);
      if (this.scene['background'].tilePositionX > 0) {
        this.scene['background'].tilePositionX -= 10;
      } else {
        this.setVelocityX(-200);
      }
    } else if (this.cursorKeys.right.isDown) {
      // Lógica para mover hacia la derecha
      this.setVelocityX(100);
      this.anims.play('running', true);
      if (this.scene['background'].tilePositionX < this.scene['background'].width / 2) {
        this.scene['background'].tilePositionX += 10;
      } else {
        this.setVelocityX(200);
      }
    } else {
      this.setVelocityX(0);
      this.anims.stop();
      this.anims.setCurrentFrame(this.anims.get('running').frames[0]);
    }
    if (this.cursorKeys.space.isDown && time > this.lastFired) {
      const bullet = this.bullets.get(0, 0, 'playerBullet');
      if (bullet) {
        this.bulletAudio.play()
        bullet.fire(this.x, this.y);
        this.lastFired = time + 50;
      }
    }
  }
}
export class PlayerBullet extends Phaser.Physics.Arcade.Sprite {
  public speed;
  constructor(scene, x: number, y: number, spriteReference: string) {
    super(scene, x, y, spriteReference);
    this.speed = Phaser.Math.GetSpeed(400, 1);
  }
  fire(x, y) {
    this.setPosition(x, y - 50);
    this.setActive(true);
    this.setVisible(true);
  }
  update(time, delta) {
    this.y -= this.speed * delta;
    if (this.y < 0) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }
};
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  public velocityY: number = 100;
  public velocityX: number = 100;
  public timerEvent: Phaser.Time.TimerEvent;
  public bullets: Phaser.GameObjects.Group;
  public bulletAudio: Phaser.Sound.BaseSound;
  public killedAudio: Phaser.Sound.BaseSound;
  public lastFired: number = 3000;

  constructor(scene, x: number, y: number, spriteReference: string) {
    super(scene, x, y, spriteReference);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.enableUpdate();
    this.setOrigin(0.5);
    //this.setScale(0.5);
    this.setCollideWorldBounds(true);
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.anims.create({
      key: 'animation',
      frames: this.anims.generateFrameNumbers(spriteReference, { start: 0, end: 5 }),
      frameRate: 1,
      repeat: -1,
    });
    this.anims.play('animation');

    this.bullets = this.scene.physics.add.group({
      classType: EnemyBullet,
      maxSize: 1,
      runChildUpdate: true,
    });
    this.bulletAudio = this.scene.sound.add("enemyBulletAudio", { volume: 0.7 });
    this.killedAudio = this.scene.sound.add("enemyKilledAudio", { volume: 0.7 });
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.body.velocity.y === 0) {
      if (Phaser.Math.RND.between(0, 1) === 0) {
        this.setVelocityY(-this.velocityY); // Velocidad negativa hacia arriba
      } else {
        this.setVelocityY(this.velocityY); // Velocidad positiva hacia abajo
      }
      if (this.body.velocity.x === 0) {
        // Movimiento aleatorio horizontal
        if (Phaser.Math.RND.between(0, 1) === 0) {
          this.setVelocityX(-this.velocityX); // Velocidad negativa hacia la izquierda
        } else {
          this.setVelocityX(this.velocityX); // Velocidad positiva hacia la derecha
        }
      }
    }
    // Limitar el movimiento a la mitad de la pantalla en el eje Y
    if (this.y < -100) {
      this.y = -100;
      this.setVelocityY(this.velocityY);
    } else if (this.y > this.scene.cameras.main.height / 2) {
      this.y = this.scene.cameras.main.height / 2;
      this.setVelocityY(-this.velocityY);
    } else {
      this.setVelocityY(this.body.velocity.y);
    }

    // Limitar el movimiento a los márgenes de 50 píxeles a la derecha y a la izquierda en el eje X
    if (this.x < -100) {
      this.x = -100;
      this.setVelocityX(this.velocityX);
    } else if (this.x > this.scene.cameras.main.width + 100) {
      this.x = this.scene.cameras.main.width + 100;
      this.setVelocityX(-this.velocityX);
    } else {
      this.setVelocityX(this.body.velocity.x);
    }
    if (time > this.lastFired) {
      const bullet = this.bullets.get(0, 0, 'enemyBullet');
      if (bullet) {
        this.bulletAudio.play();
        bullet.fire(this.x, this.y);
        this.lastFired = time + Phaser.Math.RND.between(5000, 10000);
      }
    }
  }
}
export class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
  public speed;
  constructor(scene, x: number, y: number, spriteReference: string) {
    super(scene, x, y, spriteReference);
    this.speed = Phaser.Math.GetSpeed(200, 1);
  }
  fire(x, y) {
    this.setPosition(x, y + 50);
    this.setActive(true);
    this.setVisible(true);
  }
  update(time, delta) {
    this.y += this.speed * delta;
    if (this.y > this.scene.game.canvas.height + 50) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }
};