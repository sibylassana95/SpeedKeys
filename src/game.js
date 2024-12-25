import { INITIAL_TIME, PARAGRAPHS } from './constants.js';
import { getElements, initElements, updateStats } from './utils/dom.js';
import { calculateStats } from './utils/stats.js';
import { calculateFinalScore } from './utils/scoring.js';
import { 
    showModal, 
    updateModalContent, 
    updateModalTitle, 
    updateRetryButton 
} from './utils/modal.js';

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
        
        if (initElements()) {
            this.elements = getElements();
            this.initGame();
        }
    }

    initGame() {
        this.initEventListeners();
        this.handleParagraph();
        this.updateDisplay();
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
        
        const modal = document.getElementById('score-modal');
        const retryBtn = document.getElementById('retry-btn');
        
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                if (modal) {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                }
                this.resetGame();
            });
        }
    }

    handleParagraph() {
        if (!this.elements.textBox) return;
        
        const randomIndex = Math.floor(Math.random() * PARAGRAPHS.length);
        this.currentText = PARAGRAPHS[randomIndex];
        
        this.elements.textBox.innerHTML = this.currentText
            .split("")
            .map(char => `<span>${char}</span>`)
            .join("");
        
        const firstChar = this.elements.textBox.querySelector("span");
        if (firstChar) {
            firstChar.classList.add("cursor-typing");
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
            timeSpent,
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
                this.charIndex--;
                if (characters[this.charIndex].classList.contains("text-red-500")) {
                    this.errors--;
                }
                characters[this.charIndex].classList.remove("text-green-500", "text-red-500");
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

            characters.forEach(span => span.classList.remove("cursor-typing"));
            if (characters[this.charIndex]) {
                characters[this.charIndex].classList.add("cursor-typing");
            }

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
            updateModalTitle('Parfait ! Passons au texte suivant');
            updateRetryButton('Texte suivant');
        } else {
            updateModalTitle('Texte terminé !');
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