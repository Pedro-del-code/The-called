class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
    this._lines = [];
    this._lineIndex = 0;
    this._charIndex = 0;
    this._phase = 'opening'; // opening | silence | voice | heart | end
    this._timer = null;
    this._canSkip = false;
    this._particles = [];
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    // Black bg
    this.cameras.main.setBackgroundColor('#000000');

    // Vignette overlay
    const vignette = this.add.graphics();
    const grad = this.textures.createCanvas('vignette_tex', w, h);
    const ctx = grad.getContext();
    const radGrad = ctx.createRadialGradient(w/2, h/2, h*0.2, w/2, h/2, h*0.75);
    radGrad.addColorStop(0, 'rgba(0,0,0,0)');
    radGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, w, h);
    grad.refresh();
    this.add.image(w/2, h/2, 'vignette_tex').setDepth(10);

    // Ambient particles
    this._spawnParticles();

    // Text container
    this._textObj = this.add.text(w / 2, h / 2, '', {
      fontFamily: 'IM Fell English',
      fontSize: '18px',
      color: '#E8E0CC',
      align: 'center',
      wordWrap: { width: w * 0.75 },
      lineSpacing: 10
    }).setOrigin(0.5).setAlpha(0).setDepth(5);

    // Heart (hidden at first)
    this._heart = this.add.image(w / 2, h / 2, 'heart')
      .setScale(0).setAlpha(0).setDepth(6);

    // Skip hint
    this._skipHint = this.add.text(w / 2, h - 30, 'toque para continuar', {
      fontFamily: 'IM Fell English',
      fontSize: '12px',
      color: '#555',
      fontStyle: 'italic'
    }).setOrigin(0.5).setAlpha(0).setDepth(11);

    this.tweens.add({
      targets: this._skipHint,
      alpha: 0.7,
      delay: 2000,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // Input
    this.input.on('pointerdown', () => this._onTap());
    this.input.keyboard.on('keydown', () => this._onTap());

    // Start after brief pause
    this.time.delayedCall(800, () => {
      this._startPhase('opening');
    });
  }

  _spawnParticles() {
    const w = this.scale.width;
    const h = this.scale.height;

    for (let i = 0; i < 18; i++) {
      const x = Phaser.Math.Between(20, w - 20);
      const y = Phaser.Math.Between(20, h - 20);
      const p = this.add.image(x, y, 'orb')
        .setAlpha(0)
        .setScale(Phaser.Math.FloatBetween(0.2, 0.6))
        .setTint(Phaser.Math.RND.pick([0xD4AF37, 0xFFFFFF, 0xC8A882]))
        .setDepth(2);

      this.tweens.add({
        targets: p,
        alpha: { from: 0, to: Phaser.Math.FloatBetween(0.1, 0.4) },
        y: y - Phaser.Math.Between(20, 60),
        duration: Phaser.Math.Between(3000, 7000),
        delay: Phaser.Math.Between(0, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  _startPhase(phase) {
    this._phase = phase;

    if (phase === 'opening') {
      this._lines = [...LORE.intro.opening];
      this._showLines(0xE8E0CC, () => this._startPhase('silence'));

    } else if (phase === 'silence') {
      // Fade out text, pause
      this.tweens.add({
        targets: this._textObj,
        alpha: 0,
        duration: 800,
        onComplete: () => {
          this.time.delayedCall(1200, () => this._startPhase('voice'));
        }
      });

    } else if (phase === 'voice') {
      this._lines = [...LORE.intro.voice];
      this._textObj.setColor('#D4AF37').setFontStyle('italic');
      this._showLines(0xD4AF37, () => this._startPhase('heart'));

    } else if (phase === 'heart') {
      this.tweens.add({
        targets: this._textObj,
        alpha: 0,
        duration: 600,
        onComplete: () => this._showHeart()
      });

    } else if (phase === 'end') {
      this._canSkip = true;
      this.time.delayedCall(1500, () => {
        this._goToMenu();
      });
    }
  }

  _showLines(color, onDone) {
    this._lineIndex = 0;
    this._showNextLine(onDone);
  }

  _showNextLine(onDone) {
    if (this._lineIndex >= this._lines.length) {
      this.time.delayedCall(1000, () => onDone());
      return;
    }

    const line = this._lines[this._lineIndex];
    this._typewriterText(line, () => {
      this.time.delayedCall(1400, () => {
        this._lineIndex++;
        // Fade text between lines
        this.tweens.add({
          targets: this._textObj,
          alpha: 0,
          duration: 400,
          onComplete: () => {
            this._textObj.setText('');
            this._showNextLine(onDone);
          }
        });
      });
    });
  }

  _typewriterText(fullText, onDone) {
    let current = '';
    let i = 0;

    this._textObj.setText('').setAlpha(1);

    const timer = this.time.addEvent({
      delay: 55,
      repeat: fullText.length - 1,
      callback: () => {
        current += fullText[i];
        this._textObj.setText(current);
        i++;
        if (i >= fullText.length) {
          timer.remove();
          if (onDone) onDone();
        }
      }
    });
  }

  _showHeart() {
    const w = this.scale.width;
    const h = this.scale.height;

    // Light burst
    const burst = this.add.graphics().setDepth(4);
    burst.fillStyle(0xD4AF37, 0.15);
    burst.fillCircle(w / 2, h / 2, 120);

    this.tweens.add({
      targets: burst,
      alpha: 0,
      scaleX: 3,
      scaleY: 3,
      duration: 1200,
      ease: 'Expo.easeOut'
    });

    // Heart appear
    this._heart.setPosition(w / 2, h / 2);
    this.tweens.add({
      targets: this._heart,
      alpha: 1,
      scaleX: 3,
      scaleY: 3,
      duration: 900,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Pulse
        this.tweens.add({
          targets: this._heart,
          scaleX: 3.2,
          scaleY: 3.2,
          duration: 600,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        this._startPhase('end');
      }
    });
  }

  _onTap() {
    if (this._canSkip || this._phase === 'end') {
      this._goToMenu();
    }
  }

  _goToMenu() {
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MainMenuScene');
    });
  }
}
