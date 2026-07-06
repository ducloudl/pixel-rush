export class GameState {
  constructor() {
    this.currentLevel = 1;
    this.totalScore = 0;
    this.maxLevel = 10;
    this.isPlaying = false;
    this.levelData = null;
  }

  startGame() {
    this.currentLevel = 1;
    this.totalScore = 0;
    this.isPlaying = true;
  }

  advanceLevel() {
    this.currentLevel++;
    if (this.currentLevel > this.maxLevel) {
      this.isPlaying = false;
      return false;
    }
    return true;
  }

  addScore(points) {
    this.totalScore += points;
  }

  resetLevel() {
    this.levelData = null;
  }
}
