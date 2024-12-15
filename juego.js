const player = document.getElementById('player'); 
const gameContainer = document.getElementById('gameContainer');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

let score = 0;
let lives = 3;
let playerX = gameContainer.offsetWidth / 2 - player.offsetWidth / 2;
let playerY = gameContainer.offsetHeight - player.offsetHeight - 20;
let projectiles = [];
let enemies = [];

player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

// Movimiento del jugador
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && playerX > 0) {
        playerX -= 10;
        player.style.left = `${playerX}px`;
    }
    if (e.key === 'ArrowRight' && playerX < gameContainer.offsetWidth - player.offsetWidth) {
        playerX += 10;
        player.style.left = `${playerX}px`;
    }
    if (e.key === ' ' || e.key === 'Spacebar') {
        shootProjectile();
    }
});

// Disparo de proyectiles
function shootProjectile() {
    const projectile = document.createElement('img');
    projectile.src = 'projectile.png';
    projectile.style.position = 'absolute';
    projectile.style.left = `${playerX + player.offsetWidth / 2 - 5}px`;
    projectile.style.top = `${playerY - 10}px`;
    projectile.style.width = '10px';
    projectile.style.height = '20px';
    projectile.style.display = 'block';
    gameContainer.appendChild(projectile);
    projectiles.push(projectile);
}

// Enemigos que caen
function spawnEnemy() {
    const enemy = document.createElement('img');
    enemy.src = 'enemy.png';
    const enemyX = Math.random() * (gameContainer.offsetWidth - 50);
    enemy.style.position = 'absolute';
    enemy.style.left = `${enemyX}px`;
    enemy.style.top = '-50px';
    enemy.style.width = '50px';
    enemy.style.height = '50px';
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
}

// Movimiento de los enemigos
function moveEnemies() {
    enemies.forEach((enemy, index) => {
        let enemyTop = parseInt(enemy.style.top);
        if (enemyTop > gameContainer.offsetHeight) {
            enemy.remove();
            enemies.splice(index, 1);
        } else {
            enemy.style.top = `${enemyTop + 4}px`;
        }
    });
}

// Movimiento de los proyectiles
function moveProjectiles() {
    projectiles.forEach((projectile, index) => {
        let projectileTop = parseInt(projectile.style.top);
        if (projectileTop < 0) {
            projectile.remove();
            projectiles.splice(index, 1);
        } else {
            projectile.style.top = `${projectileTop - 10}px`;
        }

        // Colisiones con enemigos
        enemies.forEach((enemy, eIndex) => {
            const projectileRect = projectile.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();

            if (
                projectileRect.top <= enemyRect.bottom &&
                projectileRect.bottom >= enemyRect.top &&
                projectileRect.left <= enemyRect.right &&
                projectileRect.right >= enemyRect.left
            ) {
                projectile.remove();
                enemy.remove();
                projectiles.splice(index, 1);
                enemies.splice(eIndex, 1);
                score += 10;
                scoreElement.innerText = `Puntaje: ${score}`;
            }
        });
    });
}

// Colisión con la nave del jugador
function checkPlayerCollisions() {
    enemies.forEach((enemy, index) => {
        const playerRect = player.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        if (
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top &&
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left
        ) {
            enemy.remove();
            enemies.splice(index, 1);
            lives--;
            livesElement.innerText = `Vidas: ${lives}`;
            if (lives === 0) {
                alert('¡Game Over!');
                resetGame();
            }
        }
    });
}

// Función para actualizar el juego
function updateGame() {
    moveEnemies();
    moveProjectiles();
    checkPlayerCollisions();
}

// Función para generar enemigos periódicamente
setInterval(spawnEnemy, 700);
spawnEnemy();
setInterval(updateGame, 20);

// Resetear el juego
function resetGame() {
    score = 0;
    lives = 3;
    scoreElement.innerText = `Puntaje: 0`;
    livesElement.innerText = `Vidas: 3`;
    enemies.forEach(enemy => enemy.remove());
    projectiles.forEach(projectile => projectile.remove());
    enemies = [];
    projectiles = [];
}
