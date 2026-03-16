class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.cameras.main.setBackgroundColor('#050305');
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Background subtle cross pattern
    this._drawBackground(w, h);

    // Ambient particles
    this._spawnParticles(w, h);

    // Divider lines
    const line1 = this.add.graphics();
    line1.lineStyle(1, 0xD4AF37, 0.4);
    line1.lineBetween(w * 0.2, h * 0.35, w * 0.8, h * 0.35);
    line1.lineBetween(w * 0.2, h * 0.72, w * 0.8, h * 0.72);

    // Small cross ornament top
    this._drawCross(w / 2, h * 0.18, 18, 0xD4AF37, 0.6);

    // Title
    const titleShadow = this.add.text(w / 2 + 2, h * 0.26 + 2, 'THE CALLED', {
      fontFamily: 'Cinzel',
      fontSize: '36px',
      color: '#000',
    }).setOrigin(0.5).setAlpha(0.5);

    const title = this.add.text(w / 2, h * 0.26, 'THE CALLED', {
      fontFamily: 'Cinzel',
      fontSize: '36px',
      color: '#D4AF37',
      letterSpacing: 6
    }).setOrigin(0.5).setAlpha(0);

    const subtitle = this.add.text(w / 2, h * 0.32, 'uma jornada de misericórdia', {
      fontFamily: 'IM Fell English',
      fontSize: '14px',
      color: '#8A7A5A',
      fontStyle: 'italic'
    }).setOrigin(0.5).setAlpha(0);

    // Fade in title
    this.tweens.add({ targets: title, alpha: 1, duration: 1200, delay: 200 });
    this.tweens.add({ targets: subtitle, alpha: 1, duration: 1200, delay: 600 });

    // Heart icon
    const heart = this.add.image(w / 2, h * 0.52, 'heart')
      .setScale(2.5).setAlpha(0).setTint(0xD4AF37);
    this.tweens.add({ targets: heart, alpha: 0.8, duration: 1000, delay: 900 });
    this.tweens.add({
      targets: heart, scaleX: 2.7, scaleY: 2.7,
      duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 1200
    });

    // Menu options
    const menuItems = [
      { label: 'NOVA JORNADA', key: 'new_game' },
      { label: 'CONTINUAR',    key: 'continue' },
    ];

    const menuY = h * 0.63;
    const menuObjs = [];

    menuItems.forEach((item, i) => {
      const btn = this.add.text(w / 2, menuY + i * 44, item.label, {
        fontFamily: 'Cinzel',
        fontSize: '16px',
        color: '#C8A870',
        letterSpacing: 3
      }).setOrigin(0.5).setAlpha(0).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => {
        this.tweens.add({ targets: btn, scaleX: 1.08, scaleY: 1.08, duration: 150 });
        btn.setColor('#FFD700');
      });
      btn.on('pointerout', () => {
        this.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 150 });
        btn.setColor('#C8A870');
      });
      btn.on('pointerdown', () => this._onMenuSelect(item.key));

      this.tweens.add({ targets: btn, alpha: 1, duration: 800, delay: 1200 + i * 200 });
      menuObjs.push(btn);
    });

    // Version
    this.add.text(w / 2, h - 16, 'v0.1 — The Beginning', {
      fontFamily: 'IM Fell English',
      fontSize: '11px',
      color: '#333',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Keyboard nav
    this._selectedIndex = 0;
    this._menuObjs = menuObjs;
    this._menuKeys = menuItems.map(m => m.key);

    const cursors = this.input.keyboard.createCursorKeys();
    const enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    cursors.down.on('down', () => this._moveMenu(1, menuObjs));
    cursors.up.on('down', () => this._moveMenu(-1, menuObjs));
    enter.on('down', () => this._onMenuSelect(this._menuKeys[this._selectedIndex]));
    space.on('down', () => this._onMenuSelect(this._menuKeys[this._selectedIndex]));

    this._updateMenuHighlight(menuObjs);
  }

  _moveMenu(dir, objs) {
    this._selectedIndex = Phaser.Math.Clamp(this._selectedIndex + dir, 0, objs.length - 1);
    this._updateMenuHighlight(objs);
  }

  _updateMenuHighlight(objs) {
    objs.forEach((o, i) => {
      o.setColor(i === this._selectedIndex ? '#FFD700' : '#C8A870');
    });
  }

  _onMenuSelect(key) {
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (key === 'new_game') {
        // TODO: start GameScene / village
        this.scene.start('IntroScene'); // placeholder
      } else if (key === 'continue') {
        // TODO: load save
        this.scene.start('IntroScene');
      }
    });
  }

  _drawBackground(w, h) {
    const bg = this.add.graphics();
    // Subtle gradient feel via layered rects
    bg.fillStyle(0x0A0608, 1);
    bg.fillRect(0, 0, w, h);
    // Center glow
    bg.fillStyle(0x1A0F0A, 1);
    bg.fillEllipse(w / 2, h / 2, w * 0.8, h * 0.6);
  }

  _drawCross(x, y, size, color, alpha) {
    const g = this.add.graphics();
    g.lineStyle(2, color, alpha);
    g.lineBetween(x, y - size, x, y + size);
    g.lineBetween(x - size * 0.6, y - size * 0.2, x + size * 0.6, y - size * 0.2);
  }

  _spawnParticles(w, h) {
    for (let i = 0; i < 14; i++) {
      const px = Phaser.Math.Between(10, w - 10);
      const py = Phaser.Math.Between(10, h - 10);
      const p = this.add.image(px, py, 'orb')
        .setAlpha(0)
        .setScale(Phaser.Math.FloatBetween(0.15, 0.45))
        .setTint(Phaser.Math.RND.pick([0xD4AF37, 0xC8A882, 0xFFFFAA]))
        .setDepth(1);

      this.tweens.add({
        targets: p,
        alpha: Phaser.Math.FloatBetween(0.05, 0.25),
        y: py - Phaser.Math.Between(15, 45),
        duration: Phaser.Math.Between(3000, 8000),
        delay: Phaser.Math.Between(0, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }
}
