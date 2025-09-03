document.addEventListener("DOMContentLoaded", function () {
    // Check if the user is logged in (assuming 'isLoggedIn' is stored in localStorage)
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn === "true") {
        // Find the login menu item and remove it
        const navLinks = document.querySelectorAll("nav ul li");
        
        navLinks.forEach((li) => {
            const link = li.querySelector("a");
            if (link && link.getAttribute("href") === "login.html") {
                li.remove();
            }
        });
    }

    // Function to check if server is available
    async function isServerAvailable() {
        try {
            // Placeholder URL - update when a server is available
            const response = await fetch("https://your-server-endpoint.com/check", { method: "GET" });
            return response.ok;
        } catch (error) {
            return false; // Server is unreachable
        }
    }

    // Function to load and display products
    async function loadProducts() {
        let products = [];
        const serverAvailable = await isServerAvailable();

        if (serverAvailable) {
            // Fetch products from the server (Placeholder - update when server is available)
            const response = await fetch("https://your-server-endpoint.com/products");
            products = await response.json();
        } else {
            // Fetch products from localStorage
            products = JSON.parse(localStorage.getItem("products")) || [];
        }

        const productContainer = document.getElementById("featured-products");
        productContainer.innerHTML = "";

        products.forEach((product) => {
            const productElement = document.createElement("div");
            productElement.classList.add("product-item");
            
            // Add a dot indicator for source (green for server, red for localStorage)
            const dotColor = product.source === "server" ? "green" : "red";
            
            productElement.innerHTML = `
                <div class="product">
                    <span class="dot" style="background-color: ${dotColor};"></span>
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                </div>
            `;
            
            productContainer.appendChild(productElement);
        });
    }

    // Load products when the page loads
    loadProducts();
});
