import supabase from "./client";

const supabaseUrl = "YOUR_SUPABASE_URL"; // Replace with your actual Supabase URL

document.addEventListener("DOMContentLoaded", () => {
    const addProductForm = document.getElementById("add-product-form");
    const productTableBody = document.querySelector("#product-table tbody");
    const statusMessage = document.getElementById("status-message");

    if (!addProductForm || !productTableBody || !statusMessage) {
        console.error("One or more required elements not found.");
        return;
    }

    addProductForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        await handleProductUpload();
    });

    renderProductTable();
});

async function handleProductUpload() {
    const name = document.getElementById("product-name").value.trim();
    const division = document.getElementById("product-division").value.trim();
    const category = document.getElementById("product-category").value.trim();
    const description = document.getElementById("product-description").value.trim();
    const imageFile = document.getElementById("product-image").files[0];

    if (!name || !division || !category || !description || !imageFile) {
        showStatus("Please fill in all fields.", "error");
        return;
    }

    try {
        showStatus("Uploading product, please wait...", "info");

        const imageUrl = await uploadImageToSupabase(imageFile);
        if (!imageUrl) throw new Error("Image upload failed.");

        const { data, error } = await supabase.from("add-product-form").insert([
            { name, division, category, description, image_url: imageUrl }
        ]);

        if (error) throw error;

        showStatus(`✅ Product "${name}" added successfully!`, "success");
        document.getElementById("add-product-form").reset();
        renderProductTable();
    } catch (error) {
        console.error("❌ Upload error:", error);
        showStatus("Error adding product: " + error.message, "error");
    }
}

async function uploadImageToSupabase(file) {
    const fileName = `products/${crypto.randomUUID()}_${file.name}`;
    const { data, error } = await supabase.storage.from("products").upload(fileName, file);

    if (error) {
        console.error("❌ Error uploading image:", error);
        return null;
    }

    return `${supabaseUrl}/storage/v1/object/public/products/${fileName}`;
}

async function renderProductTable() {
    const productTableBody = document.querySelector("#product-table tbody");
    if (!productTableBody) {
        console.error("Product table not found!");
        return;
    }
    productTableBody.innerHTML = "";
    try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;
        data.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${product.image_url}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td>${product.name}</td>
                <td>${product.division === "gas" ? "Oil & Gas" : "Concrete"}</td>
                <td>${product.category}</td>
                <td>${product.description}</td>
                <td><button class="remove-btn" data-id="${product.id}" data-image="${product.image_url}">Remove</button></td>
            `;
            productTableBody.appendChild(row);
        });
        attachRemoveListeners();
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

async function removeProduct(productId, imageUrl) {
    try {
        const imagePath = imageUrl.replace(`${supabaseUrl}/storage/v1/object/public/products/`, "");
        await supabase.storage.from("products").remove([imagePath]);

        await supabase.from("products").delete().eq("id", productId);
        showStatus("✅ Product removed successfully!", "success");
        renderProductTable();
    } catch (error) {
        console.error("Error removing product:", error);
        showStatus("❌ Error removing product: " + error.message, "error");
    }
}

function attachRemoveListeners() {
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = e.target.dataset.id;
            const imageUrl = e.target.dataset.image;
            removeProduct(productId, imageUrl);
        });
    });
}

function showStatus(message, type) {
    const statusMessage = document.getElementById("status-message");
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    setTimeout(() => statusMessage.textContent = "", 3000);
}
