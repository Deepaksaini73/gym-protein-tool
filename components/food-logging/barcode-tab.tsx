import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Scan } from "lucide-react"
import { useState } from "react"

interface BarcodeItem {
  code: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
}

interface BarcodeTabProps {
  barcodeInput: string
  onBarcodeInputChange: (value: string) => void
  onBarcodeSearch: () => void
  mockBarcodes: BarcodeItem[]
}

export function BarcodeTab({
  barcodeInput,
  onBarcodeInputChange,
  onBarcodeSearch,
  mockBarcodes,
}: BarcodeTabProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Scan className="w-5 h-5 mr-2 text-purple-600" />
          Barcode Scanner
        </CardTitle>
        <CardDescription>Scan or enter a barcode to find product information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Input
            placeholder="Enter barcode number..."
            value={barcodeInput}
            onChange={(e) => onBarcodeInputChange(e.target.value)}
            className="border-2 focus:border-purple-300"
          />
          <Button onClick={onBarcodeSearch} className="w-full bg-purple-600 hover:bg-purple-700">
            <Scan className="w-4 h-4 mr-2" />
            Search Barcode
          </Button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-2 border-purple-200">
          <h4 className="font-medium mb-3 text-purple-900">Try these sample barcodes:</h4>
          <div className="space-y-2">
            {mockBarcodes.map((item) => (
              <button
                key={item.code}
                onClick={() => onBarcodeInputChange(item.code)}
                className="block w-full text-left text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100 p-2 rounded transition-colors"
              >
                {item.code} - {item.name}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}