document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("productId");
    
    if (productId) {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const product = products.find(p => p.id === parseInt(productId));
        
        if (product) {
            displayRecommendations(product.category, productId);
        }
    }
});

function displayRecommendations(category, currentProductId) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const recommendations = products.filter(p => p.category === category && p.id !== parseInt(currentProductId));
    
    const recommendationsContainer = document.createElement("div");
    recommendationsContainer.classList.add("recommendations");
    document.body.appendChild(recommendationsContainer);
    
    recommendations.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("recommendation-item");
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="100">
            <p>${product.name}</p>
            <a href="product_view.html?productId=${product.id}">View</a>
        `;
        recommendationsContainer.appendChild(productElement);
    });
}
