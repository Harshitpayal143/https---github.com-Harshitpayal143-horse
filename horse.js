document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameArea = document.getElementById('game-area');
    const horse = document.getElementById('horse');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const finalScoreDisplay = document.getElementById('final-score');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const jumpBtn = document.getElementById('jump-btn');
    
    // Game variables
    let score = 0;
    let highScore = localStorage.getItem('rainbowHorseHighScore') || 0;
    let gameSpeed = 5;
    let isGameRunning = false;
    let isJumping = false;
    let gameLoop;
    let obstacleInterval;
    let cloudInterval;
    
    // Set high score display
    highScoreDisplay.textContent = highScore;
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    jumpBtn.addEventListener('click', jump);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            jump();
        }
    });
    
    // Create background clouds
    function createClouds() {
        cloudInterval = setInterval(() => {
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            
            // Random cloud properties
            const size = Math.random() * 50 + 30;
            const left = Math.random() * 400;
            const top = Math.random() * 200 + 20;
            const opacity = Math.random() * 0.5 + 0.3;
            
            cloud.style.width = `${size}px`;
            cloud.style.height = `${size * 0.6}px`;
            cloud.style.left = `${left}px`;
            cloud.style.top = `${top}px`;
            cloud.style.opacity = opacity;
            
            gameArea.appendChild(cloud);
            
            // Animate cloud
            let cloudPos = left;
            const cloudMove = setInterval(() => {
                cloudPos -= 0.5;
                cloud.style.left = `${cloudPos}px`;
                
                if (cloudPos < -size) {
                    clearInterval(cloudMove);
                    cloud.remove();
                }
            }, 50);
        }, 3000);
    }
    
    // Jump function
    function jump() {
        if (!isJumping && isGameRunning) {
            isJumping = true;
            horse.classList.add('jumping');
            
            setTimeout(() => {
                horse.classList.remove('jumping');
                isJumping = false;
            }, 800);
        }
    }
    
    // Create obstacles
    function createObstacle() {
        if (!isGameRunning) return;
        
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = '400px';
        obstacle.style.height = `${Math.random() * 100 + 30}px`;
        gameArea.appendChild(obstacle);
        
        // Move obstacle
        let obstaclePos = 400;
        const obstacleMove = setInterval(() => {
            if (!isGameRunning) {
                clearInterval(obstacleMove);
                return;
            }
            
            obstaclePos -= gameSpeed;
            obstacle.style.left = `${obstaclePos}px`;
            
            // Check for collision
            if (
                obstaclePos < 130 && 
                obstaclePos > 50 && 
                !isJumping && 
                parseInt(obstacle.style.height) > 50
            ) {
                gameOver();
            }
            
            // Remove obstacle when off screen
            if (obstaclePos < -30) {
                clearInterval(obstacleMove);
                obstacle.remove();
                increaseScore();
            }
        }, 20);
    }
    
    // Increase score
    function increaseScore() {
        score++;
        scoreDisplay.textContent = score;
        
        // Increase difficulty every 5 points
        if (score % 5 === 0) {
            gameSpeed += 0.5;
        }
    }
    
    // Game over
    function gameOver() {
        isGameRunning = false;
        clearInterval(gameLoop);
        clearInterval(obstacleInterval);
        clearInterval(cloudInterval);
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('rainbowHorseHighScore', highScore);
            highScoreDisplay.textContent = highScore;
        }
        
        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = 'flex';
    }
    
    // Start game
    function startGame() {
        // Reset game state
        isGameRunning = true;
        score = 0;
        gameSpeed = 5;
        scoreDisplay.textContent = score;
        
        // Clear screens
        startScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        
        // Clear existing obstacles and clouds
        document.querySelectorAll('.obstacle, .cloud').forEach(el => el.remove());
        
        // Start game loops
        createClouds();
        obstacleInterval = setInterval(createObstacle, 1500);
    }
    
    // Initial cloud creation
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            if (!isGameRunning) createClouds();
        }, i * 600);
    }
});