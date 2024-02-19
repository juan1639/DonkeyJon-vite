import { settings } from "./main.js";

// ============================================================================
export class Textos {

    static colores = {
        azul_fondo: 'rgb(134, 210, 230)',
        blanco_nube: 'rgb(233, 233, 233)',
        txt_amar2: 'rgb(240, 240, 170)',
        txt_amar1: 'rgb(255, 89, 19)',
        txt_amar3: 'rgb(225, 155, 29)'
    };

    static array_textos = [
        [' Pulse agachar para realizar accion', 'center', 50, this.colores.txt_amar1],
        [' N i v e l  ', 'center', 120, this.colores.txt_amar3]
    ];

    constructor(args) {

        this.idTxt = args[0];
        this.alin = args[1];
        this.size = args[2];
        this.color = args[3];

        this.ctx = settings.ctx;
    }

    dibuja(dxdy) {

        //this.x += dxdy[0];
        //this.y += dxdy[1];

        this.ctx.save();
        this.ctx.font = this.size.toString() + 'px arial';
        this.ctx.textAlign = this.alin;
        this.ctx.fillStyle = 'transparent';

        const colision = settings.objeto.jugador.col_item;
        const col_llave = settings.objeto.jugador.col_llave;
        const noLlave = settings.objeto.jugador.msg_NOllave;
        const nivel = settings.msg.nivel;

        if ((this.size === 50 && colision) || (this.size === 120 && nivel) || (this.size === 70 && noLlave) || (this.size === 50 && col_llave) || (this.size === 75) || (this.size === 27)) {
            
            this.ctx.fillStyle = this.color;   
        }

        let x = settings.objeto.jugador.rect.x;
        let y = settings.objeto.jugador.rect.y - settings.constante.bsy;

        // ---------------------------------------------------------------------
        let txt_extra = '';
        if (this.size === 120 && nivel) txt_extra = settings.marcadores.nivel;
        
        // ---------------------------------------------------------------------
        if (this.size === 27) y = Math.floor(settings.resolucion[1] / 1.3);

        // -----------------------------------------------------------------
        this.ctx.fillText(this.idTxt + txt_extra, x, y);

        this.ctx.restore();
    }
}
