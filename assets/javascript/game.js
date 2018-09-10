/*
Note:
Names must remain unchanged for Game info variables, and Gameplay variables.
Game requires an HTML file with the matching ids indicated in the Game info and Gameplay variables.

*/

//Variables for triggering object events. Can be altered.
var btnProgressDifficulty = document.getElementById("btnProgressDifficulty");
var btnEasyDifficulty = document.getElementById("btnEasyDifficulty");
var btnMediumDifficulty = document.getElementById("btnMediumDifficulty");
var btnHardDifficulty = document.getElementById("btnHardDifficulty");
var btnPlayAgain = document.getElementById("btnPlayAgain");
var btnResetScore = document.getElementById("btnResetScore");

//Game info variables: chage across multiple games. Required.
var infoDifficulty = document.getElementById("infoDifficulty");
var infoWinningStreak = document.getElementById("infoWinningStreak");
var infoWon = document.getElementById("infoWon");
var infoLost = document.getElementById("infoLost");
var infoMessage = document.getElementById("infoMessage");

//Gameplay variables: change while playing each game. Required.
var guessWord = document.getElementById("guessWord");
var infoWrongGuesses = document.getElementById("infoWrongGuesses");
var infoRemainigGuesses = document.getElementById("infoRemainingGuesses");

//Game Object BEGIN_______________________________________________________________________________________
var WordGuessGame = {
    strDifficulty: "", //string to store difficulty setting
    strPreviousDifficulty: "", //string to store previous difficulty setting. Used when changing difficulties, to reset word list
    arDifficulty: ["Very Easy","Easy","Medium","Hard","Very Hard"], //difficulty object settings array
    arDifficultyTries: [14,12,9,6,4], //difficulty number of tries
    arDifficultyTxtColor: ["rgb(0, 255, 13)","rgb(44, 156, 0)","rgb(255, 255, 1)","rgb(255, 85, 55)","rgb(255, 32, 32)"],//Aesthetics. Different rgb color settings for the difficulty text. Mantain same order as arDifficulty array element.
    intProgressRamp: 3, //Consecutive wins in "Progress" before difficulty goes up
    strProgressClearDif: "Hard", //After clearing "Progress" continue playing at this difficulty
    strGuess: "", //Stores player's guesses
    strWordToGuess: "", //target word to guess
    arWordToGuessDisplay: [],
    arIncorrectGuesses: [],
    arGuesses: [],
    intGamesWon: 0, //total number of games won
    intGamesLost: 0, //total number of games lost
    intWinningStreak: 0, //number of consecutive games won. Used for "Progress" difficulty, and motivates the player
    intRemainingGuesses: 0, //number of remaining tries to guess the target word
    boolIsCorrect: false, //Whenever a correct guess is made, becomes true temporarily
    boolLastGameVictory: false, //for control of winning streak (so player cannot cheat by starting new game when almost loosing)
    boolResetWordList: true, //for controlling the temporary game list created for each difficulty.
    boolGameinProgress: false, //for controlling game flow
    boolProgressCleared: false, //controls wether "Progress" difficulty was cleared.
    arWordListGame: [], //temporary word list. Words in here get added and removed depending on difficulty setting and "Progress" difficulty winning streak.

    //Allowed input keys
    arAllowedKeys: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9","10"],

    //--------------------------Master array of words for every difficulty settiing---------------------------------
    arWordListMaster: [ 
        wordListVeryEasy = [
            "DROID","FINN","JEDI","LEIA","LUKE","REBELS","REPUBLIC","REY","SITH","STAR WARS","VADER","YODA"
        ],
        wordListEasy = [
            "ANAKIN","DAGOBAH","EMPEROR","EMPIRE","EWOK","GUNGAN","HAN SOLO","KENOBI","LIGHTSABER","NABOO","PADME","PALPATINE","RESISTANCE","SKYWALKER","THE FORCE","WOOKIEE"
        ],
        wordListMedium = [
            "AHSOKA","ALDERAAN","AMIDALA","CHEWBACCA","CORUSCANT","DARTH MAUL","DARTH VADER","DEATH STAR","FIRST ORDER","GEORGE LUCAS","HARRISON FORD","JEDI KNIGHT","JEDI MASTER","KYLO REN","LUCASARTS","MARK HAMILL","MASTER YODA","MILLENNIUM FALCON","PRINCESS LEIA","SITH LORD","STORMTROOPER","TATOOINE","TIE FIGHTER","X WING"
        ],
        wordListHard = [
            "A NEW HOPE","BOBA FETT","CARRIE FISHER","CLONE WARS","COUNT DOOKU","GENERAL GRIEVOUS","IMPERIAL MARCH","IMPERIAL WALKER","JAR JAR BINKS","LANDO CALRISSIAN","MASTER WINDU","MOS EISLEY","PHANTOM MENACE","ROGUE ONE","STAR DESTROYER","TRADE FEDERATION"
        ],
        wordListVeryHard = [
            "BB8","BATTLE OF ENDOR","C3PO","JABBA THE HUTT","JEDI MIND TRICK","NABOO STARFIGHTER","OBI WAN KENOBI","POD RACING","QUI GON JINN","R2D2","SUPREME LEADER SNOKE","THE EMPIRE STRIKES BACK","THE FORCE AWAKENS","THE LAST JEDI","RETURN OF THE JEDI"
        ]
    ],
//------------------------------Game Methods--------------------------------------------------------
//-----------------General utility Methods: text and array manipulations
    mUpdateTextContent: function(HTMLelement,textContent = ""){//Updates HTML element text content
        HTMLelement.textContent = textContent;
    },
    mDifficultyFix: function(difficulty){//Difficulty fix when choosing "Progress" difficulty
        var tempDifficulty = difficulty;
        if (difficulty === "Progress"){ //Special settings for "Progress" difficulty selection
            if(this.boolProgressCleared ===true){
                tempDifficulty = this.strProgressClearDif; //If "Progress is cleared, set difficulty to [strProgressClearDif]
            }
            else tempDifficulty = this.arDifficulty[Math.min(Math.floor(this.intWinningStreak/this.intProgressRamp),this.arDifficulty.length)];
        }
        return tempDifficulty;
    },
    mConcatenateArray: function(array = [],addSpace = false){//Adds up individual elements in an array into a single text string, optionally insert a space between each one
        var tempTxt = "";
        for (var i = 0; i < array.length; i++){//Loop to return the concatenated array as text
            if(addSpace===true) tempTxt += array[i]+" ";
            else tempTxt += array[i];
        }
        return tempTxt;
    },
    mRemoveArrayElement: function(array = [], element = ""){ //Removes an specified element from the array
        var tempint = array.indexOf(element);
        if (tempint >= 0) array.splice(tempint, 1);
    },

    //------------------Game utility methods: used to manipulate game conditions and scores
    mUpdateStats: function(){//Updates score display
        this.mUpdateTextContent(infoWon,this.intGamesWon);
        this.mUpdateTextContent(infoLost,this.intGamesLost);
        this.mUpdateTextContent(infoWinningStreak,this.intWinningStreak);
    },
    mResetGame: function(){//Reset scores and game variables
        this.arWordToGuessDisplay = []; //empty array for displaying hidden words
        this.arIncorrectGuesses = []; //empty array for displaying incorrect guesses
        this.intGamesWon = 0;
        this.intGamesLost = 0;
        this.intWinningStreak = 0;
        this.boolResetWordList = true;
        this.boolProgressCleared = false;
        this.boolGameinProgress = false; //Game flow flag set to false (game ended). Won't respond to player key events until new game begins.
        this.mUpdateStats();
    },

    //-----------------------Word and list manipulation methods
    mSetWordList: function(difficulty){ //Fills game word list depending on difficulty setting
        if(difficulty === "Easy" && this.strDifficulty != "Progress"){ //Only for "Easy" button selection uses "Very Easy" and "Easy" lists
            this.arWordListGame = this.arWordListMaster[0].concat(this.arWordListMaster[1]);
        }
        else if(difficulty === "Hard" && this.strDifficulty != "Progress"){//Only for "Hard" button selection uses "Hard" and "Very Hard" lists
            this.arWordListGame = this.arWordListMaster[3].concat(this.arWordListMaster[4]);
        }
        else this.arWordListGame = this.arWordListMaster[this.arDifficulty.indexOf(difficulty)]; //For repeated gameplay in a given difficulty, and when the difficulty is cleared
    },
    mSetWordToGuess: function(list){ //Chooses random word from the list, sets it as target word to guess
        this.strWordToGuess = this.arWordListGame[Math.floor(Math.random()*list.length)];
    },
    mHideWord: function(word){ //Ofuscates the target word with "_" on each character and "|" on each space.
        for (var i = 0; i < word.length; i++){//Loop to create array of hidden word to display
            //In case there's a space, to separate the words
            if (word.charAt(i) === " ") this.arWordToGuessDisplay.push(" | "); //Push "|" character to word display
            else this.arWordToGuessDisplay.push("_ "); //Push "_ " to word display
        }
        var tempTxt = this.mConcatenateArray(this.arWordToGuessDisplay);
        return tempTxt;
    },
    mUnhideWord: function(word,guess){
        for (var i = 0; i < word.length; i++){
            if (word.charAt(i) === " ") tempTxt += " | "; //In case there's a space, to separate the words
            else if(word.charAt(i) === guess) this.arWordToGuessDisplay[i] = guess; //If the guess is right, replace "_"
        }
        var tempTxt = this.mConcatenateArray(this.arWordToGuessDisplay);
        return tempTxt;
    },

    //---------------------Game flow methods and player interactions
    mStartGame: function(difficulty){//Start game actions.
        //Difficulty string and index conrols
        var tempDifficulty = this.mDifficultyFix(difficulty);
        var tempint = this.arDifficulty.indexOf(tempDifficulty);

        if(this.strPreviousDifficulty != difficulty){//Resets word list if there was a difficulty change
            this.boolResetWordList = true;
            this.strPreviousDifficulty = difficulty;
        }

        if(this.boolLastGameVictory===false && this.arIncorrectGuesses.length > 0){ //Resets winning streak if the player began a new game without winning the previous one and already began playing.
            this.intWinningStreak = 0;
            this.mUpdateStats();
        }

        //New game initial actions
        this.boolGameinProgress = true; //Sets game progress flag to true
        this.boolLastGameVictory = false; //Sets victory flag back to false for current game
        this.arWordToGuessDisplay = []; //empty array for displaying hidden words
        this.arIncorrectGuesses = []; //empty array for displaying incorrect guesses
        this.mUpdateTextContent(infoWrongGuesses,""); //empty display of wrong guesses
        if (this.boolResetWordList){ //The game word list should be reset whenever the current list is empty (cleared condition), or the difficulty changes
            this.mSetWordList(tempDifficulty); //set game word list
            this.boolResetWordList = false;
        }
        this.mSetWordToGuess(this.arWordListGame); //set target word to guess from game word list
        this.mUpdateTextContent(guessWord,this.mHideWord(this.strWordToGuess));//Replaces word with "_ _ _ _..."
        this.intRemainingGuesses = this.arDifficultyTries[tempint]; //sets number of max wrong guesses before loosing the game
        this.mUpdateTextContent(infoRemainingGuesses,"("+this.intRemainingGuesses+" remaining)"); //Updates display remaining guesses
        this.mUpdateTextContent(infoDifficulty,this.arDifficulty[tempint]); //Updates display difficulty setting
        this.mUpdateTextContent(infoMessage,"Press any letter to try to guess the word"); //Update display Message   
        infoDifficulty.setAttribute("style","color: "+this.arDifficultyTxtColor[tempint]+";"); //Colors difficulty display text

        console.log("Word list ("+this.arWordListGame.length+" items): "+this.arWordListGame);
        console.log("Word to guess: "+this.strWordToGuess);
    },
    mEvaluateGuess: function(guess){ //Conditions for evaluating the player's guess
        if(this.arAllowedKeys.indexOf(guess) >= 0 && this.strWordToGuess.length > 1){ //Checks wether the player pressed a valid key, and a game has begun, before going forward

            if (this.boolGameinProgress) { //Checks wether a game is in progress to begin evaluating guess
                for(var i = 0; i < this.strWordToGuess.length;i++){ //goes over the word, character by character to compare against the player's guess
                    if(this.strWordToGuess.charAt(i) === guess){ //Correct guess
                        this.mUpdateTextContent(guessWord,this.mUnhideWord(this.strWordToGuess,guess)); //Updates display with guessed characters
                        this.boolIsCorrect = true; //Correct guess flag set to true
                    }
                }

                if(this.boolIsCorrect===false && this.arIncorrectGuesses.indexOf(guess)<0){ //when a NEW incorrect guess was made
                    this.intRemainingGuesses--; //reduce remaining tries
                    this.arIncorrectGuesses.push(guess); //add it to the icorrect guess array
                    this.mUpdateTextContent(infoWrongGuesses,this.mConcatenateArray(this.arIncorrectGuesses,true)); //display incorrect array text
                    this.mUpdateTextContent(infoRemainigGuesses,"("+this.intRemainingGuesses+" remaining)"); //display remaining guesses
                }

                if(this.arWordToGuessDisplay.indexOf("_ ") < 0){ //Game Won conditions. Display Array has no remaining "_" characters (guessed all characters) 
                    this.mRemoveArrayElement(this.arWordListGame,this.strWordToGuess); //Remove guessed word from the temporary game list, to avoid repeating words.
                    this.boolLastGameVictory = true; //For control of winning streak
                    this.mGameWon(); //Game won actions
                }

                if(this.intRemainingGuesses<=0){ //Game lost conditions. No more remaining guesses.
                    this.mGameLost(); //Game lost actions
                }

                this.boolIsCorrect = false; //Set flag back to false for evaluating next guess
            }
        }
    },
    mGameLost: function(){//Actions when a game is lost
        this.intGamesLost++; //Increases games lost counter
        this.intWinningStreak = 0; //Resets winning streak back to 0
        this.boolGameinProgress = false; //Game flow flag set to false (game ended). Won't respond to player key events until new game begins.
        this.mUpdateTextContent(infoMessage,"You lost... Play again? Select difficulty or 'Play again' button"); //Update display message
        this.mUpdateStats(); //Update display info
    },
    mGameWon: function(){//Actions when a game is won
        this.intGamesWon++; //Increases total games won
        this.intWinningStreak++; //Increases winning streak
        var tempMessage = ""; //For use in the display message

        if(//Special conditions after winning [intProgressRamp] consectutive games on "Progress" difficulty
            this.strDifficulty === "Progress" 
            && this.intWinningStreak > 0 
            && this.intWinningStreak%this.intProgressRamp === 0 
            && this.boolProgressCleared === false
        ){
            if(this.intWinningStreak >= this.intProgressRamp*5){//Conditions "Progress" difficulty cleared (all 5 difficulty settings cleared)
                tempMessage = "Congratulations on clearing Progress!!! Continue playing at '"+this.strProgressClearDif+"' difficulty"; //Set "cleared" message
                this.boolResetWordList = true; //set flag to reset current game word list at the start of next game
                this.boolProgressCleared = true;
            }
            else{
                tempMessage = "You won! Progress difficulty increased! Select 'Play Again' button or select difficulty."; //Set "increased difficulty" message
                this.boolResetWordList = true; //set flag to reset current game word list at the start of next game
            }
        }
        else if(this.arWordListGame.length < 1){ //If the current game word list is empty (guessed all words in the difficulty), set "cleared" message and increase difficulty
            var temptxt = this.arDifficulty[//sets next difficulty index, cannot go over "Hard" difficulty
                Math.min(this.arDifficulty.indexOf(this.mDifficultyFix(this.strDifficulty))+1,this.arDifficulty.length-2)
            ]; //Gets difficulty text based on index
            tempMessage = "Congratulations on clearing "+this.strDifficulty+"!!! Continue playing at '"+temptxt+"' difficulty"; //Set "cleared" message
            this.strDifficulty = temptxt; //Updates difficulty setting
            this.boolResetWordList = true; //set flag to reset current game word list at the start of next game
        }
        else tempMessage = "You won! Play again? Select 'Play Again' button or select difficulty."; //Otherwise, set generic victory message

        this.mUpdateTextContent(infoMessage,tempMessage); //Display message
        this.boolGameinProgress = false; //Game flow flag set to false (game ended). Won't respond to player key events until new game begins.
        this.mUpdateStats(); //Update game stats display
    }
}//_______________________________________________________________________________________Game Object END

//___________________________________________Scripts________________________________________________

//Wait for window to completely load before doing anything
window.onload = function(event){
    console.log("Hey there!");
    console.log("Peaking at the console will give you the game word list, the current word to guess, and an event each time a key is pressed");
    console.log("For testing purposes, alter the flow of the game changing the following properties within the WordGuessGame object:");
    console.log("___Game flow variables___\\\\");
    console.log("strPreviousDifficulty: last selected difficulty setting. Used when changing difficulties, to reset word list");
    console.log("------")
    console.log("intProgressRamp: number of consecutive wins in 'Progress' setting before difficulty goes up");
    console.log("------")
    console.log("intGamesWon: number of games won");
    console.log("------")
    console.log("intGamesLost: number of games lost");
    console.log("------")
    console.log("intWinningStreak: number of consecutive games won. Used for 'Progress' setting, also motivates the player");
    console.log("------")
    console.log("intRemainingGuesses: number of remaining tries to guess the target word");
    console.log("------")
    console.log("boolLastGameVictory: boolean for control of winning streak, so player cannot cheat by starting new game when almost loosing.");
    console.log("------")
    console.log("boolResetWordList: boolean for controlling the temporary game list. If 'true' generates a new list on the next game. Otherwise, keeps current list until empty.");
    console.log("------")
    console.log("boolGameinProgress: boolean for controlling game flow. Set to 'true' at the start of a game, 'false' at the end. Funky stuff happens when messed with.");
    console.log("------")
    console.log("boolProgressCleared: boolean that controls wether 'Progress' difficulty setting was cleared.");
    console.log("------")
    console.log("arWordListGame: array with temporary word list. Words in here get added and removed depending on difficulty setting and 'Progress' difficulty winning streak.");
    console.log("___________________//");
    
    //Difficulty setting buttons
    btnProgressDifficulty.onclick = function(){
        //Change color of chosen div border to appear "selected". Remove border from non selected divs
        btnProgressDifficulty.setAttribute("style","border: 2px solid rgb(255, 255, 98);");
        btnEasyDifficulty.setAttribute("style","border: none;");
        btnMediumDifficulty.setAttribute("style","border: none;");
        btnHardDifficulty.setAttribute("style","border: none;");
        WordGuessGame.strDifficulty = "Progress";
        WordGuessGame.mStartGame(WordGuessGame.strDifficulty);
    }

    btnEasyDifficulty.onclick = function(){
        //Change color of chosen div border to appear "selected". Remove border from non selected divs
        btnProgressDifficulty.setAttribute("style","border: none;");
        btnEasyDifficulty.setAttribute("style","border: 2px solid rgb(255, 255, 98);");
        btnMediumDifficulty.setAttribute("style","border: none;");
        btnHardDifficulty.setAttribute("style","border: none;");
        WordGuessGame.strDifficulty = "Easy";
        WordGuessGame.mStartGame(WordGuessGame.strDifficulty);
    }

    btnMediumDifficulty.onclick = function(){
        //Change color of chosen div border to appear "selected". Remove border from non selected divs
        btnProgressDifficulty.setAttribute("style","border: none;");
        btnEasyDifficulty.setAttribute("style","border: none;");
        btnMediumDifficulty.setAttribute("style","border: 2px solid rgb(255, 255, 98);");
        btnHardDifficulty.setAttribute("style","border: none;");
        WordGuessGame.strDifficulty = "Medium";
        WordGuessGame.mStartGame(WordGuessGame.strDifficulty);
    }

    btnHardDifficulty.onclick = function(){
        //Change color of chosen div border to appear "selected". Remove border from non selected divs
        btnProgressDifficulty.setAttribute("style","border: none;");
        btnEasyDifficulty.setAttribute("style","border: none;");
        btnMediumDifficulty.setAttribute("style","border: none;");
        btnHardDifficulty.setAttribute("style","border: 2px solid rgb(255, 255, 98);");
        WordGuessGame.strDifficulty = "Hard";
        WordGuessGame.mStartGame(WordGuessGame.strDifficulty);
    }

    btnPlayAgain.onclick = function(){ //Plays again at current difficulty
        if (WordGuessGame.strDifficulty==="") WordGuessGame.mUpdateTextContent(infoMessage,"Select a difficulty to begin!");
        else WordGuessGame.mStartGame(WordGuessGame.strDifficulty);
    }

    btnResetScore.onclick = function(){
        WordGuessGame.mResetGame();
        WordGuessGame.mUpdateTextContent(infoMessage,"Game score cleared! Select a difficulty to begin");
    }


    //When player presses a key
    document.onkeyup = function(event){
        if (WordGuessGame.strDifficulty==="") WordGuessGame.mUpdateTextContent(infoMessage,"Select a difficulty to begin!")
        console.log("---------------On key up------------------");
        WordGuessGame.mEvaluateGuess(event.key.toUpperCase());
    }
}



