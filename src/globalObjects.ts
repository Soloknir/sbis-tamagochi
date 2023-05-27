import { MoodKeys } from "./enums";

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
