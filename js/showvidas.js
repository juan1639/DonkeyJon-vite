import { settings } from "./main.js";

// ============================================================================
export class ShowVidas {

    constructor(id, left, top, width, height) {

        this.id = id;

        this.ctx = settings.ctx;
        this.img = new Image();
        this.img.src = this.id;

        this.rect = {
            x: left,
            y: top,
            ancho: width,
            alto: height
        }

        this.clip = {
            x: 400,
            y: 220,
            ancho: 80,
            alto: 110
        }
    }

    dibuja() {
        
        this.ctx.drawImage(this.img, this.clip.x, this.clip.y, this.clip.ancho, this.clip.alto, this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
    }
}
