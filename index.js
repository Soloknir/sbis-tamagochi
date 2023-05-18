

/*
This file is a core building block in the program, as it is used to "scroll" through object arrays using
buttons, creating a UI for many states. The only thing that needs to be in put into these functions
are arrays and their corresponding spriteSheets. 
Objects put into these functions should have a format like this:
function foodItem(name,spriteIndex,cost,desc,hungRestore){
	this.mainText = name;
	this.descText = desc;
	this.spriteIndex = spriteIndex;
	this.cost = cost;
	this.hungRestore = hungRestore;
	this.select = function() {
		//PUT METHOD HERE
	}
}
Object must have mainText,descText,spriteIndex properties and should have a select() method.
*/

//have a menu that allows you to select and scroll from two arrays.
//Inputs 4 strings, and will switch to a given state and display a given string
//Intended to be used in conjunction with drawGameUI)()
function drawGameMenu (state1, desc1, state2, desc2) {
	button13 = game.add.button(width * (4 / 6), height * (2 / 6), "buttonSheet", gameMenuSelect, this, 10, 10, 10);
	button13.anchor.set(0.5);
	button13.desc = desc1;
	button13.state = state1;

	button14 = game.add.button(width * (4 / 6), height * (4 / 6), "buttonSheet", gameMenuSelect, this, 10, 10, 10);
	button14.anchor.set(0.5);
	button14.desc = desc2;
	button14.state = state2;

	var text1 = game.add.bitmapText(width * (2 / 6), height * (2 / 6), "pixel", desc1, 32);
	text1.anchor.set(0.5);
	var text2 = game.add.bitmapText(width * (2 / 6), height * (4 / 6), "pixel", desc2, 32);
	text2.anchor.set(0.5);
}

function gameMenuSelect (button) {
	game.state.start(button.state);
}

slideCounter = 0;
//this function creates the buttons and UI to be displayed to the user.
function drawGameUI (array, spriteSheet) {
	slideCounter = 0;
	button10 = game.add.button(width * (1 / 6), this.game.world.centerY, "buttonSheet", changeSlide, this, 11, 11, 11);
	button10.name = "backward";
	button10.anchor.set(0.5);

	button11 = game.add.button(width * (5 / 6), this.game.world.centerY, "buttonSheet", changeSlide, this, 10, 10, 10);
	button11.name = "forward";
	button11.anchor.set(0.5);

	button12 = game.add.button(this.game.world.centerX, height * (7 / 9), "buttonSheet", changeSlide, [this, array], 12, 12, 12);
	button12.name = "select";
	button12.anchor.set(0.5);
	//notice how you can assign variables to buttons, very useful for parsing in parameters.
	button12.variable = array;

	sprite = game.add.sprite(this.game.world.centerX, this.game.world.centerY, spriteSheet);
	sprite.frame = 0;
	sprite.anchor.setTo(0.5);
	mainText = game.add.bitmapText(game.world.centerX, height * (1 / 4), "pixel", "Empty!", 32);
	mainText.anchor.setTo(0.5);
	descText = game.add.bitmapText(game.world.centerX, height * (4 / 6), "pixel", "You're out of food!", 22);
	descText.anchor.setTo(0.5);
	descText.align = "center";
	descText.align = "center";
	costText = game.add.bitmapText(game.world.centerX, height * (4 / 6) + 44, "pixel", "ERROR", 22);
	costText.anchor.setTo(0.5);
}

//changeSlide() is used to pass through various arrays
//an array must be defined in each state in order to be parsed by this function.
function changeSlide (button) {
	//console.log(button.variable);
	switch (button.name) {
		case "backward":
			slideCounter--;
			break;
		case "forward":
			slideCounter++;
			break;
		case "select":
			button.variable[slideCounter].select(button.mode);
			break;
	}
}

//To be used in the update loop; displays "slides" of an object in a list.
//changes properties of created game objects in drawGameUI according to the
//objects properties.
function displaySlide (array) {
	//keep slide "pointer" within bounds.
	slideCounter = Math.min(Math.max(slideCounter, 0), array.length - 1);
	sprite.frame = array[slideCounter].spriteIndex;
	//console.log(array[slideCounter].mainText);
	//console.log(slideCounter);
	//console.log(array[slideCounter].descText);
	//
	if ((slideCounter == 0) && (array.length == 1)) {
		button10.alpha = 0;
		button11.alpha = 0;
	}
	else if (slideCounter == 0) {
		button10.alpha = 0;
		button11.alpha = 1;
	}
	else if (slideCounter == (array.length - 1)) {
		button10.alpha = 1;
		button11.alpha = 0;
	}
	else {
		button10.alpha = 1;
		button11.alpha = 1;
	}
	mainText.text = array[slideCounter].mainText;
	descText.text = array[slideCounter].descText;
	costText.text = "Costs: $" + array[slideCounter].cost;
}
//-----------------------------------------------------------------------------------------------
function printText (contents) {
	var text = game.add.bitmapText(75, game.world.centerY - 200, "pixel", contents, 32);
	//text.anchor.set(0.5);
	//
}

var tempText;
function addTempText (contents, duration) {
	tempText = game.add.bitmapText(game.world.centerX, game.world.centerY * (3 / 4), "pixel", contents, 32);
	tempText.anchor.set(0.5);
	tempText.scale.set(0.5);
	tempText.alpha = 1;
	game.time.events.add(Phaser.Timer.SECOND * duration, removeTempText, this);
}
function removeTempText () {
	tempText.alpha = 0;
}


function drawGameBody () {
	//game.stage.backgroundColor = "#ff6e2b";
	this.background = this.game.add.sprite(0, 0, "background");

	//add buttons
	//"buttonSheet" is the name of the resource you are loading, changeState is the
	//function you want to execute on click, and the last thee numbers correspond to the 
	//frames you want in your buttonSheet in order of "out,over,clicked"
	button0 = game.add.button(width * (1 / 6), buttonDispX, "buttonSheet", changeState, this, 0, 0, 0);
	button0.name = "stats";
	button0.anchor.set(0.5);

	button1 = game.add.button(width * (2 / 6), buttonDispX, "buttonSheet", changeState, this, 2, 2, 2);
	button1.name = "food";
	button1.anchor.set(0.5);

	button2 = game.add.button(width * (3 / 6), buttonDispX, "buttonSheet", changeState, this, 1, 1, 1);
	button2.name = "toilet";
	button2.anchor.set(0.5);

	button3 = game.add.button(width * (4 / 6), buttonDispX, "buttonSheet", changeState, this, 3, 3, 3);
	button3.name = "play";
	button3.anchor.set(0.5);

	button4 = game.add.button(width * (5 / 6), buttonDispX, "buttonSheet", changeState, this, 4, 4, 4);
	button4.name = "fastForward";
	button4.anchor.set(0.5);

	button5 = game.add.button(width * (1 / 6), height - buttonDispX, "buttonSheet", changeState, this, 5, 5, 5);
	button5.name = "save";
	button5.anchor.set(0.5);

	button6 = game.add.button(width * (2 / 6), height - buttonDispX, "buttonSheet", changeState, this, 6, 6, 6);
	button6.name = "medicine";
	button6.anchor.set(0.5);

	button7 = game.add.button(width * (3 / 6), height - buttonDispX, "buttonSheet", changeState, this, 7, 7, 7);
	button7.name = "shop";
	button7.anchor.set(0.5);

	button8 = game.add.button(width * (4 / 6), height - buttonDispX, "buttonSheet", changeState, this, 8, 8, 8);
	button8.name = "settings";
	button8.anchor.set(0.5);

	button9 = game.add.button(width * (5 / 6), height - buttonDispX, "buttonSheet", changeState, this, 9, 9, 9);
	button9.name = "main";
	button9.anchor.set(0.5);
}

function changeState (button) {
	console.log(button.name);
	game.state.start(button.name);
}

function foodItem (name, spriteIndex, cost, desc, hungRestore) {
	this.mainText = name;
	this.descText = desc;
	this.spriteIndex = spriteIndex;
	this.cost = cost;
	this.hungRestore = hungRestore;
	this.select = function (mode) {
		console.log(mode);
		switch (mode) {
			//purchasing from the store puts a foodItem instance into an inventory
			case "buy":
				if (this.cost > globalVal.money) {
					addTempText("INSUFFICIENT FUNDS", 1);
					console.log("INSUFFICIENT FUNDS");
					return;
				}
				globalVal.money = globalVal.money - this.cost;
				console.log("push");
				invFoodArray.push(this);
				addTempText("Purchased!", 1);
				//game.state.start("main");
				break;
			//Consumes an item
			case "use":
				pet.hunger = pet.hunger + this.hungRestore;
				invFoodArray.splice(invFoodArray.indexOf(this), 1);
				game.state.start("main");
				break;
		}

	}
}
//
invFoodArray = [
	new foodItem("Burger", 0, 10, "Fast food", 8),
	/*
	new foodItem("Steak",1,20,"Cow flesh.\nCosts $20",18),
	new foodItem("Creamsicle",2,5,"I hate creamsicles\nCosts $5",3),
	new foodItem("Fish",3,20,"85% Mercury free!\nCosts $20",20),
	new foodItem("Egg",4,20,"Egg flesh\nCosts $20",20),
	new foodItem("Coffee",5,20,"Bitter drink\nCosts $20",20),
	new foodItem("Drumstick",6,20,"Bird flesh\nCosts $20",20),
	new foodItem("Shoe",7,150,"You pay for the design\nCosts $150",2),
	new foodItem("Chicken",8,20,"Fresh chicken\nCosts $20",20)
	*/
];



var food = {
	preload: function () {

	},
	create: function () {
		//if (!invFoodArray){}
		drawGameBody();
		drawGameUI(invFoodArray, "foodSheet");
		costText.alpha = 0;
		button12.mode = "use";

		if (!invFoodArray.length) {
			button12.alpha = 0;
			button11.alpha = 0;
			button10.alpha = 0;
			sprite.alpha = 0;
		}
		/*
		//draw food sprite
		foodSprite = game.add.sprite(this.game.world.centerX,this.game.world.centerY,"foodSheet");
		//change its "center point";
		foodSprite.frame = 0;
		foodSprite.anchor.setTo(0.5);
		mainText = game.add.bitmapText(game.world.centerX, height*(1/4),"pixel","ERROR",32);
		mainText.anchor.setTo(0.5);
		foodText = game.add.bitmapText(game.world.centerX, height*(4/6),"pixel","ERROR",22);
		foodText.anchor.setTo(0.5);
		foodText.align = "center";
		*/
	},
	update: function () {
		if (!invFoodArray.length) {

		}
		else {
			displaySlide(invFoodArray);
		}
		tickCheck();
	}
}

rerunCounter = 5;
function playItem (name, spriteIndex, cost, useCost, desc, happinessRestore) {
	this.mainText = name;
	this.descText = desc;
	this.spriteIndex = spriteIndex;
	//useCost is price to use the item,cost is the price to buy the item
	this.useCost = useCost;
	this.cost = cost;
	this.happinessRestore = happinessRestore;
	this.select = function (mode) {
		console.log("hit");

		switch (mode) {
			//purchasing from the store puts a foodItem instance into an inventory
			case "buy":
				if (this.cost > globalVal.money) {
					addTempText("INSUFFICIENT FUNDS", 1);
					console.log("INSUFFICIENT FUNDS");
					return;
				}
				globalVal.money = globalVal.money - this.cost;
				console.log("push");
				//transfer item to your inventory
				invPlayArray.push(this);
				playArray.splice(playArray.indexOf(this), 1);
				addTempText("Purchased!", 1);
				//game.state.start("main");
				break;

			//Uses an item
			case "use":
				console.log("hit");
				if (this.useCost > globalVal.money) {
					console.log("INSUFFICIENT FUNDS");
					addTempText("INSUFFICIENT FUNDS", 1);
					//TODO, have text in the screen be displayed for x amount of time
					return;
				}
				if (this.mainText == "PetFlix") {
					console.log("hit");
					rerunCounter++;
					//update the text in the object
					this.descText = "Watch reruns of 'The Office',\nfor the " + rerunCounter + "th time.\nCosts $3";
				}
				pet.happiness += this.happinessRestore;
				globalVal.money = globalVal.money - this.useCost;

				invFoodArray.splice(invFoodArray.indexOf(this), 1);
				game.state.start("main");
				break;
		}
	}
}
//TODO: allow for new playItems to be stacked onto this array when purchased from the shop
invPlayArray = [
	new playItem("Vacation", 0, 0, 100, "Chill\nCosts $100", 100),
	new playItem("Board Games", 1, 0, 1, "More like Bored Games amiright\nCosts $1", 5),
	new playItem("Work", 2, 0, -50, "Make $$$, but at the expense\n of some happiness.\nPays $50", -10),
	new playItem("PetFlix", 3, 0, 3, "Watch reruns of 'The Office',\nfor the " + rerunCounter + "th time.\nCosts $3", 5),
	new playItem("PRAISE STEVE JOBS", 4, 0, 999, "APPLE DOES WHAT WINDON'T\nCosts $999", 40)
];


var play = {
	preload: function () {
	},
	create: function () {
		drawGameBody();
		drawGameUI(invPlayArray, "playSheet");
		costText.alpha = 0;
		button12.mode = "use";
		/*
		//draw food sprite
		foodSprite = game.add.sprite(this.game.world.centerX,this.game.world.centerY,"foodSheet");
		//change its "center point";
		foodSprite.frame = 0;
		foodSprite.anchor.setTo(0.5);
		mainText = game.add.bitmapText(game.world.centerX, height*(1/4),"pixel","ERROR",32);
		mainText.anchor.setTo(0.5);
		foodText = game.add.bitmapText(game.world.centerX, height*(4/6),"pixel","ERROR",22);
		foodText.anchor.setTo(0.5);
		foodText.align = "center";
		*/
	},
	update: function () {
		displaySlide(invPlayArray);
		tickCheck();
	}
}

var shop = {
	preload: function () {
	},
	create: function () {
		drawGameBody();
		drawGameMenu("shopFood", "Buy Food", "shopItem", "Buy Items");
	},
	update: function () {
		tickCheck();

	}
}

var shopItem = {
	preload: function () {
	},
	create: function () {
		drawGameBody();
		drawGameUI(playArray, "playSheet");
		button12.mode = "buy";
	},
	update: function () {
		displaySlide(playArray);
		tickCheck();
	}
}

var shopFood = {
	preload: function () {
	},
	create: function () {
		drawGameBody();
		drawGameUI(foodArray, "foodSheet");
		button12.mode = "buy";
	},
	update: function () {
		displaySlide(foodArray);
		tickCheck();
	}
}


//items sold by the store
foodArray = [
	new foodItem("Burger", 0, 10, "Fast food", 8),
	new foodItem("Steak", 1, 20, "Cow flesh", 18),
	new foodItem("Creamsicle", 2, 5, "I hate creamsicles", 3),
	new foodItem("Fish", 3, 20, "85% Mercury free!", 20),
	new foodItem("Egg", 4, 20, "Egg flesh", 20),
	new foodItem("Coffee", 5, 20, "Bitter drink", 20),
	new foodItem("Drumstick", 6, 20, "Bird flesh", 20),
	new foodItem("Shoe", 7, 150, "You pay for the design", 2),
	new foodItem("Chicken", 8, 20, "Fresh chicken", 20)
];
//playItem(name,spriteIndex,cost,useCost,desc,happinessRestore)
playArray = [
	new playItem("Pencil", 5, 100, 0, "Draw some of stuff", 11),
	new playItem("Dumbbell", 6, 500, 0, "Get big quick", 20),
	new playItem("Computer", 7, 1000, 0, "Wow so cool", 15),
	new playItem("Plant", 8, 400, 0, "Talk to the plant or something", 4),
	new playItem("S8B04RD", 9, 800, 0, "R4D D00D3", 33),
	new playItem("Drums", 10, 400, 0, "Very loud", 13),
	new playItem("Fishing Rod", 11, 1000, 0, "*Doesn't actually catch things", 40),
]

var pet = {
	name: "BBQ MAN",
	sex: "M",
	age: 0,
	health: 50,
	happiness: 50,
	hunger: 50,
	mood: "Neutral",
	size: 60,
	sick: false,
	poop: 0
	//poop refers to legitimate fecal matter the pet makes. It is not immaturity on my side.
};

globalVal = {
	money: 500,
	counterEnabled: false,
	godMode: false,
	ezMoney: false,
	noToilet: false,
	camoNinjas: false,
};

var defaultPetJSON = JSON.stringify(pet);
var defaultGlobalValJSON = JSON.stringify(globalVal);
//var defaultInvFoodArrayJSON = JSON.stringify(invFoodArray);
//var defaultInvPlayArrayJSON = JSON.stringify(invPlayArray);
//var defaultPlayArrayJSON = JSON.stringify(playArray);


//Attempt to load JSON with key string, and assign that to assignToVar, if cannot load JSON load abort and return false.
function loadJSON (key) {
	var loadedJSON = localStorage.getItem(key);
	var testJSON = JSON.parse(loadedJSON);
	console.log(JSON.parse(loadedJSON));
	if (testJSON == null) {
		addTempText("Cannot Load File!");
		console.log("ERROR! Cannot load save!");
		return false;
	}
	else {
		console.log("hit");
		return testJSON;
	}
}

function loadStorage () {
	//loaded object is string (only strings can be stored), so we take the string
	//and "parse" it back into an object.
	if (loadJSON("petSave")) {
		pet = loadJSON("petSave");
		globalVal = loadJSON("globalValSave");


	}
}

function saveStorage () {
	//convert our object into a sting and store it to the browser.
	localStorage.setItem("petSave", JSON.stringify(pet));
	localStorage.setItem("globalValSave", JSON.stringify(globalVal));
	/*
	localStorage.setItem("invFoodArraySave",JSON.stringify(invFoodArray));
	localStorage.setItem("playArraySave",JSON.stringify(playArray));
	localStorage.setItem("invPlayArraySave",JSON.stringify(invPlayArray));
	*/
}

function resetStorage () {
	pet = JSON.parse(defaultPetJSON);
	globalVal = JSON.parse(defaultGlobalValJSON);
	localStorage.removeItem("petSave");
	localStorage.removeItem("globalValSave");
}

function saveItem (name, spriteIndex, desc) {
	this.mainText = name;
	this.descText = desc;
	this.spriteIndex = spriteIndex;
	this.select = function () {
		switch (this.mainText) {
			case "Save":
				saveStorage();
				break;
			case "Load":
				loadStorage();
				break;
			case "Reset":
				resetStorage();
				break;
		}
		game.state.start("main");
	}
}
//
saveArray = [
	new saveItem("Save", 0, "Save your game"),
	new saveItem("Load", 1, "Load your game"),
	new saveItem("Reset", 2, "Reset your game,\nand lose all your progress")
];
//
var save = {
	preload: function () {
	},
	create: function () {
		drawGameBody();
		drawGameUI(saveArray, "saveSheet");
		costText.alpha = 0;
		button12.mode = "use";

		if (!saveArray.length) {
			button12.alpha = 0;
			button11.alpha = 0;
			button10.alpha = 0;
			sprite.alpha = 0;
		}
	},
	update: function () {
		displaySlide(saveArray);
		tickCheck();
	}
}

function settingItem (name, spriteIndex, desc, affectingVal, nameVal) {
	this.mainText = name;
	this.descText = desc;
	this.spriteIndex = spriteIndex;
	this.nameVal = nameVal;
	this.select = function () {
		affectingVal = !affectingVal;
		if (affectingVal) {
			addTempText("Enabled!", 0.7);
		}
		else {
			addTempText("Disabled!", 0.7);
		}
		switch (this.nameVal) {
			case "counterEnabled":
				globalVal.counterEnabled = affectingVal;
				break;
			case "godMode":
				globalVal.godMode = affectingVal;
				break;
			case "ezMoney":
				globalVal.ezMoney = affectingVal;
				break;
			case "noToilet":
				globalVal.noToilet = affectingVal;
				break;
			case "camoNinjas":
				globalVal.camoNinjas = affectingVal;
				break;
		}
	}
}
settingArray = [
	new settingItem("Enable/Disable Counter", 0, "Enable tick counter\n& ruin fun", globalVal.counterEnabled, "counterEnabled"),
	new settingItem("Enable/Disable God Mode", 0, "Pet cannot die", globalVal.godMode, "godMode"),
	new settingItem('"Invest" in Crypto', 0, "Get $10 every now and then", globalVal.ezMoney, "ezMoney"),
	new settingItem("Enable/Disable\nFast Food", 0, "Pet doesn't poop", globalVal.noToilet, "noToilet"),
	new settingItem("Enable/Disable\nCamo Ninjas", 0, "Camoflauge Ninjas\n sometimes appear", globalVal.camoNinjas, "camoNinjas"),
];

var settings = {
	preload: function () {

	},
	create: function () {
		drawGameBody();
		drawGameUI(settingArray, "saveSheet");
		costText.alpha = 0;
		//button12.mode="use";

		if (!settingArray.length) {
			button12.alpha = 0;
			button11.alpha = 0;
			button10.alpha = 0;
			sprite.alpha = 0;
		}

	},
	update: function () {

		displaySlide(settingArray);

		tickCheck();
	}
}

var game = new Phaser.Game(800, 800, Phaser.AUTO);
var height = 800;
var width = 800;
var buttonDispX = 50;


date = new Date();



var tickCounter = 0;

var time;


//---------------------------STATES---------------------------------------
var main = {
	preload: function () {


	},
	create: function () {
		//round pixels, so that pixel sprites remain sharp
		//this fixed a problem with the button sprite sheet
		game.renderer.renderSession.roundPixels = true;
		//Allows game to run in background
		game.stage.disableVisibilityChange = true;

		drawGameBody();

		//draw pet sprite
		petSprite = game.add.sprite(this.game.world.centerX, this.game.world.centerY, "petSheet");
		//change its "center point";
		petSprite.anchor.setTo(0.5);

		//adds a custom animation with name,frames wanted in sprite sheet, the fps, and if it wants to be looped.
		petSprite.animations.add("neutral", [0, 1], 2, true);
		petSprite.animations.add("sad", [2, 3], 2, true);
		petSprite.animations.add("dead", [4, 5], 2, true);
		petSprite.animations.add("happy", [6, 7], 2, true);
		petSprite.animations.add("angry", [8, 9], 2, true);
		counter = game.add.bitmapText(75, game.world.centerY - 200, "pixel", "tickCounter", 32);
		petSprite.play("neutral");
		//add Sprites for ailments - conditions that can afflict the pet.
		sickSprite = game.add.sprite(petSprite.x + 50, petSprite.y - 50, "ailmentSheet");
		sickSprite.animations.add("sick", [2, 3], 2, true);
		sickSprite.anchor.setTo(0.5);
		sickSprite.scale.setTo(0.45);
		sickSprite.play("sick");

		//"poop" sprite. Can potentially create a "poop" object so that code is a bit more tidy, but since only 3 sprites are needed, code can be left as is.

		poopSprite0 = game.add.sprite(width * (3 / 4), height * ((2 + 2) / 7), "ailmentSheet");
		poopSprite0.scale.setTo(0.5);
		poopSprite0.anchor.setTo(0.5);
		poopSprite0.animations.add("poop", [0, 1], 2, true);
		poopSprite0.play("poop");

		poopSprite1 = game.add.sprite(width * (3 / 4), height * ((2 + 1) / 7), "ailmentSheet");
		poopSprite1.scale.setTo(0.5);
		poopSprite1.anchor.setTo(0.5);
		poopSprite1.animations.add("poop", [0, 1], 2, true);
		poopSprite1.play("poop");

		poopSprite2 = game.add.sprite(width * (3 / 4), height * ((2 + 0) / 7), "ailmentSheet");
		poopSprite2.scale.setTo(0.5);
		poopSprite2.anchor.setTo(0.5);
		poopSprite2.animations.add("poop", [0, 1], 2, true);
		poopSprite2.play("poop");

		poopArray = [poopSprite0, poopSprite1, poopSprite2];
	},

	update: function () {
		tickCheck();
		ailmentCheck();

		//play sprite animation according to mood
		petSprite.play(pet.mood);

		if (globalVal.counterEnabled) {
			counter.text = tickCounter;
		}
		else {
			counter.text = "";
		}


		//now calculate pet mood
		if (pet.mood == "dead") {
			return;
		}
		if ((pet.hunger > 50) && (pet.happiness >= 60)) {
			pet.mood = "happy";
		}
		else if ((pet.hunger >= 30) && (pet.happiness < 30)) {
			pet.mood = "angry";
		}
		else if ((pet.hunger <= 0) && (!globalVal.godMode)) {
			pet.mood = "dead";
		}
		else if ((pet.hunger < 30) || (pet.sick)) {
			pet.mood = "sad";
		}
		else {
			pet.mood = "neutral";
		}


	}
}

//State loads all most game assests. While this technically isnt needed as all states can preload
//the files are small enough that this preload will be very quick, and will prevent the game from
//flickering when states change.
var preload = {
	preload: function () {
		//loads an image can can be refenced as background
		this.load.image("background", "assets/art/background.png");
		//loads a sprite sheet and breaks the sheet up into 10, 128 x 128 sprites.
		this.load.spritesheet("petSheet", "assets/art/pet/petSheet.png", 128, 128, 10);
		this.load.spritesheet("foodSheet", "assets/art/items/foodSheet.png", 128, 128, 9);
		this.load.spritesheet("playSheet", "assets/art/items/playSheet.png", 128, 128, 12);
		this.load.spritesheet("saveSheet", "assets/art/items/saveSheet.png", 128, 128, 3);
		this.load.spritesheet("ailmentSheet", "assets/art/pet/ailmentSheet.png", 128, 128, 9);
		//loads button sprite sheet.
		this.load.spritesheet("buttonSheet", "assets/art/buttonSheet.png", 64, 64, 15);

		//loads a bitmapFont, which requires both a png as well as an XML file.
		this.load.bitmapFont("pixel", "assets/font/pixelFont.png", "assets/font/pixelFont.xml");

	},
	create: function () {
		loadStorage();
		//resetStorage();
		game.state.start("main");
	}
}
//-200+(32*4)
//var healthBarEmpty;

var stats = {
	preload: function () {
	},
	create: function () {
		drawGameBody();
		pet.happiness = Math.min(Math.max(pet.happiness, 0), 100);
		pet.hunger = Math.min(Math.max(pet.hunger, 0), 100);
		text = game.add.bitmapText(75, game.world.centerY - 200, "pixel", "ERROR", 32);



	},
	update: function () {
		tickCheck();
		text.text = "Name: " + pet.name + "\nAge:  " + pet.age + "\nHunger: " + pet.hunger + "\nHappiness: " + pet.happiness + "\nMoney: $" + globalVal.money;
	}
}


var fastForward = {
	preload: function () {
	},
	create: function () {
		drawGameBody();
		tick();
		game.state.start("main");
	},
	update: function () {
	}
}

var toilet = {
	preload: function () {
	},
	create: function () {
		drawGameBody();
		pet.poop = 0;
		game.state.start("main");
	},
	update: function () {
	}
}

var medicine = {
	preload: function () {
	},
	create: function () {
		drawGameBody();
		pet.sick = false;
		game.state.start("main");
	},
	update: function () {
	}
}

//---------------------------SUBSTATE FUNCTIONS---------------------------------------

//time per tick, in minutes
var TIME_PER_TICK = 5;
var timeBegin = 0;

//This function checks if the "real world clock" has advanced enough to increment the game a tick.
//The tick will alter the properties of the pet. 
function tickCheck () {
	var timeNow = (new Date()).getTime();
	//console.log("timeNow: "+timeNow);
	if (timeBegin == 0) {
		timeBegin = (new Date()).getTime();
		//console.log("timeBegin: "+timeBegin);
	}
	if ((timeNow - timeBegin) > (TIME_PER_TICK * 60 * 1000)) {
		timeBegin = (new Date()).getTime();
		//console.log("timeBegin: "+timeBegin);
		tick();
	}

}

function tick () {
	console.log(globalVal.ezMoney);
	if (globalVal.ezMoney) {
		globalVal.money += 10;
	}
	tickCounter++;
	console.log("tick");
	pet.hunger = pet.hunger - 3;
	pet.happiness = pet.happiness - 2;

	//further decrease stats if pet is sick
	if (pet.sick) {
		pet.hunger = pet.hunger - 5;
		pet.happiness = pet.happiness - 2;
	}
	pet.happiness = Math.min(Math.max(pet.happiness, 0), 100);
	pet.hunger = Math.min(Math.max(pet.hunger, 0), 100);

	//pet has a chance of pooping every tick
	if (globalVal.noToilet) {
		//do nothing
	}
	else if (pet.hunger > 90) {
		if (Math.random() > 0.70) {
			pet.poop++;
		}
	}
	else if (pet.hunger <= 90) {
		if (Math.random() > 0.85) {
			pet.poop++;
		}
	}
	pet.poop = Math.min(Math.max(pet.poop, 0), 3);
	//amount of poop alters probability of sickness
	if (Math.random() < (0.1 * pet.poop)) {
		pet.sick = true;
	}

	if (pet.mood != "dead") {
		pet.age++;
	}
	console.log("dung: " + pet.poop);
}

//turn ailment sprites "on" or "off" depending on the pets properties
function ailmentCheck () {
	for (var i = 0; i < 3; i++) {
		//console.log(poopArray[i]);
		if (i < pet.poop) {
			poopArray[i].alpha = 1;
		}
		else {
			poopArray[i].alpha = 0;
		}
	}
	if (pet.sick) {
		sickSprite.alpha = 1;
	}
	else {
		sickSprite.alpha = 0;
	}
}

game.state.add("preload", preload);
game.state.add("main", main);
game.state.add("stats", stats);
game.state.add("fastForward", fastForward);
game.state.add("food", food);
game.state.add("toilet", toilet);
game.state.add("medicine", medicine);
game.state.add("play", play);
game.state.add("shop", shop);
game.state.add("shopItem", shopItem);
game.state.add("shopFood", shopFood);
game.state.add("save", save);
game.state.add("settings", settings);
game.state.start("preload");