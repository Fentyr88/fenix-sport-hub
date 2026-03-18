import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, AlertTriangle, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import type { AdminCategory, UpsertCategoryPayload } from "@/api/adminCategoriesApi";
import type { AdminProduct, UpsertProductPayload } from "@/api/adminProductsApi";
import * as categoriesApi from "@/api/adminCategoriesApi";
import * as productsApi from "@/api/adminProductsApi";

const stats = [
  { label: "REVENUE", value: "$24,589", change: "+12.5%", icon: TrendingUp },
  { label: "ORDERS", value: "342", change: "+8.2%", icon: ShoppingCart },
  { label: "PRODUCTS", value: "145", change: "+3", icon: Package },
  { label: "CUSTOMERS", value: "1,247", change: "+24", icon: Users },
];

const recentOrders = [
  { id: "FX-A8K2", customer: "Alex Rivera", total: 289.98, status: "DISPATCHED", date: "2026-03-17" },
  { id: "FX-B3M7", customer: "Sarah Chen", total: 129.99, status: "PROCESSING", date: "2026-03-17" },
  { id: "FX-C9P1", customer: "Marcus Johnson", total: 449.97, status: "PENDING", date: "2026-03-16" },
  { id: "FX-D2L5", customer: "Emma Wilson", total: 64.99, status: "DISPATCHED", date: "2026-03-16" },
  { id: "FX-E7N4", customer: "James Park", total: 189.99, status: "DELIVERED", date: "2026-03-15" },
];

const tabs = [
  { id: "overview", label: "OVERVIEW", icon: BarChart3 },
  { id: "categories", label: "CATEGORIES", icon: Users },
  { id: "products", label: "PRODUCTS", icon: Package },
  { id: "orders", label: "ORDERS", icon: ShoppingCart },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryForm, setCategoryForm] = useState<UpsertCategoryPayload>({ nombre: "", descripcion: "" });

  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<UpsertProductPayload>({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    imagenUrl: "",
    categoryId: 0,
  });

  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await categoriesApi.listCategories(token as string);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
  });

  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await productsApi.listProducts(token as string);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
  });

  const categoryNameById = useMemo(() => {
    const map = new Map<number, string>();
    (categoriesQuery.data ?? []).forEach((c) => map.set(c.id, c.nombre));
    return map;
  }, [categoriesQuery.data]);

  const createCategoryMutation = useMutation({
    mutationFn: async (payload: UpsertCategoryPayload) => {
      const res = await categoriesApi.createCategory(token as string, payload);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast({ title: "Category saved" });
      setCategoryForm({ nombre: "", descripcion: "" });
      setEditingCategoryId(null);
      setCategoryFormOpen(false);
    },
    onError: (e) => toast({ title: "Category save failed", description: (e as Error).message, variant: "destructive" }),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpsertCategoryPayload }) => {
      const res = await categoriesApi.updateCategory(token as string, id, payload);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast({ title: "Category updated" });
      setCategoryForm({ nombre: "", descripcion: "" });
      setEditingCategoryId(null);
      setCategoryFormOpen(false);
    },
    onError: (e) => toast({ title: "Category update failed", description: (e as Error).message, variant: "destructive" }),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await categoriesApi.deleteCategory(token as string, id);
      if (!res.ok) throw new Error(res.error.message);
      return true;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast({ title: "Category deleted" });
    },
    onError: (e) => toast({ title: "Delete failed", description: (e as Error).message, variant: "destructive" }),
  });

  const createProductMutation = useMutation({
    mutationFn: async (payload: UpsertProductPayload) => {
      const res = await productsApi.createProduct(token as string, payload);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast({ title: "Product saved" });
      setProductForm({ nombre: "", descripcion: "", precio: 0, stock: 0, imagenUrl: "", categoryId: 0 });
      setEditingProductId(null);
      setProductFormOpen(false);
    },
    onError: (e) => toast({ title: "Product save failed", description: (e as Error).message, variant: "destructive" }),
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpsertProductPayload }) => {
      const res = await productsApi.updateProduct(token as string, id, payload);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast({ title: "Product updated" });
      setProductForm({ nombre: "", descripcion: "", precio: 0, stock: 0, imagenUrl: "", categoryId: 0 });
      setEditingProductId(null);
      setProductFormOpen(false);
    },
    onError: (e) => toast({ title: "Product update failed", description: (e as Error).message, variant: "destructive" }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await productsApi.deleteProduct(token as string, id);
      if (!res.ok) throw new Error(res.error.message);
      return true;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast({ title: "Product deleted" });
    },
    onError: (e) => toast({ title: "Delete failed", description: (e as Error).message, variant: "destructive" }),
  });

  const statusColor = (s: string) => {
    if (s === "DISPATCHED" || s === "DELIVERED") return "text-primary";
    if (s === "PROCESSING") return "text-fenix-orange";
    return "text-muted-foreground";
  };

  const requireTokenBanner = (title: string) => (
    <div className="border border-border p-4">
      <p className="text-sm font-bold">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">You must sign in with an admin account to access this section.</p>
      <Link to="/login" className="inline-block mt-3 text-xs tracking-widest text-primary hover:brightness-110">
        → GO TO SIGN IN
      </Link>
    </div>
  );

  const validateCategoryPayload = (payload: UpsertCategoryPayload): string | null => {
    if (!payload.nombre?.trim()) return "Name is required.";
    return null;
  };

  const validateProductPayload = (payload: UpsertProductPayload): string | null => {
    if (!payload.nombre?.trim()) return "Name is required.";
    if (!(payload.precio > 0)) return "Price must be greater than 0.";
    if (!Number.isInteger(payload.stock) || payload.stock < 0) return "Stock must be an integer >= 0.";
    if (!(payload.categoryId > 0)) return "Category is required.";
    return null;
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-primary text-xs tracking-[0.3em] mb-1">ADMIN</p>
            <h1 className="fenix-heading text-2xl">DASHBOARD</h1>
          </div>
          <Link to="/" className="text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors">
            ← STOREFRONT
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs tracking-widest transition-colors border-b-2 ${
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-primary text-xs tabular-nums">{stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground tracking-widest mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Low Stock Alert */}
            <div className="border border-accent/30 p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">LOW STOCK ALERT</p>
                <p className="text-xs text-muted-foreground">3 products have fewer than 30 units remaining</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h2 className="text-xs font-bold tracking-widest mb-4">RECENT ORDERS</h2>
              <div className="border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">ORDER</th>
                      <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">CUSTOMER</th>
                      <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">TOTAL</th>
                      <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">STATUS</th>
                      <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                        <td className="p-3 text-xs tabular-nums">{order.id}</td>
                        <td className="p-3 text-xs">{order.customer}</td>
                        <td className="p-3 text-xs tabular-nums">${order.total.toFixed(2)}</td>
                        <td className={`p-3 text-[10px] tracking-widest font-bold ${statusColor(order.status)}`}>{order.status}</td>
                        <td className="p-3 text-xs tabular-nums text-muted-foreground">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold tracking-widest">ALL PRODUCTS</h2>
              <button
                onClick={() => {
                  setProductFormOpen((v) => !v);
                  setEditingProductId(null);
                  setProductForm({ nombre: "", descripcion: "", precio: 0, stock: 0, imagenUrl: "", categoryId: 0 });
                }}
                className="bg-primary text-primary-foreground px-4 py-2 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all"
              >
                {productFormOpen ? "CLOSE" : "+ ADD PRODUCT"}
              </button>
            </div>

            {!token && requireTokenBanner("ADMIN PRODUCTS")}

            {token && productFormOpen && (
              <div className="border border-border p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={productForm.nombre}
                  onChange={(e) => setProductForm((p) => ({ ...p, nombre: e.target.value }))}
                  placeholder="NAME"
                  className="w-full bg-secondary/50 border border-border px-4 py-3 text-sm tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />
                <input
                  value={productForm.imagenUrl ?? ""}
                  onChange={(e) => setProductForm((p) => ({ ...p, imagenUrl: e.target.value }))}
                  placeholder="IMAGE URL (OPTIONAL)"
                  className="w-full bg-secondary/50 border border-border px-4 py-3 text-sm tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />
                <input
                  value={productForm.descripcion ?? ""}
                  onChange={(e) => setProductForm((p) => ({ ...p, descripcion: e.target.value }))}
                  placeholder="DESCRIPTION (OPTIONAL)"
                  className="w-full bg-secondary/50 border border-border px-4 py-3 text-sm tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />
                <select
                  value={productForm.categoryId || ""}
                  onChange={(e) => setProductForm((p) => ({ ...p, categoryId: Number(e.target.value) }))}
                  className="w-full bg-secondary/50 border border-border px-4 py-3 text-sm tracking-wider text-foreground focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="" disabled>
                    SELECT CATEGORY
                  </option>
                  {(categoriesQuery.data ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={productForm.precio}
                  onChange={(e) => setProductForm((p) => ({ ...p, precio: Number(e.target.value) }))}
                  placeholder="PRICE"
                  className="w-full bg-secondary/50 border border-border px-4 py-3 text-sm tabular-nums tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                  placeholder="STOCK"
                  className="w-full bg-secondary/50 border border-border px-4 py-3 text-sm tabular-nums tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />

                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setProductFormOpen(false);
                      setEditingProductId(null);
                    }}
                    className="border border-border px-4 py-2 text-xs font-bold tracking-widest hover:border-primary hover:text-primary transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => {
                      const error = validateProductPayload(productForm);
                      if (error) {
                        toast({ title: "Invalid product", description: error, variant: "destructive" });
                        return;
                      }
                      if (editingProductId) updateProductMutation.mutate({ id: editingProductId, payload: productForm });
                      else createProductMutation.mutate(productForm);
                    }}
                    className="bg-primary text-primary-foreground px-4 py-2 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all disabled:opacity-60"
                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                  >
                    {editingProductId ? "UPDATE" : "CREATE"}
                  </button>
                </div>
              </div>
            )}

            <div className="border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">PRODUCT</th>
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">CATEGORY</th>
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">PRICE</th>
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">STOCK</th>
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {token && productsQuery.isLoading && (
                    <tr>
                      <td className="p-3 text-xs text-muted-foreground" colSpan={5}>
                        LOADING...
                      </td>
                    </tr>
                  )}
                  {token && productsQuery.isError && (
                    <tr>
                      <td className="p-3 text-xs text-accent" colSpan={5}>
                        FAILED TO LOAD PRODUCTS
                      </td>
                    </tr>
                  )}
                  {token && (productsQuery.data ?? []).map((p: AdminProduct) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="p-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary flex items-center justify-center text-[10px] text-muted-foreground">
                          IMG
                        </div>
                        <span className="text-xs font-medium">{p.nombre}</span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground uppercase">
                        {categoryNameById.get(p.categoryId)?.toUpperCase() ?? `#${p.categoryId}`}
                      </td>
                      <td className="p-3 text-xs tabular-nums">${p.precio.toFixed(2)}</td>
                      <td className={`p-3 text-xs tabular-nums ${p.stock < 30 ? "text-accent" : ""}`}>{p.stock}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProductId(p.id);
                              setProductFormOpen(true);
                              setProductForm({
                                nombre: p.nombre,
                                descripcion: p.descripcion ?? "",
                                precio: p.precio,
                                stock: p.stock,
                                imagenUrl: p.imagenUrl ?? "",
                                categoryId: p.categoryId,
                              });
                            }}
                            className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              const ok = window.confirm("Delete this product?");
                              if (!ok) return;
                              deleteProductMutation.mutate(p.id);
                            }}
                            className="p-1.5 text-muted-foreground hover:text-accent transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {token && !productsQuery.isLoading && (productsQuery.data ?? []).length === 0 && (
                    <tr>
                      <td className="p-3 text-xs text-muted-foreground" colSpan={5}>
                        NO PRODUCTS
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "categories" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold tracking-widest">ALL CATEGORIES</h2>
              <button
                onClick={() => {
                  setCategoryFormOpen((v) => !v);
                  setEditingCategoryId(null);
                  setCategoryForm({ nombre: "", descripcion: "" });
                }}
                className="bg-primary text-primary-foreground px-4 py-2 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all"
              >
                {categoryFormOpen ? "CLOSE" : "+ ADD CATEGORY"}
              </button>
            </div>

            {!token && requireTokenBanner("ADMIN CATEGORIES")}

            {token && categoryFormOpen && (
              <div className="border border-border p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={categoryForm.nombre}
                  onChange={(e) => setCategoryForm((c) => ({ ...c, nombre: e.target.value }))}
                  placeholder="NAME"
                  className="w-full bg-secondary/50 border border-border px-4 py-3 text-sm tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />
                <input
                  value={categoryForm.descripcion ?? ""}
                  onChange={(e) => setCategoryForm((c) => ({ ...c, descripcion: e.target.value }))}
                  placeholder="DESCRIPTION (OPTIONAL)"
                  className="w-full bg-secondary/50 border border-border px-4 py-3 text-sm tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />

                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setCategoryFormOpen(false);
                      setEditingCategoryId(null);
                    }}
                    className="border border-border px-4 py-2 text-xs font-bold tracking-widest hover:border-primary hover:text-primary transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => {
                      const error = validateCategoryPayload(categoryForm);
                      if (error) {
                        toast({ title: "Invalid category", description: error, variant: "destructive" });
                        return;
                      }
                      if (editingCategoryId) updateCategoryMutation.mutate({ id: editingCategoryId, payload: categoryForm });
                      else createCategoryMutation.mutate(categoryForm);
                    }}
                    className="bg-primary text-primary-foreground px-4 py-2 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all disabled:opacity-60"
                    disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  >
                    {editingCategoryId ? "UPDATE" : "CREATE"}
                  </button>
                </div>
              </div>
            )}

            <div className="border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">NAME</th>
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">DESCRIPTION</th>
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {token && categoriesQuery.isLoading && (
                    <tr>
                      <td className="p-3 text-xs text-muted-foreground" colSpan={3}>
                        LOADING...
                      </td>
                    </tr>
                  )}
                  {token && categoriesQuery.isError && (
                    <tr>
                      <td className="p-3 text-xs text-accent" colSpan={3}>
                        FAILED TO LOAD CATEGORIES
                      </td>
                    </tr>
                  )}
                  {token && (categoriesQuery.data ?? []).map((c: AdminCategory) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="p-3 text-xs font-medium">{c.nombre}</td>
                      <td className="p-3 text-xs text-muted-foreground">{c.descripcion ?? ""}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCategoryId(c.id);
                              setCategoryFormOpen(true);
                              setCategoryForm({ nombre: c.nombre, descripcion: c.descripcion ?? "" });
                            }}
                            className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              const ok = window.confirm("Delete this category?");
                              if (!ok) return;
                              deleteCategoryMutation.mutate(c.id);
                            }}
                            className="p-1.5 text-muted-foreground hover:text-accent transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {token && !categoriesQuery.isLoading && (categoriesQuery.data ?? []).length === 0 && (
                    <tr>
                      <td className="p-3 text-xs text-muted-foreground" colSpan={3}>
                        NO CATEGORIES
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xs font-bold tracking-widest mb-4">ALL ORDERS</h2>
            <div className="border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">ORDER</th>
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">CUSTOMER</th>
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">TOTAL</th>
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">STATUS</th>
                    <th className="text-left text-[10px] tracking-widest text-muted-foreground p-3">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="p-3 text-xs tabular-nums">{order.id}</td>
                      <td className="p-3 text-xs">{order.customer}</td>
                      <td className="p-3 text-xs tabular-nums">${order.total.toFixed(2)}</td>
                      <td className={`p-3 text-[10px] tracking-widest font-bold ${statusColor(order.status)}`}>{order.status}</td>
                      <td className="p-3 text-xs tabular-nums text-muted-foreground">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
