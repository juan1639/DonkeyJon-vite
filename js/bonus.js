import { settings } from "./main.js";
import { Scroll } from "./scroll.js";

// ============================================================================
export class Bonus {

    static ini_suelo = Scroll.resolucion[1] - Scroll.bsy * 2;
    static gap = Scroll.bsy * 6;
    static gapMini = Scroll.bsy * 2;

    static array_bonus = [
        ['./img/items_ri.png', 35, this.ini_suelo, true],
        ['./img/items_ri.png', 12, this.ini_suelo - this.gap * 1, true],
        ['./img/items_ri.png', 29, this.ini_suelo - this.gap * 2, true],
        ['./img/items_ri.png', 10, this.ini_suelo - this.gap * 3, true],
        ['./img/items_ri.png', 12, this.ini_suelo - this.gap * 4, true],
        ['./img/items_ri.png', 33, this.ini_suelo - this.gap * 5, true],
        ['./img/items_ri.png', 25, this.ini_suelo - this.gap * 6, true],
        ['./img/items_ri.png', -6, this.ini_suelo - this.gap * 3, true],
        ['./img/items_ri.png', -4, this.ini_suelo - this.gap * 5, true]
    ];

    static array_bonus2 = [
        ['./img/items_ri.png', 35, this.ini_suelo, true],
        ['./img/items_ri.png', 8, this.ini_suelo - this.gap * 3, true],
        ['./img/items_ri.png', 32, this.ini_suelo - this.gap * 3, true],
        ['./img/items_ri.png', 10, this.ini_suelo - this.gap * 3, true],
        ['./img/items_ri.png', 56, this.ini_suelo, true],
        ['./img/items_ri.png', 30, this.ini_suelo - this.gap * 6, true],
        ['./img/items_ri.png', 56, this.ini_suelo - this.gap * 6, true],
        ['./img/items_ri.png', 53, this.ini_suelo, true],
        ['./img/items_ri.png', 46, this.ini_suelo, true]
    ];

    static array_nivelesBonus = [
        this.array_bonus,
        this.array_bonus2,
        this.array_bonus
    ];

    // ------------------------------------------------------------------
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
            x: args[1] * this.anchoTile,
            y: args[2] - this.altoTile,
            ancho: this.anchoTile,
            alto: this.altoTile
        }

        const clipX = this.elegir_item();
        this.colorId = (clipX - 8) / 32;
        this.puntos = 2000;

        this.clip = {
            x: clipX,
            y: 224,
            ancho: 32,
            alto: 24
        }
    }

    dibuja(dxdy) {

        this.rect.x += dxdy[0];
        this.rect.y += dxdy[1];

        const cw = this.clip.ancho;
        const ch = this.clip.alto;

        if (this.rect.x < -settings.constante.bsx || this.rect.x > settings.resolucion[0] + settings.constante.bsx || this.rect.y < -settings.constante.bsy * 2 || this.rect.y > settings.resolucion[1] + settings.constante.bsy) return;

        // -----------------------------------------------------------------------------------
        if (!this.accion_realizada) {
            this.ctx.drawImage(this.img, this.clip.x, this.clip.y, cw, ch, this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
        } 
    }

    elegir_item() {

        return 8 + 32 * Math.floor(Math.random()* 7);
    }
}
