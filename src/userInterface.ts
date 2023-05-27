interface IButtonConfig {
	x: number;
	y: number;
	sheet: string;
	frame?: number;
	desc?: string;
	sceneKey?: string;
	variable?: any;
	mode?: any;
}

export enum SlideMenuActions {
	BACKWARD = 'BACKWARD',
	FORWARD = 'FORWARD',
	SELECT = 'SELECT'
}

export class SpriteButton {
	button: Phaser.GameObjects.Sprite;
	desc?: string;
	sceneKey?: string;
	variable?: any;
	mode?: any;

	constructor(scene: Phaser.Scene, config: IButtonConfig, callback: (...params: any) => any) {
		const { x, y, sheet, frame, desc, sceneKey, variable, mode } = config;
		this.button = scene.add.sprite(x, y, sheet, frame);
		this.button.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => callback(this, this));

		this.desc = desc;
		this.sceneKey = sceneKey;
		this.variable = variable;
		this.mode = mode;
	}
}

export class TextButton {
	button: Phaser.GameObjects.Sprite;
	text: Phaser.GameObjects.BitmapText;
	desc?: string;
	sceneKey?: string;
	variable?: any;
	mode?: any;

	constructor(scene: Phaser.Scene, config: IButtonConfig & { title: string, fontSize: number}, callback: (...params: any) => any) {
		const { x, y, sheet, frame, desc, sceneKey, variable, mode, title, fontSize } = config;
		
		this.button = scene.add.sprite(x, y, sheet, frame);
		this.button.setDisplaySize(title.length * fontSize * 2, fontSize * 3);
		this.button.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => callback(this, this));

		this.text = scene.add.bitmapText(x, y, 'pixel', title, fontSize);
		this.text.setOrigin(0.5);
		this.text.setCenterAlign();

		this.desc = desc;
		this.sceneKey = sceneKey;
		this.variable = variable;
		this.mode = mode;
	}
}


export default class UIScene extends Phaser.Scene {
	width: number;
	height: number;
	buttonDispX: number;
	
	background: Phaser.GameObjects.Sprite;
	buttons: any[] = [];

	slideCounter = 0;
	sprite: Phaser.GameObjects.Sprite;
	text: Phaser.GameObjects.BitmapText;
	mainText: Phaser.GameObjects.BitmapText;
	descText: Phaser.GameObjects.BitmapText;
	costText: Phaser.GameObjects.BitmapText;
	tempText: Phaser.GameObjects.BitmapText;

	constructor(config: Phaser.Types.Scenes.SettingsConfig, rect: any) {
		super(config);
		this.height = rect.height;
		this.width = rect.width;
		this.buttonDispX = rect.buttonDispX;
	}

	drawGameMenu(state1: string, desc1: string, state2: string, desc2: string) {
		this.buttons[13] = new SpriteButton(
			this,
			{
				x: this.width * (4 / 6),
				y: this.height * (2 / 6),
				sheet: "buttonSheet",
				frame: 10,
				desc: desc1,
				sceneKey: state1,
			},
			this.gameMenuSelect.bind(this)
		);

		this.buttons[14] = new SpriteButton(
			this,
			{
				x: this.width * (4 / 6),
				y: this.height * (4 / 6),
				sheet: "buttonSheet",
				frame: 10,
				desc: desc2,
				sceneKey: state2,
			},
			this.gameMenuSelect.bind(this)
		);

		const text1 = this.add.bitmapText(this.width * (2 / 6), this.height * (2 / 6), "pixel", desc1, 32);
		text1.setOrigin(0.5);
		const text2 = this.add.bitmapText(this.width * (2 / 6), this.height * (4 / 6), "pixel", desc2, 32);
		text2.setOrigin(0.5);
	}

	gameMenuSelect(this: Phaser.Scene, { sceneKey }: SpriteButton) {
		if (sceneKey) {
			this.scene.start(sceneKey);
		}
	}

	drawGameUI(array: any[], spriteSheet: string) {
		const camera = this.cameras.main;
		this.slideCounter = 0;
		this.buttons[10] = new SpriteButton(
			this,
			{
				x: this.width * (1 / 6),
				y: camera.centerY,
				sheet: "buttonSheet",
				frame: 11,
				sceneKey: SlideMenuActions.BACKWARD,
			},
			this.changeSlide.bind(this)
		);

		this.buttons[11] = new SpriteButton(
			this,
			{
				x: this.width * (5 / 6),
				y: camera.centerY,
				sheet: "buttonSheet",
				frame: 10,
				sceneKey: SlideMenuActions.FORWARD,
			},
			this.changeSlide.bind(this)
		);

		this.buttons[12] = new TextButton(
			this,
			{
				x: camera.centerX,
				y: this.height * (7 / 9),
				sheet: "buttonSheet",
				frame: 12,
				sceneKey: SlideMenuActions.SELECT,
				variable: array,
				title: 'Выбрать',
				fontSize: 16
			},
			this.changeSlide.bind(this)
		);

		this.sprite = this.add.sprite(camera.centerX, camera.centerY, spriteSheet);
		this.sprite.setFrame(0);
		this.sprite.setOrigin(0.5);

		this.mainText = this.add.bitmapText(camera.centerX, this.height * (1 / 4), "pixel", "Empty!", 32);
		this.mainText.setOrigin(0.5);
		this.mainText.setCenterAlign();

		this.descText = this.add.bitmapText(camera.centerX, this.height * (4 / 6), "pixel", "You're out of food!", 22);
		this.descText.setOrigin(0.5);
		this.descText.setCenterAlign();

		this.costText = this.add.bitmapText(camera.centerX, this.height * (4 / 6) + 44, "pixel", "ERROR", 22);
		this.costText.setOrigin(0.5);
	}

	changeSlide(button: SpriteButton) {
		switch (button.sceneKey) {
			case SlideMenuActions.BACKWARD:
				this.slideCounter--;
				break;
			case SlideMenuActions.FORWARD:
				this.slideCounter++;
				break;
			case SlideMenuActions.SELECT:
				button.variable[this.slideCounter].select(button.mode, this);
				break;
		}
	}

	displaySlide(array: any[]) { // detect type
		this.slideCounter = Math.min(Math.max(this.slideCounter, 0), array.length - 1);
		this.sprite.setFrame(array[this.slideCounter].spriteIndex);

		if ((this.slideCounter == 0) && (array.length == 1)) {
			this.buttons[10].button.setAlpha(0);
			this.buttons[11].button.setAlpha(0);
		}
		else if (this.slideCounter == 0) {
			this.buttons[10].button.setAlpha(0);
			this.buttons[11].button.setAlpha(1);
		}
		else if (this.slideCounter == (array.length - 1)) {
			this.buttons[10].button.setAlpha(1);
			this.buttons[11].button.setAlpha(0);
		}
		else {
			this.buttons[10].button.setAlpha(1);
			this.buttons[11].button.setAlpha(1);
		}
		this.mainText.text = array[this.slideCounter].mainText;
		this.descText.text = array[this.slideCounter].descText;
		this.costText.text = "Стоимость: $" + array[this.slideCounter].cost;
	}

	printText(contents: string) {
		const camera = this.cameras.main;
		this.text = this.add.bitmapText(75, camera.centerY - 200, "pixel", contents, 32);
	}

	addTempText(contents: string, duration: number) {
		const camera = this.cameras.main;
		this.tempText = this.add.bitmapText(camera.centerX, camera.centerY * (3 / 4), "pixel", contents, 32);
		this.tempText.setOrigin(0.5);
		this.tempText.setScale(0.5);
		new Phaser.Time.TimerEvent({ delay: 500 * duration, callback: this.removeTempText.bind(this) });
	}

	removeTempText() {
		this.tempText.setAlpha(0);
	}

	drawGameBody() {
		this.background = this.add.sprite(0, 0, "background");
		this.background.setOrigin(0);

		this.buttons[0] = new SpriteButton(this, {
			x: this.width * (1 / 6),
			y: this.buttonDispX,
			sheet: "buttonSheet",
			frame: 0,
			sceneKey: "TamagochiStatsScene",
		}, this.changeState.bind(this));

		this.buttons[1] = new SpriteButton(this, {
			x: this.width * (2 / 6),
			y: this.buttonDispX,
			sheet: "buttonSheet",
			frame: 2,
			sceneKey: "TamagochiFoodScene",
		}, this.changeState.bind(this)); 

		this.buttons[2] = new SpriteButton(this, {
			x: this.width * (3 / 6),
			y: this.buttonDispX,
			sheet: "buttonSheet",
			frame: 1,
			sceneKey: "TamagochiToiletScene",
		}, this.changeState.bind(this));

		this.buttons[3] = new SpriteButton(this, {
			x: this.width * (4 / 6),
			y: this.buttonDispX,
			sheet: "buttonSheet",
			frame: 3,
			sceneKey: "TamagochiPlayScene",
		}, this.changeState.bind(this));

		this.buttons[4] = new SpriteButton(this, {
			x: this.width * (5 / 6),
			y: this.buttonDispX,
			sheet: "buttonSheet",
			frame: 4,
			sceneKey: "TamagochiFastForwardScene",
		}, this.changeState.bind(this));

		// this.buttons[5] = new SpriteButton(this, {
		// 	x: this.width * (1 / 6),
		// 	y: this.height - this.buttonDispX,
		// 	sheet: "buttonSheet",
		// 	frame: 5,
		// 	sceneKey: "TamagochiSaveScene",
		// }, this.changeState.bind(this));

		this.buttons[6] = new SpriteButton(this, {
			x: this.width * (2 / 6),
			y: this.height - this.buttonDispX,
			sheet: "buttonSheet",
			frame: 6,
			sceneKey: "TamagochiMedicineScene",
		}, this.changeState.bind(this));

		this.buttons[7] = new SpriteButton(this, {
			x: this.width * (3 / 6),
			y: this.height - this.buttonDispX,
			sheet: "buttonSheet",
			frame: 7,
			sceneKey: "TamagochiShopScene",
		}, this.changeState.bind(this));

		// this.buttons[8] = new SpriteButton(this, {
		// 	x: this.width * (4 / 6),
		// 	y: this.height - this.buttonDispX,
		// 	sheet: "buttonSheet",
		// 	frame: 8,
		// 	sceneKey: "TamagochiSettingScene",
		// }, this.changeState.bind(this));

		this.buttons[9] = new SpriteButton(this, {
			x: this.width * (4 / 6),
			y: this.height - this.buttonDispX,
			sheet: "buttonSheet",
			frame: 9,
			sceneKey: "TamagochiMainScene",
		}, this.changeState.bind(this));
	}

	changeState({ sceneKey }: SpriteButton) {
		if (sceneKey) {
			this.scene.start(sceneKey);
		}
	}
}