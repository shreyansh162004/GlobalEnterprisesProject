import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getProducts, saveProducts, Product, brands, categories } from "@/data/products";
import { Pencil, Trash2, Plus, LogIn, LogOut, Instagram, Youtube, Link2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ADMIN_USER = "admin";
const ADMIN_PASS = "global2024";

type Tab = "products" | "reels" | "videos";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("products");

  useEffect(() => {
    const auth = localStorage.getItem("ge-admin-auth");
    if (auth === "true") {
      setAuthenticated(true);
      setProducts(getProducts());
    }
  }, []);

  const handleLogin = () => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAuthenticated(true);
      localStorage.setItem("ge-admin-auth", "true");
      setProducts(getProducts());
    } else {
      toast({ title: "Invalid credentials", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem("ge-admin-auth");
  };

  const handleDelete = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    setProducts(updated);
    toast({ title: "Product deleted" });
  };

  const handleSave = (product: Product) => {
    let updated: Product[];
    if (editing) {
      updated = products.map((p) => (p.id === product.id ? product : p));
    } else {
      product.id = Date.now().toString();
      updated = [...products, product];
    }
    saveProducts(updated);
    setProducts(updated);
    setShowForm(false);
    setEditing(null);
    toast({ title: editing ? "Product updated" : "Product added" });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 w-full max-w-sm space-y-5">
          <h1 className="text-2xl font-heading font-bold text-center">Admin Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <button onClick={handleLogin} className="btn-premium w-full flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> Login
          </button>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Plus }[] = [
    { id: "products", label: "Products", icon: Plus },
    { id: "reels", label: "Instagram Reels", icon: Instagram },
    { id: "videos", label: "YouTube Videos", icon: Youtube },
  ];

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="btn-premium flex items-center gap-2 mb-6"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>

            {showForm && (
              <ProductForm
                product={editing}
                onSave={handleSave}
                onCancel={() => { setShowForm(false); setEditing(null); }}
              />
            )}

            <div className="space-y-3">
              {products.map((p) => (
                <motion.div key={p.id} layout className="glass-card p-4 flex items-center gap-4">
                  <img src={p.images[0]} alt={p.name} className="w-16 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand} • ₹{p.price.toLocaleString("en-IN")}</p>
                  </div>
                  <button
                    onClick={() => { setEditing(p); setShowForm(true); }}
                    className="p-2.5 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2.5 hover:bg-destructive/20 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === "reels" && <MediaLinksTab type="reels" />}
        {activeTab === "videos" && <MediaLinksTab type="videos" />}
      </div>
    </div>
  );
};

function MediaLinksTab({ type }: { type: "reels" | "videos" }) {
  const storageKey = type === "reels" ? "ge-instagram-reels" : "ge-youtube-videos";
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setLinks(JSON.parse(stored));
  }, [storageKey]);

  const save = (updated: string[]) => {
    setLinks(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const addLink = () => {
    if (!newLink.trim()) return;
    save([...links, newLink.trim()]);
    setNewLink("");
    toast({ title: "Link added" });
  };

  const removeLink = (index: number) => {
    save(links.filter((_, i) => i !== index));
    toast({ title: "Link removed" });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder={`Paste ${type === "reels" ? "Instagram Reel" : "YouTube Video"} link...`}
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addLink()}
          className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
        />
        <button onClick={addLink} className="btn-premium px-6">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {links.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No {type === "reels" ? "reels" : "videos"} added yet</p>
        )}
        {links.map((link, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-3">
            <Link2 className="w-4 h-4 text-primary shrink-0" />
            <span className="flex-1 text-sm truncate">{link}</span>
            <button onClick={() => removeLink(i)} className="p-2 hover:bg-destructive/20 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null;
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Product>(
    product || {
      id: "",
      name: "",
      price: 0,
      brand: brands[0],
      category: categories[0],
      specs: "",
      description: "",
      images: [""],
      featured: false,
    }
  );

  const update = (key: keyof Product, value: any) => setForm({ ...form, [key]: value });

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 mb-8 space-y-5">
      <h2 className="text-lg font-heading font-bold">{product ? "Edit" : "Add"} Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="Product Name" value={form.name} onChange={(e) => update("name", e.target.value)} className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
        <input placeholder="Price" type="number" value={form.price || ""} onChange={(e) => update("price", Number(e.target.value))} className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Brand</h4>
          <div className="flex flex-wrap gap-2">
            {[...brands, "Other"].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => update("brand", b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  form.brand === b ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80 border border-border"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
        <select value={form.category} onChange={(e) => update("category", e.target.value)} className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Image URL" value={form.images[0]} onChange={(e) => update("images", [e.target.value])} className="md:col-span-2 px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
        <input placeholder="Specs (brief)" value={form.specs} onChange={(e) => update("specs", e.target.value)} className="md:col-span-2 px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} className="md:col-span-2 px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary resize-none transition-colors" />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="rounded" />
          Featured Product
        </label>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave(form)} className="btn-premium">Save Product</button>
        <button onClick={onCancel} className="px-6 py-3 rounded-xl bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
      </div>
    </motion.div>
  );
}

export default Admin;
