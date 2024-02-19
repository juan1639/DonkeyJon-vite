import { settings } from './main.js';
import { FireWorks } from "./fireworks.js";
import { Textos } from './textos.js';
import { Scroll } from './scroll.js';
import { Jugador } from './Jugador.js';
import { Boommerang } from './boommerang.js';
import { Bichos } from './bichos.js';
import { Pajaros } from './pajaros.js';
import { Plataforma, PlataformaMovil } from './plataforma.js';
import { Escalera } from './Escalera.js';
import { Decorativos, DecorativosOffGame } from './decorativos.js';
import { Llave } from './llave.js';
import { Bonus } from './bonus.js';
import { LosSiete } from './lossiete.js';
import { ShowVidas } from './showvidas.js';

// ============================================================================
//  Funciones varias
// 
// ============================================================================
function checkColision(obj1, obj2, corr, dy) {
    
    return obj1.rect.x + corr.obj1_hor < obj2.rect.x + obj2.rect.ancho - corr.obj2_hor && 
            obj1.rect.x + obj1.rect.ancho - corr.obj1_hor > obj2.rect.x + corr.obj2_hor &&
            obj1.rect.y + corr.obj1_ver < obj2.rect.y + dy + obj2.rect.alto - corr.obj2_ver && 
            obj1.rect.y + obj1.rect.alto - corr.obj1_ver > obj2.rect.y + dy + corr.obj2_ver;
}

// ----------------------------------------------------------------------------
function checkColision_abovePtos(obj1, obj2) {

    // En la 3ra linea del return la diferencia es --- obj2.rect.alto * 2 ---

    return obj1.rect.x < obj2.rect.x + obj2.rect.ancho && 
            obj1.rect.x + obj1.rect.ancho > obj2.rect.x &&
            obj1.rect.y < obj2.rect.y + obj2.rect.alto * 2 && 
            obj1.rect.y + obj1.rect.alto > obj2.rect.y;
}

// ============================================================================
function lanzar_fireWorks() {

    const nroChispas = FireWorks.nro_CHISPASfireWorks;

    const rangoX = Math.floor(settings.resolucion[0] / 2);
    const rangoY = Math.floor(settings.resolucion[1] / 4);

    const x = Math.floor(Math.random()* rangoX) + settings.resolucion[0] / 4;
    const y = Math.floor(Math.random()* rangoY) + settings.resolucion[1] / 8;
    
    for (let i = 0; i < nroChispas; i ++) {
        settings.objeto.chispa.push(new FireWorks(i, x, y));
    }
}

// ============================================================================
function construir_nuevoNivel() {

    settings.objeto.plataforma = [];
    settings.objeto.escalera = [];
    settings.objeto.decorativos = [];

    instanciar_plataformas(settings.marcadores.nivel);
    instanciar_escaleras(settings.marcadores.nivel);
    instanciar_decorativos(settings.marcadores.nivel);
    instanciar_bonus(settings.marcadores.nivel);
    instanciar_llave(settings.marcadores.nivel);
    check_resetGetLos7();

    settings.marcadores.nivel ++;
    settings.msg.nivel = true;
    settings.estado.nivelSuperado = false;
    settings.objeto.jugador.invisible = true;

    setTimeout(() => {
        settings.objeto.jugador.invisible = false;
        settings.msg.nivel = false;
    }, settings.constante.pausaMsgNivelMostrar);

    settings.sonidos.fireWorks.pause();
    settings.sonidos.musicaFondo.play();
}

// ============================================================================
function instanciar_scrolls() {

    for (let args of Scroll.ini_scrolls) {
        settings.objeto.scroll.push(new Scroll(args, settings.resolucion[0], settings.resolucion[1]));
    }
}

// ============================================================================
function instanciar_jugador() {
    settings.objeto.jugador = new Jugador(settings.ini_jugador.args);
}

// ---------------------------------------------------------------------------
function instanciar_boommerang() {
    settings.objeto.boommerang.push(new Boommerang('./img/boommerang_sheet.png', -100, -100, -1, -1));
}

// ============================================================================
function instanciar_bichos() {

    const dificultad = settings.opciones_menuP.botonSelectDificultad;
    
    for (let i = 0; i < settings.nro_enemigosDificultad.mariq[dificultad]; i ++) {

        const id = Math.floor(Math.random()* Bichos.nro_bichos);
        settings.objeto.bichos.push(new Bichos(id));
    }
}

// ============================================================================
function instanciar_pajaros() {
    
    const dificultad = settings.opciones_menuP.botonSelectDificultad;

    for (let i = 0; i < settings.nro_enemigosDificultad.pajaros[dificultad]; i ++) {

        const posIniY = 0;
        settings.objeto.pajaros.push(new Pajaros(i, posIniY));
    }
}

// ============================================================================
function instanciar_textos() {

    for (let args of Textos.array_textos) {
        settings.objeto.textos.push(new Textos(args));
    }
}

// ============================================================================
function instanciar_plataformas(nivel) {

    const nivelActual = Plataforma.array_nivelesPlataformas[nivel];
    const final = nivelActual.length - 1;

    for (let i = final; i >= 0; i --) {

        const movil = nivelActual[i][5];

        if (movil === 0) {
            settings.objeto.plataforma.push(new Plataforma(nivelActual[i], './img/tile1.png'));
            
        } else {
            settings.objeto.plataforma.push(new PlataformaMovil(nivelActual[i], './img/tile6.png'));
        }
    }
}

// ============================================================================
function instanciar_escaleras(nivel) {

    const nivelActual = Escalera.array_nivelesEscaleras[nivel];

    for (let args of nivelActual) {
        settings.objeto.escalera.push(new Escalera(args));
    }
}

// ============================================================================
function instanciar_decorativos(nivel) {

    const nivelActual = Decorativos.array_nivelesDecorativos[nivel];

    for (let i of nivelActual) {
        const decX = i[0] * settings.constante.bsx;
        const accion = i[4]; // interactuable true/false
        console.log('dec:', decX, i[3], i[1], i[2], i[4]);

        settings.objeto.decorativos.push(new Decorativos(i[3], decX, i[1], i[2], accion));
    }
}

// ----------------------------------------------------------------------------
function instanciar_decorativosOffgame(id) {

    let args = settings.array_decorativosOffgame[id];
    settings.objeto.decorativosOffgame.push(new DecorativosOffGame(args[2], args[0], args[1], args[3], args[4]));
}

// ============================================================================
function instanciar_llave(nivel) {

    const nivelActual = Llave.array_llaves[nivel];
    settings.objeto.llave = new Llave(nivelActual);
}

// ============================================================================
function instanciar_bonus(nivel) {

    const nivelActual = Bonus.array_nivelesBonus[nivel];

    for (let args of nivelActual) {
        settings.objeto.bonus.push(new Bonus(args));
    }
}

// ----------------------------------------------------------------------------
function instanciar_los7() {

    for (let i = 0; i < settings.constante.nro_DIAMANTES; i ++) {

        settings.objeto.lossiete.push(new LosSiete(i, settings.constante.bsx * i, 0));
    }
}

// ============================================================================
function instanciar_showVidas() {

    for (let i = settings.marcadores.vidas; i > 0; i --) {
        const idVidas = './img/Ssheet_jugador.png';
        const xVidas = settings.resolucion[0] - i * settings.constante.bsx - settings.constante.bsx;

        settings.objeto.showvidas.push(new ShowVidas(idVidas, xVidas, 0, settings.constante.bsx, settings.constante.bsy));
    }
}

// ============================================================================
function check_gameOver() {

    if (settings.marcadores.vidas < 0 && settings.estado.enJuego) {
        settings.estado.enJuego = false;
        settings.estado.gameOver = true;

        const txt = 'Toque Pantalla o pulse ENTER para jugar volver a jugar...';
        const args = [txt, 'center', 27, 'rgb(240, 49, 19)'];

        setTimeout(() => {
            settings.estado.gameOver = false;
            settings.estado.reJugar = true;
            settings.objeto.textos.push(new Textos(args));
        }, 5000);
    }
}

// ============================================================================
function check_resetGetLos7() {

    if (settings.objeto.jugador.getLos7 || settings.marcadores.nivel === 0) {

        settings.objeto.jugador.getLos7 = false;

        for (let diamante of settings.objeto.lossiete) {
            diamante.mostrar = false;
        }
    }
}

// ============================================================================
function check_getLos7() {

    return settings.objeto.lossiete.every(diamante => diamante.mostrar);
}

// ============================================================================
function reescalaCanvas() {
    return;
}

// ----------------------------------------------------------------------------
function borraCanvas() {
    // canvas.width = canvas.width;
    // canvas.height = canvas.height;
    settings.ctx.fillStyle = settings.colores.sueloColor;
    settings.ctx.fillRect(0, 0, settings.canvas.width, settings.canvas.height);
}

// ----------------------------------------------------------------------------
function playSonidosLoop(sonido, loop, volumen) {
    sonido.play();
    sonido.loop = loop;
    sonido.volume = volumen;
}

export {
    borraCanvas,
    checkColision,
    checkColision_abovePtos,
    check_gameOver,
    instanciar_scrolls,
    instanciar_jugador,
    instanciar_boommerang,
    instanciar_bichos,
    instanciar_pajaros,
    instanciar_textos,
    instanciar_plataformas,
    instanciar_escaleras,
    instanciar_decorativos,
    instanciar_decorativosOffgame,
    instanciar_bonus,
    instanciar_llave,
    instanciar_los7,
    instanciar_showVidas,
    check_getLos7,
    lanzar_fireWorks,
    construir_nuevoNivel,
    playSonidosLoop
};
