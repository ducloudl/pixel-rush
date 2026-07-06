/**
 * Countdown timer with start/pause/resume/reset.
 */
export class Timer {
  /**
   * @param {function(number): void} onTick  - called each second with remaining time
   * @param {function(): void} onComplete    - called when time reaches 0
   */
  constructor(onTick, onComplete) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this._interval = null;
    this._timeLeft = 0;
    this._paused = false;
  }

  start(duration) {
    this.reset(duration);
    this._paused = false;
    this._interval = setInterval(() => {
      this._timeLeft--;
      this.onTick(this._timeLeft);
      if (this._timeLeft <= 0) {
        this.stop();
        this.onComplete();
      }
    }, 1000);
  }

  pause() {
    this._paused = true;
    clearInterval(this._interval);
    this._interval = null;
  }

  resume() {
    if (this._paused && this._timeLeft > 0) {
      this._paused = false;
      this._interval = setInterval(() => {
        this._timeLeft--;
        this.onTick(this._timeLeft);
        if (this._timeLeft <= 0) {
          this.stop();
          this.onComplete();
        }
      }, 1000);
    }
  }

  reset(duration) {
    this.stop();
    this._timeLeft = duration;
    this.onTick(this._timeLeft);
  }

  stop() {
    clearInterval(this._interval);
    this._interval = null;
    this._paused = false;
  }

  getTimeLeft() {
    return this._timeLeft;
  }

  isRunning() {
    return this._interval !== null && !this._paused;
  }
}
