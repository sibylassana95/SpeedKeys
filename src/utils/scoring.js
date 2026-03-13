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
    const timeSpentMin = (timeSpent || 1) / 60;
    const wpm = Math.max(0, Math.round(((charIndex / 5) / timeSpentMin)));

    // Précision (%)
    const totalTyped = corrects + errors;
    const accuracy = totalTyped > 0 ? Math.round((corrects / totalTyped) * 100) : 0;

    // Progression (% du texte complété)
    const completion = Math.round((charIndex / textLength) * 100);

    // Score de base (sur 100)
    let baseScore = Math.round((wpm * 0.4) + (accuracy * 0.4) + (completion * 0.2));

    // Grade calculation
    let grade = 'E';
    if (wpm >= 80 && accuracy >= 98) grade = 'S';
    else if (wpm >= 60 && accuracy >= 95) grade = 'A';
    else if (wpm >= 40 && accuracy >= 90) grade = 'B';
    else if (wpm >= 20 && accuracy >= 80) grade = 'C';
    else if (charIndex > 0) grade = 'D';

    return {
        wpm,
        accuracy,
        completion,
        grade,
        finalScore: baseScore
    };
}
