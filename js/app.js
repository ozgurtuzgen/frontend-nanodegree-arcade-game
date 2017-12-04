'use strict';
// Enemies our player must avoid
var Enemy = function (speed, maxDistance) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    let randomRow = Math.floor((Math.random() * 3));
    this.y = rowHeight + (randomRow * rowHeight);
    let randomX = Math.floor(Math.random() * 500);
    this.x = randomX;
    let randomDistance = Math.floor(Math.random() * 1000);
    if (randomDistance < 600) {
        this.maxDistance = randomDistance + 600;
    } else {
        this.maxDistance = randomDistance;
    }

    let randomSpeed = Math.floor((Math.random() * 40));
    this.speed = randomSpeed + 80;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > this.maxDistance) {
        this.x = -this.maxDistance;
    }
    else {
        this.x = this.x + dt * this.speed;
    }

    this.checkCollisions();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// checks player's and given enemy location whether there is a collision
// Parameter: enemy that will be checked for collision.
Enemy.prototype.checkCollisions = function () {
    let enemyLocation;

    let playerLocation = (player.y / rowHeight * 5) + (player.x / columnWidth);

    if (this.x + columnWidth < 0) {
        //not in board
        enemyLocation = -1;
    }
    else if (this.x > 5 * columnWidth) {
        //not in board
        enemyLocation = -1;
    }
    else if (this.x + columnWidth < columnWidth) {
        // in the first columns
        enemyLocation = Math.floor((this.y / rowHeight * 5));
    }
    else {
        enemyLocation = Math.floor((this.y / rowHeight * 5) + (this.x / columnWidth));
    }

    if (enemyLocation === playerLocation) {
        initiateGame();
    }
};

// Player object
var Player = function () {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    // this.sprite = 'images/char-cat-girl.png';
    this.sprite = 'images/char-boy.png';

    // intial position of the player
    this.x = 202;
    this.y = 415;

    this.score = 0;
};

// Updates player object properties
Player.prototype.update = function () {
};

// Renders the player object on the screen
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// handles keyboard input and updates player's location
Player.prototype.handleInput = function (keyStr) {
    switch (keyStr) {
        case 'left':
            if (this.x >= 100 && this.checkForRock(- 1) === false) {
                this.x = this.x - columnWidth;

                if (this.y / rowHeight < 4) {
                    score++;
                }
            }
            break;
        case 'right':
            if (this.x < 400 && this.checkForRock(1) === false) {
                this.x = this.x + columnWidth;

                if (this.y / rowHeight < 4) {
                    score++;
                }
            }
            break;
        case 'up':
            if (this.y >= 80 && this.checkForRock(- 5) === false) {
                this.y = this.y - rowHeight;

                if (this.y / rowHeight < 4) {
                    score++;
                }
            }

            break;
        case 'down':
            if (this.y < 400 && this.checkForRock(5) === false) {
                if (this.y / rowHeight < 4) {
                    score++;
                }

                this.y = this.y + rowHeight;
            }
            break;
    }
    this.checkForStar();
    $("#score").text(score);

    if (this.y < 80) {
        setTimeout(function () {
            alert("Congrats! \nScore: " + score);
            initiateGame();
        }, 100);
    }
};

Player.prototype.getLocation = function () {
    return (this.y / rowHeight * 5) + (this.x / columnWidth);
};

// checks for the move wheter applicable or not
// parameter: offset that to find the place from the current place
Player.prototype.checkForRock = function (offset) {
    for (let index = 0; index < rocks.length; index++) {
        const element = rocks[index];
        if (element.location === this.getLocation + playersNextLocation) {
            return true;
        }
    }

    return false;
};

// checks for a gem
Player.prototype.checkForStar = function () {
    let location = this.getLocation();
    for (let index = 0; index < stars.length; index++) {
        const element = stars[index];
        if (element.location === location) {
            score = score + 2;
            let row = Math.floor(location / 5);
            let column = location - (row * 5);
            ctx.drawImage(Resources.get('images/stone-block.png'), column * columnWidth, row * rowHeight);
            stars.splice(index, 1);
        }
    }
};

// rock object
var Rock = function () {
    // intial position of the rock
    this.x = -1;
    this.y = -1;

    // the location block that the rock is located
    // default value is -1; means not in the board
    this.location = -1;

    // image of the rock
    this.sprite = 'images/Rock.png';
};

// Renders the rock object on the screen
Rock.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// star object
var Star = function () {
    // the added value of the star
    this.value = 1;

    // intial position of the star
    this.x = -1;
    this.y = -1;

    // the location block that the rock is located
    // default value is -1; means not in the board
    this.location = -1;

    // image of the rock
    this.sprite = 'images/Star.png';
};

// Renders the star object on the screen
Star.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//adds three rocks randomly to the board
function addRocks() {
    for (let index = 0; index < 3; index++) {
        let ranRow = Math.floor(Math.random() * 3);
        let ranColumn = Math.floor(Math.random() * 5);

        var rock = new Rock();
        rock.location = ranRow * 5 + ranColumn;
        rock.x = columnWidth * ranColumn;
        rock.y = rowHeight * ranRow;
        rocks.push(rock);
    }
}

//adds three rocks randomly to the board
function addStars() {
    for (let index = 0; index < 2; index++) {
        let ranRow = Math.floor(Math.random() * 3);
        let ranColumn = Math.floor(Math.random() * 5);

        var star = new Star();
        star.location = ranRow * 5 + ranColumn;
        star.x = columnWidth * ranColumn;
        star.y = rowHeight * ranRow;
        stars.push(star);
    }
}

// initiate the game with the initial values. 
function initiateGame() {
    score = 0;
    $("#score").text(0);

    player = new Player();
    allEnemies = [];
    for (let index = 0; index < 5; index++) {
        var enemyInstance = new Enemy();
        allEnemies.push(enemyInstance);
    }

    rocks = [];
    addRocks();

    stars = [];
    addStars();
}

// changes the image of the player object
function changePlayer(playerType) {
    player.sprite = 'images/' + playerType;
}

// This listens for key presses and sends the keys to 
// Player.handleInput() method. 
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

var rowHeight = 83;
var columnWidth = 101;
var allEnemies = [];
var rocks = [];
var stars = [];
var player;
var score;
this.initiateGame();