import { settings } from "./main.js";
import { checkColision } from "./functions.js";
import { Scroll } from "./scroll.js";

// ============================================================================
export class Plataforma {

    static ini_suelo = Scroll.resolucion[1] - Scroll.bsy * 2;
    static gap = Scroll.bsy * 6;
    static gapMini = Scroll.bsy * 2;

    // --------------------------------------------------------------------
    // [ y, x, longSize, bordeIz, bordeDe, movil/fija, nro_alturas nivel ]
    // --------------------------------------------------------------------
    static array_plataformas = [

        [this.ini_suelo - this.gap * 7 - this.gapMini, 10, 5, true, true, 0, 6],
        [this.ini_suelo - this.gap * 6, -16, 22, false, true, 0, 6],
        [this.ini_suelo - this.gap * 7, 9, 12, false, false, 1, 6],
        [this.ini_suelo - this.gap * 6, 23, 25, true, false, 0, 6],
        [this.ini_suelo - this.gap * 6, 12, 2, true, true, 0, 6],

        [this.ini_suelo - this.gap * 5 - this.gapMini * 2, 30, 3, true, true, 0, 6],
        [this.ini_suelo - this.gap * 5 - this.gapMini, 35, 2, true, true, 0, 6],

        [this.ini_suelo - this.gap * 5, -16, 20, false, true, 0, 6],
        [this.ini_suelo - this.gap * 5, 8, 20, true, true, 0, 6],
        [this.ini_suelo - this.gap * 5, 32, 8, true, true, 0, 6],

        [this.ini_suelo - this.gap * 3, 28, 4, true, true, 0, 6],

        [this.ini_suelo - this.gap * 4, -6, 24, true, true, 0, 6],
        [this.ini_suelo - this.gap * 4, 22, 26, true, false, 0, 6],

        [this.ini_suelo - this.gap * 3, -16, 15, false, true, 0, 6],
        [this.ini_suelo - this.gap * 3, 3, 10, true, true, 0, 6],

        [this.ini_suelo - this.gap * 2, -4, 39, true, true, 0, 6],

        [this.ini_suelo - this.gap * 1, -6, 14, true, true, 0, 6],
        [this.ini_suelo - this.gap * 1, 11, 7, true, true, 0, 6],
        [this.ini_suelo - this.gap * 1, 21, 17, true, true, 0, 6],

        [this.ini_suelo, -16, 64, false, false, 0, 6]
    ];

    static array_plataformas2 = [

        [this.ini_suelo - this.gap * 6, 0, 14, false, true, 0, 6],
        [this.ini_suelo - this.gap * 6, 23, 23, true, true, 0, 6],
        [this.ini_suelo - this.gap * 6, 52, 12, true, false, 0, 6],

        [this.ini_suelo - this.gap * 5 - this.gapMini * 2, 28, 4, true, true, 0, 6],
        [this.ini_suelo - this.gap * 5 - this.gapMini, 28, 4, true, true, 0, 6],

        [this.ini_suelo - this.gap * 5, 21, 18, true, true, 0, 6],

        [this.ini_suelo - this.gap * 4, 31, 7, true, true, 0, 6],
        [this.ini_suelo - this.gap * 4, 22, 5, true, true, 0, 6],
        [this.ini_suelo - this.gap * 4, 41, 5, true, true, 0, 6],

        [this.ini_suelo - this.gap * 3, 31, 4, true, true, 0, 6],
        [this.ini_suelo - this.gap * 3, 6, 10, true, true, 0, 6],

        [this.ini_suelo - this.gap * 2, 32, 8, true, true, 0, 6],
        [this.ini_suelo - this.gap * 2, 23, 5, true, true, 0, 6],

        [this.ini_suelo - this.gap * 1 - this.gapMini * 2, 42, 3, true, true, 0, 6],
        [this.ini_suelo - this.gap * 1 - this.gapMini, 39, 2, true, true, 0, 6],

        [this.ini_suelo - this.gap * 1, 25, 12, true, true, 0, 6],

        [this.ini_suelo - this.gap * 1, 48, 8, false, false, 1, 6],

        [this.ini_suelo, 0, 64, false, false, 0, 6]
    ];

    static array_nivelesPlataformas = [
        this.array_plataformas,
        this.array_plataformas2,
        this.array_plataformas
    ];

    // ----------------------------------------------------------------------
    constructor(args, ruta) {
        
        this.anchoTile = settings.constante.bsx;
        this.altoTile = settings.constante.bsy;

        this.rutaArchivoPng = ruta;

        this.ctx = settings.ctx;
        this.img = settings.imagenes.tile_medio;
        this.img.src = ruta;

        this.img_bordeIz = new Image();
        this.img_bordeIz.src = './img/tile2.png';
        this.img_bordeDe = new Image();
        this.img_bordeDe.src = './img/tile3.png';

        this.bordeIz = args[3];
        this.bordeDe = args[4];

        this.rect = {
            x: args[1] * settings.constante.bsx,
            y: args[0],
            ancho: args[2] * settings.constante.bsx,
            anchoBucle: args[2],
            alto: settings.constante.bsy
        }
    }

    dibuja(dxdy) {

        this.rect.x += dxdy[0];
        this.rect.y += dxdy[1];

        if (this.rect.y < -settings.constante.bsy || this.rect.y > settings.resolucion[1] + settings.constante.bsy) return;

        // -------------------------------------------------------------------------
        let imagen = this.img; 

        for (let i = 0; i < this.rect.anchoBucle; i ++) {

            if (i === 0 && this.bordeIz) {
                imagen = this.img_bordeIz;

            } else if (i === this.rect.anchoBucle - 1 && this.bordeDe) {
                imagen = this.img_bordeDe;
                
            } else {
                imagen = this.img;
            }

            this.ctx.drawImage(imagen, this.rect.x + i * this.anchoTile, this.rect.y, this.anchoTile, this.altoTile);
        }
    }
}

// ============================================================================
export class PlataformaMovil {

    constructor(args, ruta) {

        this.anchoTile = settings.constante.bsx;
        this.altoTile = settings.constante.bsy;

        this.rutaArchivoPng = ruta;

        this.ctx = settings.ctx;
        this.img = settings.imagenes.tile_madera;
        this.img.src = ruta;

        this.rect = {
            x: args[1] * settings.constante.bsx,
            y: args[0],
            ancho: args[2] * settings.constante.bsx,
            anchoBucle: args[2],
            alto: settings.constante.bsy
        }

        this.move = {
            activo: true,
            velX: args[5],
            velY: args[5]
        }

        this.correcciones = {
            obj1_hor: 0,
            obj1_ver: 0,
            obj2_hor: 0,
            obj2_ver: 0
        } 
    }

    dibuja(dxdy) {

        this.actualiza(dxdy);

        if (this.rect.y < -settings.constante.bsy || this.rect.y > settings.resolucion[1] + settings.constante.bsy) return;

        // -------------------------------------------------------------------
        for (let i = 0; i < this.rect.anchoBucle; i ++) {

            this.ctx.drawImage(this.img, this.rect.x + i * this.anchoTile, this.rect.y, this.anchoTile, this.altoTile);
        }
    }

    actualiza(dxdy) {

        this.rect.x += dxdy[0];
        this.rect.y += dxdy[1];

        if (!settings.objeto.jugador.accion_realizada) return;

        // ---------------------------------------------------
        if (settings.marcadores.nivel === -999) {

            this.rect.x += this.move.velX;

            if (this.check_colisionPlataformas()) {
                this.rect.x -= this.move.velX;
                this.move.velX *= -1;
            }

            return;
        }

        if (settings.marcadores.nivel > 0) {

            this.rect.y += this.move.velY;

            if (this.check_colisionPlataformas()) {
                this.rect.y -= this.move.velY;
                this.move.velY *= -1;
            }

            return;
        }
    }

    check_colisionPlataformas() {

        for (let plataf of settings.objeto.plataforma) {

            if (checkColision(plataf, this, this.correcciones, 0)) {
                
                if (plataf.rutaArchivoPng !== './img/tile6.png') return true;
            }
        }

        return false;
    }
}
