import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  getProducts,
  saveProducts,
  Product,
  getBrands,
  getCategories,
  saveCategories,
  saveBrands,
  getWhatsAppNumber,
  saveWhatsAppNumber,
  getBanner,
  saveBanner,
  Banner,
  getAdminCreds,
  saveAdminCreds,
} from "@/data/products";
import { Pencil, Trash2, Plus, LogIn, LogOut, Instagram, Youtube, Link2, Upload, X, Globe, Tag, MessageCircle, ShieldCheck, Megaphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ImageCropper from "@/components/ImageCropper";

type Tab =
  | "products"
  | "banner"
  | "categories"
  | "brands"
  | "whatsapp"
  | "reels"
  | "videos"
  | "channels"
  | "credentials";

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
    const creds = getAdminCreds();
    if (username === creds.username && password === creds.password) {
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
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
          <button onClick={handleLogin} className="btn-premium w-full flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> Login
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
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors">
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

        {activeTab === "products" && (
          <>
            <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-premium flex items-center gap-2 mb-6">
              <Plus className="w-4 h-4" /> Add Product
            </button>
            {showForm && (
              <ProductForm product={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
            )}
            <div className="space-y-3">
              {products.map((p) => (
                <motion.div key={p.id} layout className="glass-card p-4 flex items-center gap-4">
                  <img src={p.images[0]} alt={p.name} className="w-16 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand} • ₹{p.price.toLocaleString("en-IN")}</p>
                  </div>
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2.5 hover:bg-secondary rounded-xl transition-colors">
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
        {activeTab === "banner" && <BannerTab />}
        {activeTab === "credentials" && <CredentialsTab />}
      </div>
    </div>
  );
};

function WhatsAppTab() {
  const [number, setNumber] = useState("");

  useEffect(() => {
    setNumber(getWhatsAppNumber());
  }, []);

  const save = () => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length < 10) {
      toast({ title: "Enter a valid number with country code", variant: "destructive" });
      return;
    }
    saveWhatsAppNumber(cleaned);
    toast({ title: "WhatsApp number updated!" });
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-lg font-heading font-bold">WhatsApp Contact Number</h2>
      <p className="text-sm text-muted-foreground">
        This number is used for all WhatsApp redirections — product enquiries, cart checkout, and the "Chat on WhatsApp" buttons.
      </p>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          Number with country code (e.g. 919876543210)
        </label>
        <input
          type="tel"
          placeholder="919876543210"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <button onClick={save} className="btn-premium">Save Number</button>
    </div>
  );
}

function ListManagerTab({ kind }: { kind: "categories" | "brands" }) {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  const load = () => setItems(kind === "categories" ? getCategories() : getBrands());
  useEffect(load, [kind]);

  const persist = (list: string[]) => {
    if (kind === "categories") saveCategories(list);
    else saveBrands(list);
    setItems(list);
  };

  const add = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    if (items.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      toast({ title: "Already exists", variant: "destructive" });
      return;
    }
    persist([...items, trimmed]);
    setNewItem("");
    toast({ title: `${kind === "categories" ? "Category" : "Brand"} added` });
  };

  const remove = (item: string) => {
    persist(items.filter((i) => i !== item));
    toast({ title: "Removed" });
  };

  const label = kind === "categories" ? "Category" : "Brand";

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-heading font-bold">Manage {label}s</h2>
      <p className="text-sm text-muted-foreground">
        These appear in the product form and on the Products filter page.
      </p>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder={`New ${label.toLowerCase()} name...`}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
        />
        <button onClick={add} className="btn-premium px-6">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No {label.toLowerCase()}s yet.</p>
        )}
        {items.map((item) => (
          <div key={item} className="glass-card flex items-center gap-2 pl-4 pr-2 py-2 rounded-xl">
            <span className="text-sm font-medium">{item}</span>
            <button onClick={() => remove(item)} className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors">
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

  useEffect(() => {
    const stored = localStorage.getItem("ge-channel-links");
    if (stored) {
      const parsed = JSON.parse(stored);
      setInstagram(parsed.instagram || "");
      setYoutube(parsed.youtube || "");
    }
  }, []);

  const save = () => {
    localStorage.setItem("ge-channel-links", JSON.stringify({ instagram, youtube }));
    toast({ title: "Channel links saved!" });
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-lg font-heading font-bold">Channel / Profile Links</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Instagram Profile URL</label>
          <input type="text" placeholder="https://instagram.com/yourpage" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">YouTube Channel URL</label>
          <input type="text" placeholder="https://youtube.com/@yourchannel" value={youtube} onChange={(e) => setYoutube(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
        </div>
        <button onClick={save} className="btn-premium">Save Links</button>
      </div>
    </div>
  );
}

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
          <p className="text-center text-muted-foreground py-8">No {type === "reels" ? "reels" : "videos"} added yet. Links added here will appear on the homepage.</p>
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

async function compressImage(file: File, maxSizeKB = 500): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Scale down if very large
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels
        let quality = 0.85;
        let result = canvas.toDataURL("image/jpeg", quality);

        while (result.length > maxSizeKB * 1370 && quality > 0.1) {
          quality -= 0.1;
          result = canvas.toDataURL("image/jpeg", quality);
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

// Compress a data URL while preserving its natural aspect ratio (no cropping).
async function compressDataUrl(dataUrl: string, maxDim = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      let q = quality;
      let out = canvas.toDataURL("image/jpeg", q);
      while (out.length > 700 * 1370 && q > 0.2) {
        q -= 0.1;
        out = canvas.toDataURL("image/jpeg", q);
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const b = getBanner();
    setBannerState(b);
    setLink(b?.link || "");
    setAlt(b?.alt || "");
  }, []);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await fileToDataUrl(file);
    // Save banner immediately at its natural aspect ratio (compressed only).
    const compressed = await compressDataUrl(data, 1600, 0.85);
    const updated: Banner = {
      image: compressed,
      link: link.trim() || undefined,
      alt: alt.trim() || undefined,
    };
    saveBanner(updated);
    setBannerState(updated);
    toast({ title: "Banner uploaded — displayed at its original size" });
    if (inputRef.current) inputRef.current.value = "";
  };

  const openCropper = () => {
    // Optional: let admin re-crop the existing banner if they want to.
    if (banner?.image) setRawImage(banner.image);
  };

  const onCropDone = (dataUrl: string) => {
    const updated: Banner = { image: dataUrl, link: link.trim() || undefined, alt: alt.trim() || undefined };
    saveBanner(updated);
    setBannerState(updated);
    setRawImage(null);
    toast({ title: "Banner cropped and saved" });
  };

  const updateMeta = () => {
    if (!banner) return;
    const updated: Banner = { ...banner, link: link.trim() || undefined, alt: alt.trim() || undefined };
    saveBanner(updated);
    setBannerState(updated);
    toast({ title: "Banner details saved" });
  };

  const removeBanner = () => {
    saveBanner(null);
    setBannerState(null);
    setLink("");
    setAlt("");
    toast({ title: "Banner removed — homepage skips it now" });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-heading font-bold">Homepage Promo Banner</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload any image — landscape, portrait or square. It will be shown at its natural aspect ratio on the homepage (right below the hero). Remove it anytime and the section disappears automatically.
        </p>
      </div>

      {banner?.image ? (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden glass-card flex items-center justify-center bg-black/20 p-2">
            <img
              src={banner.image}
              alt={banner.alt || "Banner"}
              className="w-auto h-auto max-w-full max-h-80 object-contain rounded-lg"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Optional link (e.g. /products or full URL)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Alt text (for accessibility)"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={updateMeta} className="btn-premium">Save Details</button>
            <button onClick={() => inputRef.current?.click()} className="btn-outline-premium inline-flex items-center gap-2">
              <Upload className="w-4 h-4" /> Replace Image
            </button>
            <button
              onClick={openCropper}
              className="px-5 py-3 rounded-xl bg-secondary border border-border text-sm font-semibold hover:bg-secondary/80 transition-colors"
            >
              Crop (Optional)
            </button>
            <button
              onClick={removeBanner}
              className="px-5 py-3 rounded-xl bg-destructive/15 border border-destructive/40 text-destructive text-sm font-semibold hover:bg-destructive/25 transition-colors inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Remove Banner
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Click to upload a banner image</p>
          <p className="text-xs text-muted-foreground mt-1">
            Any size or aspect — uploaded as-is. JPG / PNG.
          </p>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />

      {rawImage && (
        <ImageCropper
          image={rawImage}
          aspect={undefined}
          title="Crop Banner"
          onCancel={() => setRawImage(null)}
          onCropComplete={onCropDone}
        />
      )}
    </div>
  );
}

function CredentialsTab() {
  const [currentPass, setCurrentPass] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setNewUsername(getAdminCreds().username);
  }, []);

  const save = () => {
    const creds = getAdminCreds();
    if (currentPass !== creds.password) {
      toast({ title: "Current password is incorrect", variant: "destructive" });
      return;
    }
    if (!newUsername.trim() || newUsername.length < 3) {
      toast({ title: "Username must be at least 3 characters", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "New password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    saveAdminCreds({ username: newUsername.trim(), password: newPassword });
    setCurrentPass("");
    setNewPassword("");
    setConfirmPassword("");
    toast({ title: "Credentials updated — use them on next login" });
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-lg font-heading font-bold">Admin Login Credentials</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Change your admin username and password. Stored locally on this device.
        </p>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Current Password</label>
          <input
            type="password"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">New Username</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
      <button onClick={save} className="btn-premium">Update Credentials</button>
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
  const brandList = getBrands();
  const categoryList = getCategories();
  const [form, setForm] = useState<Product>(
    product || {
      id: "",
      name: "",
      price: 0,
      brand: brandList[0] || "",
      category: categoryList[0] || "",
      specs: "",
      description: "",
      images: [],
      featured: false,
    }
  );
  const [uploading, setUploading] = useState(false);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFiles, setPendingFiles] = useState<string[]>([]);
  const [cropIndex, setCropIndex] = useState(0);

  const update = (key: keyof Product, value: any) => setForm({ ...form, [key]: value });

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const datas: string[] = [];
    for (const file of Array.from(files)) {
      datas.push(await fileToDataUrl(file));
    }
    setPendingFiles(datas);
    setCropIndex(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleCropDone = (dataUrl: string) => {
    setForm((prev) => ({ ...prev, images: [...prev.images, dataUrl] }));
    if (cropIndex + 1 < pendingFiles.length) {
      setCropIndex(cropIndex + 1);
    } else {
      const total = pendingFiles.length;
      setPendingFiles([]);
      setCropIndex(0);
      toast({ title: `${total} image(s) added` });
    }
  };

  const handleCropCancel = () => {
    // Skip current; if more remain, advance, else close
    if (cropIndex + 1 < pendingFiles.length) {
      setCropIndex(cropIndex + 1);
    } else {
      setPendingFiles([]);
      setCropIndex(0);
    }
  };

  const removeImage = (index: number) => {
    const updated = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updated });
    if (thumbnailIndex >= updated.length) setThumbnailIndex(0);
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      toast({ title: "Name and price are required", variant: "destructive" });
      return;
    }
    // Reorder images so thumbnail is first
    if (thumbnailIndex > 0 && form.images.length > 1) {
      const reordered = [...form.images];
      const [thumb] = reordered.splice(thumbnailIndex, 1);
      reordered.unshift(thumb);
      onSave({ ...form, images: reordered });
    } else {
      onSave(form);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 mb-8 space-y-5">
      <h2 className="text-lg font-heading font-bold">{product ? "Edit" : "Add"} Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="Product Name" value={form.name} onChange={(e) => update("name", e.target.value)} className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
        <input placeholder="Price" type="number" value={form.price || ""} onChange={(e) => update("price", Number(e.target.value))} className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Brand</h4>
          <div className="flex flex-wrap gap-2">
            {[...brandList, "Other"].map((b) => (
              <button key={b} type="button" onClick={() => update("brand", b)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.brand === b ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80 border border-border"}`}>
                {b}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Category</h4>
          <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors">
            {categoryList.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <p className="text-[10px] text-muted-foreground/70 mt-1.5">Manage categories from the Categories tab.</p>
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground">Product Images (auto-compressed under 500KB)</h4>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to upload images
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">Multiple images • You'll crop each one</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />

          {form.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {form.images.map((img, i) => (
                <div key={i} className={`relative group rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${i === thumbnailIndex ? "border-primary shadow-[0_0_10px_hsl(var(--primary)/0.3)]" : "border-border"}`} onClick={() => setThumbnailIndex(i)}>
                  <img src={img} alt="" className="w-full aspect-square object-cover" />
                  {i === thumbnailIndex && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-[9px] text-center py-0.5 font-bold">THUMBNAIL</span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); removeImage(i); }} className="absolute top-1 right-1 p-1 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <input placeholder="Specs (brief)" value={form.specs} onChange={(e) => update("specs", e.target.value)} className="md:col-span-2 px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} className="md:col-span-2 px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary resize-none transition-colors" />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="rounded" />
          Featured Product
        </label>
      </div>
      <div className="flex gap-3">
        <button onClick={handleSave} className="btn-premium">Save Product</button>
        <button onClick={onCancel} className="px-6 py-3 rounded-xl bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
      </div>
      {pendingFiles.length > 0 && pendingFiles[cropIndex] && (
        <ImageCropper
          image={pendingFiles[cropIndex]}
          aspect={undefined}
          title={`Crop image ${cropIndex + 1} of ${pendingFiles.length}`}
          onCancel={handleCropCancel}
          onCropComplete={handleCropDone}
        />
      )}
    </motion.div>
  );
}

export default Admin;
