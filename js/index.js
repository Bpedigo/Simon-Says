class SimonGame {
    constructor() {
        this.colors = ['green', 'red', 'yellow', 'blue'];
        this.sounds = {
            green: 'sounds/simonSound1.mp3',
            red: 'sounds/simonSound2.mp3',
            yellow: 'sounds/simonSound3.mp3',
            blue: 'sounds/simonSound4.mp3',
            correct: 'sounds/correct.mp3',
            fail: 'sounds/fail.mp3'
        };
        
        this.state = {
            isPlaying: false,
            isStrict: false,
            level: 0,
            score: 0,
            sequence: [],
            playerSequence: [],
            currentStep: 0
        };

        this.achievements = {
            level10: false
        };

        this.initializeElements();
        this.attachEventListeners();
        
        // Initialize high score after elements are available
        this.highScore = parseInt(localStorage.getItem('simonHighScore')) || 0;
        this.updateHighScoreDisplay();
    }

    initializeElements() {
        this.display = document.getElementById('display-text');
        this.levelDisplay = document.getElementById('level');
        this.scoreDisplay = document.getElementById('score');
        this.highScoreDisplay = document.getElementById('high-score');
        this.achievementElement = document.getElementById('achievement');
        this.achievementText = document.getElementById('achievement-text');
        this.buttons = document.querySelectorAll('.simon-button');
        this.startButton = document.getElementById('start');
        this.strictButton = document.getElementById('strict');
        this.resetButton = document.getElementById('reset');
    }

    attachEventListeners() {
        this.startButton.addEventListener('click', () => this.toggleGame());
        this.strictButton.addEventListener('click', () => this.toggleStrictMode());
        this.resetButton.addEventListener('click', () => this.resetGame());
        
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.state.isPlaying) {
                    this.handlePlayerInput(button.dataset.color);
                }
            });
        });
    }

    toggleGame() {
        this.state.isPlaying = !this.state.isPlaying;
        this.startButton.textContent = this.state.isPlaying ? 'Stop' : 'Start';
        this.startButton.classList.toggle('active', this.state.isPlaying);
        
        if (this.state.isPlaying) {
            this.resetGame();
        } else {
            this.updateDisplay('Game Stopped');
        }
    }

    toggleStrictMode() {
        this.state.isStrict = !this.state.isStrict;
        this.strictButton.textContent = `Strict Mode ${this.state.isStrict ? 'On' : 'Off'}`;
        this.strictButton.classList.toggle('active', this.state.isStrict);
    }

    resetGame() {
        this.state = {
            ...this.state,
            level: 0,
            score: 0,
            sequence: [],
            playerSequence: [],
            currentStep: 0
        };
        this.generateSequence();
        this.updateDisplay('Get Ready!');
        this.updateLevel();
        this.updateScore();
        setTimeout(() => this.playSequence(), 1000);
    }

    generateSequence() {
        const newColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.state.sequence.push(newColor);
    }

    async playSequence() {
        this.state.isPlaying = false;
        this.updateDisplay('Watch the sequence!');
        
        for (let color of this.state.sequence) {
            await this.playColor(color);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        this.state.isPlaying = true;
        this.updateDisplay('Your turn!');
    }

    playColor(color) {
        return new Promise(resolve => {
            const button = document.querySelector(`.simon-button.${color}`);
            
            button.classList.add('active');
            
            this.playSound(color);
            
            setTimeout(() => {
                button.classList.remove('active');
                resolve();
            }, 500);
        });
    }

    handlePlayerInput(color) {
        if (!this.state.isPlaying) return;
        
        this.state.playerSequence.push(color);
        this.playColor(color);
        
        const currentIndex = this.state.playerSequence.length - 1;
        const isCorrect = this.state.playerSequence[currentIndex] === this.state.sequence[currentIndex];
        
        if (!isCorrect) {
            this.handleIncorrectInput();
        } else if (this.state.playerSequence.length === this.state.sequence.length) {
            this.handleCorrectSequence();
        }
    }

    handleIncorrectInput() {
        this.playSound('fail');
        this.updateDisplay('Wrong! Try again!');
        
        if (this.state.isStrict) {
            setTimeout(() => this.resetGame(), 1000);
        } else {
            setTimeout(() => this.playSequence(), 1000);
        }
    }

    handleCorrectSequence() {
        this.playSound('correct');
        this.state.score += this.state.level;
        this.state.level++;
        this.state.playerSequence = [];
        this.state.currentStep = 0;
        
        // Update high score
        if (this.state.score > this.highScore) {
            this.highScore = this.state.score;
            localStorage.setItem('simonHighScore', this.highScore);
            this.updateHighScoreDisplay();
        }

        this.updateDisplay('Correct! Level Up!');
        this.updateLevel();
        this.updateScore();
        
        // Add level completion animation
        document.querySelector('.game-board').classList.add('level-complete');
        setTimeout(() => {
            document.querySelector('.game-board').classList.remove('level-complete');
        }, 500);

        this.checkAchievements();
        
        if (this.state.level > 20) {
            this.handleWin();
        } else {
            setTimeout(() => {
                this.generateSequence();
                this.playSequence();
            }, 1000);
        }
    }

    handleWin() {
        this.updateDisplay('Congratulations! You Won!');
        this.state.isPlaying = false;
        this.startButton.textContent = 'Start';
        this.startButton.classList.remove('active');
    }

    playSound(color) {
        const audio = new Audio(this.sounds[color]);
        audio.play().catch(error => console.log('Audio playback failed:', error));
    }

    updateDisplay(text) {
        this.display.textContent = text;
    }

    updateLevel() {
        this.levelDisplay.textContent = this.state.level;
    }

    updateScore() {
        this.scoreDisplay.textContent = this.state.score;
    }

    updateHighScoreDisplay() {
        this.highScoreDisplay.textContent = this.highScore;
    }

    showAchievement(title, message) {
        this.achievementText.textContent = message;
        this.achievementElement.classList.add('show');
        setTimeout(() => {
            this.achievementElement.classList.remove('show');
        }, 3000);
    }

    checkAchievements() {
        if (this.state.level >= 10 && !this.achievements.level10) {
            this.achievements.level10 = true;
            this.showAchievement('Master of Memory', 'Completed 10 levels!');
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SimonGame();
});