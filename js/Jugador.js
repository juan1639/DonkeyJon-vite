import { settings } from "./main.js";
import { Textos } from './textos.js';
import { Boommerang } from "./boommerang.js";
import { DecorativosOffGame } from "./decorativos.js";
import { Plataforma } from "./plataforma.js";

import {
    checkColision,
    checkColision_abovePtos,
    check_getLos7,
    lanzar_fireWorks,
    construir_nuevoNivel,
    playSonidosLoop
} from "./functions.js";

import {
    instanciar_showBonus
} from "./functions-aux-jugador.js";

// ============================================================================
export class Jugador {

    constructor(args) {

        this.ctx = settings.ctx;
        this.img = settings.imagenes.ssheet_jugador;
        this.img.src = './img/Ssheet_jugador.png';

        this.ssheet = {
            quieto: [0, 0, 0, 0, true],
            andar: [0, 110, 80, 110, false],
            agachado: [240, 0, 240, 0, false],
            escalera: [400, 0, 480, 0, false],
            escaleraQuieto: [400, 0, 400, 0, false],
            saltar: [80, 0, 160, 0, false],
            celebrar: [560, 0, 640, 0, false],
            dies: [320, 0, 0, 0, false],
            atacando: [80, 0, 80, 0, false]
        }

        this.rect = {
            x: args[0],
            y: args[1],
            ancho: args[2],
            alto: args[3],
            clipX: 0,
            clipY: 0,
            clipAncho: 80,
            clipAlto: 110
        }

        this.move = {
            acelX: 0.0,
            velX: 6,
            velY: 4,
            velYsalto: -20,
            velYGrav: 0,
            flip: false,
            anima: 0
        }

        this.saltando = false;
        this.direcc_salto = this.move.velX;
        this.potencia_salto = 16;
        this.saltoBonus = [700, false];

        this.col_item = false;
        this.col_llave = false;
        this.col_bicho = false;
        this.col_pajaro = false;
        this.col_bonus = false;

        this.accion_realizada = false;
        this.msg_NOllave = false;

        this.bandera_boommerang = false;
        this.cadencia_boommerang = 425;

        this.getLos7 = false;

        this.invisible = true;
        this.duracion_invisible = 3500;
        this.intermitente = true;

        this.duracion_dies = 3200;

        // --------------------------------------------------------------------------
        // Correcciones en las colisiones
        // (Poniendo los 4 atributos = 0 ... sería una colision estricta rectangular)
        // --------------------------------------------------------------------------
        this.correcciones = {
            obj1_hor: 0,
            obj1_ver: 0,
            obj2_hor: Math.floor(args[2] / 3),
            obj2_ver: 0
        }

        this.correcciones_escalera = {
            obj1_hor: 0,
            obj1_ver: 10,
            obj2_hor: Math.floor(args[2] / 2),
            obj2_ver: 0
        }

        this.correcciones_items = {
            obj1_hor: 0,
            obj1_ver: 0,
            obj2_hor: 0,
            obj2_ver: Math.floor(args[2] / 3)
        }

        this.correcciones_bichos = {
            obj1_hor: 0,
            obj1_ver: 0,
            obj2_hor: Math.floor(args[2] / 4),
            obj2_ver: Math.floor(args[3] / 5)
        }

        this.correcciones_pajaros = {
            obj1_hor: 0,
            obj1_ver: 0,
            obj2_hor: Math.floor(args[2] / 4),
            obj2_ver: Math.floor(args[3] / 5)
        }

        this.intervalo_anima = setInterval(() => {
            this.move.anima = this.move.anima === 0 ? this.move.anima = 2 : this.move.anima = 0;
        }, 99);

        setInterval(() => {
            this.intermitente = this.intermitente ? this.intermitente = false : this.intermitente = true;
        }, 50);

        setTimeout(() => {
            this.invisible = false;
        }, this.duracion_invisible);
    }

    dibuja() {

        if (!settings.estado.enJuego) return [0, 0];

        const dxdy = this.actualiza();

        // -----------------------------------------------------------
        this.ctx.save();

        if (this.move.flip) {
            this.ctx.translate(this.rect.x + this.rect.ancho, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-this.rect.x, 0);
        }

        const clipXY = this.selecc_ssheetAccion();
        this.rect.clipX = clipXY[0];
        this.rect.clipY = clipXY[1];

        if ((!this.invisible) || (this.invisible && this.intermitente)) {

            this.ctx.drawImage(this.img, this.rect.clipX, this.rect.clipY, this.rect.clipAncho, this.rect.clipAlto, 
                this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
        }

        this.ctx.restore();

        return dxdy;
    }

    selecc_ssheetAccion() {

        const i = this.move.anima;

        if (this.ssheet.quieto[4]) {
            return [this.ssheet.quieto[i], this.ssheet.quieto[i + 1]]; 

        } else if (this.ssheet.andar[4]) {
            return [this.ssheet.andar[i], this.ssheet.andar[i + 1]];

        } else if (this.ssheet.agachado[4]) {
            return [this.ssheet.agachado[i], this.ssheet.agachado[i + 1]];

        } else if (this.ssheet.escalera[4]) {
            return [this.ssheet.escalera[i], this.ssheet.escalera[i + 1]];

        } else if (this.ssheet.saltar[4]) {
            return [this.ssheet.saltar[i], this.ssheet.saltar[i + 1]];
            
        } else if (this.ssheet.celebrar[4]) {
            return [this.ssheet.celebrar[i], this.ssheet.celebrar[i + 1]];

        } else if (this.ssheet.dies[4]) {
            return [this.ssheet.dies[i], this.ssheet.dies[i + 1]];

        } else if (this.ssheet.atacando[4]) {
            return [this.ssheet.atacando[i], this.ssheet.atacando[i + 1]];
        }

        return [0, 0];
    }

    actualiza() {

        if (settings.estado.nivelSuperado) {
            this.reset_ssheetBooleanos();
            this.ssheet.celebrar[4] = true;
            return [0, 0];
        }

        if (settings.estado.jugadorDies) {
            this.reset_ssheetBooleanos();
            this.ssheet.dies[4] = true;
            return [0, 0];
        }

        if (settings.marcadores.nivel > settings.constante.nro_niveles) return [0, 0];

        // -----------------------------------------------
        let dxdy = [0, 0];
        let dx = dxdy[0];
        let dy = dxdy[1];

        // -----------------------------------------------
        dxdy = this.leer_teclado(dxdy);
        dx = dxdy[0];
        dy = dxdy[1];

        dx = this.check_limitesHorizontales(dx);
        dy = this.check_colisionPlataformas(dy);
        this.col_item = this.check_colisionItems();
        this.col_llave = this.check_colisionLlave();

        if (!settings.trucos.invisible && !this.invisible) {
            this.col_bicho = this.check_colisionBichos();
            this.col_pajaro = this.check_colisionPajaros();
        }
        
        this.col_bonus = this.check_colisionBonus();

        // -----------------------------------------------
        if (!this.ssheet.escalera[4]) {

            this.move.velYGrav -= settings.constante.GRAVEDAD;
            dy += this.move.velYGrav;
        }

        //this.rect.x += dx;
        //this.rect.y += dy;

        return [-dx, dy];
    }

    check_limitesHorizontales(dx) {

        const scroll_iz = settings.objeto.scroll[0];
        const scroll_de = settings.objeto.scroll[3];
        const top = this.move.velX * 2;

        if (scroll_iz.x - dx > 0) dx = scroll_iz.x;
        if (scroll_de.x + dx < top && !this.move.flip) dx = scroll_de.x;

        return dx;
    }

    check_colisionPlataformas(dy) {

        for (let plataf of settings.objeto.plataforma) {

            if (checkColision(plataf, this, this.correcciones, 0)) {

                //console.log('colision');
                const corr = Math.floor(this.rect.alto / 2);

                if (this.move.velYGrav < 0 && this.rect.y + corr < plataf.rect.y) {

                    this.move.velYGrav = 0;
                    //dy = 0;
                    dy = this.rect.y + this.rect.alto - plataf.rect.y;

                    if (this.saltando) {
                        this.saltando = false;
                        this.saltoBonus[1] = false;
                    }
                }
            }
        }

        return dy;
    }

    check_colisionEscaleras() {

        for (let escalera of settings.objeto.escalera) {

            if (checkColision(escalera, this, this.correcciones_escalera, 0)) {

                //console.log('colision Escalera');
                const corr = Math.floor(this.rect.alto / 2);
                return true;
            }
        }

        return false;
    }

    check_colisionItems() {

        let superado = settings.estado.nivelSuperado;
        let llave = settings.objeto.llave;
        const nivel = settings.marcadores.nivel;

        for (let item of settings.objeto.decorativos) {

            if (checkColision(item, this, this.correcciones_items, 0)) {

                if (item.id === './img/lockYellow.png' && !superado && llave.accion_realizada && !settings.bandera[nivel]) {

                    settings.estado.nivelSuperado = true;
                    settings.bandera[nivel] = true;
                    lanzar_fireWorks();
                    settings.sonidos.musicaFondo.pause();
                    playSonidosLoop(settings.sonidos.fireWorks, false, settings.volumen.fireWorks);

                    setTimeout(() => {
                        this.accion_realizada = false;
                        construir_nuevoNivel();
                    }, settings.constante.pausaFireWorksNivelSuperado);

                } else if (item.id === './img/lockYellow.png' && !superado && !llave.accion_realizada) {

                    this.mostrar_msg('nollave');
                }

                if (!item.accion_realizada && this.ssheet.agachado[4] && item.id.slice(0, 15) === './img/switchRed') {
                    item.accion_realizada = true;
                    this.accion_realizada = true;
                    playSonidosLoop(settings.sonidos.eatingGhost, false, settings.volumen.eatingGhost);
                }
                
                if (item.accion) return true; // msg explicativo accion
            }
        }

        return false;
    }

    check_colisionLlave() {

        const llave = settings.objeto.llave;

        if (checkColision(llave, this, this.correcciones_escalera, 0)) {

            if (!llave.accion_realizada && this.ssheet.agachado[4]) {
                llave.accion_realizada = true;
                playSonidosLoop(settings.sonidos.eatingGhost, false, settings.volumen.eatingGhost);
                return true;
            }

            if (!llave.accion_realizada) return true;
        }
        
        return false;
    }

    check_colisionBonus() {

        for (let bonus of settings.objeto.bonus) {

            if (checkColision(bonus, this, this.correcciones_pajaros, 0) && !bonus.accion_realizada) {

                const args = [Math.floor(settings.constante.bsy / 3), 30, 10, 0, 60, 40, 20, 2800];
                instanciar_showBonus(bonus, this, false, args);
                settings.objeto.lossiete[bonus.colorId].mostrar = true;
                bonus.accion_realizada = true;

                if (!this.getLos7) {
                    this.getLos7 = check_getLos7();

                    if (this.getLos7) {
                        
                        const args = [Math.floor(settings.constante.bsy), 60, 20, 0, 80, 70, 20, 3900];
                        instanciar_showBonus(bonus, this, true, args);
                        playSonidosLoop(settings.sonidos.intermision, false, settings.volumen.intermision);
                    }
                }

                playSonidosLoop(settings.sonidos.chips1, false, 0.9);
                playSonidosLoop(settings.sonidos.chips2, false, 0.9);
                
                return true;
            }
        }

        return false;
    }

    check_colisionBichos() {

        const dies = settings.estado.jugadorDies;

        for (let bichos of settings.objeto.bichos) {

            if (checkColision(bichos, this, this.correcciones_bichos, 0) && !dies && !this.ssheet.agachado[4] && !bichos.abatido) {

                const array_posValidas = this.averiguar_plataformas();
                const pos_bicho = bichos.rect.y + bichos.rect.alto;

                if (array_posValidas.includes(pos_bicho)) {

                    this.jugadorDies_enemigoAbatido_sonido(bichos);

                    setTimeout(() => {
                        for (let bicho of settings.objeto.bichos) {
                            bicho.check_outOfLimits(true);
                        }

                        for (let pajaro of settings.objeto.pajaros) {
                            pajaro.reset_pajaro(0);
                        }

                        this.mostrar_msg('Preparado!');
                        this.revivir_jugador_preparado();

                    }, this.duracion_dies);

                    return true;
                }
            }
        }

        return false;
    }

    check_colisionPajaros() {
        
        const dies = settings.estado.jugadorDies;

        for (let pajaro of settings.objeto.pajaros) {

            if (checkColision(pajaro, this, this.correcciones_pajaros, 0) && !dies && !this.ssheet.agachado[4] && !pajaro.abatido) {
                
                this.jugadorDies_enemigoAbatido_sonido(pajaro);

                setTimeout(() => {
                    for (let bicho of settings.objeto.bichos) {
                        bicho.check_outOfLimits(true);
                    }

                    for (let pajaro of settings.objeto.pajaros) {
                        pajaro.reset_pajaro(0);
                    }

                    this.mostrar_msg('Preparado!');
                    this.revivir_jugador_preparado();

                }, this.duracion_dies);

                return true;
            }
        }

        return false;
    }

    averiguar_plataformas() {

        const nro_plataformas = Plataforma.array_plataformas[0][6];
        let array_posValidas = [];

        for (let i = 0; i < nro_plataformas; i ++) {
            const plataf = Plataforma.ini_suelo - i * Plataforma.gap;

            array_posValidas.push(plataf);
            array_posValidas.push(plataf - 1);
        }

        return array_posValidas;
    }

    leer_teclado(dxdy) {

        let dx = dxdy[0];
        let dy = dxdy[1];

        if (this.saltando) {
            this.reset_ssheetBooleanos();
            this.ssheet.andar[4] = true;

            for (let bichos of settings.objeto.bichos) {

                if (checkColision_abovePtos(bichos, this) && !this.saltoBonus[1]) {

                    console.log('salto ptos');
                    const id_bicho_ptos = [
                        [400, 20],
                        [200, 0]
                    ];
                    
                    const args = [
                        Math.floor(settings.constante.bsy / 3), 15, 5, 0, id_bicho_ptos[bichos.id][1], 35, 20, 1900
                    ];

                    instanciar_showBonus(bichos, this, false, args);
                    this.saltoBonus[1] = true;
                }
            }

            if (settings.controles.tecla_at || settings.controles.touch_at) {
                this.inicializa_disparo();
            }

            return [this.direcc_salto, dy];
        } 
            

        if (settings.controles.tecla_iz || settings.controles.touch_iz) {
            this.move.flip = true;
            this.reset_ssheetBooleanos();
            this.ssheet.andar[4] = true;
            dx = -(this.move.velX);

        } else if (settings.controles.tecla_de || settings.controles.touch_de) {
            this.move.flip = false;
            this.reset_ssheetBooleanos();
            this.ssheet.andar[4] = true;
            dx = this.move.velX;

        } else {
            
            this.reset_ssheetBooleanos();
            this.ssheet.quieto[4] = true;
        }

        if (settings.controles.tecla_up || settings.controles.touch_up) {
        
            if (this.check_colisionEscaleras()) {

                this.reset_ssheetBooleanos();
                this.ssheet.escalera[4] = true;
                dy = this.move.velY;

            } else if (!this.saltando) {

                this.saltando = true;
                this.move.velYGrav = this.potencia_salto;
                this.direcc_salto = this.move.flip === true ? -6 : 6;
                settings.sonidos.jump.play();
                playSonidosLoop(settings.sonidos.jump, false, settings.volumen.jump);
            }
        
        } else if (settings.controles.tecla_do || settings.controles.touch_do) {
            this.reset_ssheetBooleanos();
            this.ssheet.agachado[4] = true; 
            //dy = 0;

        } else if (settings.controles.tecla_at || settings.controles.touch_at) {
            this.inicializa_disparo();
        }

        return [dx, dy];
    }

    jugadorDies_enemigoAbatido_sonido(enemigo) {

        settings.estado.jugadorDies = true;
        enemigo.abatido = true;                  
        settings.sonidos.musicaFondo.pause();
        playSonidosLoop(settings.sonidos.pacmanDies, false, settings.volumen.pacmanDies);
    }

    inicializa_disparo() {

        this.reset_ssheetBooleanos();
        this.ssheet.atacando[4] = true;

        if (!this.bandera_boommerang) {

            this.bandera_boommerang = true;
            const ruta = './img/boommerang_sheet.png';
            let flip = -1;
            let iniX = 0;
            const iniY = Math.floor(this.rect.alto / 4);
            
            if (!this.move.flip) {
                flip = 1;
                iniX = Math.floor(this.rect.ancho / 2);
            }

            settings.objeto.boommerang.push(new Boommerang(ruta, this.rect.x + iniX, this.rect.y + iniY, flip, -1));

            playSonidosLoop(settings.sonidos.ataque, false, settings.volumen.ataque);

            setTimeout(() => {
                this.bandera_boommerang = false;
            }, this.cadencia_boommerang);
        }
    }

    reset_ssheetBooleanos() {

        const acciones = Object.keys(this.ssheet);

        for (let accion of acciones) {
            this.ssheet[accion][4] = false;
        }
    }

    mostrar_msg(elegir) {

        if (!this.msg_NOllave && elegir === 'nollave') {

            this.msg_NOllave = true;

            const args = ['Debes coger la llave...', 'center', 70, 'red'];

            settings.objeto.textos.push(new Textos(args));
            //console.log(settings.objeto.textos.length);

            setTimeout(() => {
                this.msg_NOllave = false;
                settings.objeto.textos.pop();
            }, 2200);
        }

        if (elegir === 'Preparado!') {

            const args = [elegir, 'center', 75, 'rgb(225, 150, 19])'];
            settings.objeto.textos.push(new Textos(args));

            setTimeout(() => {
                settings.objeto.textos.pop();
            }, 2000);
        }
    }

    revivir_jugador_preparado() {

        settings.estado.jugadorDies = false;
        settings.marcadores.vidas --;
        this.invisible = true;

        setTimeout(() => {
            this.invisible = false;
        }, this.duracion_invisible);

        if (settings.marcadores.vidas < 0) {

            let i = settings.array_decorativosOffgame[1];
            const id_dOff = i[2];
            const rx = Math.floor(i[0]);
            const ry = Math.floor(i[1]);

            settings.objeto.decorativosOffgame.push(new DecorativosOffGame(id_dOff, rx, ry, i[3], i[4]));
            playSonidosLoop(settings.sonidos.gameOver, false, settings.volumen.gameOver);
            return;
        }

        settings.marcadores.scoreVidas.innerHTML = 'Vidas: ' + settings.marcadores.vidas.toString();
        settings.objeto.showvidas.pop();
        settings.sonidos.musicaFondo.play();
    }
}
