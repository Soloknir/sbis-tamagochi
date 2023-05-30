import { SceneKeys } from "./enums";

export class FoodItem {
	mainText: string;
	descText: string;
	spriteIndex: number;
	cost: number;
	hungRestore: number;

	constructor(name: string, spriteIndex: number, cost: number, desc: string, hungRestore: number) {
		this.mainText = name;
		this.descText = desc;
		this.spriteIndex = spriteIndex;
		this.cost = cost;
		this.hungRestore = hungRestore;
	}

	select(mode: string, scene: any) {
		console.log(mode);
		switch (mode) {
			case "buy":
				if (this.cost > scene.globalVal.money) {
					scene.addTempText("Недостаточно средств", 1);
					return;
				}
				scene.globalVal.money = scene.globalVal.money - this.cost;
				invFoodArray.push(this);
				scene.addTempText("Куплено!", 1);
				break;
			//Consumes an item
			case "use":
				scene.pet.hunger = scene.pet.hunger + this.hungRestore;
				invFoodArray.splice(invFoodArray.indexOf(this), 1);
				scene.scene.start(SceneKeys.MAIN);
				break;
		}

	}
}

export const invFoodArray = [
	new FoodItem("Бургер", 0, 10, "Бургер и точка", 8)
];

export const foodArray = [
	new FoodItem("Бургер", 0, 10, "Бургер и точка", 8),
	new FoodItem("Стейк", 1, 20, "Коровка", 18),
	new FoodItem("Мороженка", 2, 5, "Странная мороженка", 3),
	new FoodItem("Рыба", 3, 20, "Вроде Язь но не так чтобы большой", 20),
	new FoodItem("Яйцо", 4, 20, "Легендарное", 20),
	new FoodItem("Кофе", 5, 20, "Источник жизни", 20),
	new FoodItem("Куриная ножка", 6, 20, "Почти как в KFC", 20),
	new FoodItem("Курица", 8, 20, "Обычная живая курица", 20)
];

