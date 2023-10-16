export default class Scene_Hud extends Phaser.Scene {
  public score: number;
  public scoreInfo: Phaser.GameObjects.Text;
  public timeInfo: Phaser.GameObjects.Text;
  public authorInfo: Phaser.GameObjects.Text;
  public playerLivesInfo: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'scene_hud', active: true });
    this.score = 0;
  }

  create() {
    //  Our Text object to display the Score
    this.scoreInfo = this.add.text(10, 10, 'Score: 0', { font: '16px Arial', color: '#fff' });
    this.timeInfo = this.add.text(this.game.canvas.width - 75, 10, 'Time: 0', { font: '16px Arial', color: '#fff', wordWrap: { width: 100 } });
    this.authorInfo = this.add.text(10, this.game.canvas.height - 20, 'AUTHOR: MIGUEL ANGEL HUANACCHIR CASTILLO U17100659', { font: '10px Arial', color: '#fff' });
    //  Grab a reference to the Game Scene
    let scene: Phaser.Scene = this.scene.get('scene_1');
    //  Listen for events from it
    scene.events.on('updateScore', (val: number) => {
      this.score = this.score + val;
      this.scoreInfo.setText(`Score: ${this.score}`);
    }, this);
    scene.events.on('updateTime', (val: number) => {
      this.timeInfo.setText(`Time: ${val}`);

    }, this);
  }

  update(time: number, delta: number): void {
  }
}