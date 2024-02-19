import { settings } from "./main.js";
import { ShowBonus } from "./showbonus.js";

// ============================================================================
//  Funciones auxiliares Jugador
// 
// ============================================================================
function instanciar_showBonus(bonus, esto, los7Done, args) {

    if (!los7Done) {

        if (args[7] === 1900) {
            settings.marcadores.puntos += args[4];

        } else {
            settings.marcadores.puntos += bonus.puntos;
        }
        
    } else {
        settings.marcadores.puntos += 64000;
    }

    settings.marcadores.scorePtos.innerHTML = 'Puntos: ' + settings.marcadores.puntos.toString();

    // 16, 370, (16,64,108,154,202)
    const gap = args[0]
    const anchoIni = args[1];
    const altoIni = args[2];
    const sbx = args[3];
    const sby = args[4];
    const anchoClip = args[5];
    const altoClip = args[6];
    const duracion = args[7];

    settings.objeto.showbonus.push(new ShowBonus('./img/showPtos.png', bonus.rect.x, esto.rect.y - gap, anchoIni, altoIni, sbx, sby, anchoClip, altoClip, duracion));
}

export {
    instanciar_showBonus
}
