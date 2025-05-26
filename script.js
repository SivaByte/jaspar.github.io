// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Particle background
    const particleContainer = document.getElementById('particle-container');
    if (particleContainer) { // Check if element exists
        const numParticles = 50; 
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 3 + 1; 
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`; 
            const driftX = (Math.random() - 0.5) * 40; 
            particle.style.setProperty('--drift-x', `${driftX}vw`);
            particle.style.animationDuration = `${Math.random() * 20 + 10}s`; 
            particle.style.animationDelay = `${Math.random() * 10}s`; 
            particleContainer.appendChild(particle);
        }
    }

    // Modal functionality
    const celestialBodies = document.querySelectorAll('.celestial-body');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');

    celestialBodies.forEach(body => {
        body.addEventListener('click', () => {
            const modalId = body.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            if (modal) {
                openModal(modal);
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (!modal.classList.contains('pointer-events-none')) {
                    closeModal(modal);
                }
            });
        }
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) { 
                closeModal(this);
            }
        });
    });

    function openModal(modal) {
        modal.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
        modal.classList.add('opacity-100', 'scale-100');
        document.body.style.overflow = 'hidden'; 
    }

    function closeModal(modal) {
        modal.classList.add('opacity-0', 'scale-95');
        modal.classList.remove('opacity-100', 'scale-100');
        setTimeout(() => {
            modal.classList.add('pointer-events-none');
        }, 300); 
        document.body.style.overflow = 'auto'; 
    }

    // Contact Form:
    // The previous JavaScript for handling form submission and displaying a front-end message
    // has been removed. The form in index.html is now set up to submit to Formspree.
    // You will need to replace 'YOUR_UNIQUE_FORM_ID' in the form's action attribute
    // with your actual Formspree endpoint.
    // Formspree will handle the email sending and can be configured for a 'thank you' page.
    // The #form-message div is no longer actively used by this default Formspree setup.

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Star Catcher Game JS ---
    const canvas = document.getElementById('gameCanvas');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const timeDisplay = document.getElementById('timeDisplay');
    const startGameButton = document.getElementById('startGameButton');
    const gameOverMessage = document.getElementById('gameOverMessage');

    if (canvas && scoreDisplay && timeDisplay && startGameButton && gameOverMessage) {
        const ctx = canvas.getContext('2d');
        let score = 0;
        let gameTime = 30; // seconds
        let gameInterval;
        let starSpawnInterval;
        let stars = [];
        let gameActive = false;
        const starRadius = 10;
        const starSpeed = 2;
        const starSpawnRate = 1000; // milliseconds

        function drawStar(x, y) {
            ctx.beginPath();
            ctx.arc(x, y, starRadius, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(x, y, starRadius * 0.2, x, y, starRadius);
            gradient.addColorStop(0, 'rgba(255, 255, 224, 1)'); 
            gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.8)'); 
            gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');   
            ctx.fillStyle = gradient;
            ctx.shadowColor = 'yellow';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0; 
        }

        function spawnStar() {
            if (!gameActive) return;
            const x = Math.random() * (canvas.width - starRadius * 2) + starRadius;
            const y = -starRadius; 
            stars.push({ x, y });
        }

        function updateStars() {
            for (let i = stars.length - 1; i >= 0; i--) {
                stars[i].y += starSpeed;
                if (stars[i].y > canvas.height + starRadius) {
                    stars.splice(i, 1); 
                }
            }
        }

        function drawGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => drawStar(star.x, star.y));
        }

        function gameLoop() {
            if (!gameActive) return;
            updateStars();
            drawGame();
            requestAnimationFrame(gameLoop);
        }

        function startGame() {
            if (gameActive) return;
            gameActive = true;
            score = 0;
            gameTime = 30;
            stars = [];
            scoreDisplay.textContent = score;
            timeDisplay.textContent = gameTime;
            gameOverMessage.classList.add('hidden');
            startGameButton.disabled = true;
            startGameButton.innerHTML = 'Catching... <i class="fas fa-spinner fa-spin ml-2"></i>';

            gameInterval = setInterval(() => {
                gameTime--;
                timeDisplay.textContent = gameTime;
                if (gameTime <= 0) {
                    endGame();
                }
            }, 1000);

            starSpawnInterval = setInterval(spawnStar, starSpawnRate);
            requestAnimationFrame(gameLoop); 
        }

        function endGame() {
            gameActive = false;
            clearInterval(gameInterval);
            clearInterval(starSpawnInterval);
            gameOverMessage.textContent = `Game Over! Final Score: ${score}`;
            gameOverMessage.classList.remove('hidden');
            startGameButton.disabled = false;
            startGameButton.innerHTML = 'Play Again <i class="fas fa-redo ml-2"></i>';
        }

        canvas.addEventListener('click', (event) => {
            if (!gameActive) return;
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            for (let i = stars.length - 1; i >= 0; i--) {
                const distance = Math.sqrt(
                    (clickX - stars[i].x) ** 2 + (clickY - stars[i].y) ** 2
                );
                if (distance < starRadius) {
                    stars.splice(i, 1);
                    score++;
                    scoreDisplay.textContent = score;
                    break; 
                }
            }
        });
        
        function resizeCanvas() {
            const container = canvas.parentElement;
            if (container) {
                canvas.width = Math.min(container.clientWidth - parseInt(getComputedStyle(container).paddingLeft) - parseInt(getComputedStyle(container).paddingRight), 600);
                canvas.height = canvas.width / 1.5; 
                if (gameActive) drawGame(); 
                else { 
                     ctx.clearRect(0, 0, canvas.width, canvas.height);
                     ctx.font = "20px Orbitron, sans-serif";
                     ctx.fillStyle = "#87CEFA";
                     ctx.textAlign = "center";
                     ctx.fillText("Click Start Game!", canvas.width / 2, canvas.height / 2);
                }
            }
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); 

        startGameButton.addEventListener('click', startGame);
    } else {
        console.error("Game elements not found. Skipping game initialization.");
    }
});
