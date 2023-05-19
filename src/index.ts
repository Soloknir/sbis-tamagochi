import Phaser from 'phaser';

export class Pet {
	name = "BBQ MAN";
	sex = "M";
	age = 0;
	health = 50;
	happiness = 50;
	hunger = 50;
	mood = "Neutral";
	size = 60;
	sick = false;
	poop = 0;
}

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
		this.anims.create({
			key: "neutral",
			frames: this.anims.generateFrameNumbers('petSheet', { start: 0, end: 1}),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: "sad",
			frames: this.anims.generateFrameNumbers('petSheet', { start: 2, end: 3}),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: "dead",
			frames: this.anims.generateFrameNumbers('petSheet', { start: 4, end: 5}),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: "happy",
			frames: this.anims.generateFrameNumbers('petSheet', { start: 6, end: 7}),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: "angry",
			frames: this.anims.generateFrameNumbers('petSheet', { start: 8, end: 9}),
			frameRate: 2,
			repeat: -1
		});


		this.counter = this.add.bitmapText(75, game.world.centerY - 200, "pixel", "tickCounter", 32);
		this.petSprite.play("neutral");
		//add Sprites for ailments - conditions that can afflict the pet.
		this.sickSprite = this.add.sprite(this.petSprite.x + 50, this.petSprite.y - 50, "ailmentSheet");
		this.anims.create({
			key: "sick",
			frames: this.anims.generateFrameNumbers('ailmentSheet', { start: 2, end: 3 }),
			frameRate: 2,
			repeat: -1
		});
		this.sickSprite.setOrigin(0.5, 0.5);
		this.sickSprite.setScale(0.45, 0.45);
		this.sickSprite.play("sick");

		//"poop" sprite. Can potentially create a "poop" object so that code is a bit more tidy, but since only 3 sprites are needed, code can be left as is.
		this.anims.create({
			key: "poop",
			frames: this.anims.generateFrameNumbers('ailmentSheet', { start: 0, end: 1 }),
			frameRate: 2,
			repeat: -1
		});

		const poopSprite0 = this.add.sprite(width * (3 / 4), height * ((2 + 2) / 7), "ailmentSheet");
		poopSprite0.setScale(0.45, 0.45);
		poopSprite0.setOrigin(0.5, 0.5);
		poopSprite0.play("poop");

		const poopSprite1 = this.add.sprite(width * (3 / 4), height * ((2 + 1) / 7), "ailmentSheet");
		poopSprite1.setScale(0.45, 0.45);
		poopSprite1.setOrigin(0.5, 0.5);
		poopSprite1.play("poop");

		const poopSprite2 = this.add.sprite(width * (3 / 4), height * ((2 + 0) / 7), "ailmentSheet");
		poopSprite2.setScale(0.45, 0.45);
		poopSprite2.setOrigin(0.5, 0.5);
		poopSprite2.play("poop");

		this.poopArray = [poopSprite0, poopSprite1, poopSprite2];
	}

	update() {
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