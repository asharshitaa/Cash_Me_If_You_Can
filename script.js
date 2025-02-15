// Store wishes in array
let wishes = [];

// Form submission handler for new wishes
document.getElementById('newWishForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const wish = {
        id: Date.now(),
        title: document.getElementById('wishTitle').value,
        targetAmount: parseFloat(document.getElementById('wishAmount').value),
        currentAmount: 0,
        tags: document.getElementById('wishTags').value.split(',').map(tag => tag.trim()),
        contributors: [],
        dateCreated: new Date()
    };

    // Add new wish to the beginning of the array
    wishes.unshift(wish);
    updateWishList();
    this.reset();
});

// Function to update the wish list display
function updateWishList() {
    const container = document.getElementById('wishListContainer');
    container.innerHTML = '';

    wishes.forEach(wish => {
        const progress = (wish.currentAmount / wish.targetAmount) * 100;
        
        const wishElement = document.createElement('div');
        wishElement.className = 'wish-item';
        wishElement.innerHTML = `
            <h3>${wish.title}</h3>
            <div class="progress-bar">
                <div class="progress" style="width: ${progress}%"></div>
            </div>
            <div class="amount-display">
                $${wish.currentAmount} raised of $${wish.targetAmount}
            </div>
            ${wish.currentAmount >= wish.targetAmount ? 
                '<div class="goal-reached">Goal Reached! 🎉</div>' :
                `<div class="contribution-form">
                    <input type="number" id="amount-${wish.id}" placeholder="Amount" min="1">
                    <button onclick="contribute(${wish.id})">Contribute</button>
                </div>`
            }
        `;
        container.appendChild(wishElement);
    });
}

// Function to handle contributions
function contribute(wishId) {
    const amountInput = document.getElementById(`amount-${wishId}`);
    const amount = parseFloat(amountInput.value);
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    const wish = wishes.find(w => w.id === wishId);
    if (wish) {
        const newTotal = wish.currentAmount + amount;
        
        if (newTotal >= wish.targetAmount) {
            wish.currentAmount = wish.targetAmount;
            updateWishList();
            alert('Target amount has been reached! 🎉');
        } else {
            wish.currentAmount += amount;
            wish.contributors.push({
                amount: amount,
                date: new Date()
            });
            updateWishList();
        }
        amountInput.value = '';
    }
}



// Initial render
updateWishList();