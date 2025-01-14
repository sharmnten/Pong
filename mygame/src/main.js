import kaplay from "kaplay";
import nipplejs from "nipplejs";
// 0. Import Playroom SDK
import { onPlayerJoin, insertCoin, isHost, myPlayer } from "playroomkit";
 
const SPEED = 320;
const PLAYERSIZE = 20;
 
function start() {
  kaplay({background: [0, 0, 0]});
  setGravity(1600);
 
  // 1. Pass Joystick data to Playroom SDK
  const joystick = nipplejs.create();
  joystick.on("plain", (e, data) => {
    myPlayer().setState("dir", data.direction);
  });
  joystick.on("end", () => {
    myPlayer().setState("dir", undefined);
  });
 
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
    const playerColor = player.getProfile().color;
    const playerSprite = add([
      circle(PLAYERSIZE),
      color(playerColor.r, playerColor.g, playerColor.b),
      pos(rand(0, width()), center().y),
      area({ width: PLAYERSIZE, height: PLAYERSIZE }),
      body(),
    ]);
 
    playerSprite.onUpdate(() => {
      // 3. We use host player as the source of truth for player positions
      if (isHost()) {
        const controls = player.getState("dir") || {};
        if (controls.x == "left"||isKeyDown("left")) {
          playerSprite.move(-SPEED, 0);
        }
        if (controls.x == "right"||isKeyDown("right")) {
          playerSprite.move(SPEED, 0);
        }
        if (controls.y == "up" && playerSprite.isGrounded()||isKeyDown("up")&& playerSprite.isGrounded()) {
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
      }
    });
 
    player.onQuit(() => destroy(playerSprite));
  });
}
 
insertCoin().then(start);