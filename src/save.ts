

export class SaveItem {
	mainText: string;
	descText: string;
	spriteIndex: number;

	constructor(name, spriteIndex, desc) {
		this.mainText = name;
		this.descText = desc;
		this.spriteIndex = spriteIndex;
	}

	select() {
		switch (this.mainText) {
			case "Save":
				saveStorage();
				break;
			case "Load":
				loadStorage();
				break;
			case "Reset":
				resetStorage();
				break;
		}
		game.state.start("main");
	}


	//Attempt to load JSON with key string, and assign that to assignToVar, if cannot load JSON load abort and return false.
	loadJSON(key) {
		let loadedJSON = localStorage.getItem(key);
		let testJSON = JSON.parse(loadedJSON);
		console.log(JSON.parse(loadedJSON));
		if (testJSON == null) {
			addTempText("Cannot Load File!");
			console.log("ERROR! Cannot load save!");
			return false;
		}
		else {
			console.log("hit");
			return testJSON;
		}
	}

	loadStorage() {
		//loaded object is string (only strings can be stored), so we take the string
		//and "parse" it back into an object.
		if (loadJSON("petSave")) {
			pet = loadJSON("petSave");
			globalVal = loadJSON("globalValSave");


		}
	}

	saveStorage() {
		//convert our object into a sting and store it to the browser.
		localStorage.setItem("petSave", JSON.stringify(pet));
		localStorage.setItem("globalValSave", JSON.stringify(globalVal));
		/*
		localStorage.setItem("invFoodArraySave",JSON.stringify(invFoodArray));
		localStorage.setItem("playArraySave",JSON.stringify(playArray));
		localStorage.setItem("invPlayArraySave",JSON.stringify(invPlayArray));
		*/
	}

	resetStorage() {
		pet = JSON.parse(defaultPetJSON);
		globalVal = JSON.parse(defaultGlobalValJSON);
		localStorage.removeItem("petSave");
		localStorage.removeItem("globalValSave");
	}
}


export const saveArray = [
	new SaveItem("Save", 0, "Save your game"),
	new SaveItem("Load", 1, "Load your game"),
	new SaveItem("Reset", 2, "Reset your game,\nand lose all your progress")
];
