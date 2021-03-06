/**********************************************************
 * Ensemble des fonctions utiliser pour les mechaniques du jeu
***********************************************************/

	//Collision avec un lingot d'or
	function checkPourCoffre(personnage, binLodeRunner) {
		//Boucle a travers tous les blocs
		for(let i = 0; i < tabBlocs.length;i++) {
			for(let j = 0; j < tabBlocs[i].length; j++) {
				//Si le bloc est un coffre
				if(tabBlocs[i][j].strNom == "COFFRE") {
					const COFFRE = tabBlocs[i][j];
					//Regarder si le personnage entre en collision avec le coffre
					if(COFFRE.x < personnage.fltX + CELL_DIMENSION &&
						COFFRE.x + CELL_DIMENSION > personnage.fltX &&
						COFFRE.y < personnage.fltY + CELL_DIMENSION &&
						COFFRE.y + CELL_DIMENSION > personnage.fltY) {
							if(!binLodeRunner && personnage.nCoffre == 1) {
								
							}
							else {
							//Ajouter le coffre au lodeRunner
							personnage.nCoffre++;
							//Enlever le coffre
							tabBlocs[i][j] = creerBloc(-1);
							if(binLodeRunner)
								objSons.ramasserOr.play();
							tabBlocs[i][j].x = j * CELL_DIMENSION;
							tabBlocs[i][j].x2 = tabBlocs[i][j].x + CELL_DIMENSION;
							tabBlocs[i][j].y = i * CELL_DIMENSION;
							tabBlocs[i][j].y2 = tabBlocs[i][j].y + CELL_DIMENSION;
							}
						}
				}
			}
		}
	}

	function checkMortTrou(personnage) {
		for(let i = 0; i < tabBlocs.length;i++) {
			for(let j = 0; j < tabBlocs[i].length; j++) {
				//Si le bloc est un coffre
				if(tabBlocs[i][j].strNom == "BRIQUE") {
					const BRIQUE = tabBlocs[i][j];
					//Regarder si le personnage entre en collision avec une brique
					if(BRIQUE.x < personnage.fltX + CELL_DIMENSION &&
						BRIQUE.x + CELL_DIMENSION > personnage.fltX &&
						BRIQUE.y < personnage.fltY + CELL_DIMENSION &&
						BRIQUE.y + CELL_DIMENSION > personnage.fltY) {
							//Enlever le coffre
							personnage.estMort = true;
						}
				}
			}
		}
	}

	/**
	 * Function qui détecte les collisions
	 * @param {objet Personnage} personnageA 
	 * @param {objet Personnage} personnageB 
	 * @returns s'il y a une collision entre les deux personnages
	 */
	function checkPourCollision(personnageA, personnageB) {
		if(personnageA.fltX < personnageB.fltX + CELL_DIMENSION 
			&& personnageA.fltX + CELL_DIMENSION > personnageB.fltX 
			&& personnageA.fltY < personnageB.fltY + CELL_DIMENSION 
			&& personnageA.fltY + CELL_DIMENSION > personnageB.fltY) {
				return true;
			}

		return false;
	}

    //Calcul la ligne et la colonne ou se trouve le personnage.
    function getGridPos(fltX, fltY) {
    	return { LIGNE: fltY / CELL_DIMENSION, COLONNE: fltX / CELL_DIMENSION};
    }

    //Changer l'état actuelle du personnage(Animation)
    function changerEtat(personnage, strEtat, binEtat) {
		//Remettre le compteur de sprite à 0
		personnage.spriteCounter = 0;
		//Remettre les états a false sauf Gauche et droite
		personnage.etatActuelle.haut = false;
        personnage.etatActuelle.bas = false;
        personnage.etatActuelle.tomber = false;
        personnage.etatActuelle.barre = false;
        personnage.etatActuelle.creuser = false;
		
		//Mettre l'état a true
		personnage["etatActuelle"][strEtat] = binEtat;

		//Reset l'orientation droite/gauche
		if(strEtat == 'gauche' && personnage.etatActuelle.droite)
			personnage.etatActuelle.droite = false;
		if(strEtat == 'droite' && personnage.etatActuelle.gauche)
			personnage.etatActuelle.gauche = false;
		//Si le personnage monte ou descends, il ne va ni a droite, ni a gauche
		if(personnage.etatActuelle.haut || personnage.etatActuelle.bas) {
			personnage.etatActuelle.gauche = false;
			personnage.etatActuelle.droite = false;
		}
		//console.log(personnage.etatActuelle);
    }

	/**
	 *Scan dans les 4 directions autours du personnage en paramètres
	  afin de savoir s'il y a la permission de faire les actions suivantes
	  -Marcher à gauche
	  -Marcher à droite
	  -Monter en haut
	  -Descendre en bas
	  -Doit Tomber
	  -Peux utiliser une barre
	  -Peux creuser un trou
	  Cette fonction met à jour la propriété "direction" du character "c"
	 */
      function checkActionPossible(c, binLodeRunner) {
		let binGauche = false;
		let binDroite = false;
		let binHaut = false;
		let binBas = false;
		let binTomber = false;
		let binBarre = false;
		let binCreuserGauche = false;
		let binCreuserDroite = false;

		//TOMBER
		//Seulement faire un check si le tableau de blocs a chargé
		if(tabBlocs.length >= 1) {
			//Tableau contenant les blocs sur lequel le joueur est
			let tabBlocsTemp = [ //4 Blocs a vérifier max
				{ligne: Math.floor(c.ligne), colonne: Math.floor(c.colonne)},
				{ligne: Math.floor(c.ligne), colonne: Math.ceil(c.colonne)},
				{ligne: Math.ceil(c.ligne), colonne: Math.floor(c.colonne)},
				{ligne: Math.ceil(c.ligne), colonne: Math.ceil(c.colonne)},
			];

			let tabBlocsTomber = [...new Set(tabBlocsTemp)];
			//Regarder si le joueur est sur un block complet? (Horizontalement)

			if(c.colonne - parseInt(c.colonne) == 0 && !c.etatActuelle.barre) {
				//Regarder si le bloc au dessous du joueur est le vide
				//et que le bloc sur lequel est le joueur n'est pas une barre
				if((tabBlocs[Math.floor(c.ligne + 1)][c.colonne].strNom == 'VIDE' && !tabBlocs[Math.floor(c.ligne + 1)][c.colonne].estSolide) 
				|| tabBlocs[Math.floor(c.ligne + 1)][c.colonne].strNom == 'BARRE' 
				|| tabBlocs[Math.floor(c.ligne + 1)][c.colonne].strNom == 'COFFRE') {
						//Le bloc sur lequel est le joueur nest pas une barre
							binTomber = true;
							changerEtat(c, "tomber", binTomber);
				}
			}
			

			

			//Si le joueur n'est pas entrain de tomber
			if(!binTomber) {
				//GAUCHE
				//Regarder si le personnage n'a pas franchi la limite à gauche
				if(c.fltX > 0) {
					//Sélectionner les blocs à gauche du personnage
					let tabBlocsGauche = [
						tabBlocs[Math.floor(c.ligne)][Math.ceil(c.colonne) - 1],
						tabBlocs[Math.ceil(c.ligne)][Math.ceil(c.colonne) - 1]
					];
					//Possible d'aller a gauche
					if(!tabBlocsGauche[0].estSolide && !tabBlocsGauche[1].estSolide) 
							binGauche = true;

				}

				//DROITE
				//Regarder si le personnage n'a pas franchi la limite à droite
				if(c.fltX + CELL_DIMENSION < objCanvas.width) {
					//Sélectionner les blocs à droite du personnage
					let tabBlocsDroite = [
						tabBlocs[Math.floor(c.ligne)][Math.floor(c.colonne) + 1],
						tabBlocs[Math.ceil(c.ligne)][Math.floor(c.colonne) + 1]
					];
					//Possible d'aller a droite
					if(!tabBlocsDroite[0].estSolide && !tabBlocsDroite[1].estSolide)
						binDroite = true;
				}

				//HAUT
				//Regarder si le personnage n'a pas franchi la limite en haut
				if(c.fltY > 0) {
					//Regarder si le joueur est sur un block complet? (Horizontalement)
					if(c.colonne - parseInt(c.colonne) == 0) {
						//Regarder si le joueur est sur une echelle?
						if(tabBlocs[Math.ceil(c.ligne)][c.colonne].strNom == 'ECHELLE') {
							//Regarder si le bloc au dessus du joueur est un bloc vide ou une echelle?
							if(tabBlocs[Math.ceil(c.ligne - 1)][c.colonne].strNom == 'ECHELLE' || tabBlocs[Math.ceil(c.ligne - 1)][c.colonne].strNom == 'VIDE') {
								binHaut = true;
							}
						}
					}
				}

				//BAS
				//Regarder si le personnage n'a pas franchi la limite en haut
				if(c.fltY + CELL_DIMENSION < (CELL_HEIGHT * CELL_DIMENSION)) {
					//Regarder si le joueur est sur un block complet? (Horizontalement)
					if(c.colonne - parseInt(c.colonne) == 0) {
						//Regarder si le joueur est sur une echelle ou dans le vide?
						if(tabBlocs[Math.floor(c.ligne)][c.colonne].strNom == 'ECHELLE' || tabBlocs[Math.floor(c.ligne)][c.colonne].strNom == 'VIDE') {
							//Regarder si le bloc au dessous du joueur est une echelle? Q: Est-ce qu'on permet de tomber si il y a du vide en dessous d'une echelle?
							if(tabBlocs[Math.floor(c.ligne + 1)][c.colonne].strNom == 'ECHELLE') {
								binBas = true;
							}
						}
					}
				}
				//BARRE
				//Regarder si le joueur est sur un block complet? (Verticalement)
				if(c.fltX > 0) {
					if(c.ligne - parseInt(c.ligne) == 0) {
						//Regarder si le joueur se tient sur une barre et si le bloc a gauche du joueur est une barre
						if(tabBlocs[c.ligne][Math.floor(c.colonne)].strNom == 'BARRE' 
						|| tabBlocs[c.ligne][Math.ceil(c.colonne)].strNom == 'BARRE')
							binBarre = true;
					}
				}
				if(binLodeRunner) {
					//Creuser un trou
					//Si le joueur est à l'état gauche ou droite
					if(c.fltX > 0 && c.fltX + CELL_DIMENSION < objCanvas.width) {
						//Si le jour n'est pas sur une barre
						if(!c.etatActuelle.barre) {
							//Regarder si le joueur est sur un block complet? (Verticalement)
							if(c.ligne - parseInt(c.ligne) == 0) {
								let blocGauche = tabBlocs[c.ligne + 1][Math.ceil(c.colonne) - 1]
								let blocDroite = tabBlocs[c.ligne + 1][Math.floor(c.colonne) + 1];
								//Si le joueur peux creuser à gauche
								//Est-ce que le block est une brique ?
								if(blocGauche.strNom == 'BRIQUE') {
									//Prendre le bloc au dessus du bloc
									blocGauche = tabBlocs[c.ligne][Math.ceil(c.colonne) - 1];
									//Si le bloc au dessus est vide
									if(blocGauche.strNom == 'VIDE') {
										binCreuserGauche = true;
									}
								}
								//Si le joueur peux creuser à droite
								//Est-ce que le block est une brique ?
								if(typeof blocDroite !== 'undefined' && blocDroite.strNom == 'BRIQUE') {
									//Prendre le bloc au dessus du bloc
									blocDroite = tabBlocs[c.ligne][Math.ceil(c.colonne) + 1];
									//Si le bloc au dessus est vide
									if(typeof blocDroite !== 'undefined' && blocDroite.strNom == 'VIDE') {
										binCreuserDroite = true;
									}
								}
							}
						}
					}
				}

			}
		}

		

		return (binLodeRunner) ? {
			gauche: binGauche,
			droite: binDroite,
			haut: binHaut,
			bas: binBas,
			tomber: binTomber, //Est-ce que c'est une action? C'est une action mais pas un choix?
			barre: binBarre,
			creuserGauche: binCreuserGauche,
			creuserDroite: binCreuserDroite
		}: {
			gauche: binGauche,
			droite: binDroite,
			haut: binHaut,
			bas: binBas,
			tomber: binTomber, //Est-ce que c'est une action? C'est une action mais pas un choix?
			barre: binBarre
		};
	}