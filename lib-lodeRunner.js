/**********************************************************
 * Functions utilisées par le personnage lodeRunner
***********************************************************/

    //Init
    function initLodeRunner() {
		//Sprites
		let imgSpriteSheet = new Image();
		imgSpriteSheet.src = 'ressources/images/lodeRunner_spritesheet.png'

			objLodeRunner = new Object;
			//Sprite de LodeRunner
			objLodeRunner.spritesheet = imgSpriteSheet;
			objLodeRunner.spriteCounter = 0;
			objLodeRunner.estMort = false;
			//NiveauScore
			objLodeRunner.intScore = 0;
			//Nombre de coffre
			objLodeRunner.nCoffre = 0;
			//Coordonnées
			objLodeRunner.fltX = (CELL_WIDTH * CELL_DIMENSION) / 2;
			objLodeRunner.fltY = ((CELL_HEIGHT - 3) * CELL_DIMENSION);
			//Position de l'image dans la grillle
			objLodeRunner.ligne = (CELL_WIDTH / 2);
			objLodeRunner.colonne = CELL_HEIGHT - 3;
			//Vitesse
			objLodeRunner.fltVitesse = 8;
			//Action possible
			objLodeRunner.actionPossible = {
				gauche: true,
				droite: true,
				haut: true,
				bas: true,
				tomber: false, //Est-ce que c'est une action? C'est une action mais pas un choix?
				barre: false,
				creuserGauche: false,
				creuserDroite: false,
			};
			//État de l'animation
			objLodeRunner.etatActuelle = {
				gauche: true,
				droite: false,
				haut: false,
				bas: false,
				tomber: false,
				barre: false,
				creuser: false,
			};

	}

	//MAJ
	function mettreAjourLodeRunner() {
		//Mettre a jour Ligne et Colonne -> gridPos
		objLodeRunner.ligne = getGridPos(objLodeRunner.fltX, objLodeRunner.fltY).LIGNE;
		objLodeRunner.colonne = getGridPos(objLodeRunner.fltX, objLodeRunner.fltY).COLONNE;
		objLodeRunner.actionPossible = checkActionPossible(objLodeRunner, true);
		//Regarder pour collision avec coffre
		checkPourCoffre(objLodeRunner, true);

		//Si LodeRunner a ramasser les 6 coffres d'or
		if(objLodeRunner.nCoffre >= 6)
			binProchainNiveau = true;

		//Si LodeRunner pert une vie
			//Se fait écraser dans un trou
			checkMortTrou(objLodeRunner);
			//Se fait frapper par un garde
			if(!objLodeRunner.estMort)
				objLodeRunner.estMort = tabGardes.some(garde => checkPourCollision(objLodeRunner, garde));

		//Si LodeRunner meurt
		if(objLodeRunner.estMort) {
			objSons.loderunnerHit.play();
			intNbreVies--;
			tabGardes = null;
			initAnimation();
		}

		//Si LodeRunner est mort 5 fois
		if(intNbreVies <= 0)
			binGameOver = true;

		//Update le score
		objLodeRunner.intScore = objLodeRunner.nCoffre * PTS_COFFRE;
		//Si le joueur est entrain de tomber
		if(objLodeRunner.actionPossible.tomber) {
			objLodeRunner.fltY += objLodeRunner.fltVitesse / 2;
			objSons.tombe.play();
		}
	}
	
	//RENDER
	function dessinerLodeRunner() {		
		objC2D.save();
		
		//Orientation a gauche
		if(objLodeRunner.etatActuelle.gauche && !objLodeRunner.etatActuelle.creuser) {
			//Barre à gauche
			if(objLodeRunner.etatActuelle.barre)
				objC2D.drawImage(objLodeRunner.spritesheet,
								 objLodeRunner.spriteCounter * CELL_DIMENSION,
								 CELL_DIMENSION * 2,
								  CELL_DIMENSION,
								  CELL_DIMENSION,
								  objLodeRunner.fltX,
								  objLodeRunner.fltY,
								  CELL_DIMENSION,
								  CELL_DIMENSION);
			//Sinon on marche à gauche
			else 
				objC2D.drawImage(objLodeRunner.spritesheet,
				 objLodeRunner.spriteCounter * CELL_DIMENSION,
				0,
				CELL_DIMENSION,
				CELL_DIMENSION,
				objLodeRunner.fltX,
				objLodeRunner.fltY,
				CELL_DIMENSION,
				CELL_DIMENSION);
		}
		//Orientation a droite
		if(objLodeRunner.etatActuelle.droite && !objLodeRunner.etatActuelle.creuser) {
			//Barre à droite
			if(objLodeRunner.etatActuelle.barre) {
				objC2D.translate(objLodeRunner.fltX + CELL_DIMENSION, objLodeRunner.fltY);
				objC2D.scale(-1, 1);
				objC2D.drawImage(objLodeRunner.spritesheet, objLodeRunner.spriteCounter * CELL_DIMENSION, CELL_DIMENSION * 2, CELL_DIMENSION, CELL_DIMENSION, 0, 0, CELL_DIMENSION, CELL_DIMENSION);
			}
			//Sinon on marche à droite
			else {
				objC2D.translate(objLodeRunner.fltX + CELL_DIMENSION, objLodeRunner.fltY);
				objC2D.scale(-1, 1);
				objC2D.drawImage(objLodeRunner.spritesheet, objLodeRunner.spriteCounter * CELL_DIMENSION, 0, CELL_DIMENSION, CELL_DIMENSION, 0, 0, CELL_DIMENSION, CELL_DIMENSION);
			}
		}

		//Orientation Monte ou descends
		if(objLodeRunner.etatActuelle.haut || objLodeRunner.etatActuelle.bas) {
			//TEMP SPRITE
			objC2D.drawImage(objLodeRunner.spritesheet, objLodeRunner.spriteCounter * CELL_DIMENSION, CELL_DIMENSION, CELL_DIMENSION, CELL_DIMENSION, objLodeRunner.fltX, objLodeRunner.fltY, CELL_DIMENSION, CELL_DIMENSION);
		}
		//Orientation Tombe
		if(objLodeRunner.etatActuelle.tomber) {
			objC2D.drawImage(objLodeRunner.spritesheet, CELL_DIMENSION * 4, CELL_DIMENSION, CELL_DIMENSION, CELL_DIMENSION, objLodeRunner.fltX, objLodeRunner.fltY, CELL_DIMENSION, CELL_DIMENSION);
		}

		//Creuse un trou
		if(objLodeRunner.etatActuelle.creuser) {
			if(objLodeRunner.etatActuelle.gauche) {
				objC2D.drawImage(objLodeRunner.spritesheet,
				 (CELL_DIMENSION * 4) + (CELL_DIMENSION * objLodeRunner.spriteCounter),
				 CELL_DIMENSION * 2,
			     CELL_DIMENSION,
				 CELL_DIMENSION,
				 objLodeRunner.fltX,
				 objLodeRunner.fltY,
				 CELL_DIMENSION,
				 CELL_DIMENSION);
			}
			else if(objLodeRunner.etatActuelle.droite) {
				objC2D.translate(objLodeRunner.fltX + CELL_DIMENSION, objLodeRunner.fltY);
				objC2D.scale(-1, 1);
				objC2D.drawImage(objLodeRunner.spritesheet,
				 (CELL_DIMENSION * 4) + (CELL_DIMENSION * objLodeRunner.spriteCounter),
				 CELL_DIMENSION * 2,
			     CELL_DIMENSION,
				 CELL_DIMENSION,
				 0,
				 0,
				 CELL_DIMENSION,
				 CELL_DIMENSION);
			}
		}
		objC2D.restore();
	}

	/**
	 *Gère toute les entrées faites sur le clavier par le joueur
	*/
	function gererControle() {
		//DEBUG #TODO supprimer à la fin
		console.log("KeyCode -> "+event.keyCode);
		if(!binCommencer) {
			//Commencé le niveau
			binCommencer = true;
		}
		else {
			//Creuser un trou Droite -> X
			if(event.keyCode == 88) {
				//Si un trou peux être creuser
				if(objLodeRunner.actionPossible.creuserDroite) {
					changerEtat(objLodeRunner, 'droite', true);
					changerEtat(objLodeRunner, 'creuser', true);
					//Enlever la brique et la remplacer par un bloc vide
					tabBlocs[objLodeRunner.ligne + 1][Math.floor(objLodeRunner.colonne) + 1] = creerBloc(-1);
					objSons.detruit.play();
					//Ajouter la brique avec un temps actuelle
					tabBlocsCreuser.push({ligne: objLodeRunner.ligne + 1, colonne: Math.floor(objLodeRunner.colonne) + 1, temps: objGUI.intTime});
					if(objLodeRunner.spriteCounter == 1)
						//Remettre le sprite Counter à 0
						changerEtat(objLodeRunner, 'droite', true);
					//Sinon
					else
						//Incrémenter le sprite Counter de 1
						objLodeRunner.spriteCounter++;	
				}
			}

			//Creuser un trou Gauche Z
			if(event.keyCode == 90) {
				//Si un trou peux être creuser
				if(objLodeRunner.actionPossible.creuserGauche) {
					changerEtat(objLodeRunner, 'gauche', true);
					changerEtat(objLodeRunner, 'creuser', true);
					//Enlever la brique et la remplacer par un bloc vide
					tabBlocs[objLodeRunner.ligne + 1][Math.ceil(objLodeRunner.colonne) - 1] = creerBloc(-1);
					objSons.detruit.play();
					//Ajouter la brique avec un temps actuelle
					tabBlocsCreuser.push({ligne: objLodeRunner.ligne + 1, colonne: Math.ceil(objLodeRunner.colonne) - 1, temps: objGUI.intTime});
					//Déplacer lodeRunner en plein milieu de la case à droite du trou
					if(objLodeRunner.spriteCounter == 1)
						//Remettre le sprite Counter à 0
						changerEtat(objLodeRunner, 'gauche', true);
					//Sinon
					else
						//Incrémenter le sprite Counter de 1
						objLodeRunner.spriteCounter++;	
				}
			}

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
							changerEtat(objLodeRunner, "droite", true);
							changerEtat(objLodeRunner, "barre", true);
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
								objSons.marche.play();
							}
						//Sinon le mettre à jour
						else
							changerEtat(objLodeRunner, "droite", true);
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
							changerEtat(objLodeRunner, "gauche", true);
							changerEtat(objLodeRunner, "barre", true);
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
								objSons.marche.play();
								
						}
						//Sinon le mettre à jour
						else
							changerEtat(objLodeRunner, "gauche", true);
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
							objSons.ladder.play();
					}
					else
						changerEtat(objLodeRunner, "haut", true);
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
							objSons.ladder.play();

					}
					else
						changerEtat(objLodeRunner, "bas", true);
				}
				//Tomber d'une barre
				else if(objLodeRunner.etatActuelle.barre) {
					changerEtat(objLodeRunner, "tomber", true);
				}
			}
		}
	}