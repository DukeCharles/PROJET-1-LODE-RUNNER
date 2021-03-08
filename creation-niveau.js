/**********************************************************
 * Ensemble des fonctions extérieures qui servent à la création du niveau
***********************************************************/	
    
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