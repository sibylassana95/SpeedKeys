import { KEYBOARD_LAYOUTS } from '../constants.js';

export function renderKeyboard(container, layoutName = 'azerty') {
    if (!container) return;

    const layout = KEYBOARD_LAYOUTS[layoutName];
    if (!layout) return;

    container.innerHTML = '';
    const keyboardDiv = document.createElement('div');
    keyboardDiv.className = 'flex flex-col gap-2 items-center bg-gray-100 dark:bg-gray-800/50 p-6 rounded-2xl';

    layout.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'flex gap-2 w-full justify-center';

        row.forEach(key => {
            const keyDiv = document.createElement('div');
            keyDiv.className = 'key';
            keyDiv.textContent = key === 'Space' ? '' : key;
            keyDiv.dataset.key = key.toLowerCase();

            // Special key widths
            if (key === 'Backspace') keyDiv.classList.add('key-wide');
            if (key === 'Tab') keyDiv.classList.add('key-wide');
            if (key === 'CapsLock') keyDiv.classList.add('key-wide');
            if (key === 'Enter') keyDiv.classList.add('key-wide');
            if (key === 'Shift') keyDiv.classList.add('key-extra-wide');
            if (key === 'Space') {
                keyDiv.classList.add('key-space');
                keyDiv.dataset.key = ' ';
            }

            rowDiv.appendChild(keyDiv);
        });

        keyboardDiv.appendChild(rowDiv);
    });

    container.appendChild(keyboardDiv);
}

export function highlightKey(key) {
    // Remove previous highlights
    document.querySelectorAll('.key.active').forEach(el => el.classList.remove('active'));

    if (!key) return;

    const keyLower = key.toLowerCase();
    const keyElement = Array.from(document.querySelectorAll('.key'))
        .find(el => el.dataset.key === keyLower);

    if (keyElement) {
        keyElement.classList.add('active');
    }
}
