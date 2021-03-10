/**********************************************************
 * Ensemble des fonctions qui servent à la création du niveau
 * @author Charles Morin
***********************************************************/

    /**
	 * Initialiser le niveau
	 * Permet de convertir une image 28x17 en niveau en utilisant 
	 * un code couleur des pixels et de les transformers en bloc correspondant
	 ***********************************
	 * NOM_BLOC : (ID) : COULEUR(R,G,B)
	 *ECHELLE : (0)   : BRUN(130, 70, 25)
	 *BRICK   : (1)   : RED(255, 0, 0)
	 *COFFRE  : (2)   : JAUNE(225, 225, 0)
	 *BETON   : (3)   : BLUE(0, 0, 255)
	 *BARRE   : (4)   : VERT(0,255,0
	 ****************************************
	 */
     function initNiveau() {
		objC2D.save();

		//Charger l'image du niveau
		imgNiveau = new Image();
		imgNiveau.src = 'ressources/images/niveau1.png';
		let tableauTemp = new Array();

		imgNiveau.onload = function() {
			//Dessiner l'image sur le canvas
			objC2D.drawImage(imgNiveau, 0, 0);

			//Convertir l'image en un tableau de pixels
			const objPixels = objC2D.getImageData(0, 0, CELL_WIDTH, CELL_HEIGHT);

			//Lire les pixels
			let cell_id = 0;
			for(let p = 0; p < objPixels.data.length; p += 4) {
						
				const RED = objPixels.data[p];
				const GREEN = objPixels.data[p + 1];
				const BLUE = objPixels.data[p + 2];

				//console.log("RGB("+RED+", "+GREEN+", "+BLUE+")");
				//Si le pixel est Brun(130, 70, 25) alors la case est une échelle
				if((RED >= 125 && RED <= 135) && (GREEN >= 65 && GREEN <= 75) && (BLUE >= 20 && BLUE <= 30))
					tableauTemp[cell_id] = creerBloc(0);
				//Si le pixel est Rouge(255, 0, 0) alors la case est une brique
				else if(RED >= 254 && GREEN <= 5 && BLUE <= 5)
					tableauTemp[cell_id]  = creerBloc(1);
				//Si le pixel est Jaune(225, 225, 0) alors la case est un coffre
				else if((RED >= 220 && RED <= 230) && (GREEN >= 220 && GREEN <= 230) && BLUE <= 5)
					tableauTemp[cell_id]  = creerBloc(2);
				//Si le pixel est Bleu(0, 0, 255) alors la case est une brique indestructible
				else if(RED <= 5 && GREEN <= 5 && BLUE >= 254)
					tableauTemp[cell_id]  = creerBloc(3);
				//Si le pixel est Vert(0, 255, 0)
				else if(RED <= 5 && GREEN >= 254 && BLUE <= 5)
					tableauTemp[cell_id]  = creerBloc(4);
				else
					tableauTemp[cell_id]  = creerBloc(-1);
				cell_id++;
			}

			console.log("Tableau remplit -> Size: "+tableauTemp.length+" [32x32] Blocs");
			//console.log("Size: "+tableauTemp.length);

			//Séparer le tableau en un tableau a 2 dimensions
			let ligne = 0;
			while(tableauTemp.length) {
				tabBlocs[ligne] = tableauTemp.splice(0, 28);
				ligne++;
			}
			//Données coordonnées
			//j * 32, i * 32
			for(let i = 0; i < tabBlocs.length; i++) {
				for(let j = 0; j < tabBlocs[i].length; j++) {
					tabBlocs[i][j].x = j * CELL_DIMENSION;
					tabBlocs[i][j].x2 = tabBlocs[i][j].x + CELL_DIMENSION;
					tabBlocs[i][j].y = i * CELL_DIMENSION;
					tabBlocs[i][j].y2 = tabBlocs[i][j].y + CELL_DIMENSION;
				}
			}
			console.log("Tableau Séparé:");
			console.log("Ancien Tableau: "+tableauTemp.length);
			console.log("Nouveau Tableau: "+tabBlocs.length);
			//console.log(tabNiveau[1][2]);
			effacerDessin();
		}
	}

    //Fonction qui charge toutes les images nécèssaires au jeu
	function initSprites() {
		imgEchelle = new Image();
		imgEchelle.src = 'ressources/images/echelle.png';
		imgBrique = new Image();
		imgBrique.src = 'ressources/images/brique.png';
		imgCoffre = new Image();
		imgCoffre.src = 'ressources/images/coffre.png';
		imgBeton = new Image();
		imgBeton.src = 'ressources/images/beton.png';
		imgBarre = new Image();
		imgBarre.src = 'ressources/images/barre.png'
	}

    //MAJ
	function mettreAjourBlocCreuser() {
		for(let i = 0; i < tabBlocsCreuser.length; i++) {
			if(objGUI.intTime - tabBlocsCreuser[i].temps >= 8000) {
				//Remplacer le bloc vide par une brique à nouveau
				let ligne = tabBlocsCreuser[i].ligne;
				let colonne = tabBlocsCreuser[i].colonne;
				tabBlocs[ligne][colonne] = creerBloc(1);
				tabBlocs[ligne][colonne].x = colonne * CELL_DIMENSION;
				tabBlocs[ligne][colonne].x2 = tabBlocs[ligne][colonne].x + CELL_DIMENSION;
				tabBlocs[ligne][colonne].y = ligne * CELL_DIMENSION;
				tabBlocs[ligne][colonne].y2 = tabBlocs[ligne][colonne].y + CELL_DIMENSION;
				//Enlever le bloc de la liste de bloc creuser
				tabBlocsCreuser.splice(i, 1);
				objSons.auto_remplit_trou.play();
			}
		}
	}

    //RENDER
	function dessinerNiveau() {
		objC2D.save();
		dessinerBackground();
		for(let i = 0; i < tabBlocs.length; i++) {
			for(let j = 0; j < tabBlocs[i].length; j++) {
				objC2D.drawImage(tabBlocs[i][j].sprite, tabBlocs[i][j].x, tabBlocs[i][j].y);
			}
		}
		objC2D.restore();
	}

	function dessinerBackground() {
		objC2D.save();
		objC2D.fillStyle = 'black';
		objC2D.fillRect(0, 0, objCanvas.width, objCanvas.height);
		objC2D.restore();
	}

/**********************************************************
 * Fonctions complémentaires pour la création du niveau
***********************************************************/

	//Dessine le message GameOver
	function dessinerGameOver() {
		objC2D.save();
		//Dessiner Fond d'écran noir
		dessinerBackground();
		//Dessiner Game Over
		objC2D.font = '50px Audiowide';
		objC2D.fillStyle = 'orange';
		objC2D.fillText("GAME OVER", (objCanvas.width / 2) - 200, objCanvas.height / 3);
		objC2D.font = '20px Audiowide';
		//Dessiner Score
		objC2D.fillText(getScoreFormat(intScoreTotal), (objCanvas.width / 2) - 125, objCanvas.height / 3 + 30);
		//Dessiner Niveau
		objC2D.fillText("Niveau: "+intNiveau, (objCanvas.width / 2) - 125, objCanvas.height / 3 + 60);
	}

	//Ajoute l'échelle pour atteindre le prochain niveau
	function ajouterEchelleProchainNiveau() {
		//Ajouter l'échelle
		tabBlocs[2][21] = creerBloc(0);
		tabBlocs[1][21] = creerBloc(0);
		tabBlocs[0][21] = creerBloc(0);

		tabBlocs[2][21].x = 21 * CELL_DIMENSION;
		tabBlocs[2][21].x2 = tabBlocs[2][21].x + CELL_DIMENSION;
		tabBlocs[2][21].y = 2 * CELL_DIMENSION;
		tabBlocs[2][21].y2 = tabBlocs[2][21].y + CELL_DIMENSION;

		tabBlocs[1][21].x = 21 * CELL_DIMENSION;
		tabBlocs[1][21].x2 = tabBlocs[1][21].x + CELL_DIMENSION;
		tabBlocs[1][21].y = 1 * CELL_DIMENSION;
		tabBlocs[1][21].y2 = tabBlocs[1][21].y + CELL_DIMENSION;

		tabBlocs[0][21].x = 21 * CELL_DIMENSION;
		tabBlocs[0][21].x2 = tabBlocs[0][21].x + CELL_DIMENSION;
		tabBlocs[0][21].y = 0 * CELL_DIMENSION;
		tabBlocs[0][21].y2 = tabBlocs[0][21].y + CELL_DIMENSION;
	}

	//Prépare le prochain niveau
	function miseAjourProchainNiveau() {
		//Ajouter points
		binProchainNiveau = false;
		objLodeRunner.intScore += PTS_NIVEAU_REUSSI;
		intScoreTotal += objLodeRunner.intScore;
		//Incrémente Niveau
		intNiveau++;

		initAnimation();
	}

	//Réinitialise le niveau
	function reinitialiserNiveau() {
		objGUI.intTime = 0;
		objGUI.objDate = new Date();
		initLodeRunner();
		initNiveau();
	}

    /**
	 *Function qui créer un objet bloc en fonction du bloc_id qu'il recoit en paramètres
	 *@param {number} bloc_id L'id du bloc que la fonction doit créer
	 *@return un objet représentant un bloc du niveau.
	 **/
     function creerBloc(bloc_id) {
		let objBloc = new Object();

		//sprite image
		let strNomBloc = "";
		let objImage = null;
		let estSolide = false;
		let estPassable = false;
		let intValeur = 0;
		switch(bloc_id) {
			case 0:
				strNomBloc = "ECHELLE";
				objImage = imgEchelle;
				estSolide = false;
				break;
			case 1:
				strNomBloc = "BRIQUE";
				objImage = imgBrique;
				estSolide = true;
				break;
			case 2:
				strNomBloc = "COFFRE";
				objImage = imgCoffre;
				estSolide = false;
				intValeur = 250;
				break;
			case 3:
				strNomBloc = "BETON";
				objImage = imgBeton;
				estSolide = true;
				break;
			case 4:
				strNomBloc = "BARRE";
				objImage = imgBarre;
				isSolid = false;
				break;
			default:
				strNomBloc = "VIDE";
				objImage = new Image();
				estSolide = false;
				break;
		}
		//Nom du block
		objBloc.strNom = strNomBloc;
		//sprite image
		objBloc.sprite = objImage;
		//SOLID BLOCK
		objBloc.estSolide = estSolide;
		//Valeur du bloc
		objBloc.valeur = intValeur;
		//Coordonnées/Hitbox
		objBloc.x;
		objBloc.x2;
		objBloc.y;
		objBloc.y2;

	return objBloc;
	}