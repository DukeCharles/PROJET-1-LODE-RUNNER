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

    function getCoord(tabCoord) {
        console.log("Coord: "+tabCoord[Math.floor(Math.random() * Math.floor(tabCoord.length - 1))]);
        return tabCoord[Math.floor(Math.random() * Math.floor(tabCoord.length - 1))];
    }

	function recolorGardeImage() {
		let imgGarde = new Image();
		imgGarde.src = 'ressources/images/garde_spritesheet.png';
        let pixels = null;

		imgGarde.onload = function() {
			objC2D.drawImage(imgGarde, 0, 0);

			pixels = objC2D.getImageData(0, 0, CELL_DIMENSION * 3, CELL_DIMENSION);

			const RED = Math.floor(Math.random() * Math.floor(255));
			const GREEN = Math.floor(Math.random() * Math.floor(255));
			const BLUE = Math.floor(Math.random() * Math.floor(255));

			for(let p = 0; p < pixels.data.length; p += 4) {

				if(pixels.data[p] >= 45 && pixels.data[p] <= 55
				&& pixels.data[p+1] >= 70 && pixels.data[p+1] <= 80
				&& pixels.data[p+2] >= 160 && pixels.data[p+2] <= 170) {
					pixels.data[p] = RED;
					pixels.data[p+1] = GREEN;
					pixels.data[p+2] = BLUE;
				}
			}
		}

		return objCanvas.toDataURL(pixels);
	}