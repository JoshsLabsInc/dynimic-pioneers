import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// division-filter.js
import { supabase } from "./index.js"; // Import Supabase client

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchProducts() {
    try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching products from Supabase:", error);
        return [];
    }
}

// ✅ Ensure this function exists before calling it
async function getDivisionProducts() {
    const products = await fetchProducts();
    console.log("Products:", products);
}

export async function getDivisionProducts(division) {
    try {
        const { data: products, error } = await supabase
            .from("products")
            .select("*")
            .eq("division", division);

        if (error) throw error;
        return products || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}
