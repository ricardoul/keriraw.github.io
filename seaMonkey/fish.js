// Original version
var eleWater = document.getElementById("waterCanvas");
var conWater = eleWater.getContext("2d");

var eleFish = document.getElementById("playCanvas");
var conFish = eleFish.getContext("2d");

var params = {
	gameSpeed: 1.4,
	startingFish: 20,
	maxFertility: 200,
	maxLife: 5000
};

var fish = [];

var colors = {
	water: '#061539',
	fish: '#FF7400',
	sickFish: '#27E000'
};

function fillWater(){
	conWater.fillStyle = colors.water;
	conWater.fillRect(0,0,eleWater.width,eleWater.height);
};

function fishSpawn(xCoord, yCoord){
	if (!xCoord && !yCoord){
		var xCoord = Math.floor(Math.random() * 700)+50,
			yCoord = Math.floor(Math.random() * 500)+50;
	}
	fish.push({
		xCoord: xCoord,
		yCoord: yCoord,
		status: 'fine',
		fertility: 0,
		life: params.maxLife
	});
};

function fishMove(){
	fish.forEach(function(dFish){
		if (dFish.xCoord > 780){
			dFish.xCoord -= params.gameSpeed;
		} else if (dFish.xCoord < 20) {
			dFish.xCoord += params.gameSpeed;
		} else {
			random = (Math.random() * 100);
			if (random > 50) {
				dFish.xCoord -= params.gameSpeed;
			} else if (random < 50) {
				dFish.xCoord += params.gameSpeed;
			}
		}

		if (dFish.yCoord > 580){
			dFish.yCoord -= params.gameSpeed;
		} else if (dFish.yCoord < 20) {
			dFish.yCoord += params.gameSpeed;
		} else {
			random = (Math.random() * 100);
			if (random > 50) {
				dFish.yCoord -= params.gameSpeed;
			} else if (random < 50) {
				dFish.yCoord += params.gameSpeed;
			}
		}

		if (dFish.status === 'fine') {
			conFish.fillStyle = colors.fish;
		} else {
			conFish.fillStyle = colors.sickFish;
		}

		conFish.fillRect(dFish.xCoord-2,dFish.yCoord-1,4,2);
	});
};

function evaluateProximity(){
	fish.forEach(function(dFish, dIndex){
		if ((dFish.xCoord < 30 || dFish.xCoord > 770 || dFish.yCoord < 30 || dFish.yCoord > 770) && acceptancePercent(1)) {
			dFish.status = 'sick';
		}
		fish.forEach(function(aFish, aIndex){
			if (dIndex != aIndex && Math.abs(dFish.xCoord-aFish.xCoord) < 2 && Math.abs(dFish.yCoord-aFish.yCoord) < 2) {
				if (acceptancePercent(5) && aFish.status === 'fine' && dFish.status === 'fine' && aFish.fertility === params.maxFertility && dFish.fertility === params.maxFertility) {
					fishSpawn(aFish.xCoord, aFish.yCoord);
					aFish.fertility = 0;
					dFish.fertility = 0;
				} else if (acceptancePercent(1) && (aFish.status === 'sick' || dFish.status === 'sick')) {
					aFish.status = 'sick';
					dFish.status = 'sick';
				}
			}
		})
	})
}

function advanceCounter(){
	fish.forEach(function(dFish){
		if (dFish.status === 'sick' && dFish.life > 0){
			dFish.life -= 1;
		} else if (dFish.life === 0) {
			dFish.status = 'dead';
		} else if (dFish.status === 'fine' && dFish.fertility < params.maxFertility){
			dFish.fertility += 1;
		}
	})
}

function removeDead(){
	fish.forEach(function(dFish, dIndex){
		if (dFish.status === 'dead') {
			fish.splice(dIndex, 1);
		}
	})
}

function acceptancePercent(accept){
	var value = Math.floor(Math.random() * 100) + 1;
	return value <= accept;
};

function clearFish(){
	conFish.clearRect(0,0,800,600);
};

function initialiseGame(){
	fillWater();
	for (var i = params.startingFish - 1; i >= 0; i--) {
		fishSpawn();
	}
	controller();
};

initialiseGame();
function controller(){
	console.log(fish.length);
	clearFish();
	fishMove();
	evaluateProximity();
	advanceCounter();
	removeDead();
	window.requestAnimationFrame(controller);
};