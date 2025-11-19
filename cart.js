function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="padding: 20px; text-align: center;">Your cart is empty</p>';
        updateCartSummary(cart);
        return;
    }
    
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="price">$${item.price}</p>
                <div class="quantity-control">
                    <button onclick="updateQuantity(${index}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="btn-remove" onclick="removeFromCart(${index})">Remove</button>
            </div>
        </div>
    `).join('');
    
    updateCartSummary(cart);
    updateCartCount(cart);
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function updateCartCount(cart) {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = `Cart (${count})`;
}

function checkout() {
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Please login first!');
        window.location.href = 'account.html';
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    alert('Order placed successfully! Thank you for your purchase.');
    localStorage.removeItem('cart');
    window.location.href = 'Project.html';
}

document.addEventListener('DOMContentLoaded', renderCart);