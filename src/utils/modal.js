// Gestion de la modal de score
export function updateModalContent(stats, finalScore) {
    const elements = {
        grade: document.getElementById('final-grade'),
        score: document.getElementById('final-score'),
        mpm: document.getElementById('final-mpm'),
        cpm: document.getElementById('final-cpm'),
        accuracy: document.getElementById('final-accuracy'),
        correct: document.getElementById('final-correct'),
        errors: document.getElementById('final-errors')
    };

    // Vérification de l'existence des éléments avant mise à jour
    if (elements.mpm) elements.mpm.textContent = stats.wpm;
    if (elements.cpm) elements.cpm.textContent = stats.cpm;
    if (elements.accuracy) elements.accuracy.textContent = finalScore.accuracy;
    if (elements.correct) elements.correct.textContent = finalScore.corrects;
    if (elements.errors) elements.errors.textContent = finalScore.errors;
    if (elements.grade) elements.grade.textContent = finalScore.grade || '';
    if (elements.score) elements.score.textContent = finalScore.finalScore || '';
}

export function showModal(modalId = 'score-modal') {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    const modalContent = modal.querySelector('div');
    if (modalContent) {
        modalContent.classList.add('modal-animation');
    }
}

export function updateModalTitle(title, modalId = 'score-modal') {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const titleElement = modal.querySelector('h2');
    if (titleElement) {
        titleElement.textContent = title;
    }
}

export function updateRetryButton(text, modalId = 'score-modal') {
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        retryBtn.textContent = text;
    }
}