// Select cvs 
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

// Variables
let frames = 0;
const DEGREE = Math.PI/180;

// Load template image
const sprite = new Image();
sprite.src = "img/sprite.png";

// Game state 
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

// Control the game 
cvs.addEventListener('click', function(evt) {
    switch(state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
                bird.flap();
                break;
        case state.over:
                state.current = state.getReady;
                break;
    }

});

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
    
    update : function() {   // moving FG to the left 
        if(state.current == state.game) {
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

// Bird 
const bird = {
    animation : [
        {sX: 276, sY : 112},
        {sX: 276, sY : 139},
        {sX: 276, sY : 164},
        {sX: 276, sY : 139}
    ],
    x : 200,
    y : 200,
    w : 34,
    h : 26,

    frame : 0,

    gravity : 0.25,  // speed of bird
    jump : 5,
    speed: 0, 
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
        // If the game state is get ready state, the bird flaps slowly
        this.period = state.current == state.getReady ? 10 : 5;
        // we increment the frame by 1, each period 
        this.frame += frames%this.period == 0 ? 1 : 0;
        // Frame goes from 0 to 4, then again to 0
        this.frame = this.frame%this.animation.length;

        if(state.current == state.getReady){ // the bird falls 
             this.y = 150; //Reset position of the bird after game over

        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            this.rotation = 0 * DEGREE;

            if(this.y + this.h/2 >= cvs.height - fg.h) { // if the birds hit the ground
                this.y = cvs.height - fg.h - this.h/2;
                if (state.current == state.game){
                    state.current = state.over;
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
    }
}

// Get ready message
const getReady = { // Change in own image
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: cvs.width/2 - 173/2,
    y: 160, 

    draw : function() {
        if(state.current == state.getReady) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

// Game over screen 
const gameOver = { // change to own design
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : 90,
    
    draw : function(){  
        if(state.current == state.over) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        } 
    }
}

// Draw elements to canvas 
function draw(){
    ctx.fillStyle = "#3B6CB5";                  // Background color 
    ctx.fillRect(0, 0, cvs.width, cvs.height);  // covering the canvas
    
    bg.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
}

// UPDATE
function update(){
    bird.update();
    fg.update();
    
}

// LOOP
function loop(){
    update();
    draw();
    frames++;
    
    requestAnimationFrame(loop);
}
loop();