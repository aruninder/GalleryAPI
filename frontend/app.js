// API Base URL
const API_BASE = 'http://localhost:4000/api';

// Global variables
let currentUser = null;
let currentToken = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    // Check for saved token
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
        currentToken = savedToken;
        getCurrentUser();
    }

    // Setup event listeners
    setupEventListeners();

    // Load products
    loadProducts();
});

// Setup event listeners
function setupEventListeners() {
    // Auth buttons
    document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
    document.getElementById('registerBtn').addEventListener('click', () => openModal('registerModal'));
    document.getElementById('addProductBtn').addEventListener('click', () => openModal('productModal'));
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('productForm').addEventListener('submit', handleAddProduct);

    // Filters
    document.getElementById('categoryFilter').addEventListener('change', loadProducts);
    document.getElementById('searchBtn').addEventListener('click', loadProducts);
    document.getElementById('clearBtn').addEventListener('click', clearFilters);
    document.getElementById('searchInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            loadProducts();
        }
    });
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Clear form if it exists
    const form = document.querySelector(`#${modalId} form`);
    if (form) {
        form.reset();
    }

    // Reset button states
    if (modalId === 'loginModal') {
        setButtonLoading('loginSubmitBtn', false);
    } else if (modalId === 'registerModal') {
        setButtonLoading('registerSubmitBtn', false);
    } else if (modalId === 'productModal') {
        setButtonLoading('productSubmitBtn', false);
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// API functions
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    if (currentToken) {
        config.headers['Authorization'] = `Bearer ${currentToken}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Button state management
function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validate inputs
    if (!email || !password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    // Set loading state
    setButtonLoading('loginSubmitBtn', true);

    try {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        currentToken = response.data.token;
        currentUser = response.data.user;
        localStorage.setItem('token', currentToken);

        updateAuthUI();
        closeModal('loginModal');
        showMessage('Login successful!', 'success');
        loadProducts();
    } catch (error) {
        showMessage(error.message, 'error');
    } finally {
        // Reset button state
        setButtonLoading('loginSubmitBtn', false);
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const shopName = document.getElementById('registerShopName').value.trim();

    // Validate inputs
    if (!username || !email || !password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }

    // Set loading state
    setButtonLoading('registerSubmitBtn', true);

    try {
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, shopName })
        });

        currentToken = response.data.token;
        currentUser = response.data.user;
        localStorage.setItem('token', currentToken);

        updateAuthUI();
        closeModal('registerModal');
        showMessage('Registration successful!', 'success');
        loadProducts();
    } catch (error) {
        showMessage(error.message, 'error');
    } finally {
        // Reset button state
        setButtonLoading('registerSubmitBtn', false);
    }
}

async function getCurrentUser() {
    try {
        const response = await apiCall('/auth/me');
        currentUser = response.data.user;
        updateAuthUI();
    } catch (error) {
        console.error('Failed to get current user:', error);
        logout();
    }
}

function logout() {
    currentToken = null;
    currentUser = null;
    localStorage.removeItem('token');
    updateAuthUI();
    showMessage('Logged out successfully!', 'success');
    loadProducts();
}

function updateAuthUI() {
    const isLoggedIn = !!currentUser;

    document.getElementById('loginBtn').style.display = isLoggedIn ? 'none' : 'inline-block';
    document.getElementById('registerBtn').style.display = isLoggedIn ? 'none' : 'inline-block';
    document.getElementById('addProductBtn').style.display = isLoggedIn ? 'inline-block' : 'none';
    document.getElementById('logoutBtn').style.display = isLoggedIn ? 'inline-block' : 'none';

    const userInfo = document.getElementById('userInfo');
    if (isLoggedIn) {
        userInfo.textContent = `Welcome, ${currentUser.username}!`;
        userInfo.style.display = 'inline';
    } else {
        userInfo.style.display = 'none';
    }
}

// Product functions
async function handleAddProduct(e) {
    e.preventDefault();

    const title = document.getElementById('productTitle').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = document.getElementById('productPrice').value;
    const imageFile = document.getElementById('productImage').files[0];

    // Validate inputs
    if (!title || !description || !category || !imageFile) {
        showMessage('Please fill in all required fields and select an image', 'error');
        return;
    }

    // Validate image file
    if (!imageFile.type.startsWith('image/')) {
        showMessage('Please select a valid image file', 'error');
        return;
    }

    // Validate file size (5MB limit)
    if (imageFile.size > 5 * 1024 * 1024) {
        showMessage('Image file size must be less than 5MB', 'error');
        return;
    }

    // Set loading state
    setButtonLoading('productSubmitBtn', true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('image', imageFile);

    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add product');
        }

        closeModal('productModal');
        showMessage('Product added successfully!', 'success');
        loadProducts();
    } catch (error) {
        showMessage(error.message, 'error');
    } finally {
        // Reset button state
        setButtonLoading('productSubmitBtn', false);
    }
}

async function loadProducts() {
    const loading = document.getElementById('loading');
    const productGrid = document.getElementById('productGrid');

    loading.style.display = 'block';
    productGrid.innerHTML = '';

    try {
        const category = document.getElementById('categoryFilter').value;
        const search = document.getElementById('searchInput').value;

        let endpoint = '/products?';
        const params = new URLSearchParams();

        if (category) params.append('category', category);
        if (search) params.append('search', search);

        endpoint += params.toString();

        const response = await apiCall(endpoint);
        const products = response.data.products;

        loading.style.display = 'none';

        if (products.length === 0) {
            productGrid.innerHTML = '<div class="loading">No products found.</div>';
            return;
        }

        products.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });

    } catch (error) {
        loading.style.display = 'none';
        showMessage(error.message, 'error');
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const canDelete = currentUser && product.shopId._id === currentUser._id;

    card.innerHTML = `
        <img src="${product.imageURL}" alt="${product.title}" class="product-image">
        <div class="product-title">${product.title}</div>
        <div class="product-description">${product.description}</div>
        ${product.price ? `<div class="product-price">$${product.price}</div>` : ''}
        <div class="product-meta">
            <span class="category-tag">${product.category}</span>
            <div class="shop-info">
                <small>by ${product.shopId.shopName || product.shopId.username}</small>
            </div>
        </div>
        ${canDelete ? `
            <div style="margin-top: 10px;">
                <button class="btn btn-danger delete-btn" onclick="deleteProduct('${product._id}', this)" id="delete-${product._id}">
                    <span class="btn-text">Delete</span>
                    <span class="btn-loading" style="display: none;">Deleting...</span>
                </button>
            </div>
        ` : ''}
    `;

    return card;
}

async function deleteProduct(productId, buttonElement) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    // Set loading state for delete button
    buttonElement.classList.add('loading');
    buttonElement.disabled = true;

    try {
        await apiCall(`/products/${productId}`, {
            method: 'DELETE'
        });

        showMessage('Product deleted successfully!', 'success');
        loadProducts();
    } catch (error) {
        showMessage(error.message, 'error');
        // Reset button state on error
        buttonElement.classList.remove('loading');
        buttonElement.disabled = false;
    }
}

function clearFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('searchInput').value = '';
    loadProducts();
}

// Utility functions
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="${type}">${message}</div>`;

    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}
