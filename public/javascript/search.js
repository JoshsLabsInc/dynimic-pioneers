document.addEventListener('DOMContentLoaded', () => {
    const productSections = document.querySelectorAll(".products"); // All product sections
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const searchBar = document.querySelector(".search-bar input");
    const mainContent = document.querySelector("main") || document.querySelector(""); // Fallback if no <main>

    // Create a search results section dynamically
    const searchResultsSection = document.createElement("section");
    searchResultsSection.className = "products search-results";
    searchResultsSection.style.display = "none";
    searchResultsSection.innerHTML = `
        <h2 class="label">Search Results</h2>
        <button id="back-to-products" class="btn">Back to Products</button>
        <div class="grid"></div>
    `;
    mainContent.appendChild(searchResultsSection);
    const searchResultsGrid = searchResultsSection.querySelector(".grid");

    const searchSelector = "#search-input"; // Make sure this has a valid ID
    const searchElement = document.querySelector(searchSelector);
    
    if (searchElement) {
        searchElement.addEventListener("input", searchFunction);
    } else {
        console.warn("Search input not found!");
    }
    
    // Function to create product cards matching index.js
    function createProductCard(product) {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="product">
                <a href="product_view.html?productId=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                </a>
                <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;

        return card;
    }

    // Function to show search results and hide product sections
    function showSearchResults(query) {
        searchResultsGrid.innerHTML = ""; // Clear previous results

        // Filter products by search query
        const matchedProducts = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );

        if (matchedProducts.length > 0) {
            matchedProducts.forEach(product => searchResultsGrid.appendChild(createProductCard(product)));
            searchResultsSection.style.display = "block";
            productSections.forEach(section => section.style.display = "none");
        } else {
            searchResultsGrid.innerHTML = `<p>No products found matching "${query}"</p>`;
        }
    }

    // Search functionality
    if (searchBar) {
        searchBar.addEventListener("input", () => {
            const query = searchBar.value.toLowerCase().trim();
            if (query.length === 0) {
                searchResultsSection.style.display = "none";
                productSections.forEach(section => section.style.display = "block");
            } else {
                showSearchResults(query);
            }
        });
    }

    // Ensure "Back to Products" button works
    document.getElementById("back-to-products").addEventListener("click", () => {
        searchResultsSection.style.display = "none";
        productSections.forEach(section => section.style.display = "block");
    });
});
