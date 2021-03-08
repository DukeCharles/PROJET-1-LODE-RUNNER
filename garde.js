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
		let test = tabEmplacementGardes[Math.floor(Math.random() * Math.floor(tabEmplacementGardes.length - 1))];
        console.log("Coord: "+test.l+" "+test.c);
        return test;
    }

	function recolorGardeImage(imgData, garde) {
			for(let p = 0; p < imgData.data.length; p += 4) {

				if(imgData.data[p] >= 45 && imgData.data[p] <= 55
				&& imgData.data[p+1] >= 70 && imgData.data[p+1] <= 80
				&& imgData.data[p+2] >= 160 && imgData.data[p+2] <= 170) {
					imgData.data[p] = garde.RED;
					imgData.data[p+1] = garde.GREEN;
					imgData.data[p+2] = garde.BLUE;
				}
			}

		return imgData;
	}