function initSons() {
    let objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/tombe.mp3');
    objSon.load();
    objSons.tombe = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/detruit.mp3');
    objSon.load();
    objSons.detruit = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/auto_remplit_trou.mp3');
    objSon.load();
    objSons.auto_remplit_trou = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/gameover.mp3');
    objSon.load();
    objSons.gameover = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/gardeMeurt.mp3');
    objSon.load();
    objSons.gardeMeurt = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/gardeTombeTrou.mp3');
    objSon.load();
    objSons.gardeTombeTrou = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/loderunnerHit.mp3');
    objSon.load();
    objSons.loderunnerHit = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/nextLevel.mp3');
    objSon.load();
    objSons.nextLevel = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/ramasserOr.mp3');
    objSon.load();
    objSons.ramasserOr = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/ladder.mp3');
    objSon.load();
    objSons.ladder = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/marche.mp3');
    objSon.load();
    objSons.marche = objSon;


}