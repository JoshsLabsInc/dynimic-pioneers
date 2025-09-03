document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    document.getElementById("cart-items").addEventListener("click", handleCartActions);
});

function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const gasCart = cart.filter(item => item.division === "gas");
    renderCart(gasCart);
}

function renderCart(cartItems) {
    const cartBody = document.getElementById("cart-items");
    cartBody.innerHTML = cartItems.map(item => `
        <tr>
            <td><img src="${item.image}" style="width: 50px"></td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
        </tr>
    `).join("");
}

function handleCartActions(event) {
    if (event.target.classList.contains("remove-btn")) {
        const productId = event.target.dataset.id;
        removeItem(productId);
    }
}

function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Convert ID to number if stored as number
    const numericId = typeof productId === "string" ? Number(productId) : productId;
    
    const updatedCart = cart.filter(item => item.id !== numericId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    loadCart(); // Refresh the cart display
    alert("Item removed successfully!");
}

function generateCartLink() {
    const division = 'gas'; // Changed to gas division
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const filteredCart = cart.filter(item => item.division === division);
    
    if (filteredCart.length === 0) {
        alert("Cart is empty! Add items to share.");
        return;
    }

    const cartId = Date.now().toString(36);
    localStorage.setItem(`cart-${cartId}`, JSON.stringify(filteredCart));
    
    const link = `${window.location.origin}/cart_gas.html?cartId=${cartId}`;
    const input = document.getElementById("cart-link");
    input.value = link;
    
    // Copy to clipboard
    input.select();
    document.execCommand("copy");
    alert("Cart link copied to clipboard!");
}