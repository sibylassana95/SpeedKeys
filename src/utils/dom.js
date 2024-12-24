// Sélecteurs DOM constants
const SELECTORS = {
    textBox: ".text-box p",
    inputBox: ".input-box",
    errorTag: "#error span",
    timerTag: "#timer span",
    wpmTag: "#wpm span",
    correctTag: "#correct span",
    cpmTag: "#cpm span",
    restartBtn: ".restart",
    themeToggle: "#theme-toggle"
};

// Cache des éléments DOM
let elements = null;

// Initialise et met en cache les éléments DOM
export function initElements() {
    elements = {};
    let hasErrors = false;

    Object.entries(SELECTORS).forEach(([key, selector]) => {
        const element = document.querySelector(selector);
        if (!element) {
            console.error(`Élément manquant: ${selector}`);
            hasErrors = true;
        }
        elements[key] = element;
    });

    return !hasErrors;
}

// Récupère les éléments, les initialise si nécessaire
export function getElements() {
    if (!elements) {
        const success = initElements();
        if (!success) {
            throw new Error("Impossible d'initialiser les éléments DOM");
        }
    }
    return elements;
}

// Met à jour les statistiques de manière sécurisée
export function updateStats({ errors, corrects, wpm, cpm, timeLeft }) {
    try {
        const els = getElements();
        if (els.errorTag) els.errorTag.textContent = errors;
        if (els.correctTag) els.correctTag.textContent = corrects;
        if (els.wpmTag) els.wpmTag.textContent = wpm;
        if (els.cpmTag) els.cpmTag.textContent = cpm;
        if (els.timerTag) els.timerTag.textContent = timeLeft;
    } catch (error) {
        console.error("Erreur lors de la mise à jour des stats:", error);
    }
}