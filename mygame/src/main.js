import kaplay, { Rect } from "kaplay";
// 0. Import Playroom SDK
import { onPlayerJoin, insertCoin, isHost, myPlayer } from "playroomkit";

 
function start() {
  // @ts-check
loadSprite("bean", "../public/sprites/bean.png")

kaplay({
  background: [255, 255, 128],
});
//create two players
const player1 = add([
  //Rect(32, 32),
  sprite("bean"),
  pos(50, 50),
  body(),
  area(),
  color(1, 0, 0),
  "player1",
])
const player2 = add([
  //Rect(32, 32),
  sprite("bean"),
  pos(100, 100),
  body(),
  color(0, 1, 0),
  area(),
  "player2",
])
//create ground
add([
  Rect(width(), 32),
  pos(0, height() - 32),
  color(1, 1, 1),
  solid(),
  area(),
])

//controls of host
if (isHost()) {
  keyDown("left", () => {
    player1.move(-100, 0)
  })
  keyDown("right", () => {
    player1.move(100, 0)
  })
  keyDown("up", () => {
    if (player1.grounded()) {
      player1.jump(300)
    }
  })
}
}
start();