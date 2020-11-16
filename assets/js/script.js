// Select cvs 
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

// DOM Elements | Getting elements by id for variables in js.
const scoreboard = document.getElementById('scoreboard');
const bestScore = document.getElementById('bestscoreboard');
const startscreen = document.getElementById('startscreen');
const endscreen = document.getElementById('endscreen');

// Variables of game
let frames = 0;
const DEGREE = Math.PI/180;
let sound = true;

// Load sounds effects
// Audio files are from https://github.com/CodeExplainedRepo/Original-Flappy-bird-JavaScript/tree/master/audio
const scoreSound = new Audio("assets/audio/sfx_point.wav");
const wings = new Audio("assets/audio/sfx_flap.wav");
const hitPipe = new Audio("assets/audio/sfx_hit.wav");
const dead = new Audio("assets/audio/sfx_die.wav");

// Load images
// Image file of sprite is from https://github.com/CodeExplainedRepo/Original-Flappy-bird-JavaScript/tree/master/img
// The original pipes and the ground from the sprite image are edited by the developer to another colour. 
const sprite = new Image();
sprite.src = "assets/images/sprite.png";

const tapToBegin = new Image();
tapToBegin.src = "assets/images/tap.png";

// Game states
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
};

// What happends in each state of the game. 
cvs.addEventListener('click', function(evt) {
    switch(state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            wings.play();
            break;
        case state.over:
            state.current = state.getReady;
    }
});

// Startscreen | If play button is presses, startscreen is hidden.
document.getElementById('play-button').onclick = function() {
    startscreen.style.visibility="hidden";
};

// Endscreen | If home button is presses, back to startscreen and reset game.
document.getElementById('home-button-go').onclick = function() {
    startscreen.style.visibility="visible";
    playagain();
};

// Endscreen | when play button is clicked, the game is reset.
document.getElementById('play-button-go').onclick = function() {
    playagain();
};

// Restarts the game. 
function playagain() {
    endscreen.style.visibility="hidden";
    bird.speedReset();
    pipes.reset();
    score.reset();
    state.current = state.getReady;
}

// Turn the sound off or on.
document.getElementById('sound-button').onclick = function() {
   playStopSound();
};
document.getElementById('sound-button-go').onclick = function() {
    playStopSound();
};

// Sound button is pressed, volume is 0ff (0) or on (1).
function playStopSound() {
    if(sound == true){ 
        sound = false;              
        scoreSound.volume = 0;
        wings.volume = 0;
        hitPipe.volume = 0;
        dead.volume = 0;
        document.getElementById('sound-button').innerHTML="&#xf6a9";
        document.getElementById('sound-button-go').innerHTML="&#xf6a9";
    }else{
        sound = true;               
        scoreSound.volume = 1;
        wings.volume = 1;
        hitPipe.volume = 1;
        dead.volume = 1;
        document.getElementById('sound-button').innerHTML='&#xf028';
        document.getElementById('sound-button-go').innerHTML='&#xf028';
    }
}
document.getElementById('sound-button').innerHTML='&#xf028';
document.getElementById('sound-button-go').innerHTML='&#xf028';

// Position of the background in canvas.
const bg = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,
    
    // With bg.draw in draw function, the image is draw.
    draw : function(){     
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w + this.w, this.y, this.w, this.h);
    }
};

// Position of the forground in canvas.
const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,

    dx : 2,
    
    // With fg.draw in draw function, the image is draw.
    draw : function(){ 
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w + this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w + this.w + this.w, this.y, this.w, this.h);
    }, 
    
    // With fg.update in update function, the forground is moving to the left.
    update : function() {    
        if(state.current == state.game) {
            this.x = (this.x - this.dx)%(this.w/2);     
        }
    }
};

// Position of the bird in canvas.
const bird = {
    animation : [
        {sX: 277, sY : 114},
        {sX: 277, sY : 139},
        {sX: 277, sY : 164},
        {sX: 277, sY : 139}
    ],
    x : 210,
    y : 280,
    w : 34,
    h : 26,

    radius : 12,

    frame : 0, // Startframe of the bird.

    gravity : 0.25,     // How fast the bird goes down.
    jump : 5,           // How high the bird jumps.
    speed: 0,           // Speed by start begins at 0 with the bird.
    rotation : 0,       // Rotation by starts begins at 0 with the bird.    

    // With bird.draw in draw function, the image is draw.
    draw : function() { 
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);
        ctx.restore();
    },

    // The jumping of the bird with bird.jump()
    flap : function() {
        this.speed = - this.jump;  
    },

      // With bird.update in update function, the bird rotates, falls down and flaps.
    update : function() { 
        // If the game state is in state game, the bird flaps.
        this.period = state.current == state.game ? 10 : 0;
        // We increment the frame by 1, each period (the frames goes after each other).
        this.frame += frames%this.period == 0 ? 1 : 0;
        // Frame goes from 0 to 4, then again to 0.
        this.frame = this.frame%this.animation.length;

        if(state.current == state.getReady){    
             this.y = 300;                      // Reset position of the bird after game over.
        }else {                                 // When the bird falls to the ground the bird goes faster and with his face down.
            this.speed += this.gravity; 
            this.y += this.speed;
            this.rotation = 0 * DEGREE;

            if(this.y + this.h/2 >= cvs.height - fg.h) { // If the birds hit the ground, the bird rotates 90 degrees.
                this.y = cvs.height - fg.h - this.h/2;
                if (state.current == state.game){
                    state.current = state.over;
                    dead.play();
                }
            }

            // If the speed is greater than the jump means the bird is falling down.
            if(this.speed >= this.jump) {
                this.rotation = 90 * DEGREE;
                this.frame = 1;                // Bird stops flying with wings. 
            }else {
                this.rotation = -25 * DEGREE;
            }
        }
    },
    // When bird.speedReset is called, the rotation and speed starts at zero.
    speedReset : function(){
        this.speed = 0;
        this.rotation = 0;
    }
};

// Position of the get ready message in canvas.
const getReady = { 
   sX : 20,
   sY : 10,
    w: 631,
    h: 335,
    x: 120,
    y: 160, 

    // With getReady.draw in draw function, the image is draw.
    draw : function() {
        if(state.current == state.getReady) {
            ctx.drawImage(tapToBegin, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
};

// Position of the game over message in canvas.
const gameOver = { 
    update : function(){
       if(state.current == state.over) {
           showGameOverScreen(endscreen); 
       }  
    },
};

// Endscreen pops up when the bird is dead.
function showGameOverScreen(endscreen){
    endscreen.style.visibility="visible";
}

// Position of the pipes message in canvas.
const pipes = {
    position : [],

    top : {
        sX : 553,
        sY : 0
    },

    bottom : {
        sX : 502,
        sY : 0,
    },

    w : 53, 
    h : 400, 
    gap : 100,      
    maxYPos : -150,
    dx : 5,         // The distance and speed between the pipes.

    // with pipes.draw in draw function, the image is draw.
    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            
            // Top pipe is called for draw.
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
            
            // Bottom pipe is called for draw.
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);  
        }
    },

    // with pipes.update in update function, the pipes show up with different gaps and if bird hits the pipes the bird is dead.
   update: function(){
        if(state.current !== state.game) return;
        
        if(frames%100 == 0){ 
            this.position.push({
                x : cvs.width,
                y : this.maxYPos * ( Math.random() + 1)  // Random gaps shown in game.
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];

            let bottomPipeYPos = p.y + this.h + this.gap;

            // Collision detection for top pipe | When bird hits a top pipe.
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over;
                hitPipe.play();
            }
            // Collision detection for bottom pipe | When bird hits a bottom pipe.
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                hitPipe.play();
            }

            p.x -= this.dx;     // Moves the pipes to the left. 

            // If the pipe goes beyond the canvas, they will be deleted.
            if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1;       // If the pipes goed beyond the pipe, the score is +1.
                scoreSound.play();

                // The best score is set, and saved in local storage.
                score.best = Math.max(score.value, score.best);     
                localStorage.setItem('best', score.best);           
            }
        }
    },
    // when pipes.reset is called, the pipes start at zero.
    reset : function() {
        this.position = [];
    }
};

// Setting the score.
const score = {
    best : parseInt(localStorage.getItem('best')) || 0,
    value : 0,

    // With score.draw in draw function, the image is draw.
    draw : function (){
        ctx.fillStyle = "#e0960a";
        ctx.strokeStyle = "#fff";

        if(state.current == state.game){                // Score in the game.
            ctx.lineWidth = 2;
            ctx.font = '70px play';
            ctx.fillText(this.value, cvs.width/2, 80);
            ctx.strokeText(this.value, cvs.width/2, 80);
        }else if(state.current == state.over){           // Score in the game in game over state.
            // Score value
            drawScoreboard();
            drawBestScoreboard();
        }
    },
    // when score.reset is called, the current score starts at zero.
    reset : function() {
        this.value = 0;
    }
};

// Draw current and best scores on scoreboard.
function drawScoreboard() {
    scoreboard.innerHTML = score.value;
}

function drawBestScoreboard() {
    bestScore.innerHTML = score.best;
}

// Every element with draw : function() is called in this function to handle all the drawings of the element to the canvas.
function draw(){
    ctx.fillStyle = "#3B6CB5";                  // Background color
    ctx.fillRect(0, 0, cvs.width, cvs.height);  // Covering the whole canvas
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    score.draw();
}

// Every element with update : function() is called in this function to update the elements.
function update(){
    bird.update();
    fg.update();
    pipes.update();
    gameOver.update();
    
}

// The loop function to update the game every second and calls the draw and update function.
function loop(){        
    update();
    draw();
    frames++;           // Each time the loop function is called, the frames incremates with 1 | Keep track of how many frames are draw to the canvas.
    requestAnimationFrame(loop);    // Takes a callback function (which is the loop function) and helps by performance of the animations.
}
loop();