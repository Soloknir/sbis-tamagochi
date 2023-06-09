import { SpriteButton, TextButton } from "./components/buttons";
import { ButtonKeys, FontSizes, FrameSheets, MoodKeys, SceneKeys, SlideMenuActions } from "./enums";
import { playArray, PlayItem } from "./play";



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
		this.buttons[ButtonKeys.MENU_ITEM_1] = new SpriteButton(
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

		this.buttons[ButtonKeys.MENU_ITEM_2] = new SpriteButton(
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

		const text1 = this.add.bitmapText(this.width * (2 / 6), this.height * (2 / 6), "pixel", desc1, FontSizes.BIG);
		text1.setOrigin(0.5);
		const text2 = this.add.bitmapText(this.width * (2 / 6), this.height * (4 / 6), "pixel", desc2, FontSizes.BIG);
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
		this.buttons[ButtonKeys.FORWARD] = new SpriteButton(
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

		this.buttons[ButtonKeys.BACKWARD] = new SpriteButton(
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

		this.buttons[ButtonKeys.SELECT] = new TextButton(
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

		this.mainText = this.add.bitmapText(camera.centerX, this.height * (1 / 4), "pixel", "Пусто!", FontSizes.BIG);
		this.mainText.setOrigin(0.5);
		this.mainText.setCenterAlign();

		this.descText = this.add.bitmapText(camera.centerX, this.height * (4 / 6), "pixel", "У вас нет еды!", FontSizes.MEDIUM);
		this.descText.setOrigin(0.5);
		this.descText.setCenterAlign();

		this.costText = this.add.bitmapText(camera.centerX, this.height * (4 / 6) + 44, "pixel", "", FontSizes.SMALL);
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
				button.variable[this.slideCounter]?.select(button.mode, this);
				break;
		}
	}

	displaySlide(array: any[]) {
		const newCounterValue = Math.min(Math.max(this.slideCounter, 0), array.length - 1)
		if (array.length === 0) {
			this.scene.start(SceneKeys.MAIN);
			return;
		}

		this.slideCounter = newCounterValue;
		this.sprite.setFrame(array[this.slideCounter].spriteIndex);

		if ((this.slideCounter == 0) && (array.length == 1)) {
			this.buttons[ButtonKeys.FORWARD].button.setAlpha(0);
			this.buttons[ButtonKeys.BACKWARD].button.setAlpha(0);
		}
		else if (this.slideCounter == 0) {
			this.buttons[ButtonKeys.FORWARD].button.setAlpha(0);
			this.buttons[ButtonKeys.BACKWARD].button.setAlpha(1);
		}
		else if (this.slideCounter == (array.length - 1)) {
			this.buttons[ButtonKeys.FORWARD].button.setAlpha(1);
			this.buttons[ButtonKeys.BACKWARD].button.setAlpha(0);
		}
		else {
			this.buttons[ButtonKeys.FORWARD].button.setAlpha(1);
			this.buttons[ButtonKeys.BACKWARD].button.setAlpha(1);
		}
		this.mainText.text = array[this.slideCounter].mainText;
		this.descText.text = array[this.slideCounter].descText;

		const cost = this.buttons[ButtonKeys.SELECT].mode === 'buy'
			? array[this.slideCounter].cost
			: array[this.slideCounter].useCost;

		this.costText.text = cost > 0
			? `(Стоимость: ${cost}\$)`
			: !cost || cost === 0
				? '' : `(Оплата: ${-cost}\$)`;

		const restore = array[this.slideCounter].happinessRestore || array[this.slideCounter].hungRestore;
		const text = (array[this.slideCounter] instanceof PlayItem) ? 'Счастье' : 'Сытость';
		this.costText.text += restore > 0
			? ` (${text}: +${restore})`
			: ` (${text}: ${restore})`
	}

	printText(contents: string) {
		const camera = this.cameras.main;
		this.text = this.add.bitmapText(75, camera.centerY - 200, "pixel", contents, FontSizes.BIG);
	}

	addTempText(contents: string, duration: number) {
		if (this.tempText?.alpha) {
			return;
		}
		
		const camera = this.cameras.main;
		this.tempText = this.add.bitmapText(camera.centerX, camera.centerY * (3 / 4), "pixel", contents, FontSizes.BIG);
		this.tempText.setOrigin(0.5);
		this.tempText.setScale(0.5);
		setTimeout(this.removeTempText.bind(this), 500 * duration);
	}

	removeTempText() {
		this.tempText.setAlpha(0);
	}

	drawGameBody() {
		this.background = this.add.sprite(0, 0, "background");
		this.background.setOrigin(0);

		this.buttons[ButtonKeys.STATS] = new SpriteButton(this, {
			x: this.width * (1 / 6),
			y: this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 0,
			sceneKey: SceneKeys.STATS,
			tooltip: 'Состояние'
		}, this.changeState.bind(this));

		this.buttons[ButtonKeys.FOOD] = new SpriteButton(this, {
			x: this.width * (2 / 6),
			y: this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 2,
			sceneKey: SceneKeys.FOOD,
			tooltip: 'Еда'
		}, this.changeState.bind(this)); 

		this.buttons[ButtonKeys.TOILET] = new SpriteButton(this, {
			x: this.width * (3 / 6),
			y: this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 1,
			sceneKey: SceneKeys.TOILET,
			tooltip: 'Исправление ошибок'
		}, this.changeState.bind(this));

		this.buttons[ButtonKeys.PLAY] = new SpriteButton(this, {
			x: this.width * (4 / 6),
			y: this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 3,
			sceneKey: SceneKeys.PLAY,
			tooltip: 'Активности'
		}, this.changeState.bind(this));

		this.buttons[ButtonKeys.FAST_FORWARD] = new SpriteButton(this, {
			x: this.width * (5 / 6),
			y: this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 4,
			sceneKey: SceneKeys.FAST_FORWARD,
			tooltip: 'Ускорение времени'
		}, this.changeState.bind(this));

		this.buttons[ButtonKeys.MEDICINE] = new SpriteButton(this, {
			x: this.width * (2 / 6),
			y: this.height - this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 6,
			sceneKey: SceneKeys.MEDICINE,
			tooltip: 'Кофеёк'
		}, this.changeState.bind(this));

		this.buttons[ButtonKeys.SHOP] = new SpriteButton(this, {
			x: this.width * (3 / 6),
			y: this.height - this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 7,
			sceneKey: playArray.length > 0 ? SceneKeys.SHOP : SceneKeys.FOOD_SHOP,
			tooltip: 'Магазин'
		}, this.changeState.bind(this));

		this.buttons[ButtonKeys.MAIN] = new SpriteButton(this, {
			x: this.width * (4 / 6),
			y: this.height - this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 9,
			sceneKey: SceneKeys.MAIN,
			tooltip: 'Главный экран'
		}, this.changeState.bind(this));
	}

	drawGameOverUI(drawPet: () => void) {
		const camera = this.cameras.main;
		this.background = this.add.sprite(0, 0, "background");
		this.background.setOrigin(0);

		drawPet();

		this.mainText = this.add.bitmapText(camera.centerX, this.height * (1 / 20), "pixel", "Питомец слишком устал!", FontSizes.BIG);
		this.mainText.setOrigin(0.5);
		this.mainText.setCenterAlign();

	
		this.buttons[ButtonKeys.WAKEUP] = new TextButton(this, {
			x: this.width * (2 / 6),
			y: this.height - this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 12,
			title: 'Разбудить',
			fontSize: 16
		}, this.handleWakeUp.bind(this, this.scene.scene));

		this.buttons[ButtonKeys.RESTART] = new TextButton(this, {
			x: this.width * (4 / 6),
			y: this.height - this.buttonDispX,
			sheet: FrameSheets.BUTTON,
			frame: 12,
			title: 'Начать сначала',
			fontSize: 16
		}, this.handleRestart.bind(this, this.scene.scene));
	}

	handleWakeUp(scene: any) {
		scene.pet.mood = MoodKeys.SAD;
		scene.pet.sick = true;
		scene.pet.hunger = 10;
		scene.pet.happiness = 10;
		scene.scene.start(SceneKeys.MAIN);
	}

	handleRestart(scene: any) {
		scene.pet.mood = MoodKeys.NEUTRAL;
		scene.pet.age = 0;
		scene.pet.hunger = 50;
		scene.pet.happiness = 100;
		scene.scene.start(SceneKeys.MAIN);
	}

	changeState({ sceneKey }: SpriteButton) {
		if (sceneKey) {
			this.scene.start(sceneKey);
		}
	}
}