// ============================================================================
//  D O N K E Y J O N   ... By Juan Eguia
// 
// ----------------------------------------------------------------------------
import { Settings } from './settings.js';

// ----------------------------------------------------------------------------
import {
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
    borraCanvas,
    check_gameOver,
    playSonidosLoop
} from "./functions.js";

// ----------------------------------------------------------------------------
import { 
    eventos_touchStart,
    eventos_touchEnd,
    eventos_keyDown,
    eventos_keyUp,
    eventos_click
} from "./controles.js";

// ----------------------------------------------------------------------------
const escalas_validas = [1, 2, 3, 4];
let escalaSel = 1;
let settings;
let dxdy = [0, 0];

// ===========================================================================
//  Funcion Inicializadora
// 
// ---------------------------------------------------------------------------
window.onload = () => {

    settings = new Settings(escalaSel);

    // --------------------------------------------------------------------
    const keysListen = Object.keys(settings.marcadores);

    for (let boton of keysListen) {
        if (boton === 'botonSelectMusica' || boton === 'botonSelectDificultad') {
            settings.marcadores[boton].addEventListener('click', () => {

                settings.opciones_menuP[boton] ++;
                if (settings.opciones_menuP[boton] >= 3) settings.opciones_menuP[boton] = 0;

                const opcion = settings.opciones_menuP[boton];

                settings.marcadores[boton].innerHTML = settings.constante[boton][opcion];

                playSonidosLoop(settings.sonidos.dieThrow1, false, 0.9);
                playSonidosLoop(settings.sonidos.chips1, false, 0.9);
            });
        }
    }

    settings.marcadores.botonNewGame.addEventListener('click', () => {
        
        playSonidosLoop(settings.sonidos.dieThrow1, false, 0.9);
        playSonidosLoop(settings.sonidos.chips2, false, 0.9);
        comenzar_instancias();
    });
}

// ===========================================================================
//  Instancias
// ---------------------------------------------------------------------------
function comenzar_instancias() {

    settings.marcadores.menuPrincipal.style.display = 'none';
    settings.canvas.style.display = 'flex';

    const resX = settings.resolucion[0];
    const resY = settings.resolucion[1];

    settings.canvas.width = resX;
    settings.canvas.height = resY;
    settings.ctx.scale(settings.escala.x, settings.escala.y);

    // ---------------------------------------------------------------
    instanciar_scrolls();
    instanciar_jugador();
    instanciar_boommerang();
    instanciar_bichos();
    instanciar_pajaros();

    instanciar_plataformas(0);
    instanciar_escaleras(0);
    instanciar_decorativos(0);
    //instanciar_decorativosOffgame(0);
    instanciar_bonus(0);
    instanciar_llave(0);

    instanciar_textos();
    instanciar_los7();
    instanciar_showVidas();

    // ---------------------------------------------------------------
    setInterval(() => {
        bucle_principal();
    }, 1000 / settings.constante.FPS);

    setTimeout(() => {
        comenzar_partida();
    }, 999);
}

// ====================================================================
function comenzar_partida() {
    
    settings.estado.preJuego = false;
    settings.estado.enJuego = true;
    // settings.objeto.decorativosOffgame.pop();

    settings.msg.nivel = true;
    
    setTimeout(() => {
        settings.msg.nivel = false;
    }, settings.constante.pausaMsgNivelMostrar);

    if (settings.opciones_menuP.botonSelectMusica != 1) {
        playSonidosLoop(settings.sonidos.musicaFondo, true, settings.volumen.musicaFondo);
    }
}

// ===================================================================
function bucle_principal() {

    borraCanvas();

    const keyObjs = Object.keys(settings.objeto);

    for (let objeto of keyObjs) {

        if (objeto === 'jugador') {
            dxdy = settings.objeto[objeto].dibuja();

        } else if (objeto === 'lossiete' || objeto === 'showvidas') {
            for (let noArg of settings.objeto[objeto]) {
                noArg.dibuja();
            }
        
        } else if (objeto === 'llave') {
            settings.objeto[objeto].dibuja(dxdy);

        } else {
            for (let arg of settings.objeto[objeto]) {
                arg.dibuja(dxdy);
            }
        }
    }
    
    check_gameOver();
}

export { settings };
