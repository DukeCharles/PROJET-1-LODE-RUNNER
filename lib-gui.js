
/**********************************************************
 * Functions utilisées pour l'affichage du GUI
***********************************************************/

//Formattage du score avec l'ajout des 0 au début au besoin
function getScoreFormat(intScore) {
    let strPadding = "0000000";
    return "Score: "+strPadding.substring(0, (strPadding.length - intScore.toString().length)) + intScore.toString();
}

//Formattage des ms en un format de temps lisible
function getTimeText(ms) {
    let timePassed = new Date(0);
    timePassed.setHours(0, 0, 0, ms);

    const STR_MINUTES = (timePassed.getMinutes() < 10) ? "0"+timePassed.getMinutes():timePassed.getMinutes();
    const STR_SECONDS = (timePassed.getSeconds() < 10) ? "0"+timePassed.getSeconds():timePassed.getSeconds();

    return STR_MINUTES+":"+STR_SECONDS;;
}


/**********************************************************
 * Fonctions utilisées dans le debugging du jeu
***********************************************************/

//Affiche l'état actuelle du personnage
//Qu'est-ce qu'il est entrain de faire.
function getEtatActuelle(objPersonnage) {
    let strEtat = "";
    let tabEtat = Object.keys(objPersonnage.etatActuelle);
    for(let i = 0; i < tabEtat.length; i++) {
        strEtat += (objPersonnage.etatActuelle[tabEtat[i]]) ? tabEtat[i]+" ": "";
    }
    return strEtat;
}

function getActionPossible(objPersonnage) {
    let strAction = "";
    let tabAction = Object.keys(objPersonnage.actionPossible);
    for(let i = 0; i < tabAction.length; i++) {
        strAction += (objPersonnage.actionPossible[tabAction[i]]) ? tabAction[i]+" - ": "";
    }
    return strAction;
}
