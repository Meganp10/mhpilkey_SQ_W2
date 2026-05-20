// ============================================================
// Week 2 Example 1: Movement, Gravity, and Collision
// ============================================================

// ------------------------------------------------------------
// THE PLAYER OBJECT
// An object groups related data together in one place.
// Instead of separate variables (playerX, playerY, playerVX...),
// we store everything about the player in one object.
// ------------------------------------------------------------

//sushi image
//sushi image
let sushiBG;
let characterImg; 



let player = {
  x: 200, // horizontal position (centre of blob)
  y: 100, // vertical position (centre of blob)

  vx: 0, // horizontal velocity — how fast we're moving left/right
  vy: 0, // vertical velocity — how fast we're moving up/down

  r: 24, // radius of the blob shape

  // Movement tuning — change these to adjust how the game feels
  speed: 0.5,     // horizontal acceleration per frame
  maxSpeed: 4,    // maximum horizontal speed
  jumpForce: -12, // upward velocity applied when jumping (negative = upward)
  friction: 0.8,  // horizontal slowdown when no key is pressed (0–1, lower = more friction)

  onGround: false, // tracks whether the player is standing on something
};

// ------------------------------------------------------------
// PHYSICS CONSTANTS
// Defined outside the player object so they can be shared
// across multiple objects later (e.g. enemies)
// ------------------------------------------------------------
const GRAVITY = 0.6; // downward force added to vy every frame

// ------------------------------------------------------------
// NOISE BLOB ANIMATION
// We use p5's noise() function to make the blob edges wobble
// organically. blobT increases each frame to animate the wobble.
// ------------------------------------------------------------
let blobT = 0; // time input for noise — increases each frame

// Floor position — where the ground is
let floorY;

function preload() {
  sushiBG = loadImage("assets/images/sushi.webp");
  characterImg = loadImage("assets/images/character.png"); 
}


// ============================================================
// setup()
// Runs once at the very start of the sketch.
// Sets up the canvas and positions the player on the floor.
// ============================================================
function setup() {
  createCanvas(800, 450);
  floorY = height - 40;         // ground sits 40px from the bottom
  player.y = floorY - player.r; // start the player sitting on the floor
}

// ============================================================
// draw()
// Runs repeatedly in a loop after setup() finishes.
// Each frame we clear the background, handle input,
// apply physics, and draw everything.
// ============================================================
function draw() {
image(sushiBG, 0, 0, width, height);

  drawFloor();
  handleInput();
  applyPhysics();
  drawPlayer();
  drawHUD();

  blobT += 0.015; // advance blob wobble animation each frame
}

// ------------------------------------------------------------
// handleInput()
// Checks which keys are held down this frame and updates
// the player's velocity accordingly.
// keyIsDown() returns true as long as the key is held —
// unlike keyPressed(), which only fires once per press.
// We check both arrow keys and WASD so either works.
// ------------------------------------------------------------
function handleInput() {
  // --- Horizontal movement ---
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // LEFT or A
    player.vx -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // RIGHT or D
    player.vx += player.speed;
  }

  // --- Clamp horizontal speed ---
  // constrain(value, min, max) keeps a value within a range.
  // Without this, holding a key forever would accelerate infinitely.
  player.vx = constrain(player.vx, -player.maxSpeed, player.maxSpeed);

  // --- Apply friction when no horizontal key is pressed ---
  // Multiplying by a value less than 1 gradually slows the player down.
  if (
    !keyIsDown(LEFT_ARROW) &&
    !keyIsDown(65) &&
    !keyIsDown(RIGHT_ARROW) &&
    !keyIsDown(68)
  ) {
    player.vx *= player.friction;
  }

  // --- Jump ---
  // The player can only jump when standing on the ground (onGround = true).
  // This prevents jumping again mid-air.
  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && player.onGround) { // UP or W
    player.vy = player.jumpForce;
    player.onGround = false;
  }
}

// ------------------------------------------------------------
// applyPhysics()
// Each frame we:
//   1. Add gravity to vertical velocity (vy)
//   2. Move the player by its velocity (vx, vy)
//   3. Check if it has landed on the floor
// ------------------------------------------------------------
function applyPhysics() {
  // 1. Apply gravity — pulls the player down every frame
  player.vy += GRAVITY;

  // 2. Move player by its current velocity
  player.x += player.vx;
  player.y += player.vy;

  // 3. Floor collision
  // If the bottom of the blob goes below the floor, push it back up.
  if (player.y + player.r >= floorY) {
    player.y = floorY - player.r; // snap to floor
    player.vy = 0;                // stop falling
    player.onGround = true;       // allow jumping again
  } else {
    player.onGround = false;
  }

  // 4. Wall collision — keep player inside canvas
  player.x = constrain(player.x, player.r, width - player.r);
}

// ------------------------------------------------------------
// drawPlayer()
// The blob is drawn as a polygon using noise() to offset
// each vertex slightly, creating an organic wobble effect.
// push() and pop() save and restore drawing settings so
// styles set here don't affect other drawing functions.
// ------------------------------------------------------------
function drawPlayer() {
  imageMode(CENTER);
  image(characterImg, player.x, player.y, player.r * 2, player.r * 2);
}



// ------------------------------------------------------------
// drawFloor()
// A simple rectangle across the bottom of the canvas.
// ------------------------------------------------------------
function drawFloor() {
  fill(40, 120, 110); // dark teal
  noStroke();
  rect(0, floorY, width, height - floorY);
}

// ------------------------------------------------------------
// drawHUD()
// HUD = Heads Up Display.
// Shows controls on screen so the player always knows
// how to interact without needing external instructions.
// ------------------------------------------------------------
function drawHUD() {
  fill(180);
  noStroke();
  textSize(13);
  textAlign(LEFT);
  text("Move: Arrow Keys or WASD   Jump: W or Up Arrow", 16, 24);
}
