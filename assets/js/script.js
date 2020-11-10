// Select cvs 
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

// DOM Elements 
const startScreen = document.getElementById('startscreen');
const gameOverScreen = document.getElementById('endscreen')
const scoreboard = document.getElementById('scoreboard');


// Variables
let frames = 0;
const DEGREE = Math.PI/180;

// Load sounds 
const SCORE_S = new Audio();
SCORE_S.src = 'assets/audio/sfx_point.wav';

const FLAP = new Audio();
FLAP.src = 'assets/audio/sfx_flap.wav';

const HIT = new Audio();
HIT.src = 'assets/audio/sfx_hit.wav';

const DIE = new Audio();
DIE.src = 'assets/audio/sfx_die.wav';

// Load images
const sprite = new Image();
sprite.src = "assets/images/sprite.png";

const tap = new Image();
tap.src = "assets/images/tap.png";

// Game state 
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

// restart button 
const restartBtn = {
    x : 120,
    y : 163,
    w : 83,
    h : 29
}

// Start of game || startscreen 
document.getElementById('play-button').onclick = function() {
    removeStartscreen()
}

function removeStartscreen() {
    startScreen.remove();
}

// Control the game by clicking 
cvs.addEventListener('click', function(evt) {
    switch(state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            FLAP.play();
            break;
        case state.over:

        
    }
});

// Function play button by game over screen 
document.getElementById('play-button-go').onclick = function() {
    playagain()
}

function playagain() {
    console.log('play again')
    endscreen.remove();
    bird.speedReset();
    pipes.reset();
    score.reset();
    gameOver.reset();
    state.current = state.getReady;
}

// Background buildings 
const bg = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,
    
    draw : function(){     // position of the image
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w + this.w, this.y, this.w, this.h);
    }
}

// Foreground 
const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,

    dx : 2,
    
    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w + this.w, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w + this.w + this.w, this.y, this.w, this.h);
    }, 
    
    update : function() {   
        if(state.current == state.game) {
            this.x = (this.x - this.dx)%(this.w/2);     // Moving FG to the left 
        }
    }
}

// Bird 
const bird = {
    animation : [
        {sX: 277, sY : 114},
        {sX: 277, sY : 139},
        {sX: 277, sY : 164},
        {sX: 277, sY : 139}
    ],
    x : 180,
    y : 280,
    w : 34,
    h : 26,

    radius : 12,

    frame : 0, // Startframe of the bird

    gravity : 0.25,     // The gravity of the bird, how fast the bird goes down
    jump : 5,           // How high the bird jumps
    speed: 0,           // speed by start begins at 0 with the bird
    rotation : 0,      

    draw : function() {
        let bird = this.animation[this.frame]

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);
        ctx.restore();
    },

    flap : function() {
        this.speed = - this.jump;  // the bird jumps
    },

    update : function() { 
        // If the game state is in state game, the bird flaps 
        this.period = state.current == state.game ? 10 : 0;
        // we increment the frame by 1, each period (the frames goes after each other)
        this.frame += frames%this.period == 0 ? 1 : 0;
        // Frame goes from 0 to 4, then again to 0
        this.frame = this.frame%this.animation.length;

        if(state.current == state.getReady){    // The bird falls 
             this.y = 300;                      // Reset position of the bird after game over
        }else {                                 // When the bird falls to the ground the bird goes faster and with his face down
            this.speed += this.gravity; 
            this.y += this.speed;
            this.rotation = 0 * DEGREE;

            if(this.y + this.h/2 >= cvs.height - fg.h) { // if the birds hit the ground
                this.y = cvs.height - fg.h - this.h/2;
                if (state.current == state.game){
                    state.current = state.over;
                    DIE.play();
                }
            }

            // If the speed is greater than the jump means the bird is falling down 
            if(this.speed >= this.jump) {
                this.rotation = 90 * DEGREE;
                this.frame = 1;                // stops flying with wings 
            }else {
                this.rotation = -25 * DEGREE;
            }
        }
    },
    speedReset : function(){
        this.speed = 0;
        this.rotation = 0;
    }
}

// Get ready message
const getReady = { 
   sX : 20,
   sY : 10,
    w: 631,
    h: 335,
    x: 100,
    y: 160, 

    draw : function() {
        if(state.current == state.getReady) {
            ctx.drawImage(tap, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        };
    }
};


// Game over screen 
const gameOver = { 
    update : function(){
        if(state.current == state.over) {
            console.log('game over')
            showGameOverScreen(endscreen)
        }
    },
    reset : function() {
        state.current = state.getReady
    }
}

// function for game over screen
function showGameOverScreen(endscreen){
    endscreen.style.visibility="visible"
}

// Pipes 
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
    gap : 100,      // the size of the gap 
    maxYPos : -150,
    dx : 5,         // the distance and speed between the pipes afstand

    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            
            // Top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
            
            // Bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);  
        }
    },

   update: function(){
        if(state.current !== state.game) return;
        
        if(frames%100 == 0){ 
            this.position.push({
                x : cvs.width,
                y : this.maxYPos * ( Math.random() + 1)  // Random gaps shown in game
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];

            let bottomPipeYPos = p.y + this.h + this.gap;

            // Collision detection | When bird hits a pipe
            // Top pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over;
                HIT.play();
            }
            // Bottom pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                HIT.play();
            }

            // Move the pipe to the left 
            p.x -= this.dx;

            // If the pipe goes beyond the canvas, they will get deleted
            if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1;       // If the pipes goed beyond the pipe, the score is +1
                SCORE_S.play();

                score.best = Math.max(score.value, score.best);
                localStorage.setItem('best', score.best);
            }
        }
    },
    reset : function() {
        this.position = [];
    }
}

// Score 
const score = {
    best : parseInt(localStorage.getItem('best')) || 0,
    value : 0,

    draw : function (){
        ctx.fillStyle = "#e0960a";
        ctx.strokeStyle = "#fff";

        if(state.current == state.game){    // Score in the game
            ctx.lineWidth = 2;
            ctx.font = '70px play';
            ctx.fillText(this.value, cvs.width/2, 80);
            ctx.strokeText(this.value, cvs.width/2, 80);
        }else if(state.current == state.over){      // Score if game over
            // Score value
            ctx.font = '35px play';
            ctx.fillText(this.value, 453, 190);
            ctx.strokeText(this.value, 453, 190);
            // Best score
            ctx.fillText(this.best, 453, 230);
            ctx.strokeText(this.best, 453, 230);
        }
    },
    reset : function() {
        this.value = 0;
    }
}


// Draw elements to canvas 
function draw(){
    ctx.fillStyle = "#3B6CB5";                  // Background color 
    ctx.fillRect(0, 0, cvs.width, cvs.height);  // covering the canvas
    
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    score.draw();
    
}

// UPDATE
function update(){
    bird.update();
    fg.update();
    pipes.update();
    gameOver.update();
    
}

// LOOP
function loop(){
    update();
    draw();
    frames++;
    
    requestAnimationFrame(loop);
}
loop();