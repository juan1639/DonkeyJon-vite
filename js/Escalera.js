import { settings } from "./main.js";
import { Scroll } from "./scroll.js";

// ============================================================================
export class Escalera {

    static ini_suelo = Scroll.resolucion[1] - Scroll.bsy * 2;
    static gap = Scroll.bsy * 6;
    static gapMini = Scroll.bsy * 2;

    static array_escaleras = [
        [31, this.ini_suelo, this.gap],
        [-1, this.ini_suelo - this.gap * 1, this.gap],
        [25, this.ini_suelo - this.gap * 2, this.gap * 2],
        [8, this.ini_suelo - this.gap * 2, this.gap],
        [-5, this.ini_suelo - this.gap * 3, this.gap],
        [34, this.ini_suelo - this.gap * 4, this.gap]
    ];

    static array_escaleras2 = [
        [31, this.ini_suelo, this.gap],
        [10, this.ini_suelo, this.gap * 3],
        [25, this.ini_suelo - this.gap * 2, this.gap * 2],
        [12, this.ini_suelo - this.gap * 3, this.gap * 3],
        [-5, this.ini_suelo - this.gap * 3, this.gap],
        [34, this.ini_suelo - this.gap * 4, this.gap]
    ];

    static array_nivelesEscaleras = [
        this.array_escaleras,
        this.array_escaleras2,
        this.array_escaleras
    ];

    // ---------------------------------------------------------------
    constructor(args) {

        this.anchoTile = settings.constante.bsx;
        this.altoTile = settings.constante.bsy;

        this.ctx = settings.ctx;
        this.img = settings.imagenes.escalera;
        this.img.src = './img/ladderWide_mid.png';

        this.rect = {
            x: args[0] * this.anchoTile,
            y: args[1] - args[2],
            ancho: this.anchoTile,
            alto: args[2],
            size: args[2]
        }

        console.log(this.rect.y, this.rect.size, this.altoTile);
    }

    dibuja(dxdy) {

        this.rect.x += dxdy[0];
        this.rect.y += dxdy[1];

        const bottom_escalera = this.rect.y + this.rect.size;

        for (let i = this.rect.y; i < bottom_escalera; i += this.altoTile) {
            this.ctx.drawImage(this.img, this.rect.x, i, this.anchoTile, this.altoTile);
        }
    }
}

