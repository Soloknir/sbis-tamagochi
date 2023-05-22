import Phaser from 'phaser';

enum MoodKeys {
	HAPPY = 'HAPPY',
	ANGRY = 'ANGRY',
	DEAD = 'DEAD',
	SAD = 'SAD',
	NEUTRAL = 'NEUTRAL'
}

export class Pet {
	name = "SBIS FOX";
	sex = "M";
	age = 0;
	health = 50;
	happiness = 50;
	hunger = 50;
	mood = MoodKeys.NEUTRAL;
	size = 60;
	sick = false;
	poop = 0;
}

const globalVal = {
	money: 500,
	counterEnabled: false,
	godMode: false,
	ezMoney: false,
	noToilet: false,
	camoNinjas: false,
};

const WIDTH = 800;
const HEIGHT = 800;

export class TamagoshiLoad extends Phaser.Scene {
	constructor() {
		super({ key: 'TamagoshiBootLoad' });
	}

	preload() {
		this.load.image("background", "assets/art/background.png");
		this.load.spritesheet("petSheet", "assets/art/pet/petSheet.png", {
			frameWidth: 128,
			frameHeight: 128,
			startFrame: 10
		});
		this.load.spritesheet("foodSheet", "assets/art/items/foodSheet.png", {
			frameWidth: 128,
			frameHeight: 128,
			startFrame: 9
		});
		this.load.spritesheet("playSheet", "assets/art/items/playSheet.png", {
			frameWidth: 128,
			frameHeight: 128,
			startFrame: 12
		});
		this.load.spritesheet("saveSheet", "assets/art/items/saveSheet.png", {
			frameWidth: 128,
			frameHeight: 128,
			startFrame: 3
		});
		this.load.spritesheet("ailmentSheet", "assets/art/pet/ailmentSheet.png", {
			frameWidth: 128,
			frameHeight: 128,
			startFrame: 9
		});
		this.load.spritesheet("buttonSheet", "assets/art/buttonSheet.png", {
			frameWidth: 64,
			frameHeight: 64,
			startFrame: 15
		});
		this.load.bitmapFont("pixel", "assets/font/pixelFont.png", "assets/font/pixelFont.xml");
	}
	create() {
		this.scene.start("TamagoshiMainScene");
	}
}

export class TamagoshiMain extends Phaser.Scene {
	pet: Pet;
	petSprite: Phaser.GameObjects.Sprite;
	sickSprite: Phaser.GameObjects.Sprite;
	poopArray: Phaser.GameObjects.Sprite[];
	counter: Phaser.GameObjects.BitmapText;

	create() {
		//round pixels, so that pixel sprites remain sharp
		//this fixed a problem with the button sprite sheet
		game.renderer.renderSession.roundPixels = true;
		//Allows game to run in background
		game.stage.disableVisibilityChange = true;

		drawGameBody();

		//draw pet sprite
		this.petSprite = this.add.sprite(game.world.centerX, game.world.centerY, "petSheet");
		//change its "center point";
		this.petSprite.setOrigin(0.5, 0.5);

		//adds a custom animation with name,frames wanted in sprite sheet, the fps, and if it wants to be looped.
		


		this.counter = this.add.bitmapText(75, game.world.centerY - 200, "pixel", "tickCounter", 32);
		this.petSprite.play("NEUTRAL");
		//add Sprites for ailments - conditions that can afflict the pet.
		this.sickSprite = this.add.sprite(this.petSprite.x + 50, this.petSprite.y - 50, "ailmentSheet");

		this.sickSprite.setOrigin(0.5, 0.5);
		this.sickSprite.setScale(0.45, 0.45);
		this.sickSprite.play("sick");

		//"poop" sprite. Can potentially create a "poop" object so that code is a bit more tidy, but since only 3 sprites are needed, code can be left as is.


		const poopSprite0 = this.add.sprite(WIDTH * (3 / 4), HEIGHT * ((2 + 2) / 7), "ailmentSheet");
		poopSprite0.setScale(0.45, 0.45);
		poopSprite0.setOrigin(0.5, 0.5);
		poopSprite0.play("poop");

		const poopSprite1 = this.add.sprite(WIDTH * (3 / 4), HEIGHT * ((2 + 1) / 7), "ailmentSheet");
		poopSprite1.setScale(0.45, 0.45);
		poopSprite1.setOrigin(0.5, 0.5);
		poopSprite1.play("poop");

		const poopSprite2 = this.add.sprite(WIDTH * (3 / 4), HEIGHT * ((2 + 0) / 7), "ailmentSheet");
		poopSprite2.setScale(0.45, 0.45);
		poopSprite2.setOrigin(0.5, 0.5);
		poopSprite2.play("poop");

		this.poopArray = [poopSprite0, poopSprite1, poopSprite2];
	}

	update() {
		tickCheck();
		ailmentCheck();

		//play sprite animation according to mood
		this.petSprite.play(this.pet.mood);

		if (globalVal.counterEnabled) {
			this.counter.text = tickCounter;
		}
		else {
			this.counter.text = "";
		}


		//now calculate pet mood
		if (this.pet.mood == MoodKeys.DEAD) {
			return;
		}
		if ((this.pet.hunger > 50) && (this.pet.happiness >= 60)) {
			this.pet.mood = MoodKeys.HAPPY;
		}
		else if ((this.pet.hunger >= 30) && (this.pet.happiness < 30)) {
			this.pet.mood = MoodKeys.ANGRY;
		}
		else if ((this.pet.hunger <= 0) && (!globalVal.godMode)) {
			this.pet.mood = MoodKeys.DEAD;
		}
		else if ((this.pet.hunger < 30) || (this.pet.sick)) {
			this.pet.mood = MoodKeys.SAD;
		}
		else {
			this.pet.mood = MoodKeys.NEUTRAL;
		}
	}

	createAnimations(): void {
		this.anims.create({
			key: MoodKeys.NEUTRAL,
			frames: this.anims.generateFrameNumbers('petSheet', { start: 0, end: 1 }),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: MoodKeys.SAD,
			frames: this.anims.generateFrameNumbers('petSheet', { start: 2, end: 3 }),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: MoodKeys.DEAD,
			frames: this.anims.generateFrameNumbers('petSheet', { start: 4, end: 5 }),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: MoodKeys.HAPPY,
			frames: this.anims.generateFrameNumbers('petSheet', { start: 6, end: 7 }),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: MoodKeys.ANGRY,
			frames: this.anims.generateFrameNumbers('petSheet', { start: 8, end: 9 }),
			frameRate: 2,
			repeat: -1
		});

		this.anims.create({
			key: "sick",
			frames: this.anims.generateFrameNumbers('ailmentSheet', { start: 2, end: 3 }),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: "poop",
			frames: this.anims.generateFrameNumbers('ailmentSheet', { start: 0, end: 1 }),
			frameRate: 2,
			repeat: -1
		});
	}
}


export class TamagochiStatsScene extends Phaser.Scene {
	create() {
		drawGameBody();
		pet.happiness = Math.min(Math.max(pet.happiness, 0), 100);
		pet.hunger = Math.min(Math.max(pet.hunger, 0), 100);
		text = game.add.bitmapText(75, game.world.centerY - 200, "pixel", "ERROR", 32);
	};
	update() {
		tickCheck();
		text.text = "Name: " + pet.name + "\nAge:  " + pet.age + "\nHunger: " + pet.hunger + "\nHappiness: " + pet.happiness + "\nMoney: $" + globalVal.money;
	}
}

export class TamagochiFastForwardScene extends Phaser.Scene {
	create() {
		drawGameBody();
		tick();
		game.state.start("main");
	}
}

export class TamagochiToiletScene extends Phaser.Scene {
	create() {
		drawGameBody();
		pet.poop = 0;
		game.state.start("main");
	}
}

export class TamagochiMedicineScene extends Phaser.Scene {
	create() {
		drawGameBody();
		pet.sick = false;
		game.state.start("main");
	}
}

export class TamagochiSettingScene extends Phaser.Scene {
	create() {
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

	}

	update() {

		displaySlide(settingArray);

		tickCheck();
	}
}

export class TamagochiSaveScene extends Phaser.Scene {
	create() {
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
	}
	update() {
		displaySlide(saveArray);
		tickCheck();
	}
}


export class TamagochiFoodScene extends Phaser.Scene {
	create() {
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
	}
	update() {
		if (!invFoodArray.length) {

		}
		else {
			displaySlide(invFoodArray);
		}
		tickCheck();
	}
}

export class TamagochiPlayScene extends Phaser.Scene {
	create() {
		drawGameBody();
		drawGameUI(invPlayArray, "playSheet");
		costText.alpha = 0;
		button12.mode = "use";
	}
	update() {
		displaySlide(invPlayArray);
		tickCheck();
	}
}

export class TamagochiShopScene extends Phaser.Scene {
	create() {
		drawGameBody();
		drawGameMenu("shopFood", "Buy Food", "shopItem", "Buy Items");
	},
	update() {
		tickCheck();

	}
}

export class TamagochiShopItemScene extends Phaser.Scene {
	create() {
		drawGameBody();
		drawGameUI(playArray, "playSheet");
		button12.mode = "buy";
	}
	update() {
		displaySlide(playArray);
		tickCheck();
	}
}

export class TamagochiShopFoodScene extends Phaser.Scene {
	create() {
		drawGameBody();
		drawGameUI(foodArray, "foodSheet");
		button12.mode = "buy";
	}
	update() {
		displaySlide(foodArray);
		tickCheck();
	}
}
