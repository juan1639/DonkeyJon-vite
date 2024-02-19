import { settings } from "./main.js";

// ============================================================================
export class Scroll {

    static bsx = 50;
    static bsy = 50;
    static nro_columnas = 16;
    static nro_filas = 11;

    static resolucion = [this.nro_columnas * this.bsx, this.nro_filas * this.bsy];

    static ini_scrolls = [
        [-this.resolucion[0], 0, './img/fondo_cielo103.png'],
        [0, 0, './img/fondo_cielo101.png'],
        [this.resolucion[0], 0, './img/fondo_cielo103.png'],
        [this.resolucion[0] * 2, 0, './img/fondo_cielo101.png'],
        [-this.resolucion[0], -this.resolucion[1], './img/fondo_cielo104.png'],
        [0, -this.resolucion[1], './img/fondo_cielo102.png'],
        [this.resolucion[0], -this.resolucion[1], './img/fondo_cielo104.png'],
        [this.resolucion[0] * 2, -this.resolucion[1], './img/fondo_cielo102.png']
    ];

    // ----------------------------------------------------------------------------
    constructor(args, ancho, alto) {

        this.ctx = settings.ctx;
        this.img = settings.imagenes.fondo_cielo1;
        this.img.src = args[2];

        this.x = args[0];
        this.y = args[1];
        this.ancho = ancho;
        this.alto = alto;
    }

    dibuja(dxdy) {

        this.x += dxdy[0];
        this.y += dxdy[1];

        if (this.y > this.alto && dxdy[1] > 0) this.y -= this.alto * 2;
        if (this.y < -this.alto && dxdy[1] < 0) this.y += this.alto * 2;

        if (this.x + this.ancho < 0 || this.x > settings.resolucion[0] || this.y + this.alto < 0 || this.y > settings.resolucion[1]) return;

        // ----------------------------------------------------------------------
        this.ctx.drawImage(this.img, this.x, this.y, this.ancho, this.alto);
    }
}
