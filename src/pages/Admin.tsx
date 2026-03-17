import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, AlertTriangle, Edit2, Trash2 } from "lucide-react";
import { products } from "@/lib/data";
import { Link } from "react-router-dom";

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
  { id: "products", label: "PRODUCTS", icon: Package },
  { id: "orders", label: "ORDERS", icon: ShoppingCart },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");

  const statusColor = (s: string) => {
    if (s === "DISPATCHED" || s === "DELIVERED") return "text-primary";
    if (s === "PROCESSING") return "text-fenix-orange";
    return "text-muted-foreground";
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
              <button className="bg-primary text-primary-foreground px-4 py-2 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all">
                + ADD PRODUCT
              </button>
            </div>
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
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover bg-secondary" />
                        <span className="text-xs font-medium">{p.name}</span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground uppercase">{p.category}</td>
                      <td className="p-3 text-xs tabular-nums">${p.price.toFixed(2)}</td>
                      <td className={`p-3 text-xs tabular-nums ${p.stock < 30 ? "text-accent" : ""}`}>{p.stock}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Edit2 className="w-3 h-3" /></button>
                          <button className="p-1.5 text-muted-foreground hover:text-accent transition-colors"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
