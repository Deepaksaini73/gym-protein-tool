"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

const PREBUILT_ITEMS = [
  "Pepsi",
  "Coca Cola",
  "Sprite",
  "Frooti",
  "Kurkure",
  "Lays Chips",
  "Samosa",
  "Vada Pav",
  "Ice Cream",
  "Maggie",
  "Bisleri Water",
  "Parle-G",
  "Bourbon Biscuit",
  "Amul Butter",
  "Dairy Milk",
  "Bhel Puri",
  "Pav Bhaji",
  "Chole Bhature",
  "Paneer Tikka",
  "Egg Puff",
  "Chicken Roll",
  "Veg Puff",
  "Bread Pakora",
  "Tea",
  "Coffee",
  "Red Bull",
  "Appy Fizz",
  "Mirinda",
  "Thumbs Up",
  "Mountain Dew",
  "Oreo",
  "Good Day Biscuit",
  "Hide & Seek",
  "Chikki",
  "Rasgulla",
  "Gulab Jamun",
  "Jalebi",
  "Lassi",
  "Chaas",
  "Momo",
  "Pizza Slice",
  "Burger",
  "French Fries",
  "Pani Puri",
  "Dhokla",
  "Idli",
  "Dosa",
  "Medu Vada",
  "Egg (boiled)",
  "Banana",
  "Apple",
  "Orange Juice",
  "Milk",
];

interface ShopItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: any) => void;
}

export function ShopItemsDialog({ open, onOpenChange, onSubmit }: ShopItemsDialogProps) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [loading, setLoading] = useState(false);
  const [customMode, setCustomMode] = useState(false);

  // Filter prebuilt items
  const filtered = PREBUILT_ITEMS.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch Gemini suggestions if not found
  const handleGeminiSuggest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/food-search-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: search }),
      });
      const data = await res.json();
      if (data && data.suggestions) {
        setSuggestions(data.suggestions.map((s: any) => s.name));
      } else {
        setSuggestions([]);
      }
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  };

  // When user selects an item, ask for quantity/unit
  const handleSelect = (item: string) => {
    setSelected(item);
    setQuantity("");
    setUnit("pcs");
  };

  // On confirm, call nutrition API
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/food-nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: selected, quantity, unit }),
      });
      const data = await res.json();
      if (data && data.nutrition) {
        onSubmit({
          id: Date.now(),
          name: selected,
          quantity: Number(quantity),
          unit,
          calories: data.nutrition.calories,
          protein: data.nutrition.protein,
          carbs: data.nutrition.carbs,
          fats: data.nutrition.fats,
          per: `${quantity}${unit}`,
        });
        setSelected(null);
        setQuantity("");
        setUnit("pcs");
        setSearch("");
        setSuggestions([]);
        setCustomMode(false);
        onOpenChange(false);
      } else {
        alert("Could not get nutrition info. Please try again.");
      }
    } catch {
      alert("Error contacting AI service.");
    }
    setLoading(false);
  };

  // Custom add fallback
  const handleCustomAdd = () => {
    setSelected(search);
    setCustomMode(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Shop/Street Food Item</DialogTitle>
        </DialogHeader>
        {!selected ? (
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search shop/street food (e.g. Pepsi, Samosa)"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setSuggestions([]);
                }}
                className="border-2 focus:border-emerald-400 pl-10 py-3 text-lg rounded-xl shadow-sm"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-2 max-h-56 overflow-y-auto border border-emerald-100">
              {filtered.map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  className="w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-emerald-50 text-base font-medium"
                  onClick={() => handleSelect(item)}
                >
                  {item}
                </Button>
              ))}
              {suggestions.map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  className="w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-emerald-50 text-base font-medium"
                  onClick={() => handleSelect(item)}
                >
                  {item}
                </Button>
              ))}
              {search && filtered.length === 0 && suggestions.length === 0 && !loading && (
                <div className="text-gray-400 text-center py-4">No results found.</div>
              )}
            </div>
            {search && filtered.length === 0 && suggestions.length === 0 && !loading && (
              <Button variant="outline" onClick={handleGeminiSuggest} className="w-full mt-2">
                Search with Gemini AI
              </Button>
            )}
            {search && filtered.length === 0 && suggestions.length === 0 && !loading && (
              <Button variant="secondary" className="w-full mt-2" onClick={handleCustomAdd}>
                Add "{search}" as custom item
              </Button>
            )}
            {loading && <div className="text-emerald-600 font-medium">Loading...</div>}
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopQty">Quantity</Label>
              <Input
                id="shopQty"
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
                placeholder="e.g. 1, 200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopUnit">Unit</Label>
              <select
                id="shopUnit"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded-md focus:border-emerald-300"
              >
                <option value="pcs">pcs</option>
                <option value="g">g</option>
                <option value="ml">ml</option>
              </select>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => { setSelected(null); setCustomMode(false); }}>
                Back
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? "Adding..." : `Add ${selected}`}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 