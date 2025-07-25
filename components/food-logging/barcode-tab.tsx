"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Barcode, Loader2, Scan } from "lucide-react";

interface BarcodeTabProps {
  onFoodDetect: (foodName: string) => void;
}

export function BarcodeTab({ onFoodDetect }: BarcodeTabProps) {
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
        const foodName = data.product.product_name || "Unknown Product";
        onFoodDetect(foodName); // Pass food name to quantity dialog
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
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Barcode className="w-5 h-5 mr-2 text-purple-600" />
          Barcode Scanner
        </CardTitle>
        <CardDescription>Scan or enter a product barcode for instant nutrition data</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barcode" className="text-sm font-medium">Barcode Number</Label>
            <Input
              id="barcode"
              type="text"
              placeholder="Enter barcode number (e.g., 1234567890123)"
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              className="border-2 border-purple-200 focus:border-purple-400 h-12 text-base"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !barcode.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Looking up...
              </div>
            ) : (
              <>
                <Scan className="w-4 h-4 mr-2" />
                Search Barcode
              </>
            )}
          </Button>

          {error && (
            <div className="text-red-600 font-medium text-sm bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}

          <div className="text-xs text-gray-500 bg-purple-50 p-2 rounded-lg border border-purple-100">
            💡 <strong>Tip:</strong> You can find barcodes on most packaged foods. Ensure good lighting for mobile scanning.
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Keep default export for backwards compatibility
export default BarcodeTab;