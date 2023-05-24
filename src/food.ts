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
			//purchasing from the store puts a FoodItem instance into an inventory
			case "buy":
				if (this.cost > scene.globalVal.money) {
					scene.addTempText("INSUFFICIENT FUNDS", 1);
					console.log("INSUFFICIENT FUNDS");
					return;
				}
				scene.globalVal.money = scene.globalVal.money - this.cost;
				console.log("push");
				invFoodArray.push(this);
				scene.addTempText("Purchased!", 1);
				//game.state.start("main");
				break;
			//Consumes an item
			case "use":
				scene.pet.hunger = scene.pet.hunger + this.hungRestore;
				invFoodArray.splice(invFoodArray.indexOf(this), 1);
				scene.scene.start("TamagochiMainScene");
				break;
		}

	}
}

export const invFoodArray = [
	new FoodItem("Burger", 0, 10, "Fast food", 8)
];

export const foodArray = [
	new FoodItem("Burger", 0, 10, "Fast food", 8),
	new FoodItem("Steak", 1, 20, "Cow flesh", 18),
	new FoodItem("Creamsicle", 2, 5, "I hate creamsicles", 3),
	new FoodItem("Fish", 3, 20, "85% Mercury free!", 20),
	new FoodItem("Egg", 4, 20, "Egg flesh", 20),
	new FoodItem("Coffee", 5, 20, "Bitter drink", 20),
	new FoodItem("Drumstick", 6, 20, "Bird flesh", 20),
	new FoodItem("Shoe", 7, 150, "You pay for the design", 2),
	new FoodItem("Chicken", 8, 20, "Fresh chicken", 20)
];

