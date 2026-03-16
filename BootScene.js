class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    const w = this.scale.width;
    const h = this.scale.height;

    const bar = this.add.graphics();
    const border = this.add.graphics();

    border.lineStyle(2, 0xD4AF37, 1);
    border.strokeRect(w / 2 - 151, h / 2 + 20, 302, 22);

    this.load.on('progress', (value) => {
      bar.clear();
      bar.fillStyle(0xD4AF37, 1);
      bar.fillRect(w / 2 - 149, h / 2 + 22, 298 * value, 18);
    });

    // Title text
    this.add.text(w / 2, h / 2 - 20, 'THE CALLED', {
      fontFamily: 'Cinzel',
      fontSize: '28px',
      color: '#D4AF37',
      letterSpacing: 8
    }).setOrigin(0.5);

    this.add.text(w / 2, h / 2 + 60, 'carregando...', {
      fontFamily: 'IM Fell English',
      fontSize: '13px',
      color: '#888',
      fontStyle: 'italic'
    }).setOrigin(0.5);
  }

  create() {
    this._generateSprites();
    this.scene.start('IntroScene');
  }

  _generateSprites() {
    // Golden Heart — Elias's soul symbol
    const heartGfx = this.make.graphics({ x: 0, y: 0, add: false });
    heartGfx.fillStyle(0xFFD700, 1);
    // Draw heart shape with curves
    heartGfx.fillCircle(10, 8, 7);
    heartGfx.fillCircle(22, 8, 7);
    heartGfx.fillTriangle(3, 12, 29, 12, 16, 26);
    // Inner glow
    heartGfx.fillStyle(0xFFF8DC, 0.6);
    heartGfx.fillCircle(10, 7, 4);
    heartGfx.fillCircle(22, 7, 4);
    heartGfx.generateTexture('heart', 32, 28);
    heartGfx.destroy();

    // Elias sprite (simple pixel art style)
    const eliasGfx = this.make.graphics({ x: 0, y: 0, add: false });
    // Body
    eliasGfx.fillStyle(0xE8D5B7, 1); // skin
    eliasGfx.fillRect(6, 0, 12, 12); // head
    eliasGfx.fillStyle(0x3D2B1F, 1); // hair
    eliasGfx.fillRect(5, 0, 14, 5);
    eliasGfx.fillStyle(0xC8A882, 1); // robe - light
    eliasGfx.fillRect(4, 12, 16, 20);
    eliasGfx.fillStyle(0xA08060, 1); // robe shadow
    eliasGfx.fillRect(4, 24, 7, 8);
    eliasGfx.fillRect(13, 24, 7, 8);
    // Golden heart on chest
    eliasGfx.fillStyle(0xFFD700, 1);
    eliasGfx.fillRect(10, 16, 4, 4);
    eliasGfx.generateTexture('elias', 24, 32);
    eliasGfx.destroy();

    // Shadow entity (generic enemy base)
    const shadowGfx = this.make.graphics({ x: 0, y: 0, add: false });
    shadowGfx.fillStyle(0x1A1A2E, 1);
    shadowGfx.fillRect(6, 0, 12, 12);
    shadowGfx.fillRect(4, 12, 16, 20);
    shadowGfx.fillStyle(0x4A0E8F, 0.8);
    shadowGfx.fillRect(7, 3, 3, 3); // eye
    shadowGfx.fillRect(14, 3, 3, 3);
    shadowGfx.generateTexture('shadow', 24, 32);
    shadowGfx.destroy();

    // Particle / light orb
    const orbGfx = this.make.graphics({ x: 0, y: 0, add: false });
    orbGfx.fillStyle(0xFFFFFF, 1);
    orbGfx.fillCircle(4, 4, 4);
    orbGfx.generateTexture('orb', 8, 8);
    orbGfx.destroy();

    // Tile: ground
    const tileGfx = this.make.graphics({ x: 0, y: 0, add: false });
    tileGfx.fillStyle(0x2A2318, 1);
    tileGfx.fillRect(0, 0, 32, 32);
    tileGfx.lineStyle(1, 0x3A3228, 0.5);
    tileGfx.strokeRect(0, 0, 32, 32);
    tileGfx.generateTexture('tile_ground', 32, 32);
    tileGfx.destroy();
  }
}
