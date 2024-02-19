import { lanzar_fireWorks } from "./functions.js";
import { settings } from "./main.js";

// ============================================================================
export class FireWorks {

    static nro_CHISPASfireWorks = 99;

    // ------------------------------------------------------------
    constructor(id, left, top) {

        this.ctx = settings.ctx;

        this.id = id;

        const angulo_rnd = Math.floor(Math.random()* 360);
        this.rad_rnd = (angulo_rnd * Math.PI) / 180;

        const velocidad = Math.floor(Math.random()* 50) + 50;
        
        this.rect = {
            x: left,
            y: top,
            ancho: 1,
            alto: 1,
            size: 1
        }

        this.move = {
            activo: true,
            vel: velocidad / 10,
            velX: Math.cos(this.rad_rnd),
            velY: Math.sin(this.rad_rnd)
        }

        this.duracion = 30;
        this.max_duracion = this.duracion + 15;
    }

    dibuja(dxdy) {

        if (this.duracion > 0) {

            this.duracion --;

            if (this.duracion === 0 && this.id === 1 && settings.estado.nivelSuperado) lanzar_fireWorks();

            const rgb = Math.floor(Math.random()* 200) + 55;
            
            if (this.duracion > 26) this.dibuja_centro(rgb);

            this.rect.x += dxdy[0];
            this.rect.y += dxdy[1];

            this.rect.x += this.move.velX * this.move.vel;
            this.rect.y += this.move.velY * this.move.vel;

            this.rect.size = Math.floor((this.max_duracion - this.duracion) / 12);

            this.ctx.beginPath();
            this.ctx.arc(this.rect.x, this.rect.y, this.rect.size, 0, 2 * Math.PI);
            this.ctx.fillStyle = 'rgb(255,' + rgb.toString() + ',9)';
            this.ctx.fill();
            this.ctx.closePath();
        }
    }

    dibuja_centro(rgb) {

        const radio = Math.floor(Math.random()* 9) + 5;

        this.ctx.beginPath();
        this.ctx.arc(this.rect.x, this.rect.y, radio, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgb(255,' + rgb.toString() + ',9)';
        this.ctx.fill();
        this.ctx.closePath();
    }
}
