import { AlertInfo, AlertInfoAction } from "~/classes/AlertInfo";
import { SceneInfo } from "~/classes/SceneInfo.class";
import { Scene } from "phaser";

export default class SceneHudCustom extends Phaser.Scene {
  public scoreInfo: Phaser.GameObjects.Text;
  public timeInfo: Phaser.GameObjects.Text;
  public authorInfo: Phaser.GameObjects.Text;
  public playerLivesInfo: Phaser.GameObjects.Text;
  public lvlInfo: Phaser.GameObjects.Text;
  private popupBackground!: Phaser.GameObjects.Rectangle;
  private alertText!: Phaser.GameObjects.Text;
  private closeActionButton!: Phaser.GameObjects.Text;
  private currentAction: AlertInfoAction;
  public sceneKeys: Array<string> = ['scene_1', 'scene_2', 'scene_3'];
  public currentScene: Phaser.Scene;



  constructor() {
    super({ key: 'scene_hud_custom', active: true });

  }

  create() {
    this.scoreInfo = this.add.text(10, 10, 'Score: 0', { font: '16px Arial', color: '#fff' });
    this.timeInfo = this.add.text(this.game.canvas.width - 75, 10, 'Time: 0', { font: '16px Arial', color: '#fff', wordWrap: { width: 100 } });
    this.authorInfo = this.add.text(10, this.game.canvas.height - 20, 'MIGUEL ANGEL HUANACCHIR CASTILLO U17100659 EX FINAL', { font: '10px Arial', color: '#fff' });
    this.lvlInfo = this.add.text(this.game.canvas.width / 2 - 15, 10, 'Level 1', { font: '16px Arial', color: '#fff' });
    this.playerLivesInfo = this.add.text(10, this.game.canvas.height - 60, 'Lives', { font: '16px Arial', color: '#fff' });

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.popupBackground = this.add.rectangle(centerX, centerY, this.cameras.main.width + 50, 200, 0x000000);
    this.popupBackground.setStrokeStyle(4, 0xffffff);
    this.popupBackground.setDepth(1);

    this.alertText = this.add.text(centerX, centerY - 40, 'Mensaje de alerta', {
      font: '16px Arial',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: this.cameras.main.width, useAdvancedWrap: true }
    });
    this.alertText.setOrigin(0.5);
    this.alertText.setDepth(2);

    this.closeActionButton = this.add.text(centerX, centerY + 40, 'OK', {
      font: '16px Arial',
      color: '#ffffff'
    });
    this.closeActionButton.setOrigin(0.5);
    this.closeActionButton.setDepth(2);
    this.closeActionButton.setInteractive();

    this.closeActionButton.on('pointerup', () => {
      this.hideAlert();
      this.events.emit(this.currentAction);
    });
    const scenes = this.game.scene.scenes;
    scenes.forEach((scene: Phaser.Scene) => {
      if (scene instanceof Scene) {
        scene.events.on('updateSceneInfo', ({ score, duration, lvl, playerLives }: SceneInfo) => {
          this.scoreInfo.setText(`Score: ${score}`);
          this.timeInfo.setText(`Time: ${duration}`);
          this.lvlInfo.setText(`Level ${lvl}`);
          this.playerLivesInfo.setText(`Lives ${playerLives}`);

        });
        scene.events.on('showAlert', (info: AlertInfo): void => {
          const { action, message } = info;
          this.currentAction = action;
          this.showAlert(message);
        });
      }
    });

    this.hideAlert();
  }

  ready() {

  }

  showAlert(message: string) {
    this.popupBackground.setVisible(true);
    this.alertText.setText(message);
    this.alertText.setVisible(true);
    this.closeActionButton.setVisible(true);
  }

  hideAlert() {
    this.popupBackground.setVisible(false);
    this.alertText.setVisible(false);
    this.closeActionButton.setVisible(false);
  }
  update(time: number, delta: number): void {
  }
}
