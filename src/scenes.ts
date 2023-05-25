import { MoodKeys } from './enums';
import { foodArray, invFoodArray } from './food';
import { tick, tickCheck } from './helpers';
import { invPlayArray, playArray } from './play';
import { saveArray } from './save';
import { settingArray } from './settings';
import UIScene from './userInterface';

export class Pet extends Phaser.Plugins.BasePlugin {
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
	constructor(pluginManager: any) {
		super(pluginManager);
	}
}

export class GameState extends Phaser.Plugins.BasePlugin {
	timeBegin = 0;
	tickCounter = 0;
	money = 500;
	counterEnabled = false;
	godMode = false;
	ezMoney = false;
	noToilet = false;
	camoNinjas = false;
};

const WIDTH = 800;
const HEIGHT = 800;

const rect = {
	width: WIDTH,
	height: HEIGHT,
	buttonDispX: 50
}

export class TamagochiLoadScene extends Phaser.Scene {
	constructor() {
		super({ key: 'TamagochiLoadScene' });
	}

	preload() {
		const gameObjectFrameSize = {
			frameWidth: 128,
			frameHeight: 128
		};

		this.load.image("background", "assets/art/background.png");
		this.load.spritesheet("petSheet", "assets/art/pet/petSheet.png", gameObjectFrameSize);
		this.load.spritesheet("foodSheet", "assets/art/items/foodSheet.png", gameObjectFrameSize);
		this.load.spritesheet("playSheet", "assets/art/items/playSheet.png", gameObjectFrameSize);
		this.load.spritesheet("saveSheet", "assets/art/items/saveSheet.png", gameObjectFrameSize);
		this.load.spritesheet("ailmentSheet", "assets/art/pet/ailmentSheet.png", gameObjectFrameSize);
		this.load.spritesheet("buttonSheet", "assets/art/buttonSheet.png", {
			frameWidth: 64,
			frameHeight: 64,
		});

		this.load.bitmapFont("pixel", "assets/font/pixeloid_mono_regular_10.png", "assets/font/pixeloid_mono_regular_10.xml");
	}
	create() {
		this.scene.start("TamagochiMainScene");
	}
}

export class TamagochiMain extends UIScene {
	static animationsLoaded = false;

	pet: Pet;
	globalVal: GameState;
	petSprite: Phaser.GameObjects.Sprite;
	sickSprite: Phaser.GameObjects.Sprite;
	bugArray: Phaser.GameObjects.Sprite[];
	counter: Phaser.GameObjects.BitmapText;

	constructor() {
		super({ key: 'TamagochiMainScene' }, rect);
	}

	create() {
		const camera = this.cameras.main;
		if (!TamagochiMain.animationsLoaded) {
			this.createAnimations();
		}

		this.drawGameBody();

		this.petSprite = this.add.sprite(camera.centerX, camera.centerY, "petSheet");
		this.petSprite.setOrigin(0.5);
		this.petSprite.setScale(2);
		this.petSprite.play(this.pet.mood);

		this.counter = this.add.bitmapText(75, camera.centerY - 200, "pixel", "tickCounter", 32);
		this.sickSprite = this.add.sprite(this.petSprite.x + 90, this.petSprite.y - 130, "ailmentSheet");
		this.sickSprite.setScale(0.7, 0.7);
		this.sickSprite.setOrigin(0.5, 0.5);
		this.sickSprite.play("sick");
		if (this.pet.mood === MoodKeys.DEAD) {
			this.sickSprite.setAlpha(0);
		}

		const poopSprite0 = this.add.sprite(WIDTH * (3 / 4), HEIGHT * ((2 + 2) / 7), "ailmentSheet");
		poopSprite0.setScale(0.45, 0.45);
		poopSprite0.setOrigin(0.5, 0.5);
		poopSprite0.play("poop");

		const poopSprite1 = this.add.sprite(WIDTH * (3 / 4), HEIGHT * ((2 + 1) / 7), "ailmentSheet");
		poopSprite1.setScale(0.45, 0.45);
		poopSprite1.setOrigin(0.5, 0.5);
		poopSprite1.play("poop");

		const bugSprite2 = this.add.sprite(WIDTH * (3 / 4), HEIGHT * ((2 + 0) / 7), "ailmentSheet");
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
			this.petSprite.play(MoodKeys.DEAD);
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
		TamagochiMain.animationsLoaded = true;
	
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
		super({ key: 'TamagochiStatsScene' }, rect);
	}
	create() {
		const camera = this.cameras.main;
		this.drawGameBody();
		this.pet.happiness = Math.min(Math.max(this.pet.happiness, 0), 100);
		this.pet.hunger = Math.min(Math.max(this.pet.hunger, 0), 100);
		this.text = this.add.bitmapText(75, camera.centerY - 200, "pixel", "ERROR", 32);
	};
	update() {
		tickCheck(this);
		const { name, age, hunger, happiness } = this.pet;
		this.text.text = `Имя: ${name}\nВозраст: ${age}\nГолод: ${hunger}\nНастроение: ${happiness}\nДеньги: ${this.globalVal.money}`;
	}
}

export class TamagochiFastForwardScene extends UIScene {
	constructor() {
		super({ key: 'TamagochiFastForwardScene' }, rect);
	}
	create() {
		tick(this);
		this.scene.start("TamagochiLoadScene");
	}
}

export class TamagochiToiletScene extends UIScene {
	pet: Pet;
	constructor() {
		super({ key: 'TamagochiToiletScene' }, rect);
	}
	create() {
		this.drawGameBody();
		this.pet.poop = 0;
		this.scene.start("TamagochiLoadScene");
	}
}

export class TamagochiMedicineScene extends UIScene {
	pet: Pet;
	constructor() {
		super({ key: 'TamagochiMedicineScene' }, rect);
	}
	create() {
		this.pet.sick = false;
		this.scene.start("TamagochiMainScene");
	}
}

export class TamagochiSettingScene extends UIScene {
	constructor() {
		super({ key: 'TamagochiSettingScene' }, rect);
	}
	create() {
		this.drawGameBody();
		this.drawGameUI(settingArray, "saveSheet");
		this.costText.setAlpha(0);
		this.buttons[12].mode = "use";

		if (!settingArray.length) {
			this.buttons[11].button.setAlpha(0);
			this.buttons[10].button.setAlpha(0);
			this.buttons[12].button.setAlpha(0);
			this.sprite.setAlpha(0);
		}
	}

	update() {
		this.displaySlide(settingArray);
		tickCheck(this);
	}
}

export class TamagochiSaveScene extends UIScene {
	constructor() {
		super({ key: 'TamagochiSaveScene' }, rect);
	}

	create() {
		this.drawGameBody();
		this.drawGameUI(saveArray, "saveSheet");
		this.costText.setAlpha(0);
		this.buttons[12].mode = "use";

		if (!saveArray.length) {
			this.buttons[12].button.setAlpha(0);
			this.buttons[11].button.setAlpha(0);
			this.buttons[10].button.setAlpha(0);
			this.sprite.setAlpha(0);
		}
	}
	update() {
		this.displaySlide(saveArray);
		tickCheck(this);
	}
}

export class TamagochiFoodScene extends UIScene {
	constructor() {
		super({ key: 'TamagochiFoodScene' }, rect);
	}
	create() {
		this.drawGameBody();
		this.drawGameUI(invFoodArray, "foodSheet");
		this.costText.setAlpha(0);
		this.buttons[12].mode = "use";

		if (!invFoodArray.length) {
			this.buttons[12].button.setAlpha(0);
			this.buttons[11].button.setAlpha(0);
			this.buttons[10].button.setAlpha(0);
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
		super({ key: 'TamagochiPlayScene' }, rect);
	}
	create() {
		this.drawGameBody();
		this.drawGameUI(invPlayArray, "playSheet");
		this.costText.setAlpha(0);
		this.buttons[12].mode = "use";
	}
	update() {
		this.displaySlide(invPlayArray);
		tickCheck(this);
	}
}

export class TamagochiShopScene extends UIScene {
	constructor() {
		super({ key: 'TamagochiShopScene' }, rect);
	}
	create() {
		this.drawGameBody();
		this.drawGameMenu("TamagochiShopFoodScene", "Купить хавчик", "TamagochiShopItemScene", "Купить хлам");
	}
	update() {
		tickCheck(this);
	}
}

export class TamagochiShopItemScene extends UIScene {
	constructor() {
		super({ key: 'TamagochiShopItemScene' }, rect);
	}
	create() {
		this.drawGameBody();
		this.drawGameUI(playArray, "playSheet");
		this.buttons[12].mode = "buy";
	}
	update() {
		this.displaySlide(playArray);
		tickCheck(this);
	}
}

export class TamagochiShopFoodScene extends UIScene {
	constructor() {
		super({ key: 'TamagochiShopFoodScene' }, rect);
	}
	create() {
		this.drawGameBody();
		this.drawGameUI(foodArray, "foodSheet");
		this.buttons[12].mode = "buy";
	}
	update() {
		this.displaySlide(foodArray);
		tickCheck(this);
	}
}
