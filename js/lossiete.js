import { settings } from "./main.js";

// ============================================================================
export class LosSiete {

    constructor(id, left, top) {

        this.id = id;
        this.mostrar = false;

        this.ctx = settings.ctx;
        this.img = new Image();
        this.img.src = './img/items_ri.png';

        const marginLeft = Math.floor(settings.resolucion[0] / 2 - ((settings.constante.bsx * 7) / 2));

        this.rect = {
            x: marginLeft + left,
            y: top,
            ancho: settings.constante.bsx,
            alto: settings.constante.bsy
        }

        const clipX = 8 + 32 * this.id;

        this.clip = {
            x: clipX,
            y: 224,
            ancho: 32,
            alto: 24
        }

        this.contador = 0;

        // ---------------------------------------------------------------
        //  Completados los 7
        // ---------------------------------------------------------------
        this.img_completed = new Image();
        this.img_completed.src = './img/showPtos.png';

        this.xc = marginLeft;
        this.yc = settings.constante.bsy;
        this.cancho = settings.constante.bsx * 7;
        this.calto = settings.constante.bsy;

        this.ccx = 80;
        this.ccy = 0;
        this.ccanc = 100;
        this.ccalc = 20;

        this.showInterm = true;

        setInterval(() => {
            if (this.showInterm) {
                this.showInterm = false;
            } else {
                this.showInterm = true;
            }
        }, 900);
    }

    dibuja() {

        this.contador ++;
        if (this.contador >= 7) this.contador = 0;

        // --------------------------------------------------------------------
        if (this.mostrar && !settings.objeto.jugador.getLos7) {
            this.ctx.drawImage(this.img, this.clip.x, this.clip.y, this.clip.ancho, this.clip.alto, this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);

        } else if (this.mostrar && settings.objeto.jugador.getLos7) {
            this.ctx.drawImage(this.img, 8 + 32 * this.contador, this.clip.y, this.clip.ancho, this.clip.alto, this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
        }
        
        if (settings.objeto.jugador.getLos7 && this.showInterm) {
            this.ctx.drawImage(this.img_completed, this.ccx, this.ccy, this.ccanc, this.ccalc, this.xc, this.yc, this.cancho, this.calto);
        }
    }
}
