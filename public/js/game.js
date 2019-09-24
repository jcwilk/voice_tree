var game;
var gameOptions = {
  tileSize: 100,
  tilesWide: 8,
  tilesHigh: 8
}

var gameUtils = {}
gameUtils.getTilePosition = function(row, col) {
  var posX = gameOptions.tileSize * col;
  var posY = gameOptions.tileSize * row;
  return new Phaser.Geom.Point(posX, posY);
}

var treeSprite = {
  downNub: 4,
  rightNub: 8,
  downSegment: 3,
  rightSegment: 0,
  downIntersection: 6,
  rightIntersection: 7,
  elbow: 5,
  flower: 1,
  leaf: 2
}

class bootGame extends Phaser.Scene {
  constructor() {
    super("BootGame");
  }

  preload() {
    this.load.spritesheet("tree_tiles", "images/vines.png", {
      frameWidth: gameOptions.tileSize,
      frameHeight: gameOptions.tileSize
    })
  }

  create() {
    console.log("game is booting...");
    this.scene.start("PlayGame");
  }
}

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  create() {
    var tilePosition = gameUtils.getTilePosition(0,0);
    this.add.image(tilePosition.x, tilePosition.y, "tree_tiles", treeSprite.downNub).setOrigin(0,0);
    this.add.image(tilePosition.x, tilePosition.y, "tree_tiles", treeSprite.leaf).setOrigin(0,0);
  }
}

window.onload = function() {
  var gameConfig = {
    width: gameOptions.tileSize * gameOptions.tilesWide,
    height: gameOptions.tileSize * gameOptions.tilesHigh,
    scene: [bootGame, playGame]
  }
  game = new Phaser.Game(gameConfig);
  window.focus()
  resizeGame();
  window.addEventListener("resize",resizeGame);
}

function resizeGame() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    } else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
