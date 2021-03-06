'use strict';

var GameEntity = function (sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
};

GameEntity.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function (speed, maxDistance) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    let randomRow = Math.floor((Math.random() * 3));
    let randomY = rowHeight + (randomRow * rowHeight);
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
    GameEntity.call(this,'images/enemy-bug.png', randomX, randomY);
};

Enemy.prototype = Object.create(GameEntity.prototype);
Enemy.prototype.constructor = Enemy;

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

    this.score = 0;

    GameEntity.call(this, 'images/char-boy.png', 202 , 415);
};

Player.prototype = Object.create(GameEntity.prototype);
Player.prototype.constructor = Player;

// Updates player object properties
Player.prototype.update = function () {
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
        if (element.location === this.getLocation() + offset) {
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
            score = score + element.value;
            let row = Math.floor(location / 5);
            let column = location - (row * 5);
            ctx.drawImage(Resources.get('images/stone-block.png'), column * columnWidth, row * rowHeight);
            stars.splice(index, 1);
        }
    }
};

// rock object
var Rock = function () {
    // the location block that the rock is located
    // default value is -1; means not in the board
    this.location = -1;

    GameEntity.call(this,'images/Rock.png',-1,-1 );
};

Rock.prototype = Object.create(GameEntity.prototype);
Rock.prototype.constructor = Rock;

// star object
var Star = function () {
    // the added value of the star
    this.value = 2;

    // the location block that the rock is located
    // default value is -1; means not in the board
    this.location = -1;

    GameEntity.call(this,'images/Star.png',-1,-1 );
};

Star.prototype = Object.create(GameEntity.prototype);
Star.prototype.constructor = Star;

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