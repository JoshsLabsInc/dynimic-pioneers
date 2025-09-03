document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    // Attach remove handler to parent element
    document.getElementById("cart-items").addEventListener("click", handleCartActions);
});

// Global function for removal
window.removeItem = function(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Convert productId to number if needed
    const numericId = Number(productId);
    
    // Filter out the item
    const updatedCart = cart.filter(item => item.id !== numericId);
    
    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Re-render cart
    loadCart();
    alert("Item removed successfully!");
};

function handleCartActions(event) {
    if (event.target.classList.contains("remove-btn")) {
        const productId = event.target.dataset.id;
        removeItem(productId);
    }
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const filteredCart = cart.filter(item => item.division === "concrete"); // Use "gas" for gas division
    renderCart(filteredCart);
}

function renderCart(cartItems) {
    const cartBody = document.getElementById("cart-items");
    cartBody.innerHTML = cartItems.map(item => `
        <tr>
            <td><img src="${item.image}" alt="${item.name}" style="width:50px;"></td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>
                <button class="remove-btn" data-id="${item.id}">
                    Remove
                </button>
            </td>
        </tr>
    `).join("");
}
function generateCartLink() {
    const division = 'concrete'; // Change to 'gas' for gas division
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const filteredCart = cart.filter(item => item.division === division);
    
    if (filteredCart.length === 0) {
        alert("Cart is empty! Add items to share.");
        return;
    }

    const cartId = Date.now().toString(36);
    localStorage.setItem(`cart-${cartId}`, JSON.stringify(filteredCart));
    
    const link = `${window.location.origin}/cart_cement.html?cartId=${cartId}`;
    const input = document.getElementById("cart-link");
    input.value = link;
    
    // Copy to clipboard
    input.select();
    document.execCommand("copy");
    alert("Cart link copied to clipboard!");
}