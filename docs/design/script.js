/*
// To get the width and height of a div
var elmnt = document.getElementById("myDIV");
var txt = "Height with padding and border: " + elmnt.offsetHeight + "px<br>";
txt += "Width with padding and border: " + elmnt.offsetWidth + "px";
*/

var player = {
    left: 500,
    top: 400,
    width: 150,
    height: 150,
    live: 5
}

var spaceShip = 1;

function drawPlayer(move = "UP") {
    console.log("style='background-image: url('./../Images/SS0" + spaceShip + move + ".png'");
    if (player.live > 0)
        content = "<div class='player' style='background-image: url('./../Images/SS0" + spaceShip + move + ".png'); left:" + player.left + "px; top:" + player.top + "px'></div>";

    document.getElementById("players").innerHTML = content;
}
drawPlayer();


document.onkeydown = function(e) {
    //console.log(e);
    var move = "";

    if (e.keyCode == 37) { // LEFT
        player.left -= 10;
        move = "LF";
    }

    if (e.keyCode == 39) { // RIGHT
        player.left += 10;
        move = "RT";
    }

    if (e.keyCode == 38) { // UP
        player.top -= 10;
        move = "UP";
    }

    if (e.keyCode == 40) { // DOWN
        player.top += 10;
        move = "DN";
    }

    if (e.keyCode == 32) { // SPACE
        //fireMissile();
    }

    drawPlayer(move);
}

function gameLoop() {
    //moveEnemies();
    //drawEnemies();

    //moveMissile();
    //drawMissiles();

    //checkForCollision();

    setTimeout(gameLoop, 50);
}

// Start the game!
gameLoop();
