import { Board } from './board.js';
import { GameState } from './state.js';
import { UIManager } from './ui.js';
import { Timer } from './timer.js';
import { calculateMatch } from './score.js';
import { generateLevel, getPattern } from './levels.js';

export class App {
  constructor() {
    this.board = null;
    this.state = new GameState();
    this.ui = new UIManager();
    this.timer = null;
    this.canvas = document.getElementById('gameCanvas');
  }

  async init() {
    // Build initial palette (will be rebuilt per level)
    this.ui.buildPalette(9, (idx) => {
      if (this.board) this.board.setColorIndex(idx);
    });

    // Wire button callbacks
    this.ui.on('start', () => this.startGame());
    this.ui.on('clear', () => this.clearBoard());
    this.ui.on('next', () => this.startLevel());
    this.ui.on('hint', () => this.showHint());

    // Canvas input handling
    this.canvas.addEventListener('mousedown', (e) => this._handleInput(e));
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._handleInput(e);
    });

    this.ui.showScreen('start');
  }

  startGame() {
    this.state.startGame();
    this.startLevel();
  }

  startLevel() {
    const levelNum = this.state.currentLevel;
    const lvl = generateLevel(levelNum);
    lvl.pattern = getPattern(levelNum);
    this.state.levelData = lvl;

    this.board = new Board(this.canvas);
    this.board.init(lvl);
    this.board.onCellChange = () => this._checkProgress();

    // Rebuild palette for this level's color count
    this.ui.buildPalette(lvl.colors, (idx) => {
      this.board.setColorIndex(idx);
    });

    this.ui.showScreen('game');

    // Start countdown timer
    this.timer = new Timer(
      (timeLeft) => this.ui.updateStats(levelNum, timeLeft, lvl.time, this.state.totalScore),
      () => this._handleTimeout()
    );
    this.timer.start(lvl.time);
  }

  _handleInput(e) {
    if (!this.board) return;
    const cell = this.board.getCellFromEvent(e);
    if (cell) {
      this.board.setCell(cell.row, cell.col, this.board.getColorIndex());
    }
  }

  _checkProgress() {
    if (!this.board || !this.state.levelData) return;
    const match = calculateMatch(this.board.playerGrid, this.state.levelData.pattern);
    if (match >= 80) {
      this._handleLevelComplete(match);
    }
  }

  _handleLevelComplete(match) {
    this.timer.stop();
    const timeRatio = this.timer.getTimeLeft() / this.state.levelData.time;
    const bonus = Math.max(0, Math.round(timeRatio * 50));
    const levelScore = match + bonus;
    this.state.addScore(levelScore);

    const hasNext = this.state.advanceLevel();
    if (hasNext) {
      this.ui.showResult(
        'Level Complete! 🎉',
        match,
        () => this.startLevel()
      );
    } else {
      this.ui.showResult(
        '🏆 You Won! All Levels Complete!',
        match,
        null
      );
    }
  }

  _handleTimeout() {
    const match = calculateMatch(
      this.board?.playerGrid || [],
      this.state.levelData?.pattern || []
    );
    if (match >= 80) return;

    this.ui.showResult(
      'Time\'s Up! ⏰',
      match,
      () => this.retryLevel()
    );
  }

  retryLevel() {
    this.state.resetLevel();
    this.startLevel();
  }

  clearBoard() {
    if (this.board) this.board.clear();
  }

  showHint() {
    if (!this.board || !this.state.levelData) return;
    const mismatches = [];
    const { playerGrid, gridSize } = this.board;
    const target = this.state.levelData.pattern;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (playerGrid[r][c] !== target[r][c]) {
          mismatches.push([r, c]);
        }
      }
    }
    if (mismatches.length > 0) {
      const [r, c] = mismatches[Math.floor(Math.random() * mismatches.length)];
      this.board.setCell(r, c, target[r][c]);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
