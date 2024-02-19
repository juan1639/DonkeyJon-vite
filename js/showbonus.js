import { settings } from "./main.js";

// ============================================================================
export class ShowBonus {

    constructor(id, left, top, width, height, cx, cy, cw, ch, duracion) {

        this.id = id;

        this.ctx = settings.ctx;
        this.img = new Image();
        this.img.src = this.id;

        this.duracion = duracion;
        this.activo = true;
        this.zoomInc = 2;

        this.rect = {
            x: left,
            y: top,
            ancho: width,
            alto: height
        }

        this.clip = {
            x: cx,
            y: cy,
            ancho: cw,
            alto: ch
        }

        setTimeout(() => {
            this.activo = false;
            settings.objeto.showbonus.shift();
        }, this.duracion);
    }

    dibuja(dxdy) {

        if (this.activo) {

            this.rect.x += dxdy[0];
            this.rect.y += dxdy[1];

            if ((this.rect.ancho < 85 && this.duracion < 3000) || (this.rect.ancho < 150 && this.duracion > 3000)) {
                
                this.rect.ancho += this.zoomInc;
                this.rect.alto += this.zoomInc;
                this.rect.x -= this.zoomInc;
                this.rect.y -= this.zoomInc;

            }

            this.rect.y --;

            this.ctx.drawImage(this.img, this.clip.x, this.clip.y, this.clip.ancho, this.clip.alto,
                this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
        }
    }
}
