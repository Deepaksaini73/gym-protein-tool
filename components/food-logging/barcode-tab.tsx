import React, { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@/components/ui/button";

interface BarcodeTabProps {
  onFoodSelect: (food: any) => void;
}

export default function BarcodeTab({ onFoodSelect }: BarcodeTabProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");

  useEffect(() => {
    let codeReader: BrowserMultiFormatReader | null = null;
    let stopFn: (() => void) | null = null;
    if (scanning && videoRef.current) {
      codeReader = new BrowserMultiFormatReader();
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera not supported in this browser or device.");
        setScanning(false);
        return;
      }
      codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
        if (result) {
          setScanning(false);
          fetchFoodDetails(result.getText());
          if (typeof codeReader.reset === 'function') codeReader.reset();
          else if (typeof codeReader.stopContinuousDecode === 'function') codeReader.stopContinuousDecode();
        }
      });
      stopFn = () => {
        if (typeof codeReader.reset === 'function') codeReader.reset();
        else if (typeof codeReader.stopContinuousDecode === 'function') codeReader.stopContinuousDecode();
      };
    }
    return () => {
      if (stopFn) stopFn();
    };
    // eslint-disable-next-line
  }, [scanning]);

  const fetchFoodDetails = async (barcode: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        // Map Open Food Facts fields to your food object
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
      } else {
        setError("No product found for this barcode.");
      }
    } catch (e) {
      setError("Failed to fetch product details.");
    }
    setLoading(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      fetchFoodDetails(manualBarcode.trim());
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setScanning((s) => !s)}>
        {scanning ? "Stop Scanning" : "Start Live Scan"}
      </Button>
      <div className="mt-4">
        {scanning && <video ref={videoRef} style={{ width: "100%", borderRadius: 8 }} />}
      </div>
      <form onSubmit={handleManualSubmit} className="flex gap-2 items-center mt-4">
        <input
          type="text"
          placeholder="Enter barcode manually"
          value={manualBarcode}
          onChange={e => setManualBarcode(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <Button type="submit" disabled={loading}>Lookup</Button>
      </form>
      {loading && <div className="text-blue-600 font-medium mt-2">Loading...</div>}
      {error && <div className="text-red-600 font-medium mt-2">{error}</div>}
    </div>
  );
}