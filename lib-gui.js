
/**********************************************************
 * Functions utilisées pour l'affichage du GUI
***********************************************************/

    //Fonction init
    function initGUI() {
		objGUI = new Object;
		objGUI.objDate = new Date();
		objGUI.intTime = 0;
		objGUI.intNiveau = intNiveau;
	}

    //Fonction MAJ
    function mettreAjourGUI() {
		//update Temps
		mettreAjourTemps();
	}

    function mettreAjourTemps() {
    	let objDate2 =  new Date();
        if(objGUI.objDate != null && objDate2 != null) {
            let msDifference = objDate2.getTime() - objGUI.objDate.getTime();
            objGUI.objDate = objDate2;
            objGUI.intTime += msDifference;
        }
	}

    //Fonction Dessiner

    function dessinerGUI() {
		objC2D.save();
		//Dessiner le background du GUI
		objC2D.fillStyle = 'black';
		objC2D.fillRect(0, CELL_DIMENSION*CELL_HEIGHT, objCanvas.width, objCanvas.height);
		
		objC2D.font = '20px Audiowide';
		objC2D.fillStyle = 'orange';
		//Afficher Score
			//MAX_SCORE est 9 999 999
		objC2D.fillText(getScoreFormat(objLodeRunner.intScore + intScoreTotal), 50, objCanvas.height - CELL_DIMENSION);
		//Afficher Temps
		objC2D.fillText("Temps: "+getTimeText(objGUI.intTime), 300, objCanvas.height - CELL_DIMENSION);
		//Afficher Niveau
		objC2D.fillText("Niveau: "+intNiveau, 500, objCanvas.height - CELL_DIMENSION);
		//Afficher Vie
		objC2D.fillText("Vies: "+intNbreVies, 650, objCanvas.height - CELL_DIMENSION);
		objC2D.restore();
	}

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

    //Dessiner
    function dessinerDebug() {
		objC2D.save();
		//GRID
		//HITBOX BRIQUE, COFFRE, ECHELLE, BARRIER, BARRE
		for(let i = 0; i < tabBlocs.length; i++) {
			for(let j = 0; j < tabBlocs[i].length; j++) {
					if(tabBlocs[i][j].strNom == 'VIDE')
						objC2D.strokeStyle = 'green';
					else if(tabBlocs[i][j].strNom == 'COFFRE')
						objC2D.strokeStyle = 'yellow';
					else if(tabBlocs[i][j].strNom == 'ECHELLE')
						objC2D.strokeStyle = 'red';
					else if(tabBlocs[i][j].strNom == 'BRIQUE' || tabBlocs[i][j].strNom == 'BETON')
						objC2D.strokeStyle = 'cyan';

					objC2D.linewidth = 2;
					objC2D.strokeRect(tabBlocs[i][j].x, tabBlocs[i][j].y, CELL_DIMENSION, CELL_DIMENSION);
			}
		}
		
		//INFORMATION LODE RUNNER
		objC2D.font = '15px Arial';
		objC2D.fillStyle = 'pink';
		//Cordonnées en pixel
		objC2D.fillText("X: "+objLodeRunner.fltX+" Y: "+objLodeRunner.fltY, 0, 15);
		//Cordonnées en pixel + La grosseur de l'image
		//objC2D.fillText("X2: "+objLodeRunner.fltX2+" Y2: "+objLodeRunner.fltY2, 0, 30);
		//Ligne et colonne
		objC2D.fillText("L: "+objLodeRunner.ligne+" C: "+objLodeRunner.colonne, 0, 45);
		//État actuelle
		objC2D.fillText("État: "+getEtatActuelle(objLodeRunner), 0, 60);
		objC2D.fillText("Action Possible: "+getActionPossible(objLodeRunner), 0, 75);
		objC2D.fillText("SpriteCounter: "+objLodeRunner.spriteCounter, 0, 90);

		//HITBOX LODE RUNNER
		objC2D.linewidth = 50;
		objC2D.strokeStyle = 'blue';
		objC2D.strokeRect(objLodeRunner.fltX, objLodeRunner.fltY, CELL_DIMENSION, CELL_DIMENSION);

		//HITBOX GARDE
		objC2D.restore();
	}

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
