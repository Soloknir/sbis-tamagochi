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

	select(mode: string) {
		console.log(mode);
		switch (mode) {
			//purchasing from the store puts a FoodItem instance into an inventory
			case "buy":
				if (this.cost > globalVal.money) {
					addTempText("INSUFFICIENT FUNDS", 1);
					console.log("INSUFFICIENT FUNDS");
					return;
				}
				globalVal.money = globalVal.money - this.cost;
				console.log("push");
				invFoodArray.push(this);
				addTempText("Purchased!", 1);
				//game.state.start("main");
				break;
			//Consumes an item
			case "use":
				pet.hunger = pet.hunger + this.hungRestore;
				invFoodArray.splice(invFoodArray.indexOf(this), 1);
				game.state.start("main");
				break;
		}

	}
}

const invFoodArray = [
	new FoodItem("Burger", 0, 10, "Fast food", 8)
];


