// Add this to your existing JavaScript code

// Function to update the order form with selected items
function updateOrderForm() {
    if (cart.length === 0) {
        orderTextarea.value = '';
        return;
    }
    
    let orderText = '';
    let total = 0;
    
    cart.forEach(item => {
        orderText += `${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}\n`;
        total += item.price * item.quantity;
    });
    
    // Add total at the end
    orderText += `\nTotal: ₹${total}`;
    
    orderTextarea.value = orderText;
}

// Function to add menu item to order form directly
function addToOrderForm(itemName, itemPrice, quantity = 1) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: itemName,
            price: parseInt(itemPrice),
            quantity: quantity
        });
    }
    
    // Update UI
    updateCartCount();
    updateOrderForm();
    showNotification();
    
    // Scroll to order form if not visible
    const orderSection = document.getElementById('orders');
    const headerHeight = document.getElementById('header').offsetHeight;
    window.scrollTo({
        top: orderSection.offsetTop - headerHeight,
        behavior: 'smooth'
    });
}

// Modify the existing order button event listeners
document.querySelectorAll('.order-btn').forEach(button => {
    button.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = this.getAttribute('data-price');
        addToOrderForm(name, price);
    });
});

// Add quantity selector to menu items
document.querySelectorAll('.menu-item').forEach(item => {
    const contentDiv = item.querySelector('.menu-item-content');
    const orderBtn = item.querySelector('.order-btn');
    
    // Create quantity controls
    const quantityControls = document.createElement('div');
    quantityControls.className = 'quantity-controls';
    quantityControls.style.display = 'none';
    quantityControls.style.marginTop = '10px';
    quantityControls.style.justifyContent = 'center';
    quantityControls.style.display = 'flex';
    quantityControls.style.gap = '10px';
    quantityControls.style.alignItems = 'center';
    
    const decreaseBtn = document.createElement('button');
    decreaseBtn.innerHTML = '-';
    decreaseBtn.style.padding = '5px 10px';
    decreaseBtn.style.border = 'none';
    decreaseBtn.style.borderRadius = '4px';
    decreaseBtn.style.backgroundColor = '#f0f0f0';
    decreaseBtn.style.cursor = 'pointer';
    
    const quantityDisplay = document.createElement('span');
    quantityDisplay.className = 'quantity-display';
    quantityDisplay.textContent = '1';
    quantityDisplay.style.minWidth = '20px';
    quantityDisplay.style.textAlign = 'center';
    
    const increaseBtn = document.createElement('button');
    increaseBtn.innerHTML = '+';
    increaseBtn.style.padding = '5px 10px';
    increaseBtn.style.border = 'none';
    increaseBtn.style.borderRadius = '4px';
    increaseBtn.style.backgroundColor = '#f0f0f0';
    increaseBtn.style.cursor = 'pointer';
    
    quantityControls.appendChild(decreaseBtn);
    quantityControls.appendChild(quantityDisplay);
    quantityControls.appendChild(increaseBtn);
    
    // Insert before the order button
    orderBtn.parentNode.insertBefore(quantityControls, orderBtn);
    
    let quantity = 1;
    
    // Event listeners for quantity controls
    decreaseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });
    
    increaseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        quantity++;
        quantityDisplay.textContent = quantity;
    });
    
    // Modify the order button to use selected quantity
    orderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const name = this.getAttribute('data-name');
        const price = this.getAttribute('data-price');
        const currentQuantity = parseInt(this.parentNode.querySelector('.quantity-display').textContent);
        addToOrderForm(name, price, currentQuantity);
    });
});

// Add this CSS to your style section to enhance the quantity controls
const quantityControlStyle = `
.quantity-controls button {
    transition: all 0.3s ease;
}
.quantity-controls button:hover {
    background-color: var(--primary-color) !important;
    color: white;
}
`;
const styleElement = document.createElement('style');
styleElement.innerHTML = quantityControlStyle;
document.head.appendChild(styleElement);