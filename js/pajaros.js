import { settings } from "./main.js";

// ============================================================================
export class Pajaros {

    constructor(id, posIniY) {

        this.ctx = settings.ctx;
        this.img = new Image();
        this.img.src = './img/bird64x72.png';

        this.id = id;
        this.abatido = false;

        this.ancho = settings.constante.bsx;
        this.alto = settings.constante.bsy;

        this.max_recorrY = settings.constante.bsy * 3;
        this.recorrY = 0;

        const posXY = this.selecc_posInicial(posIniY);

        this.rect = {
            x: posXY[0],
            y: posXY[1],
            ancho: this.ancho * 2,
            alto: this.alto * 2,
            clipX: 0,
            clipY: 0,
            clipAncho: 64,
            clipAlto:72
        }

        this.move = {
            activo: true,
            acelX: 0.0,
            velX: posXY[2],
            velY: posXY[3],
            flip: posXY[4],
            anima: 0
        }

        // --------------------------------------------------------------------------
        // Correcciones en las colisiones
        // (Poniendo los 4 atributos = 0 ... sería una colision estricta rectangular)
        // --------------------------------------------------------------------------
        this.correcciones = {
            obj1_hor: 0,
            obj1_ver: 0,
            obj2_hor: 0,
            obj2_ver: 0
        }

        this.intervalo_anima = setInterval(() => {

            this.move.anima ++;
            if (this.move.anima > 20) this.move.anima = 0;
        }, 99);

        console.log('ene_pajaro:', this.rect.x, this.rect.y, this.move.velY);
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

        this.rect.clipX = this.selecc_ssheetAnima();

        this.ctx.drawImage(this.img, this.rect.clipX, 0, this.rect.clipAncho, this.rect.clipAlto, 
            this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);

        this.ctx.restore();

        //this.ctx.drawImage(this.img, this.rect.clipX, this.rect.clipY,)
    }

    selecc_ssheetAnima() {
        return this.move.anima * this.rect.clipAncho;
    }

    actualiza(dxdy) {

        if (!this.move.activo) return;

        let dy = 0;

        this.rect.x += dxdy[0];
        this.rect.y += dxdy[1];
        
        // -------------------------------------------
        if (this.abatido) {

            // this.rect.y += Math.abs(this.move.velX);
            this.move.velY += settings.constante.GRAVEDAD;
            this.rect.y += this.move.velY;
            
            if (this.rect.y > settings.resolucion[1]) this.reset_pajaro(0);
            
        } else {
            
            this.rect.x += this.move.velX;
            this.recorrido += Math.abs(this.move.velX);
            
            this.rect.y += this.move.velY;
            this.recorrY ++;
            
            this.check_cambioY(this.recorrY);
            this.check_cambioDireccion();

            if (this.rect.y > settings.resolucion[1]) this.reset_pajaro(0);
        }
    }

    check_cambioDireccion() {

        if ((this.rect.x >= settings.resolucion[0] - this.rect.ancho && this.move.velX > 0) || (this.rect.x <= 0 && this.move.velX < 0)) {
            this.move.velX = -this.move.velX;
            this.move.flip = this.move.flip ? this.move.flip = false : this.move.flip = true;
        }
    }

    check_cambioY(recorrido) {

        if (recorrido >= this.max_recorrY) {

            this.recorrY = 0;
            this.move.velY = -this.move.velY;
        }
    }

    reset_pajaro(posIniY) {

        const posXY = this.selecc_posInicial(posIniY);

        this.rect.x = posXY[0];
        this.rect.y = posXY[1];
        
        this.move.velX = posXY[2];
        this.move.velY = posXY[3];

        this.move.flip = posXY[4];
        this.move.anima = 0;
        this.move.activo = false;
        
        setTimeout(() => {
            this.abatido = false;
            this.move.activo = true;
        }, 5000);
    }

    selecc_posInicial(posIniY) {

        const array_inicializaPajaro = [];

        // -----------------------------------------------------------------
        let nro_rnd = Math.floor(Math.random()* 2);

        if (nro_rnd === 0) {
            array_inicializaPajaro.push(-settings.constante.bsx * 2);
            
        } else {
            array_inicializaPajaro.push(settings.resolucion[0] - settings.constante.bsx * 2);
        }
        
        // -----------------------------------------------------------------
        nro_rnd = Math.floor(settings.resolucion[1] / 3);

        array_inicializaPajaro.push(posIniY + Math.floor(Math.random()* nro_rnd));
        
        // -----------------------------------------------------------------
        const velocidadProgresiva = 2 + Math.floor(settings.marcadores.nivel / 3);
        
        if (array_inicializaPajaro[0] < settings.resolucion[0] / 2) {
            array_inicializaPajaro.push(Math.floor(Math.random()* velocidadProgresiva) + 2);
            
        } else {
            array_inicializaPajaro.push(-(Math.floor(Math.random()* velocidadProgresiva) + 2));
        }
        
        // -----------------------------------------------------------------
        array_inicializaPajaro.push(Math.floor(Math.random()* 3) - 1);
        
        // -----------------------------------------------------------------
        if (array_inicializaPajaro[0] < settings.resolucion[0] / 2) {
            array_inicializaPajaro.push(true);

        } else {
            array_inicializaPajaro.push(false);
        }

        return array_inicializaPajaro;
    }
}
