export class PlayItem {
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

	select(mode: string) {
		switch (mode) {
			//purchasing from the store puts a foodItem instance into an inventory
			case "buy":
				if (this.cost > globalVal.money) {
					addTempText("INSUFFICIENT FUNDS", 1);
					console.log("INSUFFICIENT FUNDS");
					return;
				}
				globalVal.money = globalVal.money - this.cost;
				//transfer item to your inventory
				invPlayArray.push(this);
				playArray.splice(playArray.indexOf(this), 1);
				addTempText("Purchased!", 1);
				//game.state.start("main");
				break;

			//Uses an item
			case "use":
				console.log("hit");
				if (this.useCost > globalVal.money) {
					console.log("INSUFFICIENT FUNDS");
					addTempText("INSUFFICIENT FUNDS", 1);
					//TODO, have text in the screen be displayed for x amount of time
					return;
				}
				if (this.mainText == "PetFlix") {
					console.log("hit");
					rerunCounter++;
					//update the text in the object
					this.descText = "Watch reruns of 'The Office',\nfor the " + rerunCounter + "th time.\nCosts $3";
				}
				pet.happiness += this.happinessRestore;
				globalVal.money = globalVal.money - this.useCost;

				invFoodArray.splice(invFoodArray.indexOf(this), 1);
				game.state.start("main");
				break;
		}
	}
}

//TODO: allow for new playItems to be stacked onto this array when purchased from the shop
const invPlayArray = [
	new PlayItem("Vacation", 0, 0, 100, "Chill\nCosts $100", 100),
	new PlayItem("Board Games", 1, 0, 1, "More like Bored Games amiright\nCosts $1", 5),
	new PlayItem("Work", 2, 0, -50, "Make $$$, but at the expense\n of some happiness.\nPays $50", -10),
	new PlayItem("PetFlix", 3, 0, 3, "Watch reruns of 'The Office',\nfor the " + rerunCounter + "th time.\nCosts $3", 5),
	new PlayItem("PRAISE STEVE JOBS", 4, 0, 999, "APPLE DOES WHAT WINDON'T\nCosts $999", 40)
];
