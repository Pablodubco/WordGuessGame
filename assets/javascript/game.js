//Difficulty variables for onclick events
var btnProgressDifficulty = document.getElementById("btnProgressDifficulty");
var btnEasyDifficulty = document.getElementById("btnEasyDifficulty");
var btnMediumDifficulty = document.getElementById("btnMediumDifficulty");
var btnHardDifficulty = document.getElementById("btnHardDifficulty");

//Game info variables
var infoDifficulty = document.getElementById("infoDifficulty");
var infoWinningStreak = document.getElementById("infoWinningStreak");
var infoWon = document.getElementById("infoWon");
var infoLost = document.getElementById("infoLost");

//Gameplay variables
var guessWord = document.getElementById("guessWord");
var infoWrongGuesses = document.getElementById("infoWrongGuesses");

//Word Guess Game Variables
var strGuess = ""; //Stores player's guesses
var arDifficulty = ["Very Easy","Easy","Normal","Hard","Very Hard"]; //difficulty setting
var arDifficultyTxtColor = ["rgb(0, 255, 13)","rgb(44, 156, 0)","rgb(255, 255, 1)","rgb(255, 85, 55)","rgb(255, 32, 32)"];//aesthetics. Different rgb color settings for the difficulty text. Mantain same order as arDifficulty array element.
var strWordToGuess = ""; //target word to guess
var intGamesWon= 0; //total number of games won
var intGamesLost= 0; //total number of games lost
var intWinningStreak= 0; //number of consecutive games won. Used for "Progress" difficulty, and motivates the player
var intRemainingGuesses= 0; //number of remaining tries to guess the target word
var boolLastGameVictory= false; //for control of winning streak (so player cannot cheat by starting new game when almost loosing)
var arWordListGame = ["ph1","ph2"]; //temporary word list. Words in here get added and removed depending on difficulty setting and "Progress" difficulty winning streak.

//Allowed input keys
var arAllowedKeys = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","10"];

//--------------------------Master array of words for every difficulty settiing---------------------------------
var arWordListMaster = [ 
    wordListVeryEasy = [
        "DROID","FINN","JEDI","LEIA","LUKE","REBELS","REPUBLIC","SITH","STAR WARS","VADER"
    ],
    wordListEasy = [
        "ANAKIN","DAGOBAH","EMPEROR","EMPIRE","EWOK","FIRST ORDER","GUNGAN","HAN SOLO","KENOBI","LIGHTSABER","NABOO","PADME","PALPATINE","RESISTANCE","SKYWALKER","THE FORCE","WOOKIEE"
    ],
    wordListMedium = [
        "AHSOKA","ALDERAAN","AMIDALA","CHEWBACCA","CORUSCANT","DARTH MAUL","DARTH VADER","DEATH STAR","GEORGE LUCAS","HARRISON FORD","HOTH","JAKKU","JEDI KNIGHT","JEDI MASTER","KYLO REN","LUCASARTS","MARK HAMILL","MILLENNIUM FALCON","PRINCESS LEIA","R2D2","SITH LORD","STORMTROOPER","TATOOINE","TIE FIGHTER",  "X WING"
    ],
    wordListHard = [
        "A NEW HOPE","BB8","BOBA FETT","C3PO","CARRIE FISHER","CLONE WARS","COUNT DOOKU","GENERAL GRIEVOUS","IMPERIAL WALKER","JAR JAR BINKS","LANDO CALRISSIAN","MASTER WINDU","MOS EISLEY","PHANTOM MENACE","TRADE FEDERATION" 
    ],
    wordListVeryHard = [
        "BATTLE OF ENDOR","JABBA THE HUTT","NABOO STARFIGHTER","OBI WAN KENOBI","POD RACING","QUI GON JINN","SUPREME LEADER SNOKE"
    ]
];

//------------------------------Game Methods--------------------------------------------------------
function mSetWordList(difficulty){ //Fills temporary word list depending on difficulty setting
    if(difficulty === "Easy"){
        arWordListGame = arWordListMaster[0].concat(arWordListMaster[1]);
    }
    else if(difficulty === "Medium"){
        arWordListGame = arWordListMaster[2];
    }
    else if(difficulty === "Hard"){
        arWordListGame = arWordListMaster[3].concat(arWordListMaster[4]);
    }
    else if(difficulty === "Progress"){
        arWordListGame = arWordListMaster[Math.floor(intWinningStreak/3)]; //Increases difficulty every 3 consecutive wins, on the 4th game
    }
}

function mSetWordToGuess(list){ //Chooses random word from the temporary word list, sets it as target word to guess
    strWordToGuess = arWordListGame[Math.floor(Math.random()*list.length)];
}

function mStartGame(difficulty){//Start game. Run when difficulty is selected, and after every win / loss.
    mSetWordList(difficulty); //set temporary list
    console.log(arWordListGame);
    mSetWordToGuess(arWordListGame); //set target word to guess
    console.log(strWordToGuess);

    //Update HTML document with selected word
    var temptxt = strWordToGuess;
    guessWord.textContent = mHideWord(temptxt); //Replaces word with "_ _ _ _..."
    if(difficulty === "Progress"){ //Aestethics. Progress difficulty has 5 secuential settings from "Very Easy" to "Very Hard"
        var tempint = Math.floor(intWinningStreak/3);
        var temptxt = arDifficultyTxtColor[tempint];
        infoDifficulty.textContent = arDifficulty[tempint];
        infoDifficulty.setAttribute("style","color: "+temptxt+";");
    }
    else {
        var tempint = arDifficulty.indexOf(difficulty);
        var temptxt = arDifficultyTxtColor[tempint];
        infoDifficulty.textContent = difficulty;
        infoDifficulty.setAttribute("style","color: "+temptxt+";");
    }   
}

function mHideWord(word){
    var tempTxt = "";
    for (var i = 0; i < word.length; i++){
        if (word.charAt(i) === " ") { //In case there's a space, to separate the words
            tempTxt += " | ";
        }
        else {
            tempTxt += "_ ";
        }
    }
    return tempTxt;
}

function mUnhideWord(charNumber,guess){
    var tempTxt = "";
    for (var i = 0; i < word.length; i++){
        if (word.charAt(i) === " ") { //In case there's a space, to separate the words
            tempTxt += " | ";
        }
        else {
            if(i===charNumber){
                tempTxt += guess;
            }
            else {
                tempTxt += "_ ";
            }
        }
    }
    return tempTxt;
}

function mEvaluateGuess(guess){
    console.log(arAllowedKeys.indexOf(guess));
    if(arAllowedKeys.indexOf(guess) > 0){
        for(var i = 0; i < strWordToGuess.length;i++){
            if(strWordToGuess.charAt(i)===guess){
                guessWord.textContent = mUnhideWord(i,guess);
            }
        }
    }
}

function mUpdateStats(){

}

function mResetGame(){

}

//Makes sure window is completely loaded before running any script
window.onload = function(event){
    
    //Difficulty setting buttons
    btnProgressDifficulty.onclick = function(){
        //Change color of chosen div border to appear "selected". Remove border from non selected divs
        btnProgressDifficulty.setAttribute("style","border: 2px solid rgb(255, 255, 98);");
        btnEasyDifficulty.setAttribute("style","border: none;");
        btnMediumDifficulty.setAttribute("style","border: none;");
        btnHardDifficulty.setAttribute("style","border: none;");
        mStartGame("Progress");
    }

    btnEasyDifficulty.onclick = function(){
        //Change color of chosen div border to appear "selected". Remove border from non selected divs
        btnProgressDifficulty.setAttribute("style","border: none;");
        btnEasyDifficulty.setAttribute("style","border: 2px solid rgb(255, 255, 98);");
        btnMediumDifficulty.setAttribute("style","border: none;");
        btnHardDifficulty.setAttribute("style","border: none;");
        mStartGame("Easy");
    }

    btnMediumDifficulty.onclick = function(){
        //Change color of chosen div border to appear "selected". Remove border from non selected divs
        btnProgressDifficulty.setAttribute("style","border: none;");
        btnEasyDifficulty.setAttribute("style","border: none;");
        btnMediumDifficulty.setAttribute("style","border: 2px solid rgb(255, 255, 98);");
        btnHardDifficulty.setAttribute("style","border: none;");
        mStartGame("Medium");
    }

    btnHardDifficulty.onclick = function(){
        //Change color of chosen div border to appear "selected". Remove border from non selected divs
        btnProgressDifficulty.setAttribute("style","border: none;");
        btnEasyDifficulty.setAttribute("style","border: none;");
        btnMediumDifficulty.setAttribute("style","border: none;");
        btnHardDifficulty.setAttribute("style","border: 2px solid rgb(255, 255, 98);");
        mStartGame("Hard");
    }

    //When player presses a key
    document.onkeyup = function(event){
        mEvaluateGuess(event.key);
    }

}


