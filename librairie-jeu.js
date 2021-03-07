/**********************************************************
 * Ensemble des fonctions utiliser pour les mechaniques du jeu
***********************************************************/

    //Calcul la ligne et la colonne ou se trouve le personnage.
    function getGridPos(fltX, fltY) {
    return { LIGNE: fltY / CELL_DIMENSION, COLONNE: fltX / CELL_DIMENSION};
    }

    //Changer l'état actuelle du personnage(Animation)
    function changerEtat(personnage, strEtat) {
		//Remettre le compteur de sprite à 0
		personnage.spriteCounter = 0;
		//Remettre les états a false sauf Gauche et droite
		personnage.etatActuelle.haut = false;
        personnage.etatActuelle.bas = false;
        personnage.etatActuelle.tomber = false;
        personnage.etatActuelle.barre = false;
        personnage.etatActuelle.creuser = false;
        personnage.etatActuelle.mourrir = false;
		
		//Mettre l'état a true
		personnage["etatActuelle"][strEtat] = true;

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
		console.log(personnage.etatActuelle);
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
      function checkActionPossible(c) {
		let binGauche = false;
		let binDroite = false;
		let binHaut = false;
		let binBas = false;
		let binTomber = false;
		let binBarre = false;
		let binCreuser = false;

		//TOMBER
		//Seulement faire un check si le tableau de blocs a chargé
		if(tabBlocs.length >= 1) {
			//Regarder si le joueur est sur un block complet? (Horizontalement)
			if(c.colonne - parseInt(c.colonne) == 0) {
				//Regarder si le bloc au dessous du joueur est le vide 
				//et que le bloc sur lequel est le joueur n'est pas une barre
				if((tabBlocs[Math.floor(c.ligne + 1)][c.colonne].strNom == 'VIDE' || 
					tabBlocs[Math.floor(c.ligne + 1)][c.colonne].strNom == 'BARRE') && tabBlocs[Math.floor(c.ligne)][c.colonne].strNom != 'BARRE') {
						binTomber = true;
						changerEtat(objLodeRunner, "tomber");
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
					if(!tabBlocsGauche[0].isSolid && !tabBlocsGauche[1].isSolid) 
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
					if(!tabBlocsDroite[0].isSolid && !tabBlocsDroite[1].isSolid)
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

				//Creuser un trou
				//Si le joueur est à l'état gauche ou droite
				if((c.etatActuelle.gauche || c.etatActuelle.droite) && c.fltX > 0 && c.fltX + CELL_DIMENSION < objCanvas.width) {
					//Si le jour n'est pas sur une barre
					if(!c.etatActuelle.barre) {
						//Regarder si le joueur est sur un block complet? (Verticalement)
						if(c.ligne - parseInt(c.ligne) == 0) {
							//Si le block dans la direction du joueur est une brique
							let blocTest = (c.etatActuelle.gauche) ?  tabBlocs[c.ligne + 1][Math.ceil(c.colonne) - 1]: tabBlocs[c.ligne + 1][Math.floor(c.colonne) + 1];
							//Est-ce que le block est une brique ?
							if(blocTest.strNom == 'BRIQUE') {
								//Prendre le bloc au dessus du bloc
								blocTest = (c.etatActuelle.gauche) ?  tabBlocs[c.ligne][Math.ceil(c.colonne) - 1]: tabBlocs[c.ligne][Math.floor(c.colonne) + 1];
								//Si le bloc au dessus est vide
								if(blocTest.strNom == 'VIDE') {
									binCreuser = true;
								}
							}
						}
					}
				}

			}
		}

		return {
			gauche: binGauche,
			droite: binDroite,
			haut: binHaut,
			bas: binBas,
			tomber: binTomber, //Est-ce que c'est une action? C'est une action mais pas un choix?
			barre: binBarre,
			creuser: binCreuser,
			mourrir: false
		};
	}

	//Creuser trou
	function creuserTrou(binGauche, binDroite) {

	}
	

	/**
	 *Gère toute les entrées faites sur le clavier par le joueur
	*/
	function gererControle() {
		//DEBUG #TODO supprimer à la fin
		console.log("KeyCode -> "+event.keyCode);

		//Creuser un trou Droite -> X
		if(event.keyCode == 88) {
			//Si un trou peux être creuser
			if(objLodeRunner.actionPossible.creuser) {
				changerEtat(objLodeRunner, 'creuser');
				//Si LR creuse a gauche
				if(objLodeRunner.etatActuelle.gauche) {
					//Remplacer la brique par du vide
					tabBlocs[objLodeRunner.ligne + 1][Math.ceil(objLodeRunner.colonne) - 1] = creerBloc(-1);
					//Ajouter la brique avec un temps actuelle
					tabBlocsEffacer.push({ligne: objLodeRunner.ligne + 1, colonne: Math.ceil(objLodeRunner.colonne) - 1, timer: objGUI.intTime});
					//Ajouter la brique avec un timer de 8 secondes dans un tableau
				}
				//Si LR creuse a droite
				else if(objLodeRunner.etatActuelle.droite) {
					tabBlocs[objLodeRunner.ligne + 1][Math.ceil(objLodeRunner.colonne) - 1] = creerBloc(-1);
					//Ajouter la brique avec un temps actuelle
					tabBlocsEffacer.push({ligne: objLodeRunner.ligne + 1, colonne: Math.ceil(objLodeRunner.colonne) - 1, timer: objGUI.intTime});
				}
			}
		}

		//Creuser un trou Gauche

		//Debug F3
		if(event.keyCode == 114) {
			if(binDebug)
				binDebug = false;
			else if(!binDebug)
				binDebug = true;
		}

		//Bouger droite	
		if(event.keyCode == 39) {
			//Si actionPossible.gauche est possible
			if(objLodeRunner.actionPossible.droite) {
				//Si actionPossible.Barre est possible
				if(objLodeRunner.actionPossible.barre) {
					//Si l'état gauche et barre sont true.
					if(objLodeRunner.etatActuelle.droite && objLodeRunner.etatActuelle.barre  && objLodeRunner.fltX >= 0) {
						//Avancez dans la direction
						objLodeRunner.fltX += objLodeRunner.fltVitesse;
						//Si le spriteCounter est à la limite pour cette animation
						if(objLodeRunner.spriteCounter == 3)
							//Remettre le sprite Counter à 0
							objLodeRunner.spriteCounter = 0;
						//Sinon
						else {
							//Incrémenter le sprite Counter de 1
							objLodeRunner.spriteCounter++;
						}
					}
					//Sinon, les mettres à jours
					else {
						changerEtat(objLodeRunner, "droite");
						changerEtat(objLodeRunner, "barre");
					}
				}
				//Sinon cela veut dire que l'on marche vers la gauche
				else {
					//Si l'état gauche est true
					if(objLodeRunner.etatActuelle.droite 
						&& !objLodeRunner.etatActuelle.barre
						&& objLodeRunner.fltX <= objCanvas.width + CELL_DIMENSION) {
						//Avancez dans la direction
						objLodeRunner.fltX += objLodeRunner.fltVitesse;
						//Si le spriteCounter est à la limite pour cette animation
						if(objLodeRunner.spriteCounter == 3)
							//Remettre le sprite Counter à 0
							objLodeRunner.spriteCounter = 0;
						//Sinon
						else
							//Incrémenter le sprite Counter de 1
							objLodeRunner.spriteCounter++;
					}
					//Sinon le mettre à jour
					else
						changerEtat(objLodeRunner, "droite");
				}
			}
		}

		//Bouger gauche
		if(event.keyCode == 37) {
			//Si actionPossible.gauche est possible
			if(objLodeRunner.actionPossible.gauche) {
				//Si actionPossible.Barre est possible
				if(objLodeRunner.actionPossible.barre) {
					//Si l'état gauche et barre sont true.
					if(objLodeRunner.etatActuelle.gauche && objLodeRunner.etatActuelle.barre  && objLodeRunner.fltX >= 0) {
						//Avancez dans la direction
						objLodeRunner.fltX -= objLodeRunner.fltVitesse;
						//Si le spriteCounter est à la limite pour cette animation
						if(objLodeRunner.spriteCounter == 3)
							//Remettre le sprite Counter à 0
							objLodeRunner.spriteCounter = 0;
						//Sinon
						else
							//Incrémenter le sprite Counter de 1
							objLodeRunner.spriteCounter++;
					}
					//Sinon, les mettres à jours
					else {
						changerEtat(objLodeRunner, "gauche");
						changerEtat(objLodeRunner, "barre");
					}
				}
				//Sinon cela veut dire que l'on marche vers la gauche
				else {
					//Si l'état gauche est true
					if(objLodeRunner.etatActuelle.gauche
						&& !objLodeRunner.etatActuelle.barre
						&& objLodeRunner.fltX >= 0) {
						//Avancez dans la direction
						objLodeRunner.fltX -= objLodeRunner.fltVitesse;
						//Si le spriteCounter est à la limite pour cette animation
						if(objLodeRunner.spriteCounter == 3)
							//Remettre le sprite Counter à 0
							objLodeRunner.spriteCounter = 0;
						//Sinon
						else
							//Incrémenter le sprite Counter de 1
							objLodeRunner.spriteCounter++;
					}
					//Sinon le mettre à jour
					else
						changerEtat(objLodeRunner, "gauche");
				}
			}
		}

		//Monter
		if(event.keyCode == 38) {
			if(objLodeRunner.actionPossible.haut) {
				if(objLodeRunner.etatActuelle.haut) {
					objLodeRunner.fltY -= objLodeRunner.fltVitesse;
					if(objLodeRunner.spriteCounter >= 3)
						objLodeRunner.spriteCounter = 0;
					else
						objLodeRunner.spriteCounter++;
				}
				else
					changerEtat(objLodeRunner, "haut");
			}
			//Si actionPossible = barre
		}

		//Descendre
		if(event.keyCode == 40) {
			if(objLodeRunner.actionPossible.bas) {
				if(objLodeRunner.etatActuelle.bas) {
					objLodeRunner.fltY += objLodeRunner.fltVitesse;
					if(objLodeRunner.spriteCounter >= 3)
						objLodeRunner.spriteCounter = 0;
					else
						objLodeRunner.spriteCounter++;
				}
				else
					changerEtat(objLodeRunner, "bas");
			}
		}
	}