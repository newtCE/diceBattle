function gameLoop(){
	alert("Welcome to My Dice Generated RPG Battle Gauntlet!\nSoon you will roll dice to generate a short adventure to battle your way through!");
	alert('Battles are fought 1 on 1. Turn order is governed by "Phase" which is a unit of time. If your Phase count matches the current Phase, it is your turn.\nDuring your turn you select how much of your energy will be dedicated to offense or defense, higher offense means lower defense.\nNext you select the number of times you will attack, each attack you perform will push the Phase of your next turn further into the future.');
	alert("Try not to overextend yourself or leave yourself open for too long or the enemy will get many turns in a row with which to attack you.\nAfter 4 battles you will reach the end of your story...");
	let gameState="beginning"; //this state used to move from phase to phase
	let player={
		maxHP: 120,
		baseAttackPower:20,
		baseDefense: .8,
		baseInitiative: 25
	}
	let playerOffenseLevel;
	let playerDefenseLevel;
	let enemyOffenseLevel;
	let enemyDefenseLevel;
	let questPath=[];
	questPath=rollQuest();
	window.setTimeout(flavorText(gameState,questPath[3]),1000);
	gameState="battle 1";
	let enemyMonster=enemyConstructor(questPath[0],gameState);
	flavorText(gameState,enemyMonster.name);
	player=battleLoop(player,enemyMonster);	//1st battle start
	if (player.maxHP===130){
			gameState="battle 2";
			enemyMonster=enemyConstructor(questPath[1],gameState);
			flavorText(gameState,enemyMonster.name);
			player=battleLoop(player,enemyMonster);
		if (player.maxHP===140){
				gameState="battle 3";
				enemyMonster=enemyConstructor(questPath[2],gameState);
				flavorText(gameState,enemyMonster.name);
				player=battleLoop(player,enemyMonster);
			if (player.maxHP===150){
					gameState="final battle";
					enemyMonster=enemyConstructor(questPath[3],gameState);
					flavorText(gameState,questPath[3]);
					player=battleLoop(player,enemyMonster);
					if (player.maxHP===160){
						gameState="ending";
						flavorText(gameState,questPath[3]);	
						alert("THE END");
					}
				}
			}
		}
}
function battleLoop(player,enemyMonster){
console.log("The battle begins!");
let phase=0;
let playerCurrentDefense=1-(player.baseDefense*.5);
let playerCurrentHP=player.maxHP;
let enemyCurrentDefense=1-(enemyMonster.baseDefense*.5);
let enemyCurrentHP=enemyMonster.maxHP;
let playerNextTurn=player.baseInitiative;
let enemyNextTurn=enemyMonster.baseInitiative;
while (playerCurrentHP>1 && enemyCurrentHP>1){	//while nobody has lost all hp
		console.log("Player has "+playerCurrentHP+" HP");
		console.log(enemyMonster.name+" has "+enemyCurrentHP+" HP");
		let turnOutcome=determineTurn(playerNextTurn,enemyNextTurn);
		if (turnOutcome==="Player Turn"){
			phase=playerNextTurn;
			let offenseRatio=playerDetermineOffense(playerCurrentHP,enemyCurrentHP,enemyNextTurn,phase);
			playerCurrentDefense=determineCurrentDefense(offenseRatio,player.baseDefense);
			let actionNumber=playerChooseNumberOfActions(offenseRatio,player.baseInitiative,enemyNextTurn,phase);
			playerNextTurn=playerFindTurnOffsets(player.baseInitiative,offenseRatio,actionNumber,phase);//set next turn
			let damageOutput=damageCalculate(offenseRatio,actionNumber,player.baseAttackPower,enemyCurrentDefense);//get damage
			if (actionNumber>1){
			alert("Phase: "+phase+"\nPlayer strikes "+enemyMonster.name+" "+actionNumber+" times!\n"+enemyMonster.name+" took "+damageOutput+" damage!");
			}
			else{
			alert("Phase: "+phase+"\nPlayer strikes "+enemyMonster.name+"!\n"+enemyMonster.name+" took "+damageOutput+" damage!");
			}
			enemyCurrentHP=enemyCurrentHP-damageOutput;
		}
		else
		{
			phase=enemyNextTurn;
			let offenseRatio=enemyDetermineOffense(enemyMonster.maxHP,enemyCurrentHP,enemyMonster.offenseRatio00,enemyMonster.offenseRatio25,enemyMonster.offenseRatio50,enemyMonster.offenseRatio75);
			enemyCurrentDefense=determineCurrentDefense(offenseRatio,enemyMonster.baseDefense);
			let actionNumber=diceRollAnySides(3);
			enemyNextTurn=enemyChooseNumberOfActions(enemyMonster.baseInitiative,offenseRatio,actionNumber,phase);
			let damageOutput=damageCalculate(offenseRatio,actionNumber,enemyMonster.baseAttackPower,playerCurrentDefense);//get damage
			if (actionNumber>1){
			alert("Phase: "+phase+"\n"+enemyMonster.name+" strikes "+actionNumber+" times!\nPlayer took "+damageOutput+" damage!");
			}
			else{
			alert("Phase: "+phase+"\n"+enemyMonster.name+" strikes!\nPlayer took "+damageOutput+" damage!");
			}
			playerCurrentHP=playerCurrentHP-damageOutput;

		}
		
	}
	if (playerCurrentHP<1){
		alert("You were defeated!\nGame Over");
		return player;

	}
	else
	{
		alert("The "+enemyMonster.name+" has been vanquished!\nYou've gained a level!");
		player.maxHP=player.maxHP+10;
		player.baseAttackPower=player.baseAttackPower+5;
		player.baseDefense=player.baseDefense+.02;
		player.baseInitiative=player.baseInitiative-1;
		return player;
	}

}
function enemyChooseNumberOfActions(baseInitiative,offenseRatio,numberOfActions,phase){

	let turnOffset=baseInitiative*.5;
	turnOffset=Math.floor(turnOffset*numberOfActions);
	turnOffset=turnOffset+baseInitiative;
	turnOffset=turnOffset+phase;
	return turnOffset;

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
		let finalRollType=diceRollAnySides(10);
		let rollSides=0;
		switch (finalRollType){
			case 1:
				rollSides=4;
			break;

			case 2:
				rollSides=6;
			break;

			case 3:
				rollSides=8;
			break;

			case 4:
				rollSides=8;
			break;

			case 5:
				rollSides=10;
			break;

			case 6:
				rollSides=10;
			break;

			case 7:
				rollSides=10;
			break;
			
			case 8:
				rollSides=12;
			break;

			case 8:
				rollSides=16;
			break;

			case 8:
				rollSides=16;
			break;							
		}
		offenseRatio=offenseRatio-(diceRollAnySides(rollSides));
	}
	return offenseRatio;
}

function damageCalculate(offenseRatio,actionNumber,attackerBasePower,targetCurrentDefense){
	let damageOutput=offenseRatio*.01;
	damageOutput=attackerBasePower*damageOutput;
	damageOutput=damageOutput+attackerBasePower;
	damageOutput=damageOutput*actionNumber;
	damageOutput=damageOutput*targetCurrentDefense;
	damageOutput=Math.floor(damageOutput);
	return damageOutput;
}

function determineCurrentDefense(offenseRatio,baseDefense){
	let currentDefense=100-offenseRatio;
	currentDefense=currentDefense*0.01;
	currentDefense=currentDefense*baseDefense;
	currentDefense=1-currentDefense;
	return currentDefense;
}
function playerChooseNumberOfActions(offenseRatio,playerInit,enemyNextAt,phase,){
	let oneAction=playerFindTurnOffsets(playerInit,offenseRatio,1,phase);
	let twoAction=playerFindTurnOffsets(playerInit,offenseRatio,2,phase);
	let threeAction=playerFindTurnOffsets(playerInit,offenseRatio,3,phase);
	let numberOfActions=-1;
	while(numberOfActions<1||numberOfActions>3){
		numberOfActions=prompt("Enter a number between 1-3 to determine how many times you will attack.\nMore attacks push your next turn further into the future:\n"+"1:Next Turn at Phase "+oneAction+"\n2:Next Turn at Phase "+twoAction+"\n3:Next Turn at Phase "+threeAction+"\nEnemies Next Turn at Phase "+enemyNextAt);
	}
	return numberOfActions;
}
function playerFindTurnOffsets(playerInit,offenseRatio,numberOfActions,phase){
	let turnOffset=playerInit*.5;
	turnOffset=Math.floor(turnOffset*numberOfActions);
	turnOffset=turnOffset+playerInit;
	turnOffset=turnOffset+phase;
	return turnOffset;
}
function playerDetermineOffense(playerHP,enemyHP,enemyNextAt,phase){
	let offensePower=-1;
	while(offensePower<1||offensePower>100){
		offensePower=prompt("Phase: "+phase+"\nPLAYER TURN\nPlayer HP: "+playerHP+"\nEnemy HP: "+enemyHP+"\nEnemy Next Turn: "+enemyNextAt+"\nEnter a number between 1-100 to determine much of your energy will be used for offense. The remaining energy will be used for your defense this turn");
	}
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
			maxHP: 120,
			offenseRatio75:60, 
			offenseRatio50:80,
			offenseRatio25:20,
			offenseRatio00:90,
			baseAttackPower:24,
			baseDefense:.3,
			baseInitiative:20,
		};
		break;
		case 2:
			monster={
			name: "Giant Centipede",
			maxHP: 160,
			offenseRatio75:60,
			offenseRatio50:80,
			offenseRatio25:20,
			offenseRatio00:90,
			baseAttackPower:40,
			baseDefense:.6,
			baseInitiative:40, 
		};
		break;
		case 3:
			monster={
			name: "Goblin Mage",
			maxHP: 140,
			offenseRatio75:60,
			offenseRatio50:80,
			offenseRatio25:20,
			offenseRatio00:90,
			baseAttackPower:32,
			baseDefense:.3,
			baseInitiative:30,
		};
		break;
		case 4:
			monster={
			name: "Bone Pile",
			maxHP: 180,
			offenseRatio75:50,
			offenseRatio50:50,
			offenseRatio25:50,
			offenseRatio00:50,
			baseAttackPower:32,
			baseDefense:.7,
			baseInitiative:60, 
		};
		break;
		case 5:
			monster={
			name: "Constrictor",
			maxHP: 200,
			offenseRatio75:40,
			offenseRatio50:50,
			offenseRatio25:60,
			offenseRatio00:40,
			baseAttackPower:48,
			baseDefense:.3,
			baseInitiative:40,
		};
		break;
		case 6:
			monster={
			name: "Troglodyte",
			maxHP: 220,
			offenseRatio75:40,
			offenseRatio50:60,
			offenseRatio25:40,
			offenseRatio00:40,
			baseAttackPower:40,
			baseDefense:.3,
			baseInitiative:30,
		};
		break;
		case 7:
			monster={
			name: "Myrmage",
			maxHP: 600,
			offenseRatio75:90,
			offenseRatio50:60,
			offenseRatio25:40,
			offenseRatio00:40,
			baseAttackPower:48,
			baseDefense:.2,
			baseInitiative:60,
		};
		break;
		case 8:
			monster={
			name: "Chimera",
			maxHP: 840,
			offenseRatio75:60,
			offenseRatio50:80,
			offenseRatio25:60,
			offenseRatio00:50,
			baseAttackPower:56,
			baseDefense:.35,
			baseInitiative:80,
		};
		break;
		case 9:
			monster={
			name: "Ogre",
			maxHP: 700,
			offenseRatio75:60,
			offenseRatio50:80,
			offenseRatio25:20,
			offenseRatio00:90,
			baseAttackPower:64,
			baseDefense:.5,
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
				alert("You arrive at the mouth of a cavern recently unhidden by the receding tide. It is just as the fortune teller had predicted. You venture inside to meet your destiny.");
			break;

			case 2:
				alert("The forest is shrowded in mist but you advance with certainty, this is the hunting ground of the Chimera. You venture forth to meet your destiny.");
			break;

			case 3:
				alert("You stand at the foot of an impressive, ancient tower. No traces remain of the adventurers who came before you. You venture inside to meet your destiny.");
			break;
		}
	break;

	case "battle 1":
				alert("Before you appears a "+questDetail+" ready to attack!"); //when called place monster id
	break;

	case "battle 2":
				alert("Your further advance is soon stopped by a "+questDetail+" ready to attack!"); //when called place monster id
	break;

	case "battle 3":
				alert("As you close in on your final destination, a "+questDetail+" appears ready to attack!"); //when called place monster id
	break;

	case "final battle":
		switch(questDetail){ //setting description based on your boss roll
			case 1:
				alert("You reach the innermost cavern, the silvery Myrmage arises before you. Its hostility is unmistakable.");
			break;

			case 2:
				alert("From the mists appears the massive shape of the Chimera. You ready yourself for combat.");
			break;

			case 3:
				alert("Upon reaching the uppermost chamber of the tower, you discover the fabled Ogre. It appears to be ready for you.");
			break;
		}
	break;

	case "ending":
		switch(questDetail){ //setting description based on your boss roll
			case 1:
				alert("The Myrmage will no longer terrify the coastal village. You look upon the decades of plunder it leaves behind as your reward.");
			break;

			case 2:
				alert("The mists part just as the Chimera's death rattles cease to echo. The mythical beast is no more and you will be regarded as a hero.");
			break;

			case 3:
				alert("The Ogre collapses broken before you. The possesions of it's victims are all that remain of those who came before you. Closure will have to suffice.");
			break;
		}
	break;

	case "game over":
	break;
}

}
function rollQuest(){
	alert("You will now roll dice to determine the course of your quest.");
	let questArray=[0];
	let diceSides;
	for(i=0;i<4;i++){
		switch(i){
			case 0:
				alert("Roll your 1st D6");
				diceSides=6		//roll battle 1
			break;

			case 1:
				alert("Roll your 2nd D6");
				diceSides=6		//roll battle 2
			break;

			case 2:
				alert("Roll your 3rd D4");
				diceSides=4		//roll battle 3
			break;

			case 3:
				alert("Roll your 4th D4"); //it's actuall a d3..which would be a cylinder i suppose...
				diceSides=3		//roll final boss
			break;			
		}
		questArray[i]=diceRollAnySides(diceSides); //starts with d6 then to 3
		alert("You rolled a "+questArray[i]);
	}
	alert("Quest has been rolled & will now begin...");
	return questArray;
}
function diceRollAnySides(numberOfSides){
	let rollOutcome=Math.floor((Math.random() * numberOfSides)+1);     // returns a number from 1 to the number of sides
	return rollOutcome;
}
