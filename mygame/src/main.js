import kaplay from "kaplay";
// 0. Import Playroom SDK
import { onPlayerJoin, insertCoin, isHost, myPlayer, setState } from "playroomkit";
 
const SPEED = 320;
const PLAYERSIZE = 20;
 
function start() {
  kaplay({width:1920/2, height:1080/2,background: [0, 0, 0]});
  setGravity(1600);
 
  // 1. Pass Joystick data to Playroom SDK
onKeyDown("left", () => myPlayer().setState("dir", { x: "left" }));
onKeyDown("right", () => myPlayer().setState("dir", { x: "right" }));
onKeyDown("up", () => myPlayer().setState("dir", { y: "up" }));
onKeyRelease("left", () => myPlayer().setState("dir", { x:null }));
onKeyRelease("right", () => myPlayer().setState("dir", { x: null }));
onKeyRelease("up", () => myPlayer().setState("dir", { y: null }));

  // Platform to hold the player(s)
  add([
    rect(width(), 48),
    color(0, 255, 0),
    pos(0, height() - 48),
    area(),
    body({ isStatic: true }),
  ]);
 
  // 2. When a new player joins, add a circle for them in the color they chose
  onPlayerJoin((player) => {
    myPlayer().setState("alive", true);
    const playerColor = player.getProfile().color;
    //const playerName = player.getProfile().name;
    const playerSprite = add([
      circle(PLAYERSIZE),
      color(playerColor.r, playerColor.g, playerColor.b),
      pos(rand(0, width()), center().y),
      area({width: PLAYERSIZE, height: PLAYERSIZE }),
      body(),
      "player",
    ]);
 
    playerSprite.onUpdate(() => {
      // 3. We use host player as the source of truth for player positions
      if (isHost()) {
        const controls = player.getState("dir") || {};
        if (controls.x == "left") {
          playerSprite.move(-SPEED, 0);
        }
        if (controls.x == "right") {
          playerSprite.move(SPEED, 0);
        }
        if (controls.y == "up" && playerSprite.isGrounded()) {
          playerSprite.jump();
        }


        
 
        // Sync position to other players
        player.setState("pos", {
          x: playerSprite.pos.x,
          y: playerSprite.pos.y,
        });
      }
      // Other players receive position from host and move player on their screen
      else {
        const newPos = player.getState("pos") || { x: 0, y: 0 };
        playerSprite.moveTo(newPos.x, newPos.y);
        const alive = player.getState("alive") || true;
        if(!alive){
          destroy(playerSprite);
        }
      }
    });
   playerSprite.onCollide("player", "player", (e,col) => {
      if(!col?.isBottom()){
        destroy(playerSprite);
        player.setState("alive", false);
      }
      else{
        e.setState("alive", false);
        e.destroy()
      }
    });
 
    player.onQuit(() => destroy(playerSprite));
  });
}
 
insertCoin().then(start);