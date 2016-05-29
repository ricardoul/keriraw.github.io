<html>
	<head>
		<title>Sea Monkey Simulator (Tobi's wet dream)</title>
	</head>
	<body style="background-color: #101010">
		<div>
			<a href="./index.html">Back</a>
		</div>
		<div>
			<canvas id="waterCanvas" width="800" height="600" style="border:1px solid #FF0000; margin: auto; position: absolute; left: 0; right: 0; z-index: 0;"></canvas>
			<canvas id="fishCanvas" width="800" height="600" style="border:1px solid #FF0000; margin: auto; position: absolute; left: 0; right: 0; z-index: 1;"></canvas>
		</div>
	</body>

	<script>
		var eleWater = document.getElementById("waterCanvas");
		var conWater = eleWater.getContext("2d");

		var eleFish = document.getElementById("fishCanvas");
		var conFish = eleFish.getContext("2d");

		var params = {
			gameSpeed: 1.4,
			maxFish: 20,
		};

		var fish = [];

		var colors = {
			water: '#061539',
			fish: '#FF7400',
			player: '#27E000',
		};

		function fillWater(){
			conWater.fillStyle = colors.water;
			conWater.fillRect(0,0,eleWater.width,eleWater.height);
		};

		function fishSpawn(){
			if (fish.length < params.maxFish){
				var xCoord = Math.floor(Math.random() * 800),
					yCoord = Math.floor(Math.random() * 600);
				fish.push({
					name: 'fish' + fish.length,
					xCoord: xCoord,
					yCoord: yCoord,
				});
			}
		};

		function fishMove(){
			fish.forEach(function(dFish, index){
				if (dFish.xCoord > 700){
					dFish.xCoord -= params.gameSpeed;
				} else if (dFish.xCoord < 100) {
					dFish.xCoord += params.gameSpeed;
				} else {
					random = Math.random() * 100;
					if (random > 50) {
						dFish.xCoord -= params.gameSpeed;
					} else if (random < 50) {
						dFish.xCoord += params.gameSpeed;
					}
				}

				if (dFish.yCoord > 500){
					dFish.yCoord -= params.gameSpeed;
				} else if (dFish.yCoord < 100) {
					dFish.yCoord += params.gameSpeed;
				} else {
					random = Math.random() * 100;
					if (random > 50) {
						dFish.yCoord -= params.gameSpeed;
					} else if (random < 50) {
						dFish.yCoord += params.gameSpeed;
					}
				}

				conFish.fillStyle = colors.fish;
				conFish.fillRect(dFish.xCoord,dFish.yCoord,4,2);
			});
		};

		function clearFish(){
			conFish.clearRect(0,0,800,600);
		};

		function initialiseGame(){
			fillWater();
			controller();
		};

		initialiseGame();
		function controller(){
			clearFish();
			fishSpawn();
			fishMove();
			window.requestAnimationFrame(controller);
		};
	</script>
</html>
