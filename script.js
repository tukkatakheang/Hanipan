document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productsList = document.getElementById('productsList');
    const submitButton = document.querySelector('.btn-primary');
    let editingProductId = null;
    
    // Load products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Display existing products
    renderProducts();
    
    // Handle form submission
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('productName').value,
            sku: document.getElementById('sku').value,
            price: document.getElementById('price').value,
            quantity: document.getElementById('quantity').value,
            category: document.getElementById('category').value,
            status: document.getElementById('status').value
        };

        if (editingProductId) {
            // Update existing product
            products = products.map(product => {
                if (product.id === editingProductId) {
                    return { ...product, ...productData };
                }
                return product;
            });
            editingProductId = null;
            submitButton.textContent = 'បន្ថែមផលិតផល';
        } else {
            // Add new product
            products.push({
                id: Date.now(),
                ...productData
            });
        }
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(products));
        
        // Render products
        renderProducts();
        
        // Reset form
        productForm.reset();
    });
    
    // Render products function
    function renderProducts() {
        productsList.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.sku}</td>
                <td>$${product.price}</td>
                <td>${product.quantity}</td>
                <td>${product.category}</td>
                <td>${product.status}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct(${product.id})">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">
                        <span class="material-icons">delete</span>
                    </button>
                </td>
            `;
            productsList.appendChild(row);
        });
    }
    
    // Edit product function
    window.editProduct = (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            // Fill form with product data
            document.getElementById('productName').value = product.name;
            document.getElementById('sku').value = product.sku;
            document.getElementById('price').value = product.price;
            document.getElementById('quantity').value = product.quantity;
            document.getElementById('category').value = product.category;
            document.getElementById('status').value = product.status;
            
            // Set editing state
            editingProductId = id;
            submitButton.textContent = 'រក្សាទុកការផ្លាស់ប្តូរ';
            
            // Scroll to form
            document.querySelector('.add-product-form').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    };
    
    // Delete product function
    window.deleteProduct = (id) => {
        if (confirm('តើអ្នកពិតជាចង់លុបផលិតផលនេះមែនទេ?')) {
            products = products.filter(product => product.id !== id);
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts();
        }
    };
});
// Add this new function
window.printProducts = () => {
    // Add current date to the table for printing
    const productsTable = document.querySelector('.products-table');
    const currentDate = new Date().toLocaleDateString('km-KH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    productsTable.setAttribute('data-print-date', currentDate);

    // Create a print-specific table header
    const printHeader = document.createElement('div');
    printHeader.className = 'print-header';
    
    // Print the document
    window.print();
};

// Update the renderProducts function to include more details
function renderProducts() {
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>$${parseFloat(product.price).toLocaleString('km-KH')}</td>
            <td>${parseInt(product.quantity).toLocaleString('km-KH')}</td>
            <td>${translateCategory(product.category)}</td>
            <td>${product.status === 'active' ? 'សកម្ម' : 'អសកម្ម'}</td>
            <td class="action-buttons">
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <span class="material-icons">edit</span>
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    <span class="material-icons">delete</span>
                </button>
            </td>
        `;
        productsList.appendChild(row);
    });
}

// Add this helper function for category translation
function translateCategory(category) {
    const categories = {
        'electronics': 'អេឡិចត្រូនិច',
        'clothing': 'សម្លៀកបំពាក់',
        'food': 'អាហារ'
    };
    return categories[category] || category;
}

// Update the existing styles for action buttons
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .action-buttons {
            white-space: nowrap;
        }
        
        @media print {
            .action-buttons {
                display: none;
            }
            
            /* Add page break rules */
            tr {
                page-break-inside: avoid;
            }
            
            thead {
                display: table-header-group;
            }
            
            tfoot {
                display: table-footer-group;
            }
        }
    </style>
`);