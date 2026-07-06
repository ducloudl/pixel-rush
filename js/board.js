import { PALETTE } from './levels.js';

/**
 * Calculate cell size for a given grid, capped at 40px.
 */
export function getCellSize(gridSize, maxDim) {
  return Math.floor(Math.min(maxDim / gridSize, 40));
}

/**
 * 2D canvas board for Pixel Rush.
 * Renders target pattern (semi-transparent) + player grid.
 */
export class Board {
  /**
   * @param {HTMLCanvasElement} canvas - the canvas element
   * @param {number} maxDim - max canvas dimension in px (default 400)
   */
  constructor(canvas, maxDim = 400) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.maxDim = maxDim;
    this.playerGrid = [];
    this.targetGrid = [];
    this.selectedColor = 0;
    this.gridSize = 0;
    this.colors = 0;
    this.cellSize = 0;
    this.onCellChange = null;
  }

  /**
   * Initialize board for a given level.
   */
  init(levelData) {
    const { gridSize, colors, pattern } = levelData;
    this.gridSize = gridSize;
    this.colors = colors;
    this.cellSize = getCellSize(gridSize, this.maxDim);
    const totalSize = this.cellSize * gridSize;

    this.canvas.width = totalSize;
    this.canvas.height = totalSize;
    this.canvas.style.width = totalSize + 'px';
    this.canvas.style.height = totalSize + 'px';

    this.playerGrid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => null)
    );
    this.targetGrid = pattern;
    this.selectedColor = 0;
    this.render();
  }

  /**
   * Render both layers onto the canvas.
   */
  render() {
    const { ctx, cellSize, gridSize, targetGrid, playerGrid } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const x = c * cellSize;
        const y = r * cellSize;

        // Cell background
        ctx.fillStyle = '#1a1525';
        ctx.fillRect(x, y, cellSize, cellSize);

        // Target pattern (semi-transparent)
        if (targetGrid[r] && targetGrid[r][c] !== undefined) {
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = PALETTE[targetGrid[r][c]] || '#888';
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
          ctx.globalAlpha = 1.0;
        }

        // Player pixels on top
        if (playerGrid[r] && playerGrid[r][c] !== null) {
          ctx.fillStyle = PALETTE[playerGrid[r][c]] || '#888';
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        }

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }
  }

  /**
   * Set a cell color. Triggers render + callback.
   */
  setCell(row, col, colorIndex) {
    if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) return;
    this.playerGrid[row][col] = colorIndex;
    this.render();
    if (this.onCellChange) this.onCellChange(row, col, colorIndex);
  }

  /**
   * Clear all player pixels.
   */
  clear() {
    this.playerGrid = Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, () => null)
    );
    this.render();
  }

  getColorIndex() {
    return this.selectedColor;
  }

  setColorIndex(idx) {
    this.selectedColor = Math.max(0, Math.min(idx, this.colors - 1));
  }

  /**
   * Convert mouse/touch event to grid coordinates.
   */
  getCellFromEvent(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);

    if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
      return { row, col };
    }
    return null;
  }
}
