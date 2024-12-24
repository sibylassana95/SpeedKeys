// Calcule les statistiques du jeu
export function calculateStats(charIndex, errors, maxTime, timeLeft) {
    const wpm = Math.round((((charIndex - errors) / 5) / (maxTime - timeLeft)) * 60);
    return {
        wpm: wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm,
        cpm: Math.max(0, charIndex - errors)
    };
}

// Met à jour les statistiques du jeu
export function updateGameStats(stats) {
    if (!stats) return;
    
    try {
        const { errors = 0, corrects = 0, charIndex = 0, maxTime = 60, timeLeft = 60 } = stats;
        const { wpm, cpm } = calculateStats(charIndex, errors, maxTime, timeLeft);
        
        return {
            errors,
            corrects,
            wpm,
            cpm,
            timeLeft
        };
    } catch (error) {
        console.error('Erreur lors de la mise à jour des stats:', error);
        return null;
    }
}