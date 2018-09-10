#WORD GUESS GAME
Example code on creating a Word Guess Game with several categories and word lists.

##GENERAL DESCRIPTION
The current example plays a "Word Guess Game" (aka Hangman) with 4 difficulty settings:
* Progress
* Easy
* Medium
* Hard

####Game Rules
The game functions as follows:

1. When the game starts, a list of words or short phrases ("words" from here on) is selected depending on the difficulty setting.
2. A random word is then chosen from the list of words.
3. The word's characters are replaced with "_", spaces in phrases are replaced with "|"; i.e. "HELLO WORLD" becomes " _ _ _ _ _ | _ _ _ _ _ ".
4. The replaced text is displayed on the page.
5. The player must type a letter or number to try to guess the word.
6. If the guess is right, the corresponding charcters are shown; i.e. type "L" and get " _ _ L L _ | _ _ _ L _ ".
7. If the guess is wrong, the number of "tries" is reduced. The number of available tries depends on the difficulty setting.
8. If the player guesses all the characters, it's a win. If the player runs out of tries, it's game lost.

[Try it here](https://pablodubco.github.io/WordGuessGame/)

##IMPLEMENT
The game code is saved as an object with many configurable properties. It can be implemented on your page by copying the game object code **WordGuessGame** from the [game.js file](https://github.com/Pablodubco/WordGuessGame/blob/master/assets/javascript/game.js).

Follow the instructions to get it running on your page as it is.

####Getting started
Create an HTML file that has at least 8 html elements (tags) with 8 different ids. The purpose of each one is to:

1. Display the current game difficulty on your page.
2. Display the number of consecutive wins.
3. Display the total number of games won.
4. Display  the total number of games lost.
5. Display a message to the player when beginning a new game, winning, losing, or clearing a word list for a given difficulty.
6. Display the hidden word or phrase to guess
7. Display the mistakes the player has made (whenever a non matching character is typed).
8. Display how many tries or guesses the player has remaining.

Example:
'''html
    <body>
        <div id="infoDifficulty">Difficulty</div>
        <div id="infoWinningStreak">0</div>
        <div id="infoGamesWon">0</div>
        <div id="infoGamesLost">0</div>
        <div id="infoMessage">Select difficulty to begin!</div>
        <div id="guessWord">_</div>
        <div id="infoWrongGuesses"></div>
        <div id="infoRemainingGuesses"></div>
    </body>
'''

Assign the following variable names to each of the 8 different html elements (tags). Respectively:

1. infoDifficulty
2. infoWinningStreak
3. infoWon
4. infoLost
5. infoMessage
6. guessWord
7. infoWrongGuesses
8. infoRemainigGuesses

NOTE: The variable names **must remain unchanged** from the ones listed here. Otherwise, the game object code must be edited to replace your own variable names.

Example:
'''javascript
    var infoDifficulty = document.getElementById("infoDifficulty");
    var infoWinningStreak = document.getElementById("infoWinningStreak");
    var infoWon = document.getElementById("infoWon");
    var infoLost = document.getElementById("infoLost");
    var infoMessage = document.getElementById("infoMessage");
    var guessWord = document.getElementById("guessWord");
    var infoWrongGuesses = document.getElementById("infoWrongGuesses");
    var infoRemainigGuesses = document.getElementById("infoRemainingGuesses");
'''

Copy the **WordGuessGame** object code inside your script file.

Edit the **arWordListMaster** property of the "WordGuessGame" object with your own desired word lists.

Example:
'''javascript
    arWordListMaster: [ 
        wordListVeryEasy = [
            "CHICKEN","EGG","COW"
        ],
        wordListEasy = [
        ...
'''

Create an event to call on the game method **mStartGame(difficulty)** with the desired difficulty string as an argument. The desired difficulties can be any of the following "Progress", "Easy", "Medium", "Hard".

Example:
'''javascript
    var btnEasyDifficulty = document.getElementById("btnEasyDifficulty");
    btnEasyDifficulty.onclick = function(){
        WordGuessGame.mStartGame("Easy");
    }
´´´

####Additional considerations

The difficulty settings are really just 5 different categories, each with their own word list. These are named inside the **arDifficulty** object property as part of an array. In the code, they are refered to as:

* Very Easy
* Easy
* Medium
* Hard
* Very Hard

By editing the code you can turn them into "theme" categories instead of difficulty settings. i.e:

* Animals
* Vehicles
* Historical Figures, etc...

Example:
'''javascript
    var WordGuessGame = {
    arDifficulty: ["Animals","Vehicles","Historical Figures"],
    ...
'''

######Important! Have as may categories as word lists

The "*Progress*" difficulty setting is a special setting that changes categories every time the character gets a set number of consecutive wins. This number is inside the **intProgressRamp** object property.

Make sure to take a look at the **mSetWordList** method code. As it stands now, it lumps together some difficulties (categories) as follows:

* Easy: lumps together **wordListVeryEasy** and **wordListEasy**.
* Hard: lumps together **wordListHard** and **wordListVeryHard**.

You can edit it so that it only takes the corresponding category list. 
Example:
'''javascript
    mSetWordList: function(difficulty){
        this.arWordListGame = this.arWordListMaster[this.arDifficulty.indexOf(difficulty)];
    }
'''

######Important. Make sure the words in the word lists are all UPPERCASE.

##License

The project is licensed under [GNU GENERAL PUBLIC LICENSE, Version 3, 29 June 2007](http://www.gnu.org/licenses/gpl.html)