"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ArrowUp, ArrowDown, History } from "lucide-react";

type Product = {
  id: string;
  name: string;
  current_stock: number;
  initial_stock: number;
  low_stock_threshold: number;
  is_out_of_stock: boolean;
};

type InventoryLog = {
  id: string;
  type: string;
  quantity: number;
  old_stock: number;
  new_stock: number;
  notes?: string;
  created_at: string;
};

export function InventoryClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<"restock" | "adjust" | "return">("restock");
  const [quantity, setQuantity] = useState("0");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products", {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryHistory = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}/inventory`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInventoryLogs(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch inventory history:", error);
    }
  };

  const handleStockAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const endpoint = {
      restock: "restock",
      adjust: "adjust",
      return: "return",
    }[action];

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${selectedProduct.id}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({
            quantity: parseInt(quantity),
            notes,
          }),
        }
      );

      if (response.ok) {
        await fetchProducts();
        await fetchInventoryHistory(selectedProduct.id);
        setQuantity("0");
        setNotes("");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update stock");
      }
    } catch (error) {
      console.error("Failed to update stock:", error);
      alert("Failed to update stock");
    }
  };

  const getAccessToken = (): string => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    return cookies.gateway_access_token || "";
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    fetchInventoryHistory(product.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products List */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="space-y-2">
            {products.map((product) => (
              <div
                key={product.id}
                className={`p-4 border rounded cursor-pointer hover:bg-muted ${
                  selectedProduct?.id === product.id ? "bg-muted" : ""
                }`}
                onClick={() => handleProductSelect(product)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted">
                      Current Stock: {product.current_stock}
                    </div>
                  </div>
                  <div className="text-right">
                    {product.is_out_of_stock ? (
                      <span className="text-red-600 text-sm">Out of Stock</span>
                    ) : product.current_stock <= product.low_stock_threshold ? (
                      <span className="text-yellow-600 text-sm">Low Stock</span>
                    ) : (
                      <span className="text-green-600 text-sm">In Stock</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Management */}
        {selectedProduct && (
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedProduct.name}
              </h2>
              <div className="text-sm text-muted mb-4">
                Current Stock: {selectedProduct.current_stock}
              </div>

              <form onSubmit={handleStockAction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Action</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={action === "restock" ? "primary" : "secondary"}
                      onClick={() => setAction("restock")}
                    >
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Restock
                    </Button>
                    <Button
                      type="button"
                      variant={action === "adjust" ? "primary" : "secondary"}
                      onClick={() => setAction("adjust")}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Adjust
                    </Button>
                    <Button
                      type="button"
                      variant={action === "return" ? "primary" : "secondary"}
                      onClick={() => setAction("return")}
                    >
                      <ArrowDown className="h-4 w-4 mr-2" />
                      Return
                    </Button>
                  </div>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={2}
                    placeholder="Optional notes"
                  />
                </div>

                <Button type="submit">Update Stock</Button>
              </form>
            </div>

            {/* Inventory History */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <History className="h-5 w-5 mr-2" />
                Inventory History
              </h2>
              <div className="space-y-2">
                {inventoryLogs.length === 0 ? (
                  <p className="text-sm text-muted">No inventory history</p>
                ) : (
                  inventoryLogs.map((log) => (
                    <div key={log.id} className="p-3 border rounded text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{log.type}</span>
                        <span className="text-muted">
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-muted mt-1">
                        {log.quantity > 0 ? "+" : ""}
                        {log.quantity} units ({log.old_stock} → {log.new_stock})
                      </div>
                      {log.notes && <div className="text-muted mt-1">{log.notes}</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
