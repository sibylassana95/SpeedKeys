import { TypingGame } from './game.js';
import { initTheme, toggleTheme } from './utils/theme.js';
import { initElements, getElements } from './utils/dom.js';

document.addEventListener('DOMContentLoaded', () => {

    initElements();
    initTheme();
    const game = new TypingGame();
    const elements = getElements();
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
});