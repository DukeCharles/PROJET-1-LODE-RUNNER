/**********************************************************
 * Ensemble des fonctions  utilisé par les gardes.
***********************************************************/

	//INIT
	function initGardes() {
		let imgGarde = new Image();
		imgGarde.src = 'ressources/images/garde_spritesheet.png';
		//Création des gardes
		if(tabGardes == null)
			tabGardes = new Array();

		for(let i = tabGardes.length; i < 2 + intNiveau; i++) {
			objGarde = new Object;
			
			//Sprite de LodeRunner
			objGarde.spriteSheet = imgGarde;
			objGarde.spriteCounter = 0;
			
			//Couleur -> Il est possible que les gardes ont les mêmes couleurs
			objGarde.RED = Math.floor(Math.random() * Math.floor(255));
			objGarde.GREEN = Math.floor(Math.random() * Math.floor(255));
			objGarde.BLUE = Math.floor(Math.random() * Math.floor(255));

			//Si le garde est mort
			objGarde.estMort = false;

			//Nombre de coffre
			objGarde.nCoffre = 0;

			//Si le garde est pris dans un trou
			objGarde.estCoincer = false;
			objGarde.coincerTimer = null;

			//Timer pour action
			objGarde.actionTimer = null;

			//Coordonnées
			let objCoord = getCoord(tabGardes);

			objGarde.fltX = objCoord.c * CELL_DIMENSION;
			objGarde.fltY = objCoord.l * CELL_DIMENSION;

			//Position de l'image dans la grillle
			objGarde.ligne = objCoord.c;
			objGarde.colonne = objCoord.l;

			//Vitesse
			objGarde.fltVitesse = 4;

			//États
			objGarde.actionPossible = {
				gauche: true,
				droite: true,
				haut: true,
				bas: true,
				tomber: false, 
				barre: false
			};

			//Orientation pour animation
			objGarde.etatActuelle = {
				gauche: true,
				droite: false,
				haut: false,
				bas: false,
				tomber: false,
				barre: false
			};

			tabGardes.push(objGarde);
		}

	}

	//MAJ
	function MAJ_Garde() {
		tabGardes.forEach((garde, index, tabGardes) => {
			//Mettre a jour Ligne et Colonne -> gridPos
			garde.ligne = getGridPos(garde.fltX, garde.fltY).LIGNE;
			garde.colonne = getGridPos(garde.fltX, garde.fltY).COLONNE;
			//Action possible
			garde.actionPossible = checkActionPossible(garde, false);
			//Regarder pour collision avec coffre
			checkPourCoffre(garde, false);

			//Collision avec autre garde [OPTIONNELLE]

			//Se fait écraser dans un trou
			checkMortTrou(garde);

			//Regarde si le garde est coincer
			garde.estCoincer = checkCoincer(garde);

			//Si le garde est coincé
			if(garde.estCoincer) {
				//Ajouter points au lodeRunner
				objLodeRunner.intScore += PTS_GARDE_TROU;
				//Le bloc ou le garde se trouve est solide
				console.log("Ligne: "+garde.ligne+" Col: "+garde.colonne);
				if(tabBlocs[Math.ceil(garde.ligne)][Math.floor(garde.colonne)] != undefined)
					tabBlocs[Math.ceil(garde.ligne)][Math.floor(garde.colonne)].estSolide = true;
				//Mettre un timer de 4 secondes avant que le garde monte sur le bloc au dessus
				if(garde.coincerTimer == null) {
					garde.coincerTimer = objGUI.intTime;
				}
				if(objGUI.intTime - garde.coincerTimer >= 4000) {
					garde.fltX += CELL_DIMENSION;
					garde.fltY -= CELL_DIMENSION;
				}
				 //Si le garde à de l'argent, il met sur le bloc au dessus
				 if(garde.nCoffre == 1) {
					 //Enlever le coffre
					 garde.nCoffre--;
					 //Le mettre au dessus du garde
					 const ligne = Math.ceil(garde.ligne) - 1;
					 const col = Math.floor(garde.colonne);
					 tabBlocs[ligne][col] = creerBloc(2);
				     tabBlocs[ligne][col].x = col * CELL_DIMENSION;
					 tabBlocs[ligne][col].x2 = tabBlocs[ligne][col].x + CELL_DIMENSION;
					 tabBlocs[ligne][col].y = ligne * CELL_DIMENSION;
					 tabBlocs[ligne][col].y2 = tabBlocs[ligne][col].y + CELL_DIMENSION;
				 }
			}
			else
				garde.coincerTimer = null;
			

			//Si le garde est mort
			if(garde.estMort) {
				if(garde.nCoffre == 1) {
					//Enlever le coffre
					garde.nCoffre--;
					//Le mettre au dessus du garde
					const ligne = Math.ceil(garde.ligne) - 1;
					const col = Math.floor(garde.colonne);
					tabBlocs[ligne][col] = creerBloc(2);
					tabBlocs[ligne][col].x = col * CELL_DIMENSION;
					tabBlocs[ligne][col].x2 = tabBlocs[ligne][col].x + CELL_DIMENSION;
					tabBlocs[ligne][col].y = ligne * CELL_DIMENSION;
					tabBlocs[ligne][col].y2 = tabBlocs[ligne][col].y + CELL_DIMENSION;
				}
				objLodeRunner.intScore += PTS_GARDE_MEURT;
				tabGardes.splice(index, 1);
			}

			//Si le garde est entrain de tomber
			if(garde.actionPossible.tomber) {
				garde.fltY += objLodeRunner.fltVitesse;
			}
			else {
				//Faire un mouvement
				if(garde.actionTimer == null) {
					garde.actionTimer = objGUI.intTime;
				}
				if(objGUI.intTime - garde.actionTimer >= 200) {
					let action = getActionGarde(garde);
					changerEtat(garde, action, true);
					faireAction(garde, garde.etatActuelle);
					garde.actionTimer = objGUI.intTime;
				}
			}

		});
		//Si un garde est mort
		if(tabGardes.length < 2 + intNiveau)
			initGardes();
	}

	//DESSINER
	function dessinerGardes() {
		objC2D.save();
		//Dessiner tous les gardes à leur positions
		tabGardes.forEach((garde) => {
			//Default placeholder
			objC2D.drawImage(garde.spriteSheet,
						     garde.spriteCounter * CELL_DIMENSION,
							 0,
							 CELL_DIMENSION,
							 CELL_DIMENSION,
			 				 garde.fltX,
							 garde.fltY,
							 CELL_DIMENSION,
							 CELL_DIMENSION);

			//Modifier la couleur des chandails des gardes
			objC2D.putImageData(
				recolorGardeImage(objC2D.getImageData(garde.fltX, garde.fltY, CELL_DIMENSION, CELL_DIMENSION), garde), //ImageData
				garde.fltX,
				garde.fltY);
		});
		objC2D.restore();
	}

/**********************************************************
*Fonctions complémentaires utilisé par les gardes.
***********************************************************/

    
    //Tableau des emplacements possible pour les gardes
	let tabEmplacementGardes = [
		{l: 12, c: 21},
		{l: 12, c: 22},
		{l: 12, c: 23},
		{l: 12, c: 24},
		{l: 12, c: 25},
		{l: 12, c: 27},
		{l: 12, c: 13},
		{l: 12, c: 14},
		{l: 12, c: 15},
		{l: 5, c: 27},
		{l: 5, c: 25},
		{l: 5, c: 23},
		{l: 5, c: 22},	
		{l: 2, c: 27},
		{l: 2, c: 25},
		{l: 2, c: 23},
		{l: 2, c: 22},
		{l: 2, c: 21},
		{l: 9, c: 20},
		{l: 9, c: 19},
		{l: 9, c: 18},
		{l: 9, c: 17},
		{l: 9, c: 15},
		{l: 9, c: 14},
		{l: 6, c: 13},
		{l: 10, c: 12},
		{l: 10, c: 10},
		{l: 6, c: 8},
		{l: 6, c: 6},
		{l: 1, c: 14},
		{l: 1, c: 15},
		{l: 1, c: 16},
		{l: 1, c: 18},
		{l: 1, c: 19},
		{l: 2, c: 6},
		{l: 2, c: 5},
		{l: 2, c: 4},
		{l: 2, c: 3},
		{l: 2, c: 2},
		{l: 2, c: 1},
		{l: 2, c: 0},
		{l: 6, c: 4},
		{l: 6, c: 2},
		{l: 8, c: 0},
		{l: 8, c: 1},
		{l: 11, c: 0},
		{l: 11, c: 1},
		{l: 11, c: 2},
		{l: 11, c: 4},		
	];

	/**Faire une action selon l'état
	 * 
	 * @param {garde} garde qui fait l'action
	 * @param {*} etat les états actuelle du garde
	 */
	function faireAction(garde, etat) {
		//haut
		if(etat.haut) {
			garde.fltY -= garde.fltVitesse;
		}
		//Bas
		else if(etat.bas) {
			garde.fltY += garde.fltVitesse;
		}
		//Gauche
		else if(etat.gauche) {
			garde.fltX -= garde.fltVitesse;
		}
		//Droite
		else if(etat.droite) {
			garde.fltX += garde.fltVitesse;
		}
	}

    function getCoord() {
		Math.floor(Math.random() * Math.floor(tabEmplacementGardes.length - 1));
        return tabEmplacementGardes[Math.floor(Math.random() * Math.floor(tabEmplacementGardes.length - 1))];
    }

	/**
	 * 
	 * @param {ImageData} imgData Les données de l'image en pixel à recolorier
	 * @param {Object} garde L'objet du garde correspondant
	 * @returns l'imageData ayant subi des modifications par rapport à sa couleur.
	 */
	function recolorGardeImage(imgData, garde) {
			for(let p = 0; p < imgData.data.length; p += 4) {

				//Changer la couleur du chandail du garde
				if(imgData.data[p] >= 45 && imgData.data[p] <= 55
				&& imgData.data[p+1] >= 70 && imgData.data[p+1] <= 80
				&& imgData.data[p+2] >= 160 && imgData.data[p+2] <= 170) {
					imgData.data[p] = garde.RED;
					imgData.data[p+1] = garde.GREEN;
					imgData.data[p+2] = garde.BLUE;
				}
				//Regarde si le garde est en possèssion de coffre d'or
				if(garde.nCoffre > 0) {
					//Si oui recolorié les pantalons de façons doré
					if(imgData.data[p] >= 113 && imgData.data[p] <= 123
						&& imgData.data[p+1] >= 38 && imgData.data[p+1] <= 47
						&& imgData.data[p+2] <= 5 ) {
							imgData.data[p] = 255;
							imgData.data[p+1] = 200;
							imgData.data[p+2] = 0;
						}
				}

			}

		return imgData;
	}

	/**Regarde si le garde est coincer dans un trou
	 * @returns si le garde est coincé ou non
	 */
	function checkCoincer(garde) {
		return (Object.values(garde.actionPossible).some((action) => {return action})) ? false: true;
	}

	//Algorithme du garde
	function getActionGarde(garde) {
		//Regarde toute les actions possible du garde
		let tabActions = new Array();
		for (let [action, valeur] of Object.entries(garde.actionPossible)) {
			if(valeur)
				tabActions.push(action);
		  }
		//Choisi une de ces actions au hasard
		let intAction = Math.floor(Math.random() * Math.floor(tabActions.length));
		  //console.log("Action = ")
		  //console.log(tabActions[intAction]);
		return tabActions[intAction];

	}

