import Phaser from 'phaser';
import * as Scenes from "./scenes"
import { Pet, GameState } from './globalObjects';

function loadGame() {
	const canvas: HTMLCanvasElement | null = document.getElementById("canvas") as HTMLCanvasElement;
	if (!canvas) return;

	const config = {
		type: Phaser.CANVAS,
		canvas,
		autoFocus: true,
		width: 800,
		height: 800,
		plugins: {
			global: [
				{ key: 'Pet', plugin: Pet, start: false, mapping: 'pet' },
				{ key: 'GameState', plugin: GameState, start: false, mapping: 'globalVal' }
			]
		},
		scene: [
			Scenes.TamagochiLoadScene,
			Scenes.TamagochiMainScene,
			Scenes.TamagochiStatsScene,
			Scenes.TamagochiFastForwardScene,
			Scenes.TamagochiToiletScene,
			Scenes.TamagochiMedicineScene,
			Scenes.TamagochiSettingScene,
			Scenes.TamagochiSaveScene,
			Scenes.TamagochiFoodScene,
			Scenes.TamagochiPlayScene,
			Scenes.TamagochiShopScene,
			Scenes.TamagochiShopItemScene,
			Scenes.TamagochiShopFoodScene
		]
	};

	new Phaser.Game(config);
}

document.addEventListener('DOMContentLoaded', loadGame);


