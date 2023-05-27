import { SpriteButton, TextButton } from "./components/buttons";
import { FrameSheets, SceneKeys, SlideMenuActions } from "./enums";



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
				sheet: FrameSheets.BUTTON,
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
				sheet: FrameSheets.BUTTON,
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

	drawSliderUI(array: any[], spriteSheet: string) {
		const camera = this.cameras.main;
		this.slideCounter = 0;
		this.buttons[10] = new SpriteButton(
			this,
			{
				x: this.width * (1 / 6),
				y: camera.centerY,
				sheet: FrameSheets.BUTTON,
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
				sheet: FrameSheets.BUTTON,
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
				sheet: FrameSheets.BUTTON,
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
			sheet: FrameSheets.BUTTON,
			frame: 0,
			sceneKey: SceneKeys.STATS,
		}, this.changeState.bind(this));

		this.buttons[1] = new SpriteButton(this, {
			x: this.width * (2 / 6),
			y: this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 2,
			sceneKey: SceneKeys.FOOD,
		}, this.changeState.bind(this)); 

		this.buttons[2] = new SpriteButton(this, {
			x: this.width * (3 / 6),
			y: this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 1,
			sceneKey: SceneKeys.TOILET,
		}, this.changeState.bind(this));

		this.buttons[3] = new SpriteButton(this, {
			x: this.width * (4 / 6),
			y: this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 3,
			sceneKey: SceneKeys.PLAY,
		}, this.changeState.bind(this));

		this.buttons[4] = new SpriteButton(this, {
			x: this.width * (5 / 6),
			y: this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 4,
			sceneKey: SceneKeys.FAST_FORWARD,
		}, this.changeState.bind(this));

		this.buttons[6] = new SpriteButton(this, {
			x: this.width * (2 / 6),
			y: this.height - this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 6,
			sceneKey: SceneKeys.MEDICINE,
		}, this.changeState.bind(this));

		this.buttons[7] = new SpriteButton(this, {
			x: this.width * (3 / 6),
			y: this.height - this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 7,
			sceneKey: SceneKeys.SHOP,
		}, this.changeState.bind(this));

		this.buttons[9] = new SpriteButton(this, {
			x: this.width * (4 / 6),
			y: this.height - this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 9,
			sceneKey: SceneKeys.MAIN,
		}, this.changeState.bind(this));
	}

	changeState({ sceneKey }: SpriteButton) {
		if (sceneKey) {
			this.scene.start(sceneKey);
		}
	}
}