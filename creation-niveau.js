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
		let strNomBlock = "";
		let objImage = null;
		let isSolid = false;
		switch(bloc_id) {
			case 0:
				strNomBlock = "ECHELLE";
				objImage = imgEchelle;
				isSolid = false;
				break;
			case 1:
				strNomBlock = "BRIQUE";
				objImage = imgBrique;
				isSolid = true;
				break;
			case 2:
				strNomBlock = "COFFRE";
				objImage = imgCoffre;
				isSolid = false;
				break;
			case 3:
				strNomBlock = "BETON";
				objImage = imgBeton;
				isSolid = true;
				break;
			case 4:
				strNomBlock = "BARRE";
				objImage = imgBarre;
				isSolid = false;
				break;
			default:
				strNomBlock = "VIDE";
				objImage = new Image();
				isSolid = false;
				break;
		}
		//Nom du block
		objBloc.strNom = strNomBlock;
		//sprite image
		objBloc.sprite = objImage;
		//SOLID BLOCK
		objBloc.isSolid = isSolid;
		//Coordonnées/Hitbox
		objBloc.x;
		objBloc.x2;
		objBloc.y;
		objBloc.y2;

	return objBloc;
	}