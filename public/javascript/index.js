import supabase from "../admin/client"


document.addEventListener("DOMContentLoaded", async () => {
    const productContainers = document.querySelectorAll(".products .grid");
    const shopType = new URLSearchParams(window.location.search).get("shop");

    const divisionMap = {
        gas: "gas",
        cement: "concrete"
    };
    const currentDivision = divisionMap[shopType] || "concrete";

    async function fetchSupabaseProducts() {
        try {
            const { data: products, error } = await supabase.from("add-product-form").select("*");
            if (error) throw error;
            return products || [];
        } catch (error) {
            console.error("Error fetching products from Supabase:", error);
            alert("Failed to load products. Please try again later.");
            return [];
        }
    }

    async function loadProducts() {
        productContainers.forEach(container => {
            container.innerHTML = "<p>Loading products...</p>";
        });

        let products = await fetchSupabaseProducts();
        let filteredProducts = products.filter(product => product.division && product.division === currentDivision);

        if (filteredProducts.length === 0) {
            productContainers.forEach(container => {
                container.innerHTML = "<p>No products found for this division.</p>";
            });
            return;
        }

        displayProducts(filteredProducts);
    }

    window.addToCart = function(productId) {
        fetchSupabaseProducts().then(products => {
            let product = products.find(p => p.id === productId);
            if (product) {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingProduct = cart.find(p => p.id === productId);

                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    product.quantity = 1;
                    cart.push(product);
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                alert(`${product.name} added to cart!`);
            } else {
                alert("Product not found.");
            }
        }).catch(error => {
            console.error("Error adding product to cart:", error);
            alert("Failed to add product to cart. Please try again.");
        });
    };

    function displayProducts(products) {
        productContainers.forEach(container => {
            container.innerHTML = "";
            products.forEach(product => {
                if (!product.image_url || !product.name || !product.description) {
                    console.warn("Invalid product data:", product);
                    return;
                }

                const productElement = document.createElement("div");
                productElement.classList.add("card");
                productElement.innerHTML = `
                    <div class="product">
                        <a href="product_view.html?productId=${product.id}">
                            <img src="${product.image_url}" alt="${product.name}" class="product-image">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                        </a>
                        <button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
                    </div>
                `;
                container.appendChild(productElement);
            });
        });
    }

    loadProducts();
});