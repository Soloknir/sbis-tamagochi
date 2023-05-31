import { FontSizes } from "../enums";

interface IButtonConfig {
	x: number;
	y: number;
	sheet: string;
	frame?: number;
	desc?: string;
	sceneKey?: string;
	variable?: any;
	mode?: any;
	tooltip?: string;
}

export class SpriteButton {
	button: Phaser.GameObjects.Sprite;
	tooltipText: Phaser.GameObjects.BitmapText;
	desc?: string;
	sceneKey?: string;
	variable?: any;
	mode?: any;
	

	constructor(scene: Phaser.Scene, config: IButtonConfig, callback: (...params: any) => any) {
		const { x, y, sheet, frame, desc, sceneKey, variable, mode, tooltip } = config;
		this.button = scene.add.sprite(x, y, sheet, frame);
		this.button.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => callback(this, this));

		if (tooltip) {
			this.button.on('pointerover', () => {
				this.tooltipText = scene.add.bitmapText(x, y, 'pixel', tooltip, FontSizes.SMALL);
				this.tooltipText.setOrigin(0.5, -0.5);
				this.tooltipText.setCenterAlign();
			})


			this.button.on('pointerout', () => this.tooltipText.setAlpha(0))
		}

		this.desc = desc;
		this.sceneKey = sceneKey;
		this.variable = variable;
		this.mode = mode;
	}
}

export class TextButton {
	button: Phaser.GameObjects.Sprite;
	tooltipText: Phaser.GameObjects.BitmapText;
	text: Phaser.GameObjects.BitmapText;
	desc?: string;
	sceneKey?: string;
	variable?: any;
	mode?: any;

	constructor(scene: Phaser.Scene, config: IButtonConfig & { title: string, fontSize: number }, callback: (...params: any) => any) {
		const { x, y, sheet, frame, desc, sceneKey, variable, mode, title, fontSize, tooltip } = config;

		this.button = scene.add.sprite(x, y, sheet, frame);
		const buttonWidth = Math.min(Math.max(100, title.length * fontSize * 1.5), 250);
		this.button.setDisplaySize(buttonWidth, fontSize * 3);
		this.button.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => callback(this, this));

		this.text = scene.add.bitmapText(x, y, 'pixel', title, fontSize);
		this.text.setOrigin(0.5);
		this.text.setCenterAlign();

		if (tooltip) {
			this.button.on('pointerover', () => {
				this.tooltipText = scene.add.bitmapText(x, y, 'pixel', tooltip, FontSizes.SMALL);
				this.tooltipText.setOrigin(0.5, -0.5);
				this.tooltipText.setCenterAlign();
			})

			this.button.on('pointerout', () => this.tooltipText.setAlpha(0))
		}

		this.desc = desc;
		this.sceneKey = sceneKey;
		this.variable = variable;
		this.mode = mode;
	}
}