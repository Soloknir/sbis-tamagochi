import { SceneKeys } from "./enums";

export class PlayItem {
 	static rerunCounter = 1;

	mainText: string;
	descText: string;
	spriteIndex: number;
	useCost: number;
	cost: number;
	happinessRestore: number;

	constructor(name: string, spriteIndex: number, cost: number, useCost: number, desc: string, happinessRestore: number) {
		this.mainText = name;
		this.descText = desc;
		this.spriteIndex = spriteIndex;
		this.useCost = useCost;
		this.cost = cost;
		this.happinessRestore = happinessRestore;
	}

	select(mode: string, scene: any) {
		switch (mode) {
			//purchasing from the store puts a foodItem instance into an inventory
			case "buy":
				if (this.cost > scene.globalVal.money) {
					scene.addTempText("Недостаточно денег", 1);
					return;
				}
				scene.globalVal.money = scene.globalVal.money - this.cost;
				//transfer item to your inventory
				invPlayArray.push(this);
				playArray.splice(playArray.indexOf(this), 1);
				scene.addTempText("Куплено!", 1);
				break;

			//Uses an item
			case "use":
				if (this.useCost > scene.globalVal.money) {
					scene.addTempText("Недостаточно денег", 1);
					return;
				}
				if (this.mainText == "SbisOnline") {
					PlayItem.rerunCounter++;
					this.descText = "Смотреть раздел 'Мотивация',\nв " + PlayItem.rerunCounter + " раз.";
				}
				scene.pet.happiness += this.happinessRestore;
				scene.globalVal.money = scene.globalVal.money - this.useCost;

				scene.scene.start(SceneKeys.MAIN);
				break;
		}
	}
}

export const invPlayArray = [
	new PlayItem("Отпуск", 0, 0, 100, "Долгожданный отдых", 100),
	new PlayItem("Настолки", 1, 0, 1, "Играйте вместе!", 5),
	new PlayItem("Работа", 2, 0, -50, "Обменять настроение на деньги.", -10),
	new PlayItem("SbisOnline", 3, 0, 0, "Смотреть раздел 'Мотивация',в " + PlayItem.rerunCounter + " раз.", 1),
];

export const playArray = [
	new PlayItem("Карандаш", 5, 100, 0, "Ручка для космонавтов", 11),
	new PlayItem("Компьютер", 7, 1000, 0, "На чём ты работал до этого?", 15),
	new PlayItem("Кустик", 8, 400, 0, "Позаботься о нём", 4),
	new PlayItem("Скейтборд", 9, 800, 0, "Поехали кататься ", 33),
	new PlayItem("Барабан", 10, 400, 0, "Бей в барабан, Музыка громче", 13),
	new PlayItem("Удочка", 11, 1000, 0, "*Жаль негде ловить рыбу", 40),
]
