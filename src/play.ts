export class PlayItem {
 	static rerunCounter = 0;

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
					scene.addTempText("INSUFFICIENT FUNDS", 1);
					console.log("INSUFFICIENT FUNDS");
					return;
				}
				scene.globalVal.money = scene.globalVal.money - this.cost;
				//transfer item to your inventory
				invPlayArray.push(this);
				playArray.splice(playArray.indexOf(this), 1);
				scene.addTempText("Purchased!", 1);
				//game.state.start("main");
				break;

			//Uses an item
			case "use":
				if (this.useCost > scene.globalVal.money) {
					console.log("INSUFFICIENT FUNDS");
					scene.addTempText("INSUFFICIENT FUNDS", 1);
					return;
				}
				if (this.mainText == "PetFlix") {
					PlayItem.rerunCounter++;
					//update the text in the object
					this.descText = "Watch reruns of 'The Office',\nfor the " + PlayItem.rerunCounter + "th time.\nCosts $3";
				}
				scene.pet.happiness += this.happinessRestore;
				scene.globalVal.money = scene.globalVal.money - this.useCost;

				scene.scene.start("TamagochiMainScene");
				break;
		}
	}
}

//TODO: allow for new playItems to be stacked onto this array when purchased from the shop
export const invPlayArray = [
	new PlayItem("Vacation", 0, 0, 100, "Chill\nCosts $100", 100),
	new PlayItem("Board Games", 1, 0, 1, "More like Bored Games amiright\nCosts $1", 5),
	new PlayItem("Work", 2, 0, -50, "Make $$$, but at the expense\n of some happiness.\nPays $50", -10),
	new PlayItem("PetFlix", 3, 0, 3, "Watch reruns of 'The Office',\nfor the " + PlayItem.rerunCounter + "th time.\nCosts $3", 5),
	new PlayItem("PRAISE STEVE JOBS", 4, 0, 999, "APPLE DOES WHAT WINDON'T\nCosts $999", 40)
];

export const playArray = [
	new PlayItem("Pencil", 5, 100, 0, "Draw some of stuff", 11),
	new PlayItem("Dumbbell", 6, 500, 0, "Get big quick", 20),
	new PlayItem("Computer", 7, 1000, 0, "Wow so cool", 15),
	new PlayItem("Plant", 8, 400, 0, "Talk to the plant or something", 4),
	new PlayItem("S8B04RD", 9, 800, 0, "R4D D00D3", 33),
	new PlayItem("Drums", 10, 400, 0, "Very loud", 13),
	new PlayItem("Fishing Rod", 11, 1000, 0, "*Doesn't actually catch things", 40),
]
