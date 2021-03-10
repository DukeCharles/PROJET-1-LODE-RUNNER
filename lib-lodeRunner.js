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
			//État
			objLodeRunner.actionPossible = { //Direction
				gauche: true,
				droite: true,
				haut: true,
				bas: true,
				tomber: false, //Est-ce que c'est une action? C'est une action mais pas un choix?
				barre: false,
				creuserGauche: false,
				creuserDroite: false,
				mourrir: false //Est-ce que c'est une action? C'est une action mais pas un choix?
			};
			objLodeRunner.etatActuelle = { //Orientation
				gauche: true,
				droite: false,
				haut: false,
				bas: false,
				tomber: false,
				barre: false,
				creuser: false,
				mourrir: false
			};

	}

	//MAJ
	function mettreAjourLodeRunner() {
		//Mettre a jour Ligne et Colonne -> gridPos
		objLodeRunner.ligne = getGridPos(objLodeRunner.fltX, objLodeRunner.fltY).LIGNE;
		objLodeRunner.colonne = getGridPos(objLodeRunner.fltX, objLodeRunner.fltY).COLONNE;
		objLodeRunner.actionPossible = checkActionPossible(objLodeRunner);
		//Regarder pour collision avec coffre
		checkPourCoffre(objLodeRunner);

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
			intNbreVies--;
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
		else if(objLodeRunner.etatActuelle.droite && !objLodeRunner.etatActuelle.creuser) {
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
		else if(objLodeRunner.etatActuelle.haut || objLodeRunner.etatActuelle.bas) {
			//TEMP SPRITE
			objC2D.drawImage(objLodeRunner.spritesheet, objLodeRunner.spriteCounter * CELL_DIMENSION, CELL_DIMENSION, CELL_DIMENSION, CELL_DIMENSION, objLodeRunner.fltX, objLodeRunner.fltY, CELL_DIMENSION, CELL_DIMENSION);
		}
		//Orientation Tombe
		else if(objLodeRunner.etatActuelle.tomber) {
			objC2D.drawImage(objLodeRunner.spritesheet, CELL_DIMENSION * 4, CELL_DIMENSION, CELL_DIMENSION, CELL_DIMENSION, objLodeRunner.fltX, objLodeRunner.fltY, CELL_DIMENSION, CELL_DIMENSION);
		}

		//Creuse un trou
		else if(objLodeRunner.etatActuelle.creuser) {
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