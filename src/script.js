const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const birdImg = new Image();
birdImg.src = "assets/danfe.png";

// birdImg.onload = function() {
//     alert(this.width + 'x' + this.height);
//   }

const pipeTopImg = new Image();
pipeTopImg.src = 'assets/dhar.png';
const pipeBottomImg = new Image();
pipeBottomImg.src = 'assets/dhar.png';

// Game state
const gameState = {
    bird: {
        x: 50,
        y: 300,
        velocity: 0,
        gravity: 0.5,
        jump: -8,
        size: 45,
        collisionBox: {
            width: 20,  // Smaller than visual size
            height: 15,
            xOffset: 5, // Center horizontally
            yOffset: 8  // Center vertically
        }    
    },
    pipes: [],
    score: 0,
    pipeGap: 150,
    pipeWidth: 28,
    pipeSpacing: 200,
    gameOver: false
};

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        gameState.bird.velocity = gameState.bird.jump;
    }
});

canvas.addEventListener('click', () => {
    gameState.bird.velocity = gameState.bird.jump;
});

function createPipe() {
    const gapPosition = Math.random() * (canvas.height - gameState.pipeGap - 100) + 50;
    return {
        x: canvas.width,
        topHeight: gapPosition,
        bottomY: gapPosition + gameState.pipeGap,
        passed: false
    };
}

function update() {
    if (gameState.gameOver) return;

    // Update bird
    gameState.bird.velocity += gameState.bird.gravity;
    gameState.bird.y += gameState.bird.velocity;

    // Update pipes
    if (gameState.pipes.length === 0 || 
        gameState.pipes[gameState.pipes.length - 1].x < canvas.width - gameState.pipeSpacing) {
        gameState.pipes.push(createPipe());
    }

    gameState.pipes.forEach(pipe => {
        pipe.x -= 2;

        // Score counting
        if (!pipe.passed && pipe.x + gameState.pipeWidth < gameState.bird.x) {
            gameState.score++;
            scoreElement.textContent = `Score: ${gameState.score}`;
             // Trigger flash animation
            scoreElement.classList.add('score-flash');
            scoreElement.addEventListener('animationend', () => {
                scoreElement.classList.remove('score-flash');
            }, { once: true });
            pipe.passed = true;
        }

        // Collision detection
        // const birdRect = {
        //     x: gameState.bird.x,
        //     y: gameState.bird.y,
        //     width: gameState.bird.size,
        //     height: gameState.bird.size
        // };

        const birdRect = {
            x: gameState.bird.x + gameState.bird.collisionBox.xOffset,
            y: gameState.bird.y + gameState.bird.collisionBox.yOffset,
            width: gameState.bird.collisionBox.width,
            height: gameState.bird.collisionBox.height
        };

        const topPipeRect = {
            x: pipe.x,
            y: 0,
            width: gameState.pipeWidth,
            height: pipe.topHeight
        };

        const bottomPipeRect = {
            x: pipe.x,
            y: pipe.bottomY,
            width: gameState.pipeWidth,
            height: canvas.height - pipe.bottomY
        };

        if (checkCollision(birdRect, topPipeRect) || 
            checkCollision(birdRect, bottomPipeRect) ||
            gameState.bird.y < 0 || 
            gameState.bird.y + gameState.bird.size > canvas.height) {
            gameState.gameOver = true;
        }
    });

    // Remove off-screen pipes
    gameState.pipes = gameState.pipes.filter(pipe => pipe.x > -gameState.pipeWidth);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}




function draw() {
    // Clear canvas
    // ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'red';
// Bird
// ctx.strokeRect(
//     gameState.bird.x,
//     gameState.bird.y,
//     gameState.bird.size,
//     gameState.bird.size
// );
// // Pipes
// gameState.pipes.forEach(pipe => {
//     // Top pipe
//     ctx.strokeRect(pipe.x, 0, gameState.pipeWidth, pipe.topHeight);
//     // Bottom pipe
//     ctx.strokeRect(pipe.x, pipe.bottomY, gameState.pipeWidth, canvas.height - pipe.bottomY);
// });


    // Draw bird
    // ctx.fillStyle = '#FFD700';
    if (birdImg.complete) {
        ctx.drawImage(
            birdImg,
            gameState.bird.x - gameState.bird.size/2, // Center X
            gameState.bird.y - gameState.bird.size/2, // Center Y
            gameState.bird.size,
            gameState.bird.size

        );
    }
    // } else {
    //     // Fallback rectangle if image not loaded
    //     ctx.fillStyle = '#FFD700';
    //     ctx.fillRect(gameState.bird.x, gameState.bird.y, 
    //                 gameState.bird.size, gameState.bird.size);
    // }


    // ctx.fillRect(gameState.bird.x, gameState.bird.y, gameState.bird.size, gameState.bird.size);

    // Draw pipes
    // ctx.fillStyle = '#228B22';
    // // const pattern = ctx.createPattern(img, "no-repeat");
    // // ctx.fillStyle = pattern;
    // gameState.pipes.forEach(pipe => {
    //     // Top pipe
    //     ctx.fillRect(pipe.x, 0, gameState.pipeWidth, pipe.topHeight);
    //     // Bottom pipe
    //     ctx.fillRect(pipe.x, pipe.bottomY, gameState.pipeWidth, canvas.height - pipe.bottomY);
    // });

     // Draw pipes
     gameState.pipes.forEach(pipe => {
        // Top pipe (flipped vertically)
        if (pipeTopImg.complete) {
            ctx.save();
            ctx.scale(1, -1); // Flip vertically
            ctx.drawImage(
                pipeTopImg,
                pipe.x,
                -pipe.topHeight, // Negative because of flip
                gameState.pipeWidth,
                pipe.topHeight
            );
            ctx.restore();
        } else {
            ctx.fillStyle = '#228B22';
            ctx.fillRect(pipe.x, 0, gameState.pipeWidth, pipe.topHeight);
        }

        // Bottom pipe
        if (pipeBottomImg.complete) {
            ctx.drawImage(
                pipeBottomImg,
                pipe.x,
                pipe.bottomY,
                gameState.pipeWidth,
                canvas.height - pipe.bottomY
            );
        } else {
            ctx.fillStyle = '#228B22';
            ctx.fillRect(pipe.x, pipe.bottomY, gameState.pipeWidth, canvas.height - pipe.bottomY);
        }
    });

    // Draw game over screen
    if (gameState.gameOver) {
        ctx.fillStyle = 'Cyan';
        ctx.font = '20px Arial';
        ctx.shadowColor = "black";
        ctx.shadowBlur = 10;
        ctx.fillText('Game Over! Click to restart', 50, canvas.height/2);
    }
}

function gameLoop() {
    update();
    draw();
    if (!gameState.gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        // Handle restart
        canvas.addEventListener('click', () => {
            gameState.bird.y = 300;
            gameState.bird.velocity = 0;
            gameState.pipes = [];
            gameState.score = 0;
            gameState.gameOver = false;
            scoreElement.textContent = 'Score: 0';
            gameLoop();
        }, { once: true });
    }
}

// Start the game
gameLoop();