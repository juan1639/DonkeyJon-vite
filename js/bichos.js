import { settings } from "./main.js";
import { checkColision } from "./functions.js";

// ============================================================================
export class Bichos {

    static nro_bichos = 2;

    // ---------------------------------------------------
    constructor(id, indice) {

        this.ctx = settings.ctx;
        this.img = new Image();
        this.img.src = './img/Ssheet_platD.png';

        this.id = id;
        this.indice = indice;
        this.abatido = false;

        this.ancho = settings.constante.bsx * 2;
        this.alto = settings.constante.bsy;

        this.elegir_ssheetId(this.id);

        this.rect = {
            x: 0,
            y: 0,
            ancho: this.ancho,
            alto: this.alto,
            clipX: 270,
            clipY: 320,
            clipAncho: 112,
            clipAlto:72
        }

        // ---------------------------------------------------------------------
        // Id --> 0 Mariq, 1 Carac, 
        // ---------------------------------------------------------------------
        const velocidades = [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 4],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2]
        ];
        const nro_rnd = Math.floor(Math.random()* velocidades[this.id].length);

        this.move = {
            activo: true,
            acelX: 0.0,
            velX: velocidades[this.id][nro_rnd],
            velY: 0,
            flip: true,
            anima: 0
        }

        this.check_outOfLimits(true);

        // --------------------------------------------------------------------------
        // Correcciones en las colisiones
        // (Poniendo los 4 atributos = 0 ... sería una colision estricta rectangular)
        // --------------------------------------------------------------------------
        this.correcciones = {
            obj1_hor: 0,
            obj1_ver: 0,
            obj2_hor: Math.floor(this.ancho / 2),
            obj2_ver: 0
        }

        const nivel = settings.ini_suelo;
        const gap = settings.gap;

        this.array_enque_nivelPlataforma = [
            [nivel - gap * 6 - this.alto, false],
            [nivel - gap * 5 - this.alto, false],
            [nivel - gap * 4 - this.alto, false],
            [nivel - gap * 3 - this.alto, false],
            [nivel - gap * 2 - this.alto, false],
            [nivel - gap * 1 - this.alto, false],
            [nivel - this.alto, false]
        ];

        this.intervalo_anima = setInterval(() => {
            this.move.anima = this.move.anima === 0 ? this.move.anima = 2 : this.move.anima = 0;
        }, 99);

        console.log('enemigo:', this.rect.x, this.rect.y);
    }

    dibuja(dxdy) {

        this.actualiza(dxdy);

        if (settings.estado.nivelSuperado) return;
        if (!this.move.activo) return;

        this.ctx.save();

        if (this.move.flip) {
            this.ctx.translate(this.rect.x + this.rect.ancho, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-this.rect.x, 0);
        }

        const clipXY = this.selecc_ssheetAccion();
        this.rect.clipX = clipXY[0];
        this.rect.clipY = clipXY[1];

        this.ctx.drawImage(this.img, this.rect.clipX, this.rect.clipY, this.rect.clipAncho, this.rect.clipAlto, 
            this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);

        this.ctx.restore();

        //this.ctx.drawImage(this.img, this.rect.clipX, this.rect.clipY,)
    }

    selecc_ssheetAccion() {

        const i = this.move.anima;

        if (this.ssheet.andando[4]) {
            return [this.ssheet.andando[i], this.ssheet.andando[i + 1]];
        }

        return [0, 0];
    }

    elegir_ssheetId(id) {

        if (id === 0) {
            this.ssheet = {
                andando: [270, 320, 270, 580, true],
            }

        } else if (id === 1) {
            this.ssheet = {
                andando: [5, 830, 5, 960, true],
            }
        }
    }

    actualiza(dxdy) {

        let dy = 0;

        this.rect.x += dxdy[0];
        this.rect.y += dxdy[1];

        if (!this.move.activo) return;

        // -------------------------------------------
        if (this.abatido) {

            this.move.velY += settings.constante.GRAVEDAD;
            this.rect.y += this.move.velY;

            if (this.rect.y > settings.resolucion[1]) this.check_outOfLimits(false);

        } else {

            this.rect.x += this.move.velX;
            this.recorrido ++;

            this.move.velY += settings.constante.GRAVEDAD;
            dy += this.move.velY;

            dy = this.check_colisionPlataformas(dy);
            this.rect.y += dy;

            this.check_cambioDireccion();
            this.check_outOfLimits(false);
        }
    }

    check_colisionPlataformas(dy) {

        for (let plataf of settings.objeto.plataforma) {

            if (checkColision(plataf, this, this.correcciones, 0)) {

                //console.log('colision');
                this.move.velY = 0;
                dy = plataf.rect.y - (this.rect.y + this.rect.alto);
                //dy = 0;
            }
        }

        return dy;
    }

    check_cambioDireccion() {

        if ((this.rect.x === Math.floor(settings.resolucion[0] / 8) && this.move.velX < 0) || (this.rect.x === Math.floor(settings.resolucion[0] / 1.3) && this.move.velX > 0)) {

            if (Math.floor(Math.random()* 9) < 1) {
                this.move.flip = this.move.flip ? this.move.flip = false : this.move.flip = true;
                this.move.velX *= -1;
            }
        }
    }

    check_outOfLimits(reset) {

        const limit_do = settings.resolucion[1] + settings.constante.bsx * 3;

        if (this.rect.y > limit_do || reset) {

            const rangoX = Math.floor(settings.resolucion[0] / 4);
            this.rect.x = Math.floor(Math.random()* rangoX);
            this.move.velX = Math.abs(this.move.velX);
            this.move.flip = true;

            if (Math.floor(Math.random()* 9) < 5) {
                this.rect.x = settings.resolucion[0] - settings.constante.bsx - this.rect.x;
                this.move.velX = Math.abs(this.move.velX) * -1;
                this.move.flip = false;
            }

            this.rect.y = -settings.constante.bsy * 2;

            // this.move.velY = 0;
            this.move.activo = false;

            if (Math.floor(Math.random()* 9) < 5) {
                this.id = 0;
                this.elegir_ssheetId(this.id);
                
            } else {
                this.id = 1;
                this.elegir_ssheetId(this.id);
            }

            const callBack = 1200 + Math.floor(Math.random()* 1000);

            setTimeout(() => {
                this.move.activo = true;
                this.abatido = false;
            }, callBack);
        }
    }
}
