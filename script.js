let cart = [];
let wishlist = [];
let allProducts = [];
let allCategories = [];

async function fetchCategories() {
    try {
        const response = await fetch('https://api.escuelajs.co/api/v1/categories');
        allCategories = await response.json();
        populateCategories();
    } catch (error) {
        console.error('Error', error);
    }
}

function populateCategories() {
    const categorySelect = document.getElementById('categorySelect');
    const categoriesGrid = document.getElementById('categoriesGrid');
    
    allCategories.slice(0, 5).forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
        
        const card = document.createElement('div');
        card.className = 'category-card';

        card.onclick = () => {
            categorySelect.value = category.id;
            filterByCategory(category.id);
        };
        categoriesGrid.appendChild(card);
    });
}

async function fetchProducts() {
    try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        allProducts = await response.json();
        renderProducts(allProducts);
        updateProductCount();
    } catch (error) {
        document.getElementById('productsList').innerHTML = '<p>Error loading products</p>';
    }
}


function renderProducts(filteredProducts = allProducts) {
    const productsList = document.getElementById('productsList');
    
    productsList.innerHTML = filteredProducts.map(product => `
        <div class="product">
            <div class="product-image-container">
                <img src="${product.images[0]}" alt="${product.title}" class="product-image" onerror="this.src='https://via.placeholder.com/200x180?text=No+Image'">
                <span class="product-badge">${product.category.name}</span>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.name}</div>
                <div class="product-name">${product.title}</div>
                <div class="product-price">
                    <span class="price-current">$${Math.round(product.price)}</span>
                </div>
                <div class="product-buttons">
                    <button class="btn btn-add" onclick="addToCart('${product.id}', '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.images[0]}')">Add</button>
                </div>
            </div>
        </div>
    `).join('');
    updateProductCount(filteredProducts.length);
}

function updateProductCount(count = allProducts.length) {
    document.getElementById('productCount').textContent = `Showing ${count} products`;
}

function addToCart(productId, productName, productPrice, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, image: image, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`✓ ${productName} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartElements = document.querySelectorAll('#cartCount');
    cartElements.forEach(el => el.textContent = `Cart (${count})`);
}

function filterByCategory(categoryId) {
    if (categoryId === '') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category.id == categoryId);
        renderProducts(filtered);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchCategories();
    fetchProducts();
    updateCartCount();
    
    // Search
    const searchBtn = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.toLowerCase();
            const filtered = allProducts.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.category.name.toLowerCase().includes(query)
            );
            renderProducts(filtered);
        });
    }
    
    // Category filter
    document.getElementById('categorySelect').addEventListener('change', function() {
        filterByCategory(this.value);
    });
    
    // Sort
    document.getElementById('sortSelect').addEventListener('change', function() {
        let sorted = [...allProducts];
        if (this.value === 'Price: Low to High') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (this.value === 'Price: High to Low') {
            sorted.sort((a, b) => b.price - a.price);
        }
        renderProducts(sorted);
    });
    
    // Price slider
    document.getElementById('priceSlider').addEventListener('input', function() {
        document.getElementById('priceValue').textContent = this.value;
        const filtered = allProducts.filter(p => p.price <= this.value);
        renderProducts(filtered);
    });
    
    // Reset filters
    document.querySelector('.btn-reset').addEventListener('click', function() {
        document.getElementById('categorySelect').value = '';
        document.getElementById('sortSelect').value = 'Featured';
        document.getElementById('priceSlider').value = 10000;
        document.getElementById('priceValue').textContent = '10000';
        renderProducts(allProducts);
    });
});