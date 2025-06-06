// === DOM ELEMENTS ===
const coinsDisplay = document.getElementById('coinsAmount');
const buyButtons = document.querySelectorAll('.buy-btn');

// Modal Elements
const modal = document.getElementById('modalAlert');
const modalMessage = document.getElementById('modalMessage');
const modalClose = document.getElementById('modalClose');

// === LOAD DATA ===
let coins = parseInt(localStorage.getItem('snakeCoins')) || 0;
let ownedSkins = JSON.parse(localStorage.getItem('ownedSkins')) || ['green']; // green is default
let selectedSkin = localStorage.getItem('snakeColor') || 'green';

// === UPDATE COINS DISPLAY ===
function updateCoinsDisplay() {
    coinsDisplay.textContent = coins;
}

// === SHOW MODAL ===
function showModal(message) {
    modalMessage.innerHTML = message;
    modal.style.display = 'block';
}

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

// === INITIALIZE SHOP BUTTONS ===
buyButtons.forEach(button => {
    const skinColor = button.dataset.color;
    const price = parseInt(button.dataset.price);

    // If skin already owned → change button text
    if (ownedSkins.includes(skinColor)) {
        button.textContent = (skinColor === selectedSkin) ? 'Selected' : 'Select';
    }

    // Button click handler
    button.addEventListener('click', () => {
        if (ownedSkins.includes(skinColor)) {
            // Skin already owned → select skin
            selectedSkin = skinColor;
            localStorage.setItem('snakeColor', selectedSkin);
            showModal(`Skin changed to <strong>${skinColor}</strong>! 🐍`);

            // Update all buttons text
            buyButtons.forEach(btn => {
                if (btn.dataset.color === selectedSkin) {
                    btn.textContent = 'Selected';
                } else if (ownedSkins.includes(btn.dataset.color)) {
                    btn.textContent = 'Select';
                }
            });

        } else {
            // Try to buy skin
            if (coins >= price) {
                coins -= price;
                ownedSkins.push(skinColor);
                selectedSkin = skinColor;

                // Save to localStorage
                localStorage.setItem('snakeCoins', coins);
                localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));
                localStorage.setItem('snakeColor', selectedSkin);

                updateCoinsDisplay();

                showModal(`You bought <strong>${skinColor}</strong> skin! 🎉`);

                // Update all buttons text
                buyButtons.forEach(btn => {
                    if (btn.dataset.color === selectedSkin) {
                        btn.textContent = 'Selected';
                    } else if (ownedSkins.includes(btn.dataset.color)) {
                        btn.textContent = 'Select';
                    }
                });

            } else {
                showModal(`Not enough coins! 🪙<br>You need ${price} coins.`);
            }
        }
    });
});

// === INIT ===
updateCoinsDisplay();
