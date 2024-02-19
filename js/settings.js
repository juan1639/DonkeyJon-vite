
// ============================================================================
export class Settings {

    constructor(escalaSel) {

        this.constante = {
            bsx: 50,
            bsy: 50,
            nro_filas: 11,
            nro_columnas: 16,
            GRAVEDAD: 1,
            FPS: 60,
            nro_DIAMANTES: 7,
            nro_niveles: 2,
            botonSelectMusica: ['Musica: On', 'Musica: Off', 'Musica: On'],
            botonSelectDificultad: ['Dificultad: Facil', 'Dificultad: Normal', 'Dificultad: Difícil'],
            pausaFireWorksNivelSuperado: 9999,
            pausaMsgNivelMostrar: 5200,
            ancho_jugador: 120,
            alto_jugador: 150
        };

        this.opciones_menuP = {
            botonSelectMusica: 0,
            botonSelectDificultad: 1
        };

        this.resolucion = [
            this.constante.bsx * this.constante.nro_columnas, 
            this.constante.bsy * this.constante.nro_filas
        ];

        this.ini_suelo = this.resolucion[1] - this.constante.bsy * 2;
        this.gap = this.constante.bsy * 6;
        this.gapMini = this.constante.bsy * 2;

        this.ini_jugador = {
            args: [
                Math.floor(this.resolucion[0] / 2),
                this.ini_suelo - this.constante.alto_jugador,
                this.constante.ancho_jugador,
                this.constante.alto_jugador
            ]
        };

        this.escala = {
            x: escalaSel,
            y: escalaSel
        };

        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        
        this.objeto = {
            scroll: [],
            plataforma: [],
            escalera: [],
            jugador: null,
            bichos: [],
            pajaros: [],
            bonus: [],
            boommerang: [],
            decorativos: [],
            lossiete: [],
            showbonus: [],
            showvidas: [],
            chispa: [],
            textos: [],
            llave: null,
            decorativosOffgame: []
        };

        this.marcadores = {
            puntos: 0,
            nivel: 1,
            vidas: 3,
            scorePtos: document.getElementById('puntos'),
            scoreNivel: document.getElementById('nivel'),
            scoreVidas: document.getElementById('vidas'),
            menuPrincipal: document.getElementById('menu__principal'),
            botonNewGame: document.getElementById('boton__newGame'),
            botonSelectDificultad: document.getElementById('boton__selectDificultad'),
            botonSelectMusica: document.getElementById('boton__selectMusica'),
            contenedorControles: document.getElementById('contenedor2__botonesControl'),
            botonNextLevel: document.getElementById('boton__NextLevel')
        };

        this.bandera = {
            nivel: [
                false, false, false, false, false,
                false, false, false, false, false,
                false, false, false, false, false,
                false, false, false, false, false
            ]
        };

        this.nro_enemigosDificultad = {
            mariq: [1, 2, 3],
            carac: [1, 2, 3],
            pajaros: [1, 2, 3],
        };

        this.nro_enemigos = {
            mariq: [2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            carac: [2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            pajaros: [2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5]
        };

        this.controles = {
            tecla_iz: false,
            tecla_de: false,
            tecla_up: false,
            tecla_do: false,
            tecla_at: false,
            tecla_music_onoff: false,
            tecla_enter: false,

            touch_iz: false,
            touch_de: false,
            touch_up: false,
            touch_do: false,
            touch_at: false,
            touch_music_onoff: false,
            touch_nextLevel: false,
            touch_newGame: false,
            touch_canvas: false
        };

        this.tecla = {
            tecla_iz: ['ArrowLeft', 'ArrowLeft'],
            tecla_de: ['ArrowRight', 'ArrowRight'],
            tecla_up: ['ArrowUp', 'ArrowUp'],
            tecla_do: ['ArrowDown', 'ArrowDown'],
            tecla_at: ['Control', ' '],
            tecla_music_onoff: ['s', 'S'],
            tecla_enter: ['Enter', 'Enter'],

            touch_iz: ['boton__le', 'flecha__le'],
            touch_de: ['boton__ri', 'flecha__ri'],
            touch_up: ['boton__up', 'flecha__up'],
            touch_do: ['boton__do', 'flecha__do'],
            touch_at: ['boton__at', 'icono__at'],
            touch_music_onoff: ['boton__music', 'boton__music'],
            touch_nextLevel: ['boton__NextLevel', 'boton__NextLevel'],
            touch_newGame: ['boton__newGame', 'boton__newGame'],
            touch_canvas: ['canvas', 'canvas']
        };

        this.estado = {
            preJuego: false,
            enJuego: true,
            jugadorDies: false,
            gameOver: false,
            reJugar: false,
            nivelSuperado: false
        };
        
        this.colores = {
            azul_fondo: 'rgb(134, 210, 230)',
            blanco_nube: 'rgb(233, 233, 233)',
            txt_amar2: 'rgb(240, 240, 170)',
            txt_amar1: 'rgb(255, 89, 19)',
            txt_amar3: 'rgb(225, 155, 29)'
        };

        this.msg = {
            nivel: false
        };
        
        this.array_decorativosOffgame = [
            [this.resolucion[0] / 2, this.resolucion[1] / 2, './img/cartel_presentacion.png', 400, 300],
            [this.resolucion[0] / 2, this.resolucion[1] / 2, './img/cartel_gameover.png', 400, 140]
        ];

        this.trucos = {
            invisible: false,
            vidasInfinitas: false
        };

        this.imagenes = {
            ssheet_jugador: new Image(),
            fondo_cielo1: new Image(),
            tile_medio: new Image(),
            tile_madera: new Image(),
            tile_metal: new Image(),
            escalera: new Image()
        };

        this.sonidos = {
            gameOver: new Audio('./audio/gameoveretro.ogg'),
            jump: new Audio('./audio/jumpbros.ogg'),
            ataque: new Audio('./audio/misc125.mp3'),
            dieThrow1: new Audio('./audio/dieThrow1.ogg'),
            dieThrow2: new Audio('./audio/dieThrow2.ogg'),
            chips1: new Audio('./audio/chipsCollide1.ogg'),
            chips2: new Audio('./audio/chipsCollide2.ogg'),
            chips3: new Audio('./audio/chipsCollide3.ogg'),
            marioTuberias: new Audio('./audio/mario_tuberias.ogg'),
            pacmanDies: new Audio('./audio/pacmandies.ogg'),
            eatingCherry: new Audio('./audio/pacmaneatingcherry.mp3'),
            eatingGhost: new Audio('./audio/pacmaneatinghost.ogg'),
            intermision: new Audio('./audio/pacmanintermision.ogg'),
            fireWorks: new Audio('./audio/fireworks.mp3'),
            musicaFondo: new Audio('./audio/music-puzzle-game1.mp3')
        };

        this.volumen = {
            gameOver: 0.8,
            jump: 0.3,
            ataque: 0.7,
            marioTuberias: 0.9,
            pacmanDies: 0.4,
            eatingCherry: 0.9,
            eatingGhost: 0.8,
            intermision: 0.6,
            fireWorks: 0.9,
            musicaFondo: 0.5
        }
    }
}

