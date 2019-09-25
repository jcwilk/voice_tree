var game;
var gameOptions = {
  tileSize: 100,
  tilesWide: 8,
  tilesHigh: 8
}

var gameUtils = {}
gameUtils.getTilePosition = function(col, row) {
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
    // var tilePosition = gameUtils.getTilePosition(0,0);
    // this.add.image(tilePosition.x, tilePosition.y, "tree_tiles", treeSprite.downNub).setOrigin(0,0);
    // this.add.image(tilePosition.x, tilePosition.y, "tree_tiles", treeSprite.leaf).setOrigin(0,0);
    var node = makeNode();
    node.replies.push(makeNode());
    node.replies.push(makeNode());
    growTreeNode(node, 0, -1, this);

  }
}

function makeTreeSprite(col,row,frame,scene) {
  console.log("sprite"+frame+":"+col+","+row);
  var corner = gameUtils.getTilePosition(col,row);
  return scene.add.image(corner.x, corner.y, "tree_tiles", frame).setOrigin(0,0);//.setVisible(false);

}

function makeNode() {
  var obj = {
    flower: null,
    replies: [],
    segments: [],
    nub: null,
    leaf: null,
    sprite: null
  }

  //builds node, flower, and segments leading up to it
  obj.buildNodeSprites = function(col, row, minWidth, frameIndex, scene) {
    if (obj.sprite) obj.sprite.destroy();
    if (obj.flower) obj.flower.destroy();

    console.log("node"+col+","+row);

    for(var i = 0; i < obj.segments.length; i++) obj.segments[i].destroy;
    obj.segments = [];

    var nodeWidth = 0;

    for(var i = 0; i < minWidth-1; i++) {
      obj.segments.push(makeTreeSprite(col + i, row, treeSprite.rightSegment, scene))
      nodeWidth++;
    }

    obj.sprite = makeTreeSprite(col + nodeWidth, row, frameIndex, scene);
    obj.flower = makeTreeSprite(col + nodeWidth, row, treeSprite.flower, scene);
    nodeWidth++;
    return nodeWidth;
  }

  obj.buildNub = function(col, row, frameIndex, scene) {
    if (obj.nub) obj.nub.destroy();
    if (obj.leaf) obj.leaf.destroy();

    console.log("nub"+col+","+row);

    obj.nub = makeTreeSprite(col, row, frameIndex, scene);
    obj.leaf = makeTreeSprite(col, row, treeSprite.leaf, scene);

    return 1;
  }

  return obj
}

// Expands nubs and replies from a given node. node should already be built
// Returns how many columns wide the total growth was, minimum is 1
function growTreeNode(node, rightOffset, depth, scene) {
  if (node.replies.length < 1) {
    return node.buildNub(rightOffset, depth + 1, treeSprite.downNub, scene);
  } else {

    //grow first reply
    var reply = node.replies[0];
    var branchWidth = reply.buildNodeSprites(rightOffset, depth + 1, 1, treeSprite.downIntersection, scene);
    var extraWidth = growTreeNode(reply, rightOffset, depth + 1, scene);

    //loop through replies after the first
    for(var repliesIndex = 1; repliesIndex < node.replies.length; repliesIndex++) {
      reply = node.replies[repliesIndex];

      branchWidth+= reply.buildNodeSprites(rightOffset + branchWidth, depth + 1, extraWidth, treeSprite.rightIntersection, scene);

      extraWidth = growTreeNode(reply, rightOffset + extraWidth, depth + 1, scene);
    }

    branchWidth += node.buildNub(rightOffset + branchWidth, depth + 1, treeSprite.rightNub, scene);

    return branchWidth;
  }
}

window.onload = function() {
  var gameConfig = {
    width: gameOptions.tileSize * gameOptions.tilesWide,
    height: gameOptions.tileSize * gameOptions.tilesHigh,
    scene: [bootGame, playGame]//,
    //backgroundColor: 0x00ffff
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
