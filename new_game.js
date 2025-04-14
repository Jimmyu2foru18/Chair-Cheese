/**
 * ChairCheese Game - Canvas Implementation
 * A fruit-ninja style game where players slice cheese while avoiding bombs
 */

// Game Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to match window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize canvas size
resizeCanvas();

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Game State
const gameState = {
    active: false,
    score: 0,
    lives: 5,
    combo: 0,
    comboTimer: 0,
    powerUpActive: false,
    powerUpValue: 1,
    powerUpDuration: 0,
    lastSliceTime: 0,
    gameObjects: [],
    particles: [],
    sliceTrail: [],
    lastFrameTime: 0
};

// Asset Management
const assets = {
    images: {},
    sounds: {}
};

// Load game assets
function loadAssets() {
    // We'll use simple shapes for now, but could load images here
    // Background color will be sky blue
    
    // Setup audio (commented out for now)
    /*
    assets.sounds.slice = new Audio('slice.mp3');
    assets.sounds.powerup = new Audio('powerup.mp3');
    assets.sounds.explosion = new Audio('explosion.mp3');
    assets.sounds.gameOver = new Audio('gameover.mp3');
    assets.sounds.background = new Audio('background.mp3');
    assets.sounds.background.loop = true;
    */
}

// Game Object Classes
class GameObject {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 60;
        this.height = 60;
        this.velocityX = (Math.random() - 0.1) * 2; // Further reduced horizontal speed
        this.velocityY = -4 - Math.random() * 4; // Reduced upward velocity for slower movement
        this.gravity = 0.015; // Reduced gravity for slower fall
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.08; // Slower rotation
        this.sliced = false;
        this.value = 1;
        this.color = '#FFFF00'; // Default yellow
    }

    update(deltaTime) {
        // Apply gravity
        this.velocityY += this.gravity;
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Update rotation
        this.rotation += this.rotationSpeed;
        
        // Boundary checking to keep objects within screen
        // Bounce off left and right edges
        if (this.x < this.width/2) {
            this.x = this.width/2;
            this.velocityX = Math.abs(this.velocityX) * 0.8; // Bounce with reduced velocity
        } else if (this.x > canvas.width - this.width/2) {
            this.x = canvas.width - this.width/2;
            this.velocityX = -Math.abs(this.velocityX) * 0.8; // Bounce with reduced velocity
        }
        
        // Check if object is out of bounds (only at bottom)
        return this.y > canvas.height + 100; // Return true if object should be removed
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw based on object type
        if (this.type === 'cheese') {
            this.drawCheese();
        } else if (this.type === 'swiss') {
            this.drawSwissCheese();
        } else if (this.type === 'cheddar') {
            this.drawCheddarCheese();
        } else if (this.type === 'powerup') {
            this.drawPowerUp();
        } else if (this.type === 'bomb') {
            this.drawBomb();
        }
        
        ctx.restore();
    }

    drawCheese() {
        // Regular round cheese
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add some details
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.width/6, -this.height/6, this.width/10, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSwissCheese() {
        // Swiss cheese (with holes)
        ctx.fillStyle = '#FFF59D';
        ctx.beginPath();
        ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add holes
        ctx.fillStyle = '#FFF8E1';
        ctx.beginPath();
        ctx.arc(this.width/5, -this.height/5, this.width/8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(-this.width/6, this.height/6, this.width/10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.width/8, this.height/4, this.width/12, 0, Math.PI * 2);
        ctx.fill();
    }

    drawCheddarCheese() {
        // Cheddar (wedge shape)
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(-this.width/2, -this.height/2);
        ctx.lineTo(this.width/2, -this.height/2);
        ctx.lineTo(this.width/2, this.height/2);
        ctx.closePath();
        ctx.fill();
        
        // Add some texture lines
        ctx.strokeStyle = '#FF8C00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.width/4, -this.height/4);
        ctx.lineTo(this.width/4, -this.height/4);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-this.width/6, 0);
        ctx.lineTo(this.width/3, 0);
        ctx.stroke();
    }

    drawPowerUp() {
        // Power-up (glowing orb)
        const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, this.width/2);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.7, '#00FFFF');
        gradient.addColorStop(1, '#0088FF');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, this.width/1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    drawBomb() {
        // Chair (instead of bomb)
        
        // Chair seat (square)
        ctx.fillStyle = '#8B4513'; // Brown wood color
        ctx.fillRect(-this.width/2.5, -this.height/3, this.width/1.25, this.height/2);
        
        // Chair backrest
        ctx.fillRect(-this.width/2.5, -this.height/3 - this.height/2, this.width/1.25, this.height/6);
        
        // Chair legs
        ctx.fillStyle = '#A0522D'; // Darker brown
        
        // Back legs
        ctx.fillRect(-this.width/2.5, -this.height/3 + this.height/2, this.width/8, this.height/3);
        ctx.fillRect(this.width/2.5 - this.width/8, -this.height/3 + this.height/2, this.width/8, this.height/3);
        
        // Front legs
        ctx.fillRect(-this.width/2.5, -this.height/3 + this.height/2, this.width/8, this.height/3);
        ctx.fillRect(this.width/2.5 - this.width/8, -this.height/3 + this.height/2, this.width/8, this.height/3);
        
        // Chair back supports
        ctx.fillRect(-this.width/3, -this.height/3 - this.height/2, this.width/12, this.height/2);
        ctx.fillRect(this.width/3 - this.width/12, -this.height/3 - this.height/2, this.width/12, this.height/2);
        
        // Warning sign
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(0, -this.height/6, this.width/6, 0, Math.PI * 2);
        ctx.fill();
        
        // Warning symbol
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', 0, -this.height/6);
    }

    // Check if point is inside object (for collision detection)
    containsPoint(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.width/2;
    }

    // Check if slice line intersects with object
    intersectsLine(x1, y1, x2, y2) {
        // Simple line-circle intersection
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize direction vector
        const dirX = dx / len;
        const dirY = dy / len;
        
        // Calculate vector from line start to circle center
        const cx = this.x - x1;
        const cy = this.y - y1;
        
        // Project circle center onto line
        const projection = cx * dirX + cy * dirY;
        
        // Find closest point on line to circle center
        let closestX, closestY;
        
        // Check if projection is outside line segment
        if (projection < 0) {
            closestX = x1;
            closestY = y1;
        } else if (projection > len) {
            closestX = x2;
            closestY = y2;
        } else {
            // Projection is on line segment
            closestX = x1 + projection * dirX;
            closestY = y1 + projection * dirY;
        }
        
        // Calculate distance from closest point to circle center
        const distX = this.x - closestX;
        const distY = this.y - closestY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        // Check if distance is less than circle radius
        return distance <= this.width/2;
    }
}

// Particle effect when slicing objects
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.velocityX = (Math.random() - 0.5) * 8;
        this.velocityY = (Math.random() - 0.5) * 8;
        this.color = color;
        this.alpha = 1;
        this.gravity = 0.1;
        this.lifespan = 60; // frames
    }

    update() {
        this.velocityY += this.gravity;
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.alpha -= 1 / this.lifespan;
        this.lifespan--;
        return this.lifespan <= 0;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Game Functions
function initGame() {
    // Reset game state
    gameState.active = true;
    gameState.score = 0;
    gameState.lives = 5;
    gameState.combo = 0;
    gameState.comboTimer = 0;
    gameState.powerUpActive = false;
    gameState.powerUpValue = 1;
    gameState.powerUpDuration = 0;
    gameState.gameObjects = [];
    gameState.particles = [];
    gameState.sliceTrail = [];
    
    // Update UI
    document.getElementById('score').textContent = `Cheese: ${gameState.score}`;
    document.getElementById('lives').textContent = `Lives: ${gameState.lives}`;
    document.getElementById('multiplier').classList.add('hidden');
    document.getElementById('powerup').classList.add('hidden');
    
    // Hide start screen, show game UI
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    document.getElementById('game-over').classList.add('hidden');
    
    // Spawn initial objects
    spawnInitialObjects();
    
    // Start game loop if not already running
    if (!gameState.lastFrameTime) {
        gameState.lastFrameTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
    
    // Play background music
    // if (assets.sounds.background) assets.sounds.background.play();
}

function spawnInitialObjects() {
    // Spawn several cheese pieces
    for (let i = 0; i < 5; i++) {
        spawnRandomCheese();
    }
    
    // Spawn one power-up
    spawnPowerUp();
    
    // Spawn one bomb
    spawnBomb();
}

function spawnRandomCheese() {
    const x = Math.random() * canvas.width;
    const y = canvas.height + 100; // Start further below screen for higher arc
    
    // Determine cheese type
    const rand = Math.random();
    let cheeseObj;
    
    if (rand < 0.6) {
        // Regular cheese
        cheeseObj = new GameObject(x, y, 'cheese');
        cheeseObj.value = 1;
    } else if (rand < 0.8) {
        // Swiss cheese
        cheeseObj = new GameObject(x, y, 'swiss');
        cheeseObj.value = 3;
        cheeseObj.width = 60;
        cheeseObj.height = 60;
    } else {
        // Cheddar cheese
        cheeseObj = new GameObject(x, y, 'cheddar');
        cheeseObj.value = 5;
        cheeseObj.width = 65;
        cheeseObj.height = 65;
    }
    
    gameState.gameObjects.push(cheeseObj);
}

function spawnPowerUp() {
    const x = Math.random() * canvas.width;
    const y = canvas.height + 100; // Start further below screen for higher arc
    
    const powerUp = new GameObject(x, y, 'powerup');
    powerUp.value = 2; // Multiplier value
    powerUp.width = 40;
    powerUp.height = 40;
    
    gameState.gameObjects.push(powerUp);
}

function spawnBomb() {
    const x = Math.random() * canvas.width;
    const y = canvas.height + 100; // Start further below screen for higher arc
    
    const bomb = new GameObject(x, y, 'bomb');
    bomb.width = 50;
    bomb.height = 50;
    bomb.velocityY = -10 - Math.random() * 2; // Reduced upward velocity for slower movement
    
    gameState.gameObjects.push(bomb);
}

// Handle mouse/touch movement for slicing
let isMouseDown = false;

canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    handleSliceStart(e.clientX, e.clientY);
});

canvas.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        handleSliceMove(e.clientX, e.clientY);
    }
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
    handleSliceEnd();
});

canvas.addEventListener('mouseleave', () => {
    isMouseDown = false;
    handleSliceEnd();
});

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMouseDown = true;
    handleSliceStart(e.touches[0].clientX, e.touches[0].clientY);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isMouseDown) {
        handleSliceMove(e.touches[0].clientX, e.touches[0].clientY);
    }
});

canvas.addEventListener('touchend', () => {
    isMouseDown = false;
    handleSliceEnd();
});

function handleSliceStart(x, y) {
    if (!gameState.active) return;
    
    // Clear previous slice trail
    gameState.sliceTrail = [];
    
    // Add first point
    gameState.sliceTrail.push({ x, y });
}

function handleSliceMove(x, y) {
    if (!gameState.active) return;
    
    // Add point to slice trail
    gameState.sliceTrail.push({ x, y });
    
    // Limit trail length
    if (gameState.sliceTrail.length > 20) {
        gameState.sliceTrail.shift();
    }
    
    // Check for collisions with game objects
    checkSliceCollisions();
}

function handleSliceEnd() {
    // Clear slice trail after a short delay
    setTimeout(() => {
        gameState.sliceTrail = [];
    }, 100);
}

function checkSliceCollisions() {
    if (gameState.sliceTrail.length < 2) return;
    
    // Get last two points of slice trail
    const lastPoint = gameState.sliceTrail[gameState.sliceTrail.length - 1];
    const prevPoint = gameState.sliceTrail[gameState.sliceTrail.length - 2];
    
    // Check each game object for intersection with slice line
    gameState.gameObjects.forEach((obj, index) => {
        if (obj.sliced) return;
        
        if (obj.intersectsLine(prevPoint.x, prevPoint.y, lastPoint.x, lastPoint.y)) {
            if (obj.type === 'bomb') {
                // Hit bomb - lose life
                hitBomb(obj, index);
            } else if (obj.type === 'powerup') {
                // Activate power-up
                activatePowerUp(obj, index);
            } else {
                // Slice cheese
                sliceObject(obj, index);
            }
        }
    });
}

function sliceObject(obj, index) {
    // Mark as sliced
    obj.sliced = true;
    
    // Calculate score based on cheese value and multipliers
    const baseValue = obj.value * (gameState.powerUpActive ? gameState.powerUpValue : 1);
    gameState.score += baseValue;
    
    // Update combo
    const now = performance.now();
    if (now - gameState.lastSliceTime < 1000) {
        gameState.combo++;
        gameState.comboTimer = 2; // 2 seconds to maintain combo
        
        // Bonus points for combo
        if (gameState.combo > 1) {
            gameState.score += gameState.combo;
            
            // Show combo text
            const comboDisplay = document.getElementById('combo-display');
            comboDisplay.textContent = `Combo x${gameState.combo}! +${gameState.combo}`;
            comboDisplay.classList.remove('hidden');
            comboDisplay.classList.add('active');
            
            // Hide after a short delay
            setTimeout(() => {
                comboDisplay.classList.remove('active');
                setTimeout(() => {
                    comboDisplay.classList.add('hidden');
                }, 300);
            }, 1000);
        }
    } else {
        gameState.combo = 1;
        gameState.comboTimer = 2;
    }
    gameState.lastSliceTime = now;
    
    // Update score display
    document.getElementById('score').textContent = `Cheese: ${Math.floor(gameState.score)}`;
    
    // Create particles
    createParticles(obj.x, obj.y, obj.type === 'swiss' ? '#FFF59D' : 
                                 obj.type === 'cheddar' ? '#FFA500' : '#FFFF00');
    
    // Play slice sound
    // if (assets.sounds.slice) assets.sounds.slice.play();
    
    // Split the object into two halves (visual effect)
    // This is handled by removing the original and creating particles
    
    // Remove the sliced object after a short delay
    setTimeout(() => {
        const idx = gameState.gameObjects.indexOf(obj);
        if (idx !== -1) {
            gameState.gameObjects.splice(idx, 1);
        }
    }, 100);
}

function activatePowerUp(powerUp, index) {
    // Remove power-up
    gameState.gameObjects.splice(index, 1);
    
    // Activate power-up effect
    gameState.powerUpActive = true;
    gameState.powerUpValue = powerUp.value;
    gameState.powerUpDuration = 10; // 10 seconds
    
    // Update UI
    document.getElementById('powerup').textContent = `Power-Up: x${powerUp.value}`;
    document.getElementById('powerup').classList.remove('hidden');
    
    // Create particles
    createParticles(powerUp.x, powerUp.y, '#00FFFF');
    
    // Play power-up sound
    // if (assets.sounds.powerup) assets.sounds.powerup.play();
}

function hitBomb(bomb, index) {
    // Remove bomb
    gameState.gameObjects.splice(index, 1);
    
    // Lose a life
    gameState.lives--;
    document.getElementById('lives').textContent = `Lives: ${gameState.lives}`;
    
    // Create explosion particles
    for (let i = 0; i < 30; i++) {
        const particle = new Particle(bomb.x, bomb.y, '#FF0000');
        particle.size = Math.random() * 8 + 3;
        particle.velocityX = (Math.random() - 0.5) * 12;
        particle.velocityY = (Math.random() - 0.5) * 12;
        gameState.particles.push(particle);
    }
    
    // Play explosion sound
    // if (assets.sounds.explosion) assets.sounds.explosion.play();
    
    // Check for game over
    if (gameState.lives <= 0) {
        gameOver();
    }
}

function createParticles(x, y, color) {
    // Create particle effect
    for (let i = 0; i < 15; i++) {
        gameState.particles.push(new Particle(x, y, color));
    }
}

function gameOver() {
    gameState.active = false;
    
    // Stop background music
    // if (assets.sounds.background) assets.sounds.background.pause();
    
    // Play game over sound
    // if (assets.sounds.gameOver) assets.sounds.gameOver.play();
    
    // Show game over screen
    document.getElementById('game-ui').classList.add('hidden');
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('final-score').textContent = `Final Score: ${Math.floor(gameState.score)}`;
}

// Game Loop
function gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - gameState.lastFrameTime;
    gameState.lastFrameTime = timestamp;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    if (gameState.active) {
        // Update game state
        updateGame(deltaTime);
        
        // Draw game objects
        drawGame();
        
        // Spawn new objects periodically
        if (Math.random() < 0.02) {
            spawnRandomCheese();
        }
        
        if (Math.random() < 0.005) {
            spawnPowerUp();
        }
        
        if (Math.random() < 0.01) {
            spawnBomb();
        }
    }
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

function updateGame(deltaTime) {
    // Update power-up duration
    if (gameState.powerUpActive) {
        gameState.powerUpDuration -= deltaTime / 1000; // Convert to seconds
        
        if (gameState.powerUpDuration <= 0) {
            gameState.powerUpActive = false;
            document.getElementById('powerup').classList.add('hidden');
        } else {
            document.getElementById('powerup').textContent = 
                `Power-Up: x${gameState.powerUpValue} (${Math.ceil(gameState.powerUpDuration)}s)`;
        }
    }
    
    // Update combo timer
    if (gameState.combo > 1) {
        gameState.comboTimer -= deltaTime / 1000;
        
        if (gameState.comboTimer <= 0) {
            gameState.combo = 0;
        }
    }
    
    // Update game objects
    for (let i = gameState.gameObjects.length - 1; i >= 0; i--) {
        const obj = gameState.gameObjects[i];
        
        // Update object position
        const shouldRemove = obj.update(deltaTime);
        
        // Check if object is out of bounds
        if (shouldRemove) {
            // If it's a cheese and not sliced, lose a life
            if ((obj.type === 'cheese' || obj.type === 'swiss' || obj.type === 'cheddar') && !obj.sliced) {
                gameState.lives--;
                document.getElementById('lives').textContent = `Lives: ${gameState.lives}`;
                
                // Check for game over
                if (gameState.lives <= 0) {
                    gameOver();
                }
            }
            
            // Remove object
            gameState.gameObjects.splice(i, 1);
        }
    }
    
    // Update particles
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const particle = gameState.particles[i];
        const shouldRemove = particle.update();
        
        if (shouldRemove) {
            gameState.particles.splice(i, 1);
        }
    }
}

function drawBackground() {
    // Draw sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(1, '#E0F7FA'); // Light blue
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGame() {
    // Draw game objects
    gameState.gameObjects.forEach(obj => obj.draw());
    
    // Draw particles
    gameState.particles.forEach(particle => particle.draw());
    
    // Draw slice trail
    drawSliceTrail();
}

function drawSliceTrail() {
    if (gameState.sliceTrail.length < 2) return;
    
    // Draw main slice trail
    ctx.strokeStyle = '#000000'; // Changed from white to black to match cursor
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(gameState.sliceTrail[0].x, gameState.sliceTrail[0].y);
    
    for (let i = 1; i < gameState.sliceTrail.length; i++) {
        ctx.lineTo(gameState.sliceTrail[i].x, gameState.sliceTrail[i].y);
    }
    
    ctx.stroke();
    
    // Draw glow effect
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 6;
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.globalAlpha = 1;
}

// Event Listeners
document.getElementById('startButton').addEventListener('click', () => {
    initGame();
});

document.getElementById('restart-button').addEventListener('click', () => {
    initGame();
});

// Initialize the game
loadAssets();

// Show start screen
document.getElementById('start-screen').classList.remove('hidden');
document.getElementById('game-ui').classList.add('hidden');
document.getElementById('game-over').classList.add('hidden');