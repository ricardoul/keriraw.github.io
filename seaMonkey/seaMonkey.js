var eleWater = document.getElementById('waterCanvas')
,	conWater = eleWater.getContext('2d')
,	eleMonkey = document.getElementById('playCanvas')
,	conMonkey = eleMonkey.getContext('2d')
,	configs = {
	 	gameSpeed: 1.4
	,	startingFish: 25
	,	maxFertility: 250
	,	startingFertility: 200
	,	maxLife: 5000
	,	poisonSize: 25
	}
,	palette = {
	 	water: '#061539'
	,	poison: '#002E2E'
	,	monkeyFine: '#FF7400'
	,	monkeySick: '#27E000'
	}
,	monkeys = []
;

(function initializer ()
{
 	fillWater();
	for (var i = configs.startingFish - 1; i >= 0; i--) {
		monkeys.push(new Monkey());
	}
	console.log(`${monkeys.length} monkeys started!`);
	controller();
})();

function controller ()
{
	clearMonkeys();
	monkeys.forEach(function (monkey, index)
	{
		monkey.move();
		monkey.grow();
		monkey.live(index);
		monkey.draw();
		if (monkey.status === 'dead')
		{
			monkeys.splice(index, 1);
			console.log(`A monkey died at the age of ${monkey.age}, there are ${monkeys.length} monkeys now.`);
		}
	})
	window.requestAnimationFrame(controller);
};

function Monkey ()
{
	this.xCoord = Math.floor(Math.random() * 700)+50;
	this.yCoord = Math.floor(Math.random() * 500)+50;
	this.status = 'fine';
	this.fertility = configs.startingFertility;
	this.life = configs.maxLife;
	this.age = 0;

	this.move = function ()
	{
		if (this.xCoord > 780)
		{
			this.xCoord -= configs.gameSpeed;
		}
		else if (this.xCoord < 20)
		{
			this.xCoord += configs.gameSpeed;
		}
		else
		{
			random = (Math.random() * 100);
			if (random > 50)
			{
				this.xCoord -= configs.gameSpeed;
			}
			else if (random < 50)
			{
				this.xCoord += configs.gameSpeed;
			}
		}

		if (this.yCoord > 580)
		{
			this.yCoord -= configs.gameSpeed;
		}
		else if (this.yCoord < 20)
		{
			this.yCoord += configs.gameSpeed;
		}
		else
		{
			random = (Math.random() * 100);
			if (random > 50)
			{
				this.yCoord -= configs.gameSpeed;
			}
			else if (random < 50)
			{
				this.yCoord += configs.gameSpeed;
			}
		}
	}

	this.grow = function ()
	{
		this.age += 1;
		if (this.status === 'sick' && this.life > 0)
		{
			this.life -= 1;
		}
		else if (this.life === 0)
		{
			this.status = 'dead';
		}
		else if (this.status === 'fine' && this.fertility < configs.maxFertility)
		{
			this.fertility += 1;
		}
	}

	this.live = function (index)
	{
		if ((this.xCoord < configs.poisonSize || this.xCoord > eleWater.width-configs.poisonSize || this.yCoord < configs.poisonSize || this.yCoord > eleWater.height-configs.poisonSize) && acceptancePercent(1))
		{
			this.status = 'sick';
		}

		for (var i = 0; i < index; i++)
		{
			if (Math.abs(this.xCoord-monkeys[i].xCoord) < 2 && Math.abs(this.yCoord-monkeys[i].yCoord) < 2) {
				if (acceptancePercent(25) && monkeys[i].status === 'fine' && this.status === 'fine' && monkeys[i].fertility === configs.maxFertility && this.fertility === configs.maxFertility)
				{
					monkeys.push(new Monkey());
					console.log(`A new monkey is born! They are ${monkeys.length} monkeys now.`);
					monkeys[i].fertility = 0;
					this.fertility = 0;
				}
				else if (acceptancePercent(1) && (monkeys[i].status === 'sick' || this.status === 'sick'))
				{
					monkeys[i].status = 'sick';
					this.status = 'sick';
				}
			}
		}
	}

	this.draw = function ()
	{
		if (this.status === 'fine')
		{
			conMonkey.fillStyle = palette.monkeyFine;
		}
		else
		{
			conMonkey.fillStyle = palette.monkeySick;
		}

		conMonkey.fillRect(this.xCoord-2,this.yCoord-1,4,2);
	}
}

function fillWater ()
{
 	conWater.fillStyle = palette.poison;
 	conWater.fillRect(0,0,eleWater.width,eleWater.height);
 	conWater.fillStyle = palette.water;
 	conWater.fillRect(configs.poisonSize,configs.poisonSize,eleWater.width-configs.poisonSize*2,eleWater.height-configs.poisonSize*2);
};

function acceptancePercent (accept)
{
	var value = Math.floor(Math.random() * 100) + 1;
	return value <= accept;
};

function clearMonkeys ()
{
	conMonkey.clearRect(0,0,800,600);
};