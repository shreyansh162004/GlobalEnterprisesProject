/**
 * Admin Dashboard - Supabase Integration
 * All data operations are now async and connected to Supabase database
 * Admin credentials remain unchanged: username: "admin", password: "global2024"
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  getProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
  Product,
  getBrands,
  getCategories,
  addCategory,
  deleteCategory,
  addBrand,
  deleteBrand,
  getWhatsAppNumber,
  saveWhatsAppNumber,
  getBanner,
  saveBanner,
  Banner,
  getAdminCreds,
  getContactInfo,
  saveContactInfo,
  ContactInfo,
  fetchInstagramReels,
  addInstagramReel,
  deleteInstagramReel,
  fetchYoutubeVideos,
  addYoutubeVideo,
  deleteYoutubeVideo,
  uploadImageToStorage,
  fetchChannelLinks,
  saveChannelLinks,
} from "@/data/products";
import { Pencil, Trash2, Plus, LogIn, LogOut, Instagram, Youtube, Link2, Upload, X, Globe, Tag, MessageCircle, ShieldCheck, Megaphone, Phone, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ImageCropper from "@/components/ImageCropper";

type Tab =
  | "products"
  | "banner"
  | "categories"
  | "brands"
  | "whatsapp"
  | "contact"
  | "reels"
  | "videos"
  | "channels"
  | "credentials";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("products");

  useEffect(() => {
    const auth = localStorage.getItem("ge-admin-auth");
    if (auth === "true") {
      setAuthenticated(true);
      loadProducts();
    }
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const prods = await getProducts();
      setProducts(prods);
    } catch (err) {
      console.error("Error loading products:", err);
      toast({ title: "Error loading products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const creds = await getAdminCreds();
      if (username === creds.username && password === creds.password) {
        setAuthenticated(true);
        localStorage.setItem("ge-admin-auth", "true");
        await loadProducts();
      } else {
        toast({ title: "Invalid credentials", variant: "destructive" });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast({ title: "Error during login", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem("ge-admin-auth");
    setProducts([]);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteProduct(id);
      if (success) {
        const updated = products.filter((p) => p.id !== id);
        setProducts(updated);
        toast({ title: "Product deleted" });
      } else {
        toast({ title: "Error deleting product", variant: "destructive" });
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast({ title: "Error deleting product", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (product: Omit<Product, "id">) => {
    setLoading(true);
    try {
      if (editing) {
        const success = await updateProduct(editing.id, product as any);
        if (success) {
          const updated = products.map((p) => (p.id === editing.id ? { ...success } : p));
          setProducts(updated);
          toast({ title: "Product updated" });
        } else {
          toast({ title: "Error updating product", variant: "destructive" });
        }
      } else {
        const newProduct = await saveProduct(product);
        if (newProduct) {
          setProducts([...products, newProduct]);
          toast({ title: "Product added" });
        } else {
          toast({ title: "Error adding product", variant: "destructive" });
        }
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("Save error:", err);
      toast({ title: "Error saving product", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 w-full max-w-sm space-y-5">
          <h1 className="text-2xl font-heading font-bold text-center">Admin Login</h1>
          <p className="text-xs text-muted-foreground text-center">Default: admin / global2024</p>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleLogin()}
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
          <button onClick={handleLogin} disabled={loading} className="btn-premium w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Plus }[] = [
    { id: "products", label: "Products", icon: Plus },
    { id: "banner", label: "Banner", icon: Megaphone },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "brands", label: "Brands", icon: Tag },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "contact", label: "Contact Info", icon: Phone },
    { id: "reels", label: "Instagram Reels", icon: Instagram },
    { id: "videos", label: "YouTube Videos", icon: Youtube },
    { id: "channels", label: "Channel Links", icon: Globe },
    { id: "credentials", label: "Admin Login", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

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

        {loading && activeTab === "products" && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {activeTab === "products" && !loading && (
          <>
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="btn-premium flex items-center gap-2 mb-6"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            {showForm && <ProductForm product={editing} onSave={handleSave} onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }} />}
            <div className="space-y-3">
              {products.map((p) => (
                <motion.div key={p.id} layout className="glass-card p-4 flex items-center gap-4">
                  {p.images && p.images[0] && (
                    <img src={p.images[0]} alt={p.name} className="w-16 h-12 rounded-xl object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.brand} • ₹{p.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                    className="p-2.5 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2.5 hover:bg-destructive/20 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === "reels" && <MediaLinksTab type="reels" />}
        {activeTab === "videos" && <MediaLinksTab type="videos" />}
        {activeTab === "channels" && <ChannelLinksTab />}
        {activeTab === "categories" && <ListManagerTab kind="categories" />}
        {activeTab === "brands" && <ListManagerTab kind="brands" />}
        {activeTab === "whatsapp" && <WhatsAppTab />}
        {activeTab === "contact" && <ContactInfoTab />}
        {activeTab === "banner" && <BannerTab />}
        {activeTab === "credentials" && <CredentialsTab />}
      </div>
    </div>
  );
};

function WhatsAppTab() {
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const num = await getWhatsAppNumber();
      setNumber(num);
      setLoading(false);
    };
    load();
  }, []);

  const save = async () => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length < 10) {
      toast({ title: "Enter a valid number with country code", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const success = await saveWhatsAppNumber(cleaned);
      if (success) {
        toast({ title: "WhatsApp number updated!" });
      } else {
        toast({ title: "Error updating number", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-lg font-heading font-bold">WhatsApp Contact Number</h2>
      <p className="text-sm text-muted-foreground">
        This number is used for all WhatsApp redirections — product enquiries, cart checkout, and the "Chat on WhatsApp" buttons.
      </p>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Number with country code (e.g. 917879707696)</label>
        <input
          type="tel"
          placeholder="917879707696"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <button onClick={save} disabled={loading} className="btn-premium disabled:opacity-50">
        {loading ? "Saving..." : "Save Number"}
      </button>
    </div>
  );
}

function ContactInfoTab() {
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const contactInfo = await getContactInfo();
      setInfo(contactInfo);
      setLoading(false);
    };
    load();
  }, []);

  const update = (key: keyof ContactInfo, value: string) =>
    setInfo((prev) => prev ? { ...prev, [key]: value } : null);

  const save = async () => {
    if (!info || !info.phone.trim() || !info.email.trim() || !info.address.trim()) {
      toast({ title: "Phone, email and address are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const success = await saveContactInfo({
        phone: info.phone.trim(),
        email: info.email.trim(),
        address: info.address.trim(),
        hours: info.hours.trim(),
      });
      if (success) {
        toast({ title: "Contact details updated!" });
      } else {
        toast({ title: "Error updating contact info", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || !info) return <div><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-heading font-bold">Public Contact Information</h2>
      <p className="text-sm text-muted-foreground">
        Shown on the Contact page and in the site footer. The phone here is for display & call links.
      </p>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone (display)</label>
          <input
            type="text"
            placeholder="+91 78797 07696"
            value={info.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
          <input
            type="email"
            placeholder="info@globalenterprises.in"
            value={info.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label>
          <textarea
            placeholder="Rasal Chowk, Jain Tower, Hotel Samdariya, Jabalpur, MP 482001"
            value={info.address}
            onChange={(e) => update("address", e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary resize-none transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Working Hours</label>
          <input
            type="text"
            placeholder="Mon–Sat: 10AM – 8PM"
            value={info.hours}
            onChange={(e) => update("hours", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
      <button onClick={save} disabled={loading} className="btn-premium disabled:opacity-50">
        {loading ? "Saving..." : "Save Contact Info"}
      </button>
    </div>
  );
}

function ListManagerTab({ kind }: { kind: "categories" | "brands" }) {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const list = kind === "categories" ? await getCategories() : await getBrands();
      setItems(list);
      setLoading(false);
    };
    load();
  }, [kind]);

  const add = async () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    if (items.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      toast({ title: "Already exists", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const success = kind === "categories" ? await addCategory(trimmed) : await addBrand(trimmed);
      if (success) {
        setItems([...items, trimmed]);
        setNewItem("");
        toast({ title: `${kind === "categories" ? "Category" : "Brand"} added` });
      }
    } finally {
      setLoading(false);
    }
  };

  const remove = async (item: string) => {
    setLoading(true);
    try {
      const success = kind === "categories" ? await deleteCategory(item) : await deleteBrand(item);
      if (success) {
        setItems(items.filter((i) => i !== item));
        toast({ title: "Removed" });
      }
    } finally {
      setLoading(false);
    }
  };

  const label = kind === "categories" ? "Category" : "Brand";

  if (loading && items.length === 0) return <div><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-heading font-bold">Manage {label}s</h2>
      <p className="text-sm text-muted-foreground">These appear in the product form and on the Products filter page.</p>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder={`New ${label.toLowerCase()} name...`}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
        />
        <button onClick={add} disabled={loading} className="btn-premium px-6 disabled:opacity-50">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No {label.toLowerCase()}s yet.</p>}
        {items.map((item) => (
          <div key={item} className="glass-card flex items-center gap-2 pl-4 pr-2 py-2 rounded-xl">
            <span className="text-sm font-medium">{item}</span>
            <button onClick={() => remove(item)} disabled={loading} className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors disabled:opacity-50">
              <X className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChannelLinksTab() {
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const links = await fetchChannelLinks();
      setInstagram(links.instagram || "");
      setYoutube(links.youtube || "");
      setLoading(false);
    };
    load();
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      const success = await saveChannelLinks({ instagram, youtube });
      if (success) {
        toast({ title: "Channel links saved!" });
      } else {
        toast({ title: "Error saving links", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-lg font-heading font-bold">Channel / Profile Links</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Instagram Profile URL</label>
          <input
            type="text"
            placeholder="https://instagram.com/yourpage"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">YouTube Channel URL</label>
          <input
            type="text"
            placeholder="https://youtube.com/@yourchannel"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
        </div>
        <button onClick={save} disabled={loading} className="btn-premium disabled:opacity-50">
          {loading ? "Saving..." : "Save Links"}
        </button>
      </div>
    </div>
  );
}

function MediaLinksTab({ type }: { type: "reels" | "videos" }) {
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const list = type === "reels" ? await fetchInstagramReels() : await fetchYoutubeVideos();
      setLinks(list);
      setLoading(false);
    };
    load();
  }, [type]);

  const addLink = async () => {
    if (!newLink.trim()) return;
    setLoading(true);
    try {
      const success = type === "reels" ? await addInstagramReel(newLink.trim()) : await addYoutubeVideo(newLink.trim());
      if (success) {
        setLinks([...links, newLink.trim()]);
        setNewLink("");
        toast({ title: "Link added" });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeLink = async (url: string) => {
    setLoading(true);
    try {
      const success = type === "reels" ? await deleteInstagramReel(url) : await deleteYoutubeVideo(url);
      if (success) {
        setLinks(links.filter((l) => l !== url));
        toast({ title: "Link removed" });
      }
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
        />
        <button onClick={addLink} disabled={loading} className="btn-premium px-6 disabled:opacity-50">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {links.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No {type === "reels" ? "reels" : "videos"} added yet. Links added here will appear on the homepage.
          </p>
        )}
        {links.map((link) => (
          <div key={link} className="glass-card p-4 flex items-center gap-3">
            <Link2 className="w-4 h-4 text-primary shrink-0" />
            <span className="flex-1 text-sm truncate">{link}</span>
            <button onClick={() => removeLink(link)} disabled={loading} className="p-2 hover:bg-destructive/20 rounded-xl transition-colors disabled:opacity-50">
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

async function compressImage(file: File, maxSizeKB = 500): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        let quality = 0.85;
        let result = "";
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d")!;
        let attempt = 0;
        // Iteratively reduce size and quality until under maxSizeKB
        while (true) {
          canvas.width = width;
          canvas.height = height;
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          result = canvas.toDataURL("image/jpeg", quality);
          // Check if under size or quality is too low
          if (result.length <= maxSizeKB * 1024 || (quality <= 0.2 && (width <= 400 || height <= 400))) {
            break;
          }
          // Lower quality first, then reduce dimensions if needed
          if (quality > 0.2) {
            quality -= 0.07;
          } else {
            width = Math.round(width * 0.92);
            height = Math.round(height * 0.92);
          }
          attempt++;
          if (attempt > 18) break; // Prevent infinite loop
        }
        resolve(result);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = (e) => resolve(e.target?.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function compressDataUrl(dataUrl: string, maxDim = 1600, quality = 0.85): Promise<string> {
  // Enforce a max file size (default 700KB) with iterative resizing and quality reduction
  const maxSizeKB = 700;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      let q = quality;
      let out = "";
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d")!;
      let attempt = 0;
      while (true) {
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        out = canvas.toDataURL("image/jpeg", q);
        if (out.length <= maxSizeKB * 1024 || (q <= 0.2 && (width <= 400 || height <= 400))) {
          break;
        }
        if (q > 0.2) {
          q -= 0.07;
        } else {
          width = Math.round(width * 0.92);
          height = Math.round(height * 0.92);
        }
        attempt++;
        if (attempt > 18) break;
      }
      resolve(out);
    };
    img.src = dataUrl;
  });
}

function BannerTab() {
  const [banner, setBannerState] = useState<Banner | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [alt, setAlt] = useState("");
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      const b = await getBanner();
      setBannerState(b);
      setLink(b?.link || "");
      setAlt(b?.alt || "");
      setLoading(false);
    };
    load();
  }, []);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = await fileToDataUrl(file);
      const compressed = await compressDataUrl(data, 1600, 0.85);
      const uploaded = await uploadImageToStorage(compressed, "banners");
      if (!uploaded) {
        toast({ title: "Banner upload failed", variant: "destructive" });
        return;
      }
      const updated: Banner = {
        image: uploaded,
        link: link.trim() || undefined,
        alt: alt.trim() || undefined,
      };
      const success = await saveBanner(updated);
      if (success) {
        setBannerState(updated);
        toast({ title: "Banner uploaded — displayed at its original size" });
      }
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const updateMeta = async () => {
    if (!banner) return;
    setLoading(true);
    try {
      const updated: Banner = { ...banner, link: link.trim() || undefined, alt: alt.trim() || undefined };
      const success = await saveBanner(updated);
      if (success) {
        setBannerState(updated);
        toast({ title: "Banner details saved" });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeBanner = async () => {
    setLoading(true);
    try {
      const success = await saveBanner(null);
      if (success) {
        setBannerState(null);
        setLink("");
        setAlt("");
        toast({ title: "Banner removed — homepage skips it now" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-heading font-bold">Homepage Banner</h2>
      {banner && (
        <div className="space-y-4">
          <img src={banner.image} alt={banner.alt} className="w-full h-64 rounded-xl object-cover border border-border" />
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Link (optional)</label>
              <input
                type="text"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Alt text (optional)</label>
              <input
                type="text"
                placeholder="Banner description"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={updateMeta} disabled={loading} className="btn-premium disabled:opacity-50">
              Update Details
            </button>
            <button onClick={removeBanner} disabled={loading} className="btn-secondary disabled:opacity-50">
              Remove Banner
            </button>
          </div>
        </div>
      )}
      {!banner && (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-4">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">No banner uploaded yet</p>
          <input ref={inputRef} type="file" accept="image/*" onChange={onPick} disabled={loading} className="hidden" />
          <button onClick={() => inputRef.current?.click()} disabled={loading} className="btn-premium disabled:opacity-50">
            Choose Image
          </button>
        </div>
      )}
    </div>
  );
}

function CredentialsTab() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("global2024");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const creds = await getAdminCreds();
      setUsername(creds.username);
      setPassword(creds.password);
    };
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-lg">
      <div className="glass-card p-6 space-y-4 border border-amber-500/30 bg-amber-500/5">
        <h2 className="text-lg font-heading font-bold">Admin Credentials</h2>
        <p className="text-sm text-muted-foreground">
          Default username and password have been set and will not be changed by this interface to ensure security.
        </p>
        <div className="space-y-3 pt-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Username</label>
            <div className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-mono">
              {username}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Password</label>
            <div className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-mono">
              {'•'.repeat(password.length)}
            </div>
          </div>
        </div>
        <p className="text-xs text-amber-600 pt-4">
          ⓘ Credentials are locked and cannot be changed through this interface for security purposes.
        </p>
      </div>
    </div>
  );
}

interface ProductFormProps {
  product: Product | null;
  onSave: (product: Omit<Product, "id">) => void;
  onCancel: () => void;
}

function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [brand, setBrand] = useState(product?.brand || "");
  const [category, setCategory] = useState(product?.category || "");
  const [specs, setSpecs] = useState(product?.specs || "");
  const [description, setDescription] = useState(product?.description || "");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [featured, setFeatured] = useState(product?.featured || false);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [b, c] = await Promise.all([getBrands(), getCategories()]);
      setBrands(b);
      setCategories(c);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = () => {
    if (!name.trim() || !price || !brand || !category) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    onSave({
      name: name.trim(),
      price: Number(price),
      brand,
      category,
      specs: specs.trim(),
      description: description.trim(),
      images,
      featured,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      const uploaded = await uploadImageToStorage(dataUrl, "products");
      if (!uploaded) {
        toast({ title: "Image upload failed", variant: "destructive" });
        return;
      }
      setImages([...images, uploaded]);
    } catch (err) {
      console.error("Product image upload error:", err);
      toast({ title: "Image upload failed", variant: "destructive" });
    }
  };

  if (loading) return <div><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-6 space-y-4 border border-primary/30"
    >
      <h3 className="text-lg font-heading font-bold">{product ? "Edit Product" : "Add New Product"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors">
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors">
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <textarea placeholder="Specifications" value={specs} onChange={(e) => setSpecs(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Images</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="block mb-2" />
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} alt="" className="w-20 h-20 rounded-xl object-cover" />
              <button
                onClick={() => setImages(images.filter((_, j) => j !== i))}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        <span className="text-sm">Featured product</span>
      </label>
      <div className="flex gap-3">
        <button onClick={handleSave} className="btn-premium">
          {product ? "Update Product" : "Add Product"}
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

export default Admin;
