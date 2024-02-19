import { settings } from "./main.js";
import { Scroll } from "./scroll.js";

// ============================================================================
export class Decorativos {

    static ini_suelo = Scroll.resolucion[1] - Scroll.bsy * 2;
    static gap = Scroll.bsy * 6;
    static gapMini = Scroll.bsy * 2;

    static array_decorativos = [

        [-10, this.ini_suelo, 1, './img/tree05.png', false],
        [42, this.ini_suelo, 1, './img/tree05.png', false],
        [-10, this.ini_suelo - this.gap * 3, 1, './img/tree05.png', false],
        [42, this.ini_suelo - this.gap * 4, 1, './img/tree05.png', false],
        [-14, this.ini_suelo - this.gap * 5, 3, './img/tree05.png', false],
        [42, this.ini_suelo - this.gap * 6, 2, './img/tree05.png', false],
        [26, this.ini_suelo, 1, './img/Letrero_creditos.png', false],
        [-15, this.ini_suelo, 1, './img/Letrero_kenneyNl.png', false],
        [-15, this.ini_suelo - this.gap * 3, 1, './img/Letrero_IMI.png', false],
        [31, this.ini_suelo - this.gap * 2, 1, './img/Letrero_piscis.png', false],
        [6, this.ini_suelo - this.gap * 2, 1, './img/signArrow_up.png', false],
        [10, this.ini_suelo - this.gap * 2, 1, './img/signArrow_right.png', false],
        [-7, this.ini_suelo, 1, './img/signArrow_TR.png', false],
        [38, this.ini_suelo, 1, './img/signArrow_up.png', false],
        [3, this.ini_suelo - this.gap * 1, 1, './img/signArrow_up.png', false],
        [30, this.ini_suelo - this.gap * 4, 1, './img/signArrow_TL.png', false],
        [32, this.ini_suelo - this.gap * 4, 1, './img/signArrow_up.png', false],
        [34, this.ini_suelo - this.gap * 6, 1, './img/signLeft.png', false],
        [9, this.ini_suelo - this.gap * 5, 1, './img/signLeft.png', false],
        [37, this.ini_suelo - this.gap * 6, 1, './img/Letrero_Arlekin.png', false],

        [2, this.ini_suelo - this.gap * 5, 1, './img/switchRed_mid.png', true],

        [-12, this.ini_suelo - this.gap * 6, 1, './img/flagYellow1.png', false],
        [-10, this.ini_suelo - this.gap * 6, 1, './img/lockYellow.png', false]
    ];

    static array_decorativos2 = [

        [58, this.ini_suelo, 1, './img/tree05.png', false],
        [-10, this.ini_suelo - this.gap * 3, 1, './img/tree05.png', false],
        [42, this.ini_suelo - this.gap * 4, 1, './img/tree05.png', false],
        [59, this.ini_suelo - this.gap * 6, 2, './img/tree05.png', false],
        [6, this.ini_suelo, 1, './img/tree05.png', false],
        [6, this.ini_suelo - this.gap * 3, 1, './img/tree05.png', false],
        [26, this.ini_suelo, 1, './img/Letrero_creditos.png', false],
        [1, this.ini_suelo, 1, './img/Letrero_kenneyNl.png', false],
        [42, this.ini_suelo, 1, './img/Letrero_IMI.png', false],
        [32, this.ini_suelo - this.gap * 2, 1, './img/Letrero_piscis.png', false],
        [49, this.ini_suelo, 1, './img/signArrow_up.png', false],
        [12, this.ini_suelo, 1, './img/signArrow_up.png', false],
        [14, this.ini_suelo, 1, './img/signRight.png', false],
        [32, this.ini_suelo - this.gap * 4, 1, './img/signArrow_up.png', false],
        [24, this.ini_suelo - this.gap * 6, 1, './img/signLeft.png', false],
        [27, this.ini_suelo - this.gap * 6, 1, './img/signRight.png', false],
        [37, this.ini_suelo - this.gap * 6, 1, './img/Letrero_Arlekin.png', false],

        [35, this.ini_suelo - this.gap * 6, 1, './img/switchRed_mid.png', true],

        [2, this.ini_suelo - this.gap * 6, 1, './img/flagYellow1.png', false],
        [6, this.ini_suelo - this.gap * 6, 1, './img/lockYellow.png', false]
    ];

    static array_nivelesDecorativos = [
        this.array_decorativos,
        this.array_decorativos2,
        this.array_decorativos
    ];

    // ----------------------------------------------------------------------------
    constructor(id, left, top, cuantos, accion) {

        this.anchoTile = settings.constante.bsx;
        this.altoTile = settings.constante.bsy;
        this.id = id;

        this.ctx = settings.ctx;
        this.img = new Image();
        this.img.src = this.id;

        this.cuantos = cuantos;
        this.accion = accion;
        this.accion_realizada = false;

        const size = this.elegir_sizeElemento(this.anchoTile, this.altoTile);
        const ancho = size[0];
        const alto = size[1];

        this.rect = {
            x: left,
            y: top - alto,
            ancho: ancho,
            anchoBucle: cuantos,
            alto: alto
        }
        
        if (this.id.slice(0, 12) === './img/lockYe') this.rect.x += Math.floor(this.anchoTile / 5);

        this.anima = false;

        setInterval(() => {
            this.anima = this.anima ? this.anima = false : this.anima = true;
        }, 99);
    }

    dibuja(dxdy) {

        this.rect.x += dxdy[0];
        this.rect.y += dxdy[1];

        if (this.rect.x > settings.resolucion[0] + settings.constante.bsx || this.rect.y > settings.resolucion[1] + settings.constante.bsy || this.rect.y < -settings.constante.bsy * 5) return;

        // ----------------------------------------------------------------------------------
        let img = this.img;
        img.src = this.elegirImg();

        const ancho = this.rect.ancho;
        const alto = this.rect.alto;

        for (let i = 0; i < this.rect.anchoBucle; i ++) {
            this.ctx.drawImage(img, this.rect.x + i * ancho, this.rect.y, ancho, alto);
        }
    }

    elegir_sizeElemento() {

        if (this.id.slice(0, 14) === './img/Letrero_') {
            return [this.anchoTile * 4, this.altoTile * 3];

        } else if (this.id.slice(0, 12) === './img/signAr') {
            return [this.anchoTile, this.altoTile * 2];
            
        } else if (this.id.slice(0, 15) === './img/switchRed') {
            return [this.anchoTile, this.altoTile];

        } else if (this.id.slice(0, 12) === './img/flagYe') {
            return [this.anchoTile * 2, this.altoTile * 3];

        } else if (this.id.slice(0, 12) === './img/lockYe') {
            return [this.anchoTile * 2, this.altoTile * 2];

        } else if (this.id.slice(0, 12) === './img/signLe' || this.id.slice(0, 12) === './img/signRi') {
            return [this.anchoTile * 2, this.altoTile * 2];
        }

        return [this.anchoTile * 2, this.altoTile * 4];
    }

    elegirImg() {

        if (this.id.slice(0, 12) === './img/flagYe') {

            if (this.anima) {
                return './img/flagYellow1.png';
            } else {
                return './img/flagYellow2.png';
            }
        }

        if (this.id.slice(0, 15) === './img/switchRed') {
            
            if (this.accion_realizada) {
                return './img/switchRed_right.png';
            } else {
                return './img/switchRed_mid.png';
            }
        }

        if (this.id.slice(0, 12) === './img/lockYe') {
            
            if (settings.objeto.llave.accion_realizada) {
                return './img/signExit.png';
            } else {
                return './img/lockYellow.png';
            }
        }

        return this.img.src;
    }
}

// ============================================================================
export class DecorativosOffGame {

    constructor(id, left, top, width, height) {

        this.anchoTile = settings.constante.bsx;
        this.altoTile = settings.constante.bsy;
        this.id = id;
        console.log(this.id);

        this.ctx = settings.ctx;
        this.img = new Image();
        this.img.src = this.id;
        
        left -= width / 2;
        top -= height / 1.7;

        this.rect = {
            x: Math.floor(left),
            y: Math.floor(top),
            ancho: width,
            alto: height
        }
    }

    dibuja(dxdy) {

        this.rect.x += dxdy[0];
        this.rect.y += dxdy[1];

        /* if ((settings.estado.preJuego && this.id.slice(6, 21) === 'cartel_presenta') ||
            (settings.estado.gameOver && this.id === './img/cartel_gameover.png')) {
            this.ctx.drawImage(this.img, this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
        } */

        this.ctx.drawImage(this.img, this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
    }
}
