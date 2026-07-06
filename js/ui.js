import { PALETTE } from './levels.js';

export class UIManager {
  constructor() {
    this.screens = {
      start: document.getElementById('startScreen'),
      game: document.getElementById('gameScreen'),
      result: document.getElementById('resultScreen'),
    };
    this.elements = {
      level: document.getElementById('levelDisplay'),
      timer: document.getElementById('timerDisplay'),
      score: document.getElementById('scoreDisplay'),
      resultTitle: document.getElementById('resultTitle'),
      resultScore: document.getElementById('resultScore'),
      palette: document.getElementById('palette'),
    };
    this.buttons = {
      start: document.getElementById('startBtn'),
      next: document.getElementById('nextBtn'),
      clear: document.getElementById('clearBtn'),
      hint: document.getElementById('hintBtn'),
    };
    this._callbacks = {};
    this._bindButtons();
  }

  _bindButtons() {
    this.buttons.start?.addEventListener('click', () => this._emit('start'));
    this.buttons.next?.addEventListener('click', () => this._emit('next'));
    this.buttons.clear?.addEventListener('click', () => this._emit('clear'));
    this.buttons.hint?.addEventListener('click', () => this._emit('hint'));
  }

  _emit(event) {
    if (this._callbacks[event]) this._callbacks[event]();
  }

  on(event, callback) {
    this._callbacks[event] = callback;
  }

  showScreen(name) {
    Object.values(this.screens).forEach(s => s?.classList.add('hidden'));
    this.screens[name]?.classList.remove('hidden');
  }

  updateStats(level, timeLeft, timeTotal, score) {
    this.elements.level.textContent = `Level ${level}`;
    this.elements.timer.textContent = timeLeft;
    const pct = Math.max(0, timeLeft / timeTotal);
    this.elements.timer.style.color = pct < 0.2 ? 'var(--danger)' : 'var(--text)';
    this.elements.score.textContent = score;
  }

  buildPalette(colors, onColorSelect) {
    if (!this.elements.palette) return;
    this.elements.palette.innerHTML = '';
    for (let i = 0; i < colors; i++) {
      const btn = document.createElement('button');
      btn.className = 'color-swatch';
      btn.style.background = PALETTE[i % PALETTE.length];
      btn.style.border = i === 0 ? '2px solid white' : '2px solid transparent';
      btn.dataset.index = i;
      btn.addEventListener('click', () => {
        this.elements.palette.querySelectorAll('.color-swatch').forEach(s => {
          s.style.borderColor = 'transparent';
        });
        btn.style.borderColor = 'white';
        onColorSelect(i);
      });
      this.elements.palette.appendChild(btn);
    }
  }

  showResult(title, matchPercent, onNext) {
    this.elements.resultTitle.textContent = title;
    this.elements.resultScore.textContent = `Match: ${matchPercent}%`;
    this.elements.resultScore.style.color =
      matchPercent >= 80 ? 'var(--success)' :
      matchPercent >= 50 ? 'var(--warning)' : 'var(--danger)';

    if (onNext) {
      this.buttons.next.onclick = onNext;
      this.buttons.next.style.display = '';
    } else {
      this.buttons.next.style.display = 'none';
    }
    this.showScreen('result');
  }
}
