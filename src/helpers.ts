//time per tick, in minutes
const TIME_PER_TICK = 5;

export function tickCheck({ globalVal, pet }: any) {
	let timeNow = (new Date()).getTime();
	if (globalVal.timeBegin == 0) {
		globalVal.timeBegin = (new Date()).getTime();
	}
	if ((timeNow - globalVal.timeBegin) > (TIME_PER_TICK * 60 * 1000)) {
		globalVal.timeBegin = (new Date()).getTime();
		tick({ globalVal, pet });
	}

}

export function tick({ globalVal, pet }: any) {
	console.log(globalVal.ezMoney);
	if (globalVal.ezMoney) {
		globalVal.money += 10;
	}
	globalVal.tickCounter++;
	pet.hunger = pet.hunger - 3;
	pet.happiness = pet.happiness - 2;

	//further decrease stats if pet is sick
	if (pet.sick) {
		pet.hunger = pet.hunger - 5;
		pet.happiness = pet.happiness - 2;
	}
	pet.happiness = Math.min(Math.max(pet.happiness, 0), 100);
	pet.hunger = Math.min(Math.max(pet.hunger, 0), 100);

	//pet has a chance of pooping every tick
	if (globalVal.noToilet) {
		//do nothing
	}
	else if (pet.hunger > 90) {
		if (Math.random() > 0.70) {
			pet.poop++;
		}
	}
	else if (pet.hunger <= 90) {
		if (Math.random() > 0.85) {
			pet.poop++;
		}
	}
	pet.poop = Math.min(Math.max(pet.poop, 0), 3);
	//amount of poop alters probability of sickness
	if (Math.random() < (0.1 * pet.poop)) {
		pet.sick = true;
	}

	if (pet.mood != "dead") {
		pet.age++;
	}
	console.log("dung: " + pet.poop);
}

