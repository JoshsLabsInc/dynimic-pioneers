// addcartsort.js
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const productGrid = document.getElementById("product-grid");
    const categoryTitle = document.getElementById("category-title");

    // Add null check for elements
    if (!productGrid || !categoryTitle) {
        console.error("Required elements not found!");
        return;
    }


    if (category) {
        categoryTitle.textContent = `Showing all: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
        loadSortedProducts(category);
    } else {
        categoryTitle.textContent = "Showing all products";
        loadSortedProducts();
    }

    function loadSortedProducts(categoryFilter = null) {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        let filteredProducts = categoryFilter ? products.filter(p => p.category === categoryFilter) : products;

        displayProducts(filteredProducts);
    }

    function displayProducts(products) {
        productGrid.innerHTML = "";

        if (products.length === 0) {
            productGrid.innerHTML = "<p>No products found in this category.</p>";
            return;
        }

        products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("card");

            productElement.innerHTML = `
                <div class="product">
                    <a href="product_view.html?productId=${product.id}">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                    </a>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;

            productGrid.appendChild(productElement);
        });

        // Attach event listeners to Add to Cart buttons
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", (event) => {
                const productId = parseInt(event.target.getAttribute("data-id"));
                addToCart(productId);
            });
        });
    }

    const cartElement = document.getElementById("cart-count");

    if (cartElement) {
        cartElement.textContent = "Updated Cart Count";
    } else {
        console.warn("cart-count element not found!");
    }


    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const product = products.find(p => p.id === productId);

        if (product) {
            const existingProduct = cart.find(item => item.id === productId);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                product.quantity = 1;
                cart.push(product);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${product.name} added to cart!`);
        }
    }
});
