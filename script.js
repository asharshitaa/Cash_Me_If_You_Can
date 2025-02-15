// // Store wishes in array
// let wishes = [];

// // Form submission handler for new wishes
// document.getElementById('newWishForm').addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     const wish = {
//         id: Date.now(),
//         title: document.getElementById('wishTitle').value,
//         targetAmount: parseFloat(document.getElementById('wishAmount').value),
//         currentAmount: 0,
//         tags: document.getElementById('wishTags').value.split(',').map(tag => tag.trim()),
//         contributors: [],
//         dateCreated: new Date()
//     };

//     // Add new wish to the beginning of the array
//     wishes.unshift(wish);
//     updateWishList();
//     this.reset();
// });

// // Function to update the wish list display
// function updateWishList() {
//     const container = document.getElementById('wishListContainer');
//     container.innerHTML = '';

//     wishes.forEach(wish => {
//         const progress = (wish.currentAmount / wish.targetAmount) * 100;
        
//         const wishElement = document.createElement('div');
//         wishElement.className = 'wish-item';
//         wishElement.innerHTML = `
//             <h3>${wish.title}</h3>
//             <div class="progress-bar">
//                 <div class="progress" style="width: ${progress}%"></div>
//             </div>
//             <div class="amount-display">
//                 $${wish.currentAmount} raised of $${wish.targetAmount}
//             </div>
//             ${wish.currentAmount >= wish.targetAmount ? 
//                 '<div class="goal-reached">Goal Reached! 🎉</div>' :
//                 `<div class="contribution-form">
//                     <input type="number" id="amount-${wish.id}" placeholder="Amount" min="1">
//                     <button onclick="contribute(${wish.id})">Contribute</button>
//                 </div>`
//             }
//         `;
//         container.appendChild(wishElement);
//     });
// }

// // Function to handle contributions
// function contribute(wishId) {
//     const amountInput = document.getElementById(`amount-${wishId}`);
//     const amount = parseFloat(amountInput.value);
    
//     if (!amount || amount <= 0) {
//         alert('Please enter a valid amount');
//         return;
//     }

//     const wish = wishes.find(w => w.id === wishId);
//     if (wish) {
//         const newTotal = wish.currentAmount + amount;
        
//         if (newTotal >= wish.targetAmount) {
//             wish.currentAmount = wish.targetAmount;
//             updateWishList();
//             alert('Target amount has been reached! 🎉');
//         } else {
//             wish.currentAmount += amount;
//             wish.contributors.push({
//                 amount: amount,
//                 date: new Date()
//             });
//             updateWishList();
//         }
//         amountInput.value = '';
//     }
// }


let wishes = [];

// Load saved data on page load
window.onload = function() {
    loadData();
};

// Handle dynamic split input fields
document.getElementById('splitCount').addEventListener('input', function() {
    const count = parseInt(this.value);
    const splitInputs = document.getElementById('splitInputs');
    splitInputs.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'split-item';
        div.innerHTML = `
            <input type="text" placeholder="Category Name" class="split-name" required>
            <input type="number" placeholder="Amount" class="split-amount" min="1" required>
        `;
        splitInputs.appendChild(div);
    }
});

// Handle new wish submission
document.getElementById('newWishForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('wishTitle').value;
    const splitNames = document.querySelectorAll('.split-name');
    const splitAmounts = document.querySelectorAll('.split-amount');

    let splits = [];
    let totalAmount = 0;

    splitNames.forEach((name, index) => {
        const category = name.value.trim();
        const amount = parseFloat(splitAmounts[index].value);
        if (category && amount > 0) {
            splits.push({ category, amount, currentAmount: 0 });
            totalAmount += amount;
        }
    });

    const wish = {
        id: Date.now(),
        title,
        totalAmount,
        splits,
        dateCreated: new Date()
    };

    wishes.unshift(wish);
    updateWishList();
    this.reset();
    document.getElementById('splitInputs').innerHTML = ''; // Clear dynamic inputs
});

// Update wish list display
function updateWishList() {
    const container = document.getElementById('wishListContainer');
    container.innerHTML = '';

    wishes.forEach(wish => {
        const wishElement = document.createElement('div');
        wishElement.className = 'wish-item';
        wishElement.innerHTML = `
            <h3>${wish.title}</h3>
            <div class="amount-display">$0 raised of $${wish.totalAmount}</div>
            <div class="split-container">
                ${wish.splits.map(split => `
                    <div class="split-item">
                        <div class="split-info">
                            <span>${split.category}</span>
                            <span>$${split.currentAmount} / $${split.amount}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${(split.currentAmount / split.amount) * 100}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(wishElement);
    });

    saveData(); // Save data after updating UI
}

// Save and load data
function saveData() {
    localStorage.setItem('wishes', JSON.stringify(wishes));
}

function loadData() {
    const storedWishes = localStorage.getItem('wishes');
    if (storedWishes) {
        wishes = JSON.parse(storedWishes);
        updateWishList();
    }
}

// Reset Page
document.getElementById('resetPage').addEventListener('click', function() {
    localStorage.removeItem('wishes');
    wishes = [];
    updateWishList();
    alert('Page reset! All data cleared.');
});
