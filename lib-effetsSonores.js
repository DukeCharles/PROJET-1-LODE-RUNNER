function initSons() {
    let objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/loderunner/tombe.mp3');
    objSon.load();
    objSons.tombe = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/loderunner/detruit.mp3');
    objSon.load();
    objSons.detruit = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/niveau/auto_remplit_trou.mp3');
    objSon.load();
    objSons.auto_remplit_trou = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/niveau/gameover.mp3');
    objSon.load();
    objSons.gameover = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/garde/gardeMeurt.mp3');
    objSon.load();
    objSons.gardeMeurt = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/garde/gardeTombeTrou.mp3');
    objSon.load();
    objSons.gardeTombeTrou = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/loderunner/loderunnerHit.mp3');
    objSon.load();
    objSons.loderunnerHit = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/niveau/nextLevel.mp3');
    objSon.load();
    objSons.nextLevel = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/loderunner/ramasserOr.mp3');
    objSon.load();
    objSons.ramasserOr = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/loderunner/ladder.mp3');
    objSon.load();
    objSons.ladder = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'ressources/sons/loderunner/marche.mp3');
    objSon.load();
    objSons.marche = objSon;


}