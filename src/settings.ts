export class SettingItem {
	mainText: string;
	descText: string;
	spriteIndex: number;
	affectingVal: Boolean;
	nameVal: string;

	constructor(name: string, spriteIndex: number, desc: string, affectingVal: boolean, nameVal: string) {
		this.mainText = name;
		this.descText = desc;
		this.spriteIndex = spriteIndex;
		this.affectingVal = affectingVal;
		this.nameVal = nameVal;
	}

	select({ globalVal, addTempText } : any) {
		this.affectingVal = !this.affectingVal;
		if (this.affectingVal) {
			addTempText("Enabled!", 0.7);
		}
		else {
			addTempText("Disabled!", 0.7);
		}
		switch (this.nameVal) {
			case "counterEnabled":
				globalVal.counterEnabled = this.affectingVal;
				break;
			case "godMode":
				globalVal.godMode = this.affectingVal;
				break;
			case "ezMoney":
				globalVal.ezMoney = this.affectingVal;
				break;
			case "noToilet":
				globalVal.noToilet = this.affectingVal;
				break;
			case "camoNinjas":
				globalVal.camoNinjas = this.affectingVal;
				break;
		}
	}
}

export const settingArray = [
	// new SettingItem("Enable/Disable Counter", 0, "Enable tick counter\n& ruin fun", globalVal.counterEnabled, "counterEnabled"),
	// new SettingItem("Enable/Disable God Mode", 0, "Pet cannot die", globalVal.godMode, "godMode"),
	// new SettingItem('"Invest" in Crypto', 0, "Get $10 every now and then", globalVal.ezMoney, "ezMoney"),
	// new SettingItem("Enable/Disable\nFast Food", 0, "Pet doesn't poop", globalVal.noToilet, "noToilet"),
	// new SettingItem("Enable/Disable\nCamo Ninjas", 0, "Camoflauge Ninjas\n sometimes appear", globalVal.camoNinjas, "camoNinjas"),
];

