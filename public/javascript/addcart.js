document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("productId");

    if (productId) {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const product = products.find(p => p.id === parseInt(productId));

        if (product) {
            document.querySelector(".product-image").src = product.image;
            document.querySelector(".product-image").alt = product.name;
            document.getElementById("product-name").textContent = product.name;
            document.getElementById("product-category").textContent = product.category;
            document.getElementById("product-description").textContent = product.description;

            // Add to Cart button functionality
            document.querySelector(".add-to-cart").addEventListener("click", () => {
                addToCart(product);
            });
        } else {
            document.querySelector(".product-view").innerHTML = "<p>Product not found.</p>";
        }
    } else {
        document.querySelector(".product-view").innerHTML = "<p>Product ID not provided.</p>";
    }
});

const cartElement = document.getElementById("cart-count");

if (cartElement) {
    cartElement.textContent = "Updated Cart Count";
} else {
    console.warn("cart-count element not found!");
}

// In addcart.js
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const quantity = parseInt(document.getElementById("quantity").value) || 1; // Get quantity
    const division = product.division; // Ensure division is stored with product

    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ ...product, quantity, division }); // Include division
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} (x${quantity}) added to cart!`);
}
