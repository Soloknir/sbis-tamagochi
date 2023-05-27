import Phaser from 'phaser';
import { GameState, Pet, TamagochiFastForwardScene, TamagochiFoodScene, TamagochiMedicineScene, TamagochiPlayScene, TamagochiSaveScene, TamagochiSettingScene, TamagochiShopFoodScene, TamagochiShopItemScene, TamagochiShopScene, TamagochiStatsScene, TamagochiToiletScene, TamagochiLoadScene, TamagochiMain } from "./scenes"


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
			TamagochiLoadScene,
			TamagochiMain,
			TamagochiStatsScene,
			TamagochiFastForwardScene,
			TamagochiToiletScene,
			TamagochiMedicineScene,
			TamagochiSettingScene,
			TamagochiSaveScene,
			TamagochiFoodScene,
			TamagochiPlayScene,
			TamagochiShopScene,
			TamagochiShopItemScene,
			TamagochiShopFoodScene
		]
	};

	new Phaser.Game(config);
}

document.addEventListener('DOMContentLoaded', loadGame);


