"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface BarcodeTabProps {
  onFoodSelect: (food: any) => void;
}

const BarcodeTab: React.FC<BarcodeTabProps> = ({ onFoodSelect }) => {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const food = {
          id: Date.now(),
          name: data.product.product_name || "Unknown Product",
          calories: data.product.nutriments?.['energy-kcal_100g'] || 0,
          protein: data.product.nutriments?.['proteins_100g'] || 0,
          carbs: data.product.nutriments?.['carbohydrates_100g'] || 0,
          fats: data.product.nutriments?.['fat_100g'] || 0,
          per: "100g",
        };
        onFoodSelect(food);
        setBarcode("");
      } else {
        setError("No product found for this barcode.");
      }
    } catch (e) {
      setError("Failed to fetch product details.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center w-full max-w-md mx-auto mt-6">
      <input
        type="text"
        placeholder="Enter barcode number"
        value={barcode}
        onChange={e => setBarcode(e.target.value)}
        className="w-full p-3 border-2 border-emerald-400 rounded focus:outline-none focus:border-emerald-600 text-lg"
        required
      />
      <Button
        type="submit"
        disabled={loading || !barcode.trim()}
        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 text-lg font-semibold py-3 rounded shadow"
      >
        {loading ? "Looking up..." : "Search Barcode"}
      </Button>
      {error && <div className="text-red-600 font-medium mt-2">{error}</div>}
    </form>
  );
};

export default BarcodeTab;