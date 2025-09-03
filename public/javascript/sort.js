import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("product-grid");
    const title = document.getElementById("category-title");
    const sortSelect = document.getElementById("sort-options");
    const searchInput = document.querySelector(".search-bar input");

    const shopType = new URLSearchParams(window.location.search).get("shop");

    function getQueryParam(param) {
        return new URLSearchParams(window.location.search).get(param);
    }

    function formatCategory(category) {
        return category ? category.toLowerCase().replace(/ /g, "-") : "";
    }

    async function fetchProductsFromSupabase() {
        try {
            const { data, error } = await supabase.from("products").select("*");
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching products from Supabase:", error);
            return [];
        }
    }

    async function loadProducts(category, sortBy = "date-desc") {
        let products = await fetchProductsFromSupabase();

        // Filter products based on the selected shop
        if (shopType === "cement") {
            products = products.filter(product =>
                product.name.toLowerCase().includes("grade cement") || 
                product.name.toLowerCase().includes("hydraulic cement")
            );
        } else {
            products = products.filter(product =>
                !product.name.toLowerCase().includes("grade cement") && 
                !product.name.toLowerCase().includes("hydraulic cement")
            );
        }

        // Set title and filter by category
        if (category) {
            title.textContent = `Showing all: ${category.replace(/-/g, " ")}`;
            products = products.filter(product => formatCategory(product.category) === category);
        } else {
            title.textContent = "Showing all: Products";
        }

        sortProducts(products, sortBy);
        renderProducts(products);
    }

    function sortProducts(products, sortBy) {
        switch (sortBy) {
            case "name":
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "category":
                products.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case "date-asc":
                products.sort((a, b) => a.id - b.id);
                break;
            case "date-desc":
                products.sort((a, b) => b.id - a.id);
                break;
        }
    }

    function renderProducts(products) {
        grid.innerHTML = "";
        if (products.length === 0) {
            grid.innerHTML = "<p>No products available.</p>";
            return;
        }

        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("data-name", product.name.toLowerCase());

            card.innerHTML = `
                <a href="product_view.html?productId=${product.id}" class="product-link">
                    <img src="${product.image_url}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                </a>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;

            grid.appendChild(card);
        });

        attachCartButtons();
    }

    function attachCartButtons() {
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", (event) => {
                const productId = event.target.getAttribute("data-id");
                addToCart(productId);
            });
        });
    }

    async function addToCart(productId) {
        let products = await fetchProductsFromSupabase();
        const product = products.find(p => p.id === productId);

        if (!product) return;

        const cartKey = shopType === "gas" ? "cart_gas" : "cart_cement";
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        alert(`${product.name} added to ${shopType === "gas" ? "Gas Division Cart" : "Cement Division Cart"}!`);
    }

    function searchProducts() {
        const query = searchInput.value.toLowerCase();
        document.querySelectorAll("#product-grid .card").forEach(card => {
            const productName = card.getAttribute("data-name");
            card.style.display = productName.includes(query) ? "block" : "none";
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            const category = getQueryParam("category");
            loadProducts(category, e.target.value);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", searchProducts);
    }

    const category = getQueryParam("category");
    loadProducts(category);
});
