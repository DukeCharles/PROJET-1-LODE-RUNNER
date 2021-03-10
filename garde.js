/**********************************************************
 * Ensemble des fonctions extérieures utilisé par les gardes.
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
				}

			}

		return imgData;
	}

	/**Regarde si le garde est coincer dans un trou
	 * @returns si le garde est coincé ou non
	 */
	function estCoincer() {
		//Condition nécèssaire

		//Est sur un bloc qui est une brique
		//N'a aucune action possible à vrai?
		return false;
	}

