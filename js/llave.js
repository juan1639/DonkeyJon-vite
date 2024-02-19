import { settings } from "./main.js";
import { Scroll } from './scroll.js';

// ============================================================================
export class Llave {

    static ini_suelo = Scroll.resolucion[1] - Scroll.bsy * 2;
    static gap = Scroll.bsy * 6;
    static gapMini = Scroll.bsy * 2;

    static array_llaves = [
        ['./img/keyYellow.png', 29 * Scroll.bsx, this.ini_suelo - this.gap * 3, true],
        ['./img/keyYellow.png', 54 * Scroll.bsx, this.ini_suelo - this.gap * 6, true],
        ['./img/keyYellow.png', 29 * Scroll.bsx, this.ini_suelo - this.gap * 3, true]
    ];

    // -----------------------------------------------------------------------
    constructor(args) {

        this.anchoTile = settings.constante.bsx;
        this.altoTile = settings.constante.bsy;
        this.id = args[0];

        this.ctx = settings.ctx;
        this.img = new Image();
        this.img.src = this.id;

        this.accion = args[3];
        this.accion_realizada = false;

        this.rect = {
            x: args[1],
            y: args[2],
            ancho: this.anchoTile * 2,
            alto: this.altoTile * 2
        }

        this.rect.y -= this.rect.alto;

        this.clip = {
            x: 0,
            y: 0,
            ancho: 128,
            alto: 90
        }
    }

    dibuja(dxdy) {

        if (this.accion_realizada) {
            this.rect.x = 0;
            this.rect.y = 0;

        } else {

            this.rect.x += dxdy[0];
            this.rect.y += dxdy[1];
        }
        
        const cw = this.clip.ancho;
        const ch = this.clip.alto;

        this.ctx.drawImage(this.img, this.clip.x, this.clip.y, cw, ch, this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
    }
}
