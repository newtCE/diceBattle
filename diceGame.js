//write some functions for enemy behaviors

function gameLoop(){
	let gameState="beginning"; //this state used to move from phase to phase
	let player={
		maxHP: 120,
		baseAttackPower:20,
		baseDefense: .09,
		baseInitiative: 25
	}
	let playerOffenseLevel;
	let playerDefenseLevel;
	let enemyOffenseLevel;
	let enemyDefenseLevel;
	let questPath=[];
	let fiendFolioNames=["","Goblin","Giant Centipede","Goblin Mage","Bone Pile","Constrictor","Troglodyte"];
	console.log("Welcome to the beginning of the game.");
	questPath=rollQuest();
	console.log("Quest has been rolled.");
	console.log(questPath);
	window.setTimeout(flavorText(gameState,questPath[3]),1000);
	gameState="battle 1";
	let enemyMonster=enemyConstructor(questPath[0],gameState);
	flavorText(gameState,enemyMonster.name);
	battleLoop(player,enemyMonster);	//1st battle start
	gameState="battle 2";
	enemyMonster=enemyConstructor(questPath[1],gameState);
	flavorText(gameState,enemyMonster.name);
	gameState="battle 3";
	enemyMonster=enemyConstructor(questPath[2],gameState);
	flavorText(gameState,enemyMonster.name);
	gameState="final battle";
	flavorText(gameState,questPath[3]);
	gameState="ending";
	flavorText(gameState,questPath[3]);	
	//prompt("Welcome to the start of the game.");
	

}
function battleLoop(player,enemyMonster){
console.log("The battle begins!");
let phase=0;
let playerCurrentDefense=player.baseDefense*.5;
let playerCurrentHP=player.maxHP;
let enemyCurrentDefense=enemyMonster.baseDefense*.5;
let enemyCurrentHP=enemyMonster.maxHP;
let playerNextTurn=player.baseInitiative;
let enemyNextTurn=enemyMonster.baseInitiative;
while (playerCurrentHP>1 && enemyCurrentHP>1){	//while nobody has lost all hp
		console.log("Player has "+playerCurrentHP+" HP");
		console.log(enemyMonster.name+" has "+enemyCurrentHP+" HP");
		let turnOutcome=determineTurn(playerNextTurn,enemyNextTurn);
		if (turnOutcome==="Player Turn"){
			phase=playerNextTurn;
			let offenseRatio=playerDetermineOffense();
			playerCurrentDefense=determineCurrentDefense(offenseRatio,player.baseDefense);
			let actionNumber=playerChooseNumberOfActions(offenseRatio,player.baseInitiative,enemyNextTurn,phase);
			playerNextTurn=playerFindTurnOffsets(offenseRatio,player.baseInitiative,actionNumber);//set next turn
			let damageOutput=damageCalculate(offenseRatio,actionNumber,player.baseAttackPower,enemyCurrentDefense);//get damage
			if (actionNumber>1){
			console.log("Player strikes "+enemyMonster.name+" "+actionNumber+" times!");
			}
			else{
			console.log("Player strikes "+enemyMonster.name+"!");
			}
			console.log(enemyMonster.name+" took"+damageOutput+" damage!");
			enemyCurrentHP=enemyCurrentHP-damageOutput;
		}
		else
		{
			phase=enemyNextTurn;
			let offenseRatio=enemyDetermineOffense(enemyMonster.maxHP,enemyCurrentHP,enemyMonster.offenseRatio00,enemyMonster.offenseRatio25,enemyMonster.offenseRatio50,enemyMonster.offenseRatio75);
			enemyCurrentDefense=determineCurrentDefense(offenseRatio,enemyMonster.baseDefense);
			let actionNumber=diceRollAnySides(3);
			enemyNextTurn=enemyChooseNumberOfActions(offenseRatio,enemyMonster.baseInitiative,phase);
			let damageOutput=damageCalculate(offenseRatio,actionNumber,enemyMonster.baseAttackPower,playerCurrentDefense);//get damage
			if (actionNumber>1){
			console.log(enemyMonster.name+" strikes "+actionNumber+" times!");
			}
			else{
			console.log(enemyMonster.name+" strikes!");
			}
			console.log("Player took "+damageOutput+" damage!");
			playerCurrentHP=playerCurrentHP-damageOutput;

		}
		console.log("Phase: "+phase);
	}

}
function enemyChooseNumberOfActions(offenseRatio,numberOfActions,baseInitiative,phase){

	let turnOffset=Math.floor(baseInitiative+(numberOfActions*((baseInitiative*.5)*(offenseRatio*.1))));
	return turnOffset+phase;

}

function enemyDetermineOffense(maxHP,enemyCurrentHP,ratio00,ratio25,ratio50,ratio75){
	let offenseRatio=0;
	if (enemyCurrentHP>0){
		let hpRatio=maxHP/enemyCurrentHP;
		if (hpRatio>.0){
			offenseRatio=ratio00;
		}
		if (hpRatio>.24){
			offenseRatio=ratio25;
		}
		if (hpRatio>.49){
			offenseRatio=ratio50;
		}
		if (hpRatio>.74){
			offenseRatio=ratio75;
		}
		offenseRatio=offenseRatio-(diceRollAnySides(16));

	}
	return offenseRatio;
}

function damageCalculate(offenseRatio,actionNumber,attackerBasePower,targetCurrentDefense){
	let damageOutput=(attackerBasePower+((offenseRatio*.01)*(attackerBasePower)))*targetCurrentDefense;
	return damageOutput;
}

function determineCurrentDefense(offenseRatio,baseDefense){
	let currentDefense=.1*(100-offenseRatio)*baseDefense;
	return currentDefense;
}
function playerChooseNumberOfActions(offenseRatio,playerInit,enemyNextAt,phase){
	let oneAction=playerFindTurnOffsets(offenseRatio,playerInit,1,phase);
	let twoAction=playerFindTurnOffsets(offenseRatio,playerInit,2,phase);
	let threeAction=playerFindTurnOffsets(offenseRatio,playerInit,3,phase);
	let numberOfActions=prompt("Enter a number between 1-3 to determine how many times you will attack.\nMore attacks push your next turn further into the future:\n"+"1:Next Turn at Phase "+oneAction+"\n2:Next Turn at Phase "+twoAction+"\n3:Next Turn at Phase "+threeAction+"\nEnemies Next Turn at Phase "+enemyNextAt);
	return numberOfActions;
}
function playerFindTurnOffsets(playerInit,offenseRatio,numberOfActions,phase){
	let turnOffset=Math.floor(playerInit+(numberOfActions*((playerInit*.5)*(offenseRatio*.1))));
	return turnOffset+phase;
}

function playerDetermineOffense(){
	let offensePower=prompt("Enter a number between 1-100 to determine much of your energy will be used for offense. The remaining energy will be used for your defense this turn");
	return Math.floor(offensePower);
}

function determineTurn(playerInit,enemyInit){
	let turnOutcome="";
	if (playerInit<enemyInit){
		turnOutcome="Player Turn";
	}
	else if (playerInit===enemyInit){
		turnOutcome="Player Turn";
	}
	else
	{
		turnOutcome="Enemy Turn";
	}
	console.log(turnOutcome);
	return turnOutcome;
}

function enemyConstructor(enemyID,gameState){
	if (gameState==="final battle"){
			enemyID=enemyID+6;
	}
	let monster={	//define and instantiate placeholder values for monster object
	name: "Goblin",
	maxHP: 70,
	offenseRatio75:60, //the highest amount of action power which can be set to offense
	offenseRatio50:80,
	offenseRatio25:20,
	offenseRatio00:90,
	baseAttackPower:12, //this value is the minimum attack output which is multiplied by the offense ratio x.10 during the turn
	baseDefense:.03, //this value is multiplied by the defense ratio and then subtracted from 1 to find the damage incurred
	baseInitiative:20,	//the minimum phase cost of taking a turn, the type and number of attack performed during a turn use this value to calculate turn offset 
	};		
	switch(enemyID){	
		case 1:
			monster={
			name: "Goblin",
			maxHP: 70,
			offenseRatio75:60, 
			offenseRatio50:80,
			offenseRatio25:20,
			offenseRatio00:90,
			baseAttackPower:12,
			baseDefense:.03,
			baseInitiative:230,
		};
		break;
		case 2:
			monster={
			name: "Giant Centipede",
			maxHP: 70,
			offenseRatio75:60,
			offenseRatio50:80,
			offenseRatio25:20,
			offenseRatio00:90,
			baseAttackPower:12,
			baseDefense:.04,
			baseInitiative:40, 
		};
		break;
		case 3:
			monster={
			name: "Goblin Mage",
			maxHP: 80,
			offenseRatio75:60,
			offenseRatio50:80,
			offenseRatio25:20,
			offenseRatio00:90,
			baseAttackPower:12,
			baseDefense:.03,
			baseInitiative:30,
		};
		break;
		case 4:
			monster={
			name: "Bone Pile",
			maxHP: 70,
			offenseRatio75:50,
			offenseRatio50:50,
			offenseRatio25:50,
			offenseRatio00:50,
			baseAttackPower:12,
			baseDefense:.03,
			baseInitiative:60, 
		};
		break;
		case 5:
			monster={
			name: "Constrictor",
			maxHP: 70,
			offenseRatio75:40,
			offenseRatio50:50,
			offenseRatio25:60,
			offenseRatio00:40,
			baseAttackPower:12,
			baseDefense:.03,
			baseInitiative:40,
		};
		break;
		case 6:
			monster={
			name: "Troglodyte",
			maxHP: 70,
			offenseRatio75:40,
			offenseRatio50:60,
			offenseRatio25:40,
			offenseRatio00:40,
			baseAttackPower:12,
			baseDefense:.03,
			baseInitiative:30,
		};
		break;
		case 7:
			monster={
			name: "Myrmage",
			maxHP: 250,
			offenseRatio75:50,
			offenseRatio50:60,
			offenseRatio25:40,
			offenseRatio00:40,
			baseAttackPower:12,
			baseDefense:.02,
			baseInitiative:60,
		};
		break;
		case 8:
			monster={
			name: "Chimera",
			maxHP: 320,
			offenseRatio75:60,
			offenseRatio50:80,
			offenseRatio25:60,
			offenseRatio00:50,
			baseAttackPower:12,
			baseDefense:.03,
			baseInitiative:80,
		};
		break;
		case 9:
			monster={
			name: "Ogre",
			maxHP: 300,
			offenseRatio75:60,
			offenseRatio50:80,
			offenseRatio25:20,
			offenseRatio00:90,
			baseAttackPower:12,
			baseDefense:.04,
			baseInitiative:120,
		};
		break;																							
	}
return monster;
}
function flavorText(gameState,questDetail){
switch(gameState){
	case "beginning":
		switch(questDetail){ //setting description based on your boss roll
			case 1:
				console.log("You arrive at the mouth of a cavern recently unhidden by the receding tide. It is just as the fortune teller had predicted. You venture inside to meet your destiny.");
			break;

			case 2:
				console.log("The forest is shrowded in mist but you advance with certainty, this is the hunting ground of the Chimera. You venture forth to meet your destiny.");
			break;

			case 3:
				console.log("You stand at the foot of an impressive, ancient tower. No traces remain of the adventurers who came before you. You venture inside to meet your destiny.");
			break;
		}

	break;

	case "battle 1":
				console.log("Before you appears a "+questDetail+" ready to attack!"); //when called place monster id
	break;

	case "battle 2":
				console.log("Your further advance is soon stopped by a "+questDetail+" ready to attack!"); //when called place monster id
	break;

	case "battle 3":
				console.log("As you close in on your final destination, a "+questDetail+" appears ready to attack!"); //when called place monster id
	break;

	case "final battle":
		switch(questDetail){ //setting description based on your boss roll
			case 1:
				console.log("You reach the innermost cavern, the silvery Myrmage arises before you. Its hostility is unmistakable.");
			break;

			case 2:
				console.log("From the mists appears the massive shape of the Chimera. You ready yourself for combat.");
			break;

			case 3:
				console.log("Upon reaching the uppermost chamber of the tower, you discover the fabled Ogre. It appears to be ready for you.");
			break;
		}
	break;

	case "ending":
		switch(questDetail){ //setting description based on your boss roll
			case 1:
				console.log("The Myrmage will no longer terrify the coastal village. You look upon the decades of plunder it leaves behind as your reward.");
			break;

			case 2:
				console.log("The mists part just as the Chimera's death rattles cease to echo. The mythical beast is no more and you will be regarded as a hero.");
			break;

			case 3:
				console.log("The Ogre collapses broken before you. The possesions of it's victims are all that remain of those who came before you. Closure will have to suffice.");
			break;
		}
	break;

	case "game over":

	break;


}

}
function rollQuest(){
	let questArray=[0];
	let diceSides;
	for(i=0;i<4;i++){
		switch(i){
			case 0:
				diceSides=6		//roll battle 1
			break;

			case 1:
				diceSides=6		//roll battle 2
			break;

			case 2:
				diceSides=4		//roll battle 3
			break;

			case 3:
				diceSides=3		//roll final boss
			break;			
		}
		questArray[i]=diceRollAnySides(diceSides); //starts with d6 then to 3
		console.log(questArray[i]);
	}
	return questArray;
}

function diceRollAnySides(numberOfSides){
	let rollOutcome=Math.floor((Math.random() * numberOfSides)+1);     // returns a number from 1 to the number of sides
	return rollOutcome;
	console.log(rollOutcome);
}
diceRollAnySides(8);

function enemyActionChoose(){
	let rollActionCount;
}
function goblinActionRoll(rollOutcome){

}
function fiendFolio(number,infoField){


}
gameLoop();	