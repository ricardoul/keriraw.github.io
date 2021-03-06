// ***************
// **  CONTEXT  **
// ***************

// Gets each canva context
var b = document.getElementById("missileBackground");
var back = b.getContext("2d");

var p = document.getElementById("missilePlayground");
var play = p.getContext("2d");

var params = {
	gameSpeed: 1.4,
	baseHeight: 50,
	baseCount: 5,
	towerBaseHeight: 5,
	maxEnemies: 8,
	trail: false,
	trailLength: 3,
	maxExplosionSize: 50
};

var game = {
	status: 'loading',
	score: 0
};

var towers = [],
	missiles = [],
	enemies = [],
	explosions = [];

var colors = {
	background: '#000000',
	terrain: '#660D0D',
	tower: '#474747',
	enemy: '#FF0000',
	missile: '#00FF00',
	explosion: '#F8FF00'
};

// ***************
// **  TERRAIN  **
// ***************

// Creates the terrain
function terrainCreate(){
	terrainBase();
	terrainTower(params.baseCount);
};

// Creates the lower part of the terrain
function terrainBase(){
	back.fillStyle = colors.terrain;
	back.fillRect(0,b.height-params.baseHeight,b.width,params.baseHeight);
};

// Calculates where the mounds are located
function terrainTower(amount){
	for (var i = 1; i < amount+1; i++){
		var location = Math.floor((b.width/(amount+1))*i);
		terrainMound(location);
		towerSpawn(location);
	}
};

// Creates a single mound
function terrainMound(xMiddleCoord){
	back.fillStyle = colors.terrain;
	xMiddleCoord = xMiddleCoord-50;
	var heightCoord = b.height-params.baseHeight;
	back.beginPath();
	back.moveTo(xMiddleCoord,heightCoord);
	back.lineTo(xMiddleCoord+100,heightCoord);
	back.lineTo(xMiddleCoord+70,heightCoord-20);
	back.lineTo(xMiddleCoord+30,heightCoord-20);
	back.fill();
};

// ***************
// **  ENEMIES  **
// ***************

function enemySpawn(){
	// TODO: make acceptance vary dependign on enemies
	if (enemies.length < params.maxEnemies && acceptancePercent(5)){
		var xCoord = Math.floor(Math.random() * 800),
			yCoord = Math.floor(Math.random() * -200),
			xDest = Math.floor(Math.random() * 800),
			yDest = 600,
			xDelta = Math.abs(xDest - xCoord),
			yDelta = Math.abs(yDest - yCoord),
			travelLength = Math.sqrt((xDelta*xDelta)+(yDelta*yDelta));
		enemies.push({
			name: 'enemy' + enemies.length,
			xCoord: xCoord,
			yCoord: yCoord,
			xOrigin: xCoord,
			yOrigin: yCoord,
			xDest: xDest,
			yDest: yDest,
			xDelta: xDelta,
			yDelta: yDelta,
			xSpeed: (xDelta/travelLength)*params.gameSpeed,
			ySpeed: (yDelta/travelLength)*params.gameSpeed,
			travelLength: travelLength,
			status: 'alive'
		});
	}
};

function enemyMove(){
	enemies.forEach(function(enemy, index){
		// Calculate new position
		if (enemy.xOrigin < enemy.xDest){
			enemy.xCoord += enemy.xSpeed;
		} else {
			enemy.xCoord -= enemy.xSpeed;
		}
		enemy.yCoord += enemy.ySpeed;
		// Verifies if space is empty
		if (verifyEmptySpace(enemy.xCoord, enemy.yCoord)) {
			enemy.status = 'dead';
		}
		// Remove from enemies
		if (enemy.yCoord > 600 || enemy.status === 'dead'){
			spawnExplosion(enemy.xCoord, enemy.yCoord);
			enemies.splice(index, 1);
		} else {
			// Paint new position
			play.fillStyle = colors.enemy;
			play.fillRect(enemy.xCoord,enemy.yCoord,2,2);
		}
	});
};

// **************
// **  TOWERS  **
// **************

// TODO: separate spawn and draw
// Creates a single tower
function towerSpawn(xMiddleCoord){
	back.fillStyle = colors.tower;
	// Calculates the height in the middle of the tower, canvas height - (terrain base + mound height + flat tower part)
	var heightCoord = b.height-(params.baseHeight+20+params.towerBaseHeight);
	back.beginPath();
	// Creates the upper part of the tower (the half circle)
	back.arc(xMiddleCoord,heightCoord,15,0,1*Math.PI,true);
	back.fillRect(xMiddleCoord-15,heightCoord,30,params.towerBaseHeight)
	back.fill();

	towers.push({
		name: 'tower' + towers.length,
		status: 'alive',
		center: xMiddleCoord,
		charge: 100
	});
};

function rechargeTowers(){
	towers.forEach(function(tower){
		if (tower.charge < 100){
			// TODO: adjust recharge rate
			tower.charge += 0.5 * params.gameSpeed;
		}
	});
};

function findShootingTower(){
	var shootingTower = towers.find(function(tower){
		return tower.status === 'alive' && tower.charge >= 100;
	})
	,	shootingTowerIndex = towers.findIndex(function(tower){
		return tower.status === 'alive' && tower.charge >= 100;
	});
	if(shootingTowerIndex >= 0){
		towers[shootingTowerIndex].charge = 0;
		return shootingTower.center;
	}
};

// ****************
// **  MISSILES  **
// ****************

function spawnMissile(e){
	var rect = p.getBoundingClientRect(),
		xDest = Math.floor(e.clientX - rect.left),
		yDest = Math.floor(e.clientY - rect.top),
		xCoord = findShootingTower(),
		yCoord = b.height-(params.baseHeight+20+params.towerBaseHeight+15);
		xDelta = Math.abs(xDest - xCoord),
		yDelta = Math.abs(yDest - yCoord),
		travelLength = Math.sqrt((xDelta*xDelta)+(yDelta*yDelta));
	// TODO: improve the comprobation
	// if xCoord is undefined, it's because there is not available tower
	if (xCoord){
		missiles.push({
			name: 'missile' + missiles.length,
			xCoord: xCoord,
			yCoord: yCoord,
			xOrigin: xCoord,
			yOrigin: yCoord,
			xDest: xDest,
			yDest: yDest,
			xDelta: xDelta,
			yDelta: yDelta,
			xSpeed: (xDelta/travelLength)*params.gameSpeed,
			ySpeed: (yDelta/travelLength)*params.gameSpeed,
			travelLength: travelLength,
			status: 'alive'
		});
	}
};

function missileMove(){
	missiles.forEach(function(missile, index){
		// Calculate new position
		if (missile.xOrigin < missile.xDest) {
			missile.xCoord += missile.xSpeed;
		} else {
			missile.xCoord -= missile.xSpeed;
		}
		if (missile.yOrigin < missile.yDest) {
			missile.yCoord += missile.ySpeed;
		} else {
			missile.yCoord -= missile.ySpeed;
		}
		// Verifies if space is empty
		if (verifyEmptySpace(missile.xCoord, missile.yCoord)) {
			missile.status = 'dead';
		}
		// Remove from missiles
		if (calculateDestination(missile) || missile.status === 'dead'){
			spawnExplosion(missile.xCoord, missile.yCoord);
			missiles.splice(index, 1);
		} else {
			// Paint new position
			play.fillStyle = colors.missile;
			play.fillRect(missile.xCoord,missile.yCoord,2,2);
		}
	})
};

// ******************
// **  EXPLOSIONS  **
// ******************

function spawnExplosion(xCoord, yCoord){
	explosions.push({
		name: 'explosion' + explosions.length,
		xCoord: Math.floor(xCoord),
		yCoord: Math.floor(yCoord),
		radius: 1
	});
	evaluateTowerDestruction(xCoord, yCoord);
};

function drawExplosions(){
	explosions.forEach(function(explosion, index){
		explosion.radius += params.gameSpeed/2;
		if (explosion.radius >= params.maxExplosionSize) {
			explosions.splice(index, 1);
		} else {
			play.beginPath();
			play.fillStyle = colors.explosion;
			play.arc(explosion.xCoord,explosion.yCoord,explosion.radius,0,2*Math.PI);
			play.fill();
		}
	})
};

function evaluateTowerDestruction(xCoord, yCoord){
	// TODO: move this to params
	var damageZone = 15 + params.maxExplosionSize;
	towers.forEach(function(tower){
		var xDelta = Math.abs(tower.center - xCoord),
			// TODO: improved calculation to not do it everytime
			yDelta = Math.abs(b.height - params.baseHeight - params.towerBaseHeight - 20 - yCoord),
			explosionDistance = Math.sqrt((xDelta*xDelta)+(yDelta*yDelta));
		if (tower.status === 'alive' && explosionDistance < damageZone) {
			tower.status = 'dead';
		}
	})
};

// ***************
// **  HELPERS  **
// ***************

function calculateDestination(projectile){
	return (Math.abs(projectile.xDest-projectile.xCoord) < projectile.xSpeed * params.gameSpeed && Math.abs(projectile.yDest-projectile.yCoord) < projectile.ySpeed * params.gameSpeed);
};

function acceptancePercent(accept){
	var value = Math.floor(Math.random() * 100) + 1;
	return value <= accept;
};

function verifyEmptySpace(xCoord, yCoord){
	var imgPlayData = play.getImageData(xCoord, yCoord, 1, 1);
	var imgBackData = back.getImageData(xCoord, yCoord, 1, 1);
	return imgPlayData.data[0] || imgPlayData.data[1] || imgPlayData.data[2] || imgBackData.data[0] || imgBackData.data[1] || imgBackData.data[2];
};

// ***************
// **  SCREENS  **
// ***************

// TODO:
function titleScreen(){
	back.font = "30px Arial";
	back.fillStyle = "white";
	back.fillText('Missile',10,100);
	back.fillText('Click anywhere to start',10,150);
};

// TODO:
function scoreScreen(){
	clearAll();
	back.font = "30px Arial";
	back.fillStyle = "white";
	back.fillText('GAME OVER',10,100);
	back.fillText('Click anywhere to restart',10,150);
};

// **************
// **  CLEARS  **
// **************

function clearBackground(){
	back.clearRect(0,0,800,600);
};

function clearPlayground(){
	play.clearRect(0,0,800,600);
};

function clearAll(){
	towers = [];
	missiles = [];
	enemies = [];
	explosions = [];
	clearBackground();
	clearPlayground();
};

// ************
// **  MAIN  **
// ************

// Resets the game to a new one
function initialiseGame(){
	clearAll();
	terrainCreate();
	game.status = 'playing';
	p.removeEventListener('click', initialiseGame);
	p.addEventListener('click', spawnMissile)
	controller();
};

function evaluateGame(){
	if (towers.every(function(tower){return tower.status === 'dead';})) {
		game.status = 'over';
	}
};

// Game controller
controller();
function controller(){
	if (game.status === 'playing'){
		clearPlayground();
		drawExplosions();
		enemySpawn();
		enemyMove();
		missileMove();
		// just add previous positions calculating on the fly with position - speed - gameSpeed
		//addTrails();
		rechargeTowers();
		evaluateGame();
		// increase speed, add score
		window.requestAnimationFrame(controller);
	} else if (game.status === 'over'){
		p.removeEventListener('click', spawnMissile);
		// Score screen
		scoreScreen();
		p.addEventListener('click', initialiseGame);
	} else {
		// Title screen
		titleScreen();
		p.addEventListener('click', initialiseGame);
	}
};