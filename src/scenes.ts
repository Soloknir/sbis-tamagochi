import { ButtonKeys, FontSizes, FrameSheets, MoodKeys, SceneKeys } from './enums';
import { foodArray, invFoodArray } from './food';
import { Pet, GameState } from './globalObjects';
import { tick, tickCheck } from './helpers';
import { invPlayArray, playArray } from './play';
import UIScene from './userInterface';

const WIDTH = 800;
const HEIGHT = 800;

const rect = {
	width: WIDTH,
	height: HEIGHT,
	buttonDispX: 50
}

export class TamagochiLoadScene extends Phaser.Scene {
	constructor() {
		super({ key: SceneKeys.LOAD });
	}

	preload() {
		const gameObjectFrameSize = {
			frameWidth: 128,
			frameHeight: 128
		};

		const petObjectFrameSize = {
			frameWidth: 256,
			frameHeight: 256
		};

		this.load.image("background", "assets/images/background.png");
		this.load.spritesheet(FrameSheets.PET, "assets/images/pet/petSheet.png", petObjectFrameSize);
		this.load.spritesheet(FrameSheets.FOOD, "assets/images/items/foodSheet.png", gameObjectFrameSize);
		this.load.spritesheet(FrameSheets.PLAY, "assets/images/items/playSheet.png", gameObjectFrameSize);
		this.load.spritesheet(FrameSheets.SAVE, "assets/images/items/saveSheet.png", gameObjectFrameSize);
		this.load.spritesheet(FrameSheets.AILMENT, "assets/images/pet/ailmentSheet.png", gameObjectFrameSize);
		this.load.spritesheet(FrameSheets.BUTTON, "assets/images/buttonSheet.png", {
			frameWidth: 64,
			frameHeight: 64,
		});

		this.load.bitmapFont("pixel", "assets/font/open_sans_regular_32.png", "assets/font/open_sans_regular_32.xml");
		this.load.audio('background', 'assets/sounds/background.mp3');
	}
	create() {
		const music = this.sound.add('background', { volume: 0.4 });
		music.setLoop(true);
		music.play();

		this.scene.start(SceneKeys.MAIN);
	}
}

export class TamagochiMainScene extends UIScene {
	static animationsLoaded = false;

	pet: Pet;
	globalVal: GameState;
	petSprite: Phaser.GameObjects.Sprite;
	sickSprite: Phaser.GameObjects.Sprite;
	bugArray: Phaser.GameObjects.Sprite[];
	counter: Phaser.GameObjects.BitmapText;

	constructor() {
		super({ key: SceneKeys.MAIN }, rect);
	}

	create() {
		const camera = this.cameras.main;
		if (!TamagochiMainScene.animationsLoaded) {
			this.createAnimations();
		}

		this.drawGameBody();

		this.petSprite = this.add.sprite(camera.centerX, camera.centerY, FrameSheets.PET);
		this.petSprite.setOrigin(0.5);
		this.petSprite.setScale(0.9);
		this.petSprite.play(this.pet.mood);

		this.counter = this.add.bitmapText(75, camera.centerY - 200, "pixel", "tickCounter", FontSizes.BIG);
		this.sickSprite = this.add.sprite(this.petSprite.x + 90, this.petSprite.y - 130, FrameSheets.AILMENT);
		this.sickSprite.setScale(0.7, 0.7);
		this.sickSprite.setOrigin(0.5, 0.5);
		this.sickSprite.play("sick");
		if (this.pet.mood === MoodKeys.DEAD) {
			this.sickSprite.setAlpha(0);
		}

		const poopSprite0 = this.add.sprite(WIDTH * (3 / 4), HEIGHT * ((2 + 2) / 7), FrameSheets.AILMENT);
		poopSprite0.setScale(0.45, 0.45);
		poopSprite0.setOrigin(0.5, 0.5);
		poopSprite0.play("poop");

		const poopSprite1 = this.add.sprite(WIDTH * (3 / 4), HEIGHT * ((2 + 1) / 7), FrameSheets.AILMENT);
		poopSprite1.setScale(0.45, 0.45);
		poopSprite1.setOrigin(0.5, 0.5);
		poopSprite1.play("poop");

		const bugSprite2 = this.add.sprite(WIDTH * (3 / 4), HEIGHT * ((2 + 0) / 7), FrameSheets.AILMENT);
		bugSprite2.setScale(0.45, 0.45);
		bugSprite2.setOrigin(0.5, 0.5);
		bugSprite2.play("poop");

		this.bugArray = [poopSprite0, poopSprite1, bugSprite2];
	}

	update() {
		tickCheck(this);

		if (this.globalVal.counterEnabled) {
			this.counter.text = `${this.globalVal.tickCounter}`;
		}
		else {
			this.counter.text = "";
		}

		if (this.pet.mood == MoodKeys.DEAD) {
			return;
		}
	
		this.ailmentCheck();

		if ((this.pet.hunger > 50) && (this.pet.happiness >= 60)) {
			if (this.pet.mood !== MoodKeys.HAPPY)
				this.petSprite.play(MoodKeys.HAPPY);
			this.pet.mood = MoodKeys.HAPPY;
		} else if ((this.pet.hunger >= 30) && (this.pet.happiness < 30)) {
			if (this.pet.mood !== MoodKeys.ANGRY)
				this.petSprite.play(MoodKeys.ANGRY);
			this.pet.mood = MoodKeys.ANGRY;
		} else if ((this.pet.hunger <= 0) && (!this.globalVal.godMode)) {
			this.pet.mood = MoodKeys.DEAD;
			this.sickSprite.setAlpha(0);
			this.scene.start(SceneKeys.GAME_OVER);
		} else if ((this.pet.hunger < 30) || (this.pet.sick)) {
			if (this.pet.mood !== MoodKeys.SAD)
				this.petSprite.play(MoodKeys.SAD);
			this.pet.mood = MoodKeys.SAD;
		} else {
			if (this.pet.mood !== MoodKeys.NEUTRAL)
				this.petSprite.play(MoodKeys.NEUTRAL);
			this.pet.mood = MoodKeys.NEUTRAL;
		}
	}

	createAnimations(): void {
		TamagochiMainScene.animationsLoaded = true;
	
		this.anims.create({
			key: MoodKeys.NEUTRAL,
			frames: this.anims.generateFrameNumbers(FrameSheets.PET, { start: 0, end: 1 }),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: MoodKeys.SAD,
			frames: this.anims.generateFrameNumbers(FrameSheets.PET, { start: 2, end: 3 }),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: MoodKeys.DEAD,
			frames: this.anims.generateFrameNumbers(FrameSheets.PET, { start: 8, end: 9 }),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: MoodKeys.HAPPY,
			frames: this.anims.generateFrameNumbers(FrameSheets.PET, { start: 6, end: 7 }),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: MoodKeys.ANGRY,
			frames: this.anims.generateFrameNumbers(FrameSheets.PET, { start: 4, end: 5 }),
			frameRate: 2,
			repeat: -1
		});

		this.anims.create({
			key: "sick",
			frames: this.anims.generateFrameNumbers(FrameSheets.AILMENT, { start: 2, end: 3 }),
			frameRate: 2,
			repeat: -1
		});
		this.anims.create({
			key: "poop",
			frames: this.anims.generateFrameNumbers(FrameSheets.AILMENT, { start: 0, end: 1 }),
			frameRate: 2,
			repeat: -1
		});
	}

	ailmentCheck() {
		for (let i = 0; i < 3; i++) {
			this.bugArray[i].alpha = i < this.pet.poop ? 1 : 0;
		}

		if (this.pet.mood !== MoodKeys.DEAD) {
			this.sickSprite.alpha = this.pet.sick ? 1 : 0;
		}
	}
}


export class TamagochiStatsScene extends UIScene {
	pet: Pet;
	globalVal: GameState;
	constructor() {
		super({ key: SceneKeys.STATS }, rect);
	}
	create() {
		const camera = this.cameras.main;
		this.drawGameBody();
		this.pet.happiness = Math.min(Math.max(this.pet.happiness, 0), 100);
		this.pet.hunger = Math.min(Math.max(this.pet.hunger, 0), 100);
		this.text = this.add.bitmapText(75, camera.centerY - 200, "pixel", "Ошибка", FontSizes.BIG);
	};
	update() {
		tickCheck(this);
		const { name, age, hunger, happiness } = this.pet;
		this.text.text = `Имя: ${name}\nВозраст: ${age}\nГолод: ${hunger}\nНастроение: ${happiness}\nДеньги: ${this.globalVal.money}`;
	}
}

export class TamagochiFastForwardScene extends UIScene {
	constructor() {
		super({ key: SceneKeys.FAST_FORWARD }, rect);
	}
	create() {
		tick(this);
		this.scene.start(SceneKeys.MAIN);
	}
}

export class TamagochiToiletScene extends UIScene {
	pet: Pet;
	constructor() {
		super({ key: SceneKeys.TOILET }, rect);
	}
	create() {
		this.drawGameBody();
		this.pet.poop = 0;
		this.scene.start(SceneKeys.MAIN);
	}
}

export class TamagochiMedicineScene extends UIScene {
	pet: Pet;
	constructor() {
		super({ key: SceneKeys.MEDICINE }, rect);
	}
	create() {
		this.pet.sick = false;
		this.scene.start(SceneKeys.MAIN);
	}
}

export class TamagochiFoodScene extends UIScene {
	constructor() {
		super({ key: SceneKeys.FOOD }, rect);
	}
	create() {
		this.drawGameBody();
		this.drawSliderUI(invFoodArray, FrameSheets.FOOD);
		this.buttons[ButtonKeys.SELECT].mode = "use";

		if (!invFoodArray.length) {
			this.buttons[ButtonKeys.SELECT].button.setAlpha(0);
			this.buttons[ButtonKeys.SELECT].text?.setAlpha(0);
			this.buttons[ButtonKeys.FORWARD].button.setAlpha(0);
			this.buttons[ButtonKeys.BACKWARD].button.setAlpha(0);
			this.sprite.setAlpha(0);
		}
	}
	update() {
		if (!invFoodArray.length) {

		}
		else {
			this.displaySlide(invFoodArray);
		}
		tickCheck(this);
	}
}

export class TamagochiPlayScene extends UIScene {
	constructor() {
		super({ key: SceneKeys.PLAY }, rect);
	}
	create() {
		this.drawGameBody();
		this.drawSliderUI(invPlayArray, FrameSheets.PLAY);
		this.buttons[ButtonKeys.SELECT].mode = "use";
	}
	update() {
		this.displaySlide(invPlayArray);
		tickCheck(this);
	}
}

export class TamagochiShopScene extends UIScene {
	constructor() {
		super({ key: SceneKeys.SHOP }, rect);
	}
	create() {
		this.drawGameBody();
		this.drawGameMenu(SceneKeys.FOOD_SHOP, "Купить еду", SceneKeys.ITEM_SHOP, "Купить вещи");
	}
	update() {
		tickCheck(this);
	}
}

export class TamagochiShopItemScene extends UIScene {
	constructor() {
		super({ key: SceneKeys.ITEM_SHOP }, rect);
	}
	create() {
		this.drawGameBody();
		this.drawSliderUI(playArray, FrameSheets.PLAY);
		this.buttons[ButtonKeys.SELECT].mode = "buy";
	}
	update() {
		this.displaySlide(playArray);
		tickCheck(this);
	}
}

export class TamagochiShopFoodScene extends UIScene {
	constructor() {
		super({ key: SceneKeys.FOOD_SHOP }, rect);
	}
	create() {
		this.drawGameBody();
		this.drawSliderUI(foodArray, FrameSheets.FOOD);
		this.buttons[ButtonKeys.SELECT].mode = "buy";
	}
	update() {
		this.displaySlide(foodArray);
		tickCheck(this);
	}
}

export class TamagochiGameOverScene extends UIScene {
	petSprite: Phaser.GameObjects.Sprite;

	constructor() {
		super({ key: SceneKeys.GAME_OVER }, rect);
	}
	create() {
		this.drawGameOverUI(this.drawPet.bind(this));
	}
	update() {
		tickCheck(this);
	}
	drawPet() {
		const camera = this.cameras.main;
		this.petSprite = this.add.sprite(camera.centerX, camera.centerY, FrameSheets.PET);
		this.petSprite.setOrigin(0.5);
		this.petSprite.setScale(2);
		this.petSprite.play(MoodKeys.DEAD);
	}
}
