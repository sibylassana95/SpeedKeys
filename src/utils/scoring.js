/**
 * Calcule un score basé sur plusieurs facteurs
 * @param {Object} params Les paramètres pour calculer le score
 * @param {number} params.charIndex L'index du caractère actuel
 * @param {number} params.errors Le nombre d'erreurs
 * @param {number} params.corrects Le nombre de caractères corrects
 * @param {number} params.timeSpent Le temps passé en secondes
 * @param {number} params.totalTime Le temps total alloué en secondes
 * @param {number} params.textLength La longueur totale du texte
 * @returns {Object} Les statistiques détaillées du score
 */
export function calculateFinalScore({
    charIndex,
    errors,
    corrects,
    timeSpent,
    totalTime,
    textLength
}) {
    // Vérification des types des paramètres
    if (typeof charIndex !== 'number' || typeof errors !== 'number' || typeof corrects !== 'number' ||
        typeof timeSpent !== 'number' || typeof totalTime !== 'number' || typeof textLength !== 'number') {
        throw new Error('Tous les paramètres doivent être des nombres');
    }

    // Vitesse de frappe (WPM)
    const wpm = Math.round((((charIndex - errors) / 5) / (timeSpent / 60)));

    // Précision (%)
    const accuracy = Math.round((corrects / (corrects + errors)) * 100) || 0;

    // Progression (% du texte complété)
    const completion = Math.round((charIndex / textLength) * 100);

    // Score de base (sur 100)
    let baseScore = Math.round((wpm * 0.4) + (accuracy * 0.4) + (completion * 0.2));

    // Bonus de temps
    const timeBonus = Math.round((totalTime - timeSpent) * 0.5);

    // Bonus de précision
    const accuracyBonus = accuracy >= 98 ? 20 : accuracy >= 95 ? 10 : 0;

    // Score final
    const finalScore = Math.min(100, Math.max(0, baseScore + timeBonus + accuracyBonus));

    // Grade basé sur le score final
    const grade = getGrade(finalScore);

    return {
        wpm,
        accuracy,
        completion,
        timeBonus,
        accuracyBonus,
        finalScore,
        grade
    };
}

/**
 * Détermine le grade en fonction du score
 * @param {number} score Le score final
 * @returns {string} Le grade obtenu
 */
function getGrade(score) {
    if (typeof score !== 'number') {
        throw new Error('Le score doit être un nombre');
    }
    if (score >= 95) return 'S+';
    if (score >= 90) return 'S';
    if (score >= 85) return 'A+';
    if (score >= 70) return 'A';
    if (score >= 60) return 'B+';
    if (score >= 50) return 'B';
    if (score >= 40) return 'C+';
    if (score >= 30) return 'C';
    return 'D';
}