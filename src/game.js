import { INITIAL_TIME, PARAGRAPHS, LEARNING_EXERCISES } from './constants.js';
import { getElements, initElements, updateStats } from './utils/dom.js';
import { calculateStats } from './utils/stats.js';
import { calculateFinalScore } from './utils/scoring.js';
import { 
    showModal, 
    updateModalContent, 
    updateModalTitle, 
    updateRetryButton 
} from './utils/modal.js';
import { renderKeyboard, highlightKey } from './utils/keyboard.js';

export class TypingGame {
    constructor() {
        this.maxTime = INITIAL_TIME;
        this.timeLeft = INITIAL_TIME;
        this.charIndex = 0;
        this.errors = 0;
        this.isTyping = false;
        this.corrects = 0;
        this.timer = null;
        this.currentText = '';
        this.currentMode = 'test'; // 'test' or 'learn'
        this.currentExerciseIndex = 0;
        this.keyboardLayout = 'azerty';
        
        if (initElements()) {
            this.elements = getElements();
            this.initGame();
        }
    }

    initGame() {
        this.initEventListeners();
        this.renderInitialKeyboard();
        this.resetGame();
    }

    renderInitialKeyboard() {
        if (this.elements.keyboardContainer) {
            renderKeyboard(this.elements.keyboardContainer, this.keyboardLayout);
        }
    }

    initEventListeners() {
        if (this.elements.inputBox) {
            this.elements.inputBox.addEventListener("input", () => this.startTyping());
        }
        if (this.elements.restartBtn) {
            this.elements.restartBtn.addEventListener("click", () => this.resetGame());
        }
        if (this.elements.textBox) {
            this.elements.textBox.addEventListener("click", () => this.elements.inputBox?.focus());
        }
        
        // Mode switch
        if (this.elements.modeTest) {
            this.elements.modeTest.addEventListener("click", () => this.switchMode('test'));
        }
        if (this.elements.modeLearn) {
            this.elements.modeLearn.addEventListener("click", () => this.switchMode('learn'));
        }

        // Layout selection
        document.querySelectorAll(".layout-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                document.querySelectorAll(".layout-btn").forEach(b => b.classList.remove("active"));
                e.target.classList.add("active");
                this.keyboardLayout = e.target.dataset.layout;
                this.renderInitialKeyboard();
                this.resetGame();
            });
        });

        // Time selection
        document.querySelectorAll(".time-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
                e.target.classList.add("active");
                this.maxTime = parseInt(e.target.dataset.time);
                this.resetGame();
            });
        });

        const modal = document.getElementById('score-modal');
        const retryBtn = document.getElementById('retry-btn');
        
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                if (modal) {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                }
                if (this.currentMode === 'learn' && this.errors === 0 && this.charIndex > 0) {
                    this.currentExerciseIndex = (this.currentExerciseIndex + 1) % LEARNING_EXERCISES.length;
                }
                this.resetGame();
            });
        }
    }

    switchMode(mode) {
        this.currentMode = mode;
        if (mode === 'test') {
            this.elements.modeTest.classList.add('active');
            this.elements.modeLearn.classList.remove('active');
            this.elements.learningHeader.classList.add('hidden');
        } else {
            this.elements.modeTest.classList.remove('active');
            this.elements.modeLearn.classList.add('active');
            this.elements.learningHeader.classList.remove('hidden');
            this.currentExerciseIndex = 0;
        }
        this.resetGame();
    }

    handleParagraph() {
        if (!this.elements.textBox) return;
        
        if (this.currentMode === 'test') {
            const randomIndex = Math.floor(Math.random() * PARAGRAPHS.length);
            this.currentText = PARAGRAPHS[randomIndex];
        } else {
            const exercise = LEARNING_EXERCISES[this.currentExerciseIndex];
            this.currentText = exercise.text;
            if (this.elements.learningHeader) {
                this.elements.learningHeader.querySelector('h2').textContent = exercise.title;
            }
        }
        
        this.elements.textBox.innerHTML = this.currentText
            .split("")
            .map(char => `<span>${char}</span>`)
            .join("");
        
        this.updateCursor();
    }

    updateCursor() {
        const characters = this.elements.textBox.querySelectorAll("span");
        characters.forEach(span => span.classList.remove("cursor-typing"));
        if (characters[this.charIndex]) {
            characters[this.charIndex].classList.add("cursor-typing");
            highlightKey(characters[this.charIndex].innerText);
        } else {
            highlightKey(null);
        }
    }

    updateDisplay() {
        const stats = calculateStats(this.charIndex, this.errors, this.maxTime, this.timeLeft);
        updateStats({
            errors: this.errors,
            corrects: this.corrects,
            wpm: stats.wpm,
            cpm: stats.cpm,
            timeLeft: this.timeLeft
        });
    }

    showScoreModal() {
        const timeSpent = this.maxTime - this.timeLeft;
        
        const finalScore = calculateFinalScore({
            charIndex: this.charIndex,
            errors: this.errors,
            corrects: this.corrects,
            timeSpent: timeSpent || 1,
            totalTime: this.maxTime,
            textLength: this.currentText.length
        });

        const stats = calculateStats(this.charIndex, this.errors, this.maxTime, this.timeLeft);

        updateModalContent(stats, {
            ...finalScore,
            corrects: this.corrects,
            errors: this.errors
        });
        
        showModal();
    }

    startTyping() {
        if (!this.elements.textBox || !this.elements.inputBox) return;

        const characters = this.elements.textBox.querySelectorAll("span");
        const typedChar = this.elements.inputBox.value.split("")[this.charIndex];

        if (this.charIndex < characters.length && this.timeLeft > 0) {
            if (!this.isTyping) {
                this.timer = setInterval(() => this.startTimer(), 1000);
                this.isTyping = true;
            }

            if (typedChar == null) {
                if (this.charIndex > 0) {
                    this.charIndex--;
                    if (characters[this.charIndex].classList.contains("text-red-500")) {
                        this.errors--;
                    } else if (characters[this.charIndex].classList.contains("text-green-500")) {
                        this.corrects--;
                    }
                    characters[this.charIndex].classList.remove("text-green-500", "text-red-500");
                }
            } else {
                if (characters[this.charIndex].innerText === typedChar) {
                    this.corrects++;
                    characters[this.charIndex].classList.add("text-green-500");
                } else {
                    this.errors++;
                    characters[this.charIndex].classList.add("text-red-500");
                }
                this.charIndex++;
            }

            this.updateCursor();

            if (this.charIndex === characters.length) {
                this.handleTextCompletion();
            }

            this.updateDisplay();
        } else {
            this.elements.inputBox.value = "";
            clearInterval(this.timer);
        }
    }

    handleTextCompletion() {
        clearInterval(this.timer);
        
        if (this.errors === 0) {
            updateModalTitle(this.currentMode === 'test' ? 'Parfait ! Passons au texte suivant' : 'Niveau réussi !');
            updateRetryButton(this.currentMode === 'test' ? 'Texte suivant' : 'Niveau suivant');
        } else {
            updateModalTitle('Texte terminé !');
            updateRetryButton('Réessayer');
        }
        
        this.showScoreModal();
    }

    startTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft === 0) {
                updateModalTitle('Temps écoulé !');
                this.showScoreModal();
            }
        } else {
            clearInterval(this.timer);
        }
    }

    resetGame() {
        if (this.elements.inputBox) {
            this.elements.inputBox.value = "";
        }
        clearInterval(this.timer);
        this.timeLeft = this.maxTime;
        this.charIndex = 0;
        this.errors = 0;
        this.isTyping = false;
        this.corrects = 0;
        
        this.handleParagraph();
        this.updateDisplay();
        this.elements.inputBox?.focus();
    }
}
