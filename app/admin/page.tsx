'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {
  Shield,
  Lock,
  Package,
  TrendingUp,
  Users,
  LogOut,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Layers,
  ChevronRight,
  Key,
  MessageSquare,
  Trash2,
  X,
  Globe,
  Plus,
  Edit3,
  Image as ImageIcon,
  Palette,
  Ruler,
  Upload,
  FolderTree,
  Loader2,
  Sparkles,
  Gift,
  Tag,
  Download,
  Send,
  MessageCircle,
} from 'lucide-react';

export interface ProductVariantColor {
  name: string;
  hex: string;
  sizes: string[];
  images: string[];
}

export interface EditableProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  mrp: number;
  price: number;
  inStock: boolean;
  featuredSale: boolean;
  isNewArrival: boolean;
  coverPrimary: string;
  coverHover: string;
  images: string[];
  sizes: string[];
  hasColors: boolean;
  colors: ProductVariantColor[];
  description: string;
  spec: string;
}

export interface LeatherComboItem {
  id: string;
  title: string;
  subTitle: string;
  originalPrice: number;
  comboPrice: number;
  image: string;
  tag: string;
  includedItems: string[];
}

interface ModeratedReview {
  id: string;
  productSlug: string;
  productName: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  showOnTiltedHome: boolean;
  approved: boolean;
}

interface AdminOrder {
  id: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CRAFTING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  shippingAddr?: any;
  items?: any[];
}

interface CustomerLead {
  email: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  city: string;
  lastOrderDate: string;
}

const DEFAULT_CATEGORY_SUB_MAP: Record<string, string[]> = {
  'Full-Grain Belts': ['Formal Dress Belts', 'Heavy Jeans 40mm', 'Raw Saddle Harness', 'Reversible Belts'],
  'Wallets & Carry': ['Slim Bifold Wallets', 'Cardholders', 'Field Backpacks', 'Travel Duffles', 'Leather Cases'],
  'Outerwear Atelier': ['Moto Jackets', 'Bomber Jackets', 'Field Coats'],
  'Welted Footwear': ['Service Derby Shoes', 'Oxford Dress Shoes', 'Raw Harness Slides', 'Boots'],
};

const DEFAULT_COMBOS: LeatherComboItem[] = [
  {
    id: 'combo-01',
    title: 'The Gentleman Executive Set',
    subTitle: 'The Bridle Edition Belt + Bespoke Folio Wallet',
    originalPrice: 9998,
    comboPrice: 7999,
    image: '/belt-macro.png',
    tag: 'Bestseller Bundle',
    includedItems: ['The Bridle Edition Belt', 'Bespoke Folio Wallet', 'Solid Brass Keyring'],
  },
  {
    id: 'combo-02',
    title: 'Heritage Travel Cargo Set',
    subTitle: 'Monolithic Field Duffle + Travel Organizer Case',
    originalPrice: 28498,
    comboPrice: 22999,
    image: '/belt-macro.png',
    tag: 'Exclusive Voyage Edition',
    includedItems: ['Field Duffle 45L', 'MagSafe Leather Case', 'Luggage Tag'],
  },
];

const INITIAL_REVIEWS: ModeratedReview[] = [
  {
    id: 'rev-101',
    productSlug: 'the-bridle-edition',
    productName: 'The Bridle Edition Belt',
    author: 'Rohit Verma',
    rating: 5,
    date: '2 Days Ago',
    title: 'Pure 4mm hide, lifetime build',
    comment: 'The thickest pure leather belt I have ever bought in India. Solid brass weight is phenomenal.',
    verified: true,
    showOnTiltedHome: true,
    approved: true,
  },
  {
    id: 'rev-102',
    productSlug: 'the-onyx-dress',
    productName: 'The Onyx Dress Belt',
    author: 'Ananya Singhania',
    rating: 5,
    date: '3 Days Ago',
    title: 'Perfect tailored finish',
    comment: 'Tailored perfectly for my husband suit trousers. Real hand painted edge shine.',
    verified: true,
    showOnTiltedHome: true,
    approved: true,
  },
];

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 15 * 60 * 1000;

export default function MasterAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  // Rate Limiting
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'inventory' | 'combos' | 'categories' | 'crm' | 'orders' | 'reviews' | 'currency' | 'analytics'>('inventory');

  // Master Data
  const [products, setProducts] = useState<EditableProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [categorySubMap, setCategorySubMap] = useState<Record<string, string[]>>(DEFAULT_CATEGORY_SUB_MAP);
  const [combos, setCombos] = useState<LeatherComboItem[]>(DEFAULT_COMBOS);
  const [reviews, setReviews] = useState<ModeratedReview[]>(INITIAL_REVIEWS);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // CRM Search & Broadcast State
  const [crmSearch, setCrmSearch] = useState('');
  const [promoMessage, setPromoMessage] = useState('Greetings from HIDEWOOD Kanpur! Exclusive festive handcrafted leather drops are live now with complimentary personalization.');

  const [saveBanner, setSaveBanner] = useState(false);
  const [saveMessage, setSaveMessage] = useState('Database Synced');

  // Loaders
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Full-Grain Belts');
  const [formSubCategory, setFormSubCategory] = useState('Formal Dress Belts');
  const [customSubCategory, setCustomSubCategory] = useState('');
  const [formMrp, setFormMrp] = useState(6999);
  const [formPrice, setFormPrice] = useState(5499);
  const [formIsNewArrival, setFormIsNewArrival] = useState(true);
  const [formDescription, setFormDescription] = useState('');
  const [formSpec, setFormSpec] = useState('');

  // Covers & Galleries
  const [formCoverPrimary, setFormCoverPrimary] = useState('');
  const [formCoverHover, setFormCoverHover] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [imageInputUrl, setImageInputUrl] = useState('');

  // Sizes & Colors
  const [formSizes, setFormSizes] = useState<string[]>(['30', '32', '34', '36', '38']);
  const [newSizeInput, setNewSizeInput] = useState('');
  const [formHasColors, setFormHasColors] = useState(false);
  const [formColors, setFormColors] = useState<ProductVariantColor[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#111111');
  const [newColorSizes, setNewColorSizes] = useState<string[]>(['32', '34', '36']);
  const [newColorSizeInput, setNewColorSizeInput] = useState('');
  const [newColorImagesList, setNewColorImagesList] = useState<string[]>([]);
  const [newColorSingleUrl, setNewColorSingleUrl] = useState('');

  // Combo Modal State
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [comboTitle, setComboTitle] = useState('');
  const [comboSubtitle, setComboSubtitle] = useState('');
  const [comboOriginalPrice, setComboOriginalPrice] = useState(9999);
  const [comboPrice, setComboPrice] = useState(7999);
  const [comboTag, setComboTag] = useState('Handcrafted Bundle');
  const [comboImage, setComboImage] = useState('');
  const [comboIncludedText, setComboIncludedText] = useState('Belt, Wallet, Brass Keyring');

  // Category Manager State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategoryInput, setNewSubCategoryInput] = useState('');
  const [targetCategoryForSub, setTargetCategoryForSub] = useState('Full-Grain Belts');

  // Currencies
  const [globalCurrencies, setGlobalCurrencies] = useState({
    usd: true,
    eur: true,
    gbp: true,
    aed: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const loginCardRef = useRef<HTMLDivElement>(null);

  // Helper for secure headers
  const getAdminHeaders = () => {
    const token = sessionStorage.getItem('hidewood_admin_token') || '';
    return {
      'Content-Type': 'application/json',
      'x-atelier-admin-key': token,
    };
  };

  const fetchLiveCatalog = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products from database:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchLiveCategories = async () => {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      const data = await res.json();
      if (data.categories) {
        setCategorySubMap(data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchLiveOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/orders/all', {
        headers: getAdminHeaders(),
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load real orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Session verification on mount
  useEffect(() => {
    const verifyExistingSession = async () => {
      const savedToken = sessionStorage.getItem('hidewood_admin_token');
      if (!savedToken) {
        setIsVerifyingAuth(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: savedToken }),
        });
        if (res.ok) {
          setIsAuthenticated(true);
          fetchLiveCatalog();
          fetchLiveOrders();
          fetchLiveCategories();
        } else {
          sessionStorage.removeItem('hidewood_admin_token');
        }
      } catch (e) {
        console.error('Session verify failed:', e);
      } finally {
        setIsVerifyingAuth(false);
      }
    };

    verifyExistingSession();

    const savedLockout = localStorage.getItem('hidewood_admin_lockout_until');
    if (savedLockout) {
      const lockTime = parseInt(savedLockout, 10);
      if (lockTime > Date.now()) {
        setLockoutUntil(lockTime);
      } else {
        localStorage.removeItem('hidewood_admin_lockout_until');
        localStorage.removeItem('hidewood_admin_failed_attempts');
      }
    }

    const cachedCombos = localStorage.getItem('hidewood_combos');
    if (cachedCombos) {
      try {
        setCombos(JSON.parse(cachedCombos));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutRemaining(diff);
      if (diff <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        localStorage.removeItem('hidewood_admin_lockout_until');
        localStorage.removeItem('hidewood_admin_failed_attempts');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleLoginTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!loginCardRef.current || lockoutUntil) return;
    const rect = loginCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(loginCardRef.current, {
      rotateX: (y / (rect.height / 2)) * -10,
      rotateY: (x / (rect.width / 2)) * 10,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleLoginReset = () => {
    if (!loginCardRef.current) return;
    gsap.to(loginCardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  useEffect(() => {
    if (isAuthenticated && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.admin-fade-card',
          { opacity: 0, y: 20, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.04, ease: 'power3.out' }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isAuthenticated, activeTab]);

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutUntil) return;

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkeyInput }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        sessionStorage.setItem('hidewood_admin_token', data.token);
        setIsAuthenticated(true);
        setAuthError(false);
        setFailedAttempts(0);
        localStorage.removeItem('hidewood_admin_failed_attempts');
        fetchLiveCatalog();
        fetchLiveOrders();
        fetchLiveCategories();
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        localStorage.setItem('hidewood_admin_failed_attempts', newAttempts.toString());

        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_TIME_MS;
          setLockoutUntil(lockTime);
          localStorage.setItem('hidewood_admin_lockout_until', lockTime.toString());
        }

        setAuthError(true);
        if (loginCardRef.current) {
          gsap.timeline()
            .to(loginCardRef.current, { x: -10, duration: 0.07 })
            .to(loginCardRef.current, { x: 10, duration: 0.07 })
            .to(loginCardRef.current, { x: -6, duration: 0.07 })
            .to(loginCardRef.current, { x: 0, duration: 0.07 });
        }
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('hidewood_admin_token');
    setIsAuthenticated(false);
    setPasskeyInput('');
  };

  const triggerSaveToast = (msg = 'Database Synced') => {
    setSaveMessage(msg);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2200);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (cloudUrl: string) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            if (typeof reader.result === 'string') {
              try {
                const res = await fetch('/api/upload', {
                  method: 'POST',
                  headers: getAdminHeaders(),
                  body: JSON.stringify({ image: reader.result }),
                });
                const data = await res.json();
                if (data.url) {
                  onSuccess(data.url);
                  triggerSaveToast('Image Uploaded to Cloudinary');
                } else {
                  alert('Image upload failed: ' + (data.error || 'Server error'));
                }
              } catch (err) {
                console.error(err);
                alert('Upload failed. Check network log.');
              }
            }
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const customerLeads: CustomerLead[] = useMemo(() => {
    const map = new Map<string, CustomerLead>();

    orders.forEach((ord) => {
      const email = ord.customerEmail.toLowerCase().trim();
      const existing = map.get(email);
      const city = ord.shippingAddr?.city || 'India';
      const phone = ord.customerPhone || ord.shippingAddr?.phone || '';

      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += ord.totalAmount;
        if (phone && !existing.phone) existing.phone = phone;
      } else {
        map.set(email, {
          email,
          name: ord.customerName || ord.shippingAddr?.name || 'Patron',
          phone: phone || '+91 9999999999',
          totalOrders: 1,
          totalSpent: ord.totalAmount,
          city,
          lastOrderDate: new Date(ord.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  const filteredLeads = useMemo(() => {
    if (!crmSearch) return customerLeads;
    const q = crmSearch.toLowerCase();
    return customerLeads.filter(
      (l) => l.email.toLowerCase().includes(q) || l.name.toLowerCase().includes(q) || l.phone.includes(q)
    );
  }, [customerLeads, crmSearch]);

  const handleExportCSV = () => {
    if (customerLeads.length === 0) {
      alert('No real customer orders available to export yet.');
      return;
    }

    const headers = ['Buyer Name', 'Email Address', 'Phone Number', 'Total Orders', 'Lifetime Spend (INR)', 'City', 'Last Purchase Date'];
    const rows = customerLeads.map((l) => [
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      l.totalOrders,
      l.totalSpent,
      `"${l.city}"`,
      `"${l.lastOrderDate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hidewood_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSaveToast('Customer CSV Exported');
  };

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setFormName('');
    const firstCat = Object.keys(categorySubMap)[0] || 'Full-Grain Belts';
    setFormCategory(firstCat);
    setFormSubCategory(categorySubMap[firstCat]?.[0] || 'General');
    setCustomSubCategory('');
    setFormMrp(6999);
    setFormPrice(5499);
    setFormIsNewArrival(true);
    setFormCoverPrimary('');
    setFormCoverHover('');
    setFormImages([]);
    setImageInputUrl('');
    setFormDescription('');
    setFormSpec('4.2mm Real Hide • Solid Brass Buckle');
    setFormSizes(['30', '32', '34', '36', '38']);
    setFormHasColors(false);
    setFormColors([]);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: EditableProduct) => {
    setEditingProductId(prod.id);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormSubCategory(prod.subCategory || 'General');
    setCustomSubCategory('');
    setFormMrp(prod.mrp);
    setFormPrice(prod.price);
    setFormIsNewArrival(prod.isNewArrival ?? true);
    setFormCoverPrimary(prod.coverPrimary || prod.images?.[0] || '');
    setFormCoverHover(prod.coverHover || prod.images?.[1] || '');
    setFormImages(prod.images || []);
    setImageInputUrl('');
    setFormDescription(prod.description);
    setFormSpec(prod.spec);
    setFormSizes(prod.sizes || ['30', '32', '34', '36', '38']);
    setFormHasColors(prod.hasColors || false);
    setFormColors(prod.colors || []);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leather article permanently from the database?')) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        triggerSaveToast('Product Deleted Permanently From Cloud DB');
      } else {
        alert('Unauthorized or failed to delete.');
      }
    } catch (err) {
      console.error(err);
      alert('Delete failed. Check server log.');
    }
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCoverPrimary) {
      alert('Please upload or provide at least the Default Primary Image.');
      return;
    }

    setIsSubmitting(true);
    const finalSubCategory = customSubCategory.trim() || formSubCategory;

    if (finalSubCategory && finalSubCategory !== 'General') {
      const existingSubs = categorySubMap[formCategory] || [];
      if (!existingSubs.includes(finalSubCategory)) {
        const updatedSubs = [...existingSubs, finalSubCategory];
        const updatedMap = {
          ...categorySubMap,
          [formCategory]: updatedSubs,
        };
        setCategorySubMap(updatedMap);
        window.dispatchEvent(new Event('hidewood_categories_updated'));

        fetch('/api/categories', {
          method: 'POST',
          headers: getAdminHeaders(),
          body: JSON.stringify({
            action: 'ADD_SUB',
            category: formCategory,
            subCategory: finalSubCategory,
          }),
        }).catch((err) => console.error('Cloud category sync error:', err));
      }
    }

    const compiledImages = [
      formCoverPrimary,
      ...(formCoverHover ? [formCoverHover] : []),
      ...formImages.filter((img) => img !== formCoverPrimary && img !== formCoverHover),
    ];

    const payload = {
      name: formName,
      category: formCategory,
      subCategory: finalSubCategory,
      mrp: Number(formMrp),
      price: Number(formPrice),
      isNewArrival: Boolean(formIsNewArrival),
      coverPrimary: formCoverPrimary,
      coverHover: formCoverHover || formCoverPrimary,
      images: compiledImages,
      sizes: formSizes.length > 0 ? formSizes : ['Free Size'],
      hasColors: formHasColors,
      colors: formHasColors ? formColors : [],
      description: formDescription,
      spec: formSpec,
    };

    try {
      if (editingProductId) {
        const res = await fetch(`/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: getAdminHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.product) {
          setProducts((prev) => prev.map((p) => (p.id === editingProductId ? data.product : p)));
          triggerSaveToast('Product Updated In Cloud DB');
        } else {
          alert('Update failed: ' + (data.error || 'Unauthorized'));
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: getAdminHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.product) {
          setProducts((prev) => [data.product, ...prev]);
          triggerSaveToast('Product Created In Cloud DB');
        } else {
          alert('Creation failed: ' + (data.error || 'Unauthorized'));
        }
      }
      setIsProductModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSize = () => {
    if (!newSizeInput.trim() || formSizes.includes(newSizeInput.trim())) return;
    setFormSizes([...formSizes, newSizeInput.trim()]);
    setNewSizeInput('');
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setFormSizes(formSizes.filter((s) => s !== sizeToRemove));
  };

  const handleAddColorSize = () => {
    if (!newColorSizeInput.trim() || newColorSizes.includes(newColorSizeInput.trim())) return;
    setNewColorSizes([...newColorSizes, newColorSizeInput.trim()]);
    setNewColorSizeInput('');
  };

  const handleRemoveColorSize = (sz: string) => {
    setNewColorSizes(newColorSizes.filter((s) => s !== sz));
  };

  const handleCommitColorVariant = () => {
    if (!newColorName.trim()) {
      alert('Please enter a color name (e.g. Chestnut Tan)');
      return;
    }
    const newVariant: ProductVariantColor = {
      name: newColorName.trim(),
      hex: newColorHex,
      sizes: newColorSizes.length > 0 ? newColorSizes : formSizes,
      images: newColorImagesList.length > 0 ? newColorImagesList : (formCoverPrimary ? [formCoverPrimary] : []),
    };
    setFormColors([...formColors, newVariant]);
    setNewColorName('');
    setNewColorHex('#111111');
    setNewColorSizes(['32', '34', '36']);
    setNewColorImagesList([]);
    setNewColorSingleUrl('');
  };

  const handleRemoveColorVariant = (index: number) => {
    setFormColors(formColors.filter((_, i) => i !== index));
  };

  const toggleStockStatus = async (id: string, currentStock: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ inStock: !currentStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, inStock: !currentStock } : p))
        );
        triggerSaveToast('Stock Status Synced to DB');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSaleBadge = async (id: string, currentSale: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ featuredSale: !currentSale }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, featuredSale: !currentSale } : p))
        );
        triggerSaveToast('Flash Sale Synced to DB');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleNewArrivalBadge = async (id: string, currentArrival: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ isNewArrival: !currentArrival }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isNewArrival: !currentArrival } : p))
        );
        triggerSaveToast('New Arrival Synced to DB');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCombo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comboTitle || !comboImage) {
      alert('Title and combo image are required.');
      return;
    }
    const newCombo: LeatherComboItem = {
      id: `combo-${Date.now()}`,
      title: comboTitle,
      subTitle: comboSubtitle,
      originalPrice: Number(comboOriginalPrice),
      comboPrice: Number(comboPrice),
      image: comboImage,
      tag: comboTag,
      includedItems: comboIncludedText.split(',').map((s) => s.trim()).filter(Boolean),
    };

    const updated = [newCombo, ...combos];
    setCombos(updated);
    localStorage.setItem('hidewood_combos', JSON.stringify(updated));
    setIsComboModalOpen(false);
    setComboTitle('');
    setComboSubtitle('');
    setComboImage('');
    triggerSaveToast('Leather Combo Saved');
  };

  const handleDeleteCombo = (id: string) => {
    if (confirm('Delete this combo offer?')) {
      const updated = combos.filter((c) => c.id !== id);
      setCombos(updated);
      localStorage.setItem('hidewood_combos', JSON.stringify(updated));
      triggerSaveToast('Combo Removed');
    }
  };

  const handleAddNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCat = newCategoryName.trim();
    if (!cleanCat || categorySubMap[cleanCat]) return;

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ action: 'ADD_CATEGORY', category: cleanCat }),
      });
    } catch (err) {
      console.error(err);
    }

    const updated = { ...categorySubMap, [cleanCat]: ['General'] };
    setCategorySubMap(updated);
    window.dispatchEvent(new Event('hidewood_categories_updated'));
    setNewCategoryName('');
    triggerSaveToast(`Category "${cleanCat}" Synced to Cloud DB`);
  };

  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSub = newSubCategoryInput.trim();
    if (!cleanSub) return;

    const existingSubs = categorySubMap[targetCategoryForSub] || [];
    if (existingSubs.includes(cleanSub)) return;

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          action: 'ADD_SUB',
          category: targetCategoryForSub,
          subCategory: cleanSub,
        }),
      });
    } catch (err) {
      console.error(err);
    }

    const updated = {
      ...categorySubMap,
      [targetCategoryForSub]: [...existingSubs, cleanSub],
    };
    setCategorySubMap(updated);
    window.dispatchEvent(new Event('hidewood_categories_updated'));
    setNewSubCategoryInput('');
    triggerSaveToast(`Sub-category Synced to Cloud DB under ${targetCategoryForSub}`);
  };

  const handleDeleteSubCategory = async (category: string, sub: string) => {
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          action: 'DELETE_SUB',
          category,
          subCategory: sub,
        }),
      });
    } catch (err) {
      console.error(err);
    }

    const currentSubs = categorySubMap[category] || [];
    const filteredSubs = currentSubs.filter(
      (s) => s.trim().toLowerCase() !== sub.trim().toLowerCase()
    );

    const updated = {
      ...categorySubMap,
      [category]: filteredSubs,
    };

    setCategorySubMap(updated);
    window.dispatchEvent(new Event('hidewood_categories_updated'));
    triggerSaveToast(`Permanently Deleted "${sub}" From Cloud DB`);
  };

  const toggleTiltedHomeReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, showOnTiltedHome: !r.showOnTiltedHome } : r))
    );
    triggerSaveToast('Review Visibility Updated');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    triggerSaveToast('Review Deleted');
  };

  const updateOrderStatus = async (orderId: string, newStatus: AdminOrder['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
        );
        triggerSaveToast('Order Status Synced to DB');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isVerifyingAuth) {
    return (
      <main className="min-h-screen bg-[#070707] flex items-center justify-center font-mono text-xs text-neutral-400">
        <Loader2 className="w-6 h-6 animate-spin text-red-500 mb-2" />
        <span>Verifying secure atelier session...</span>
      </main>
    );
  }

  // 1. LOCKED VIEW
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#070707] flex items-center justify-center p-4 select-none relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-950/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-950/20 rounded-full blur-[140px] pointer-events-none" />

        <div
          ref={loginCardRef}
          onMouseMove={handleLoginTilt}
          onMouseLeave={handleLoginReset}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-full max-w-md bg-[#121212]/95 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] relative z-10"
        >
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-red-500 font-bold">
              <Shield className="w-3.5 h-3.5" />
              RESTRICTED VAULT
            </span>
            <span>KANPUR ATELIER</span>
          </div>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-white">
              <Lock className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-sans">
              ATELIER COMMAND
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              Enter master cryptographic passkey to unlock store operations.
            </p>
          </div>

          <form onSubmit={handleAuthorize} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1A1A1A] border border-white/10 px-3.5 py-3 text-sm font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 transition-colors"
                />
                <Key className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>

              {authError && (
                <div className="text-[11px] font-mono text-red-500 mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Invalid Passkey.
                  </span>
                  <span>{MAX_FAILED_ATTEMPTS - failedAttempts} attempts left</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase font-bold tracking-widest transition-all cursor-pointer shadow-lg active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Panel</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    );
  }

  // 2. UNLOCKED VIEW
  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0A0A] text-neutral-200 select-none pb-20">
      {saveBanner && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white font-mono text-xs uppercase px-4 py-2.5 shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      <header className="border-b border-white/10 bg-[#111111]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-red-600 text-white font-black text-xs tracking-tighter">
            HW
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              HIDEWOOD Master Console
            </h2>
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected to Neon Database (Singapore)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors py-1.5 px-3 border border-white/10 bg-white/5"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-200 uppercase font-bold tracking-wider transition-colors cursor-pointer text-[10px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
          {[
            {
              label: 'Total Revenue',
              value: `₹${orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString('en-IN')}`,
              change: 'Real Capture',
              icon: TrendingUp,
              color: 'text-emerald-400',
            },
            {
              label: 'Real Active Orders',
              value: orders.length.toString(),
              change: 'Live Database Orders',
              icon: Package,
              color: 'text-amber-400',
            },
            {
              label: 'Live Products',
              value: products.length.toString(),
              change: 'Neon PostgreSQL Active',
              icon: Layers,
              color: 'text-blue-400',
            },
            {
              label: 'Active Combos',
              value: combos.length.toString(),
              change: 'Gift Bundles Live',
              icon: Gift,
              color: 'text-purple-400',
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="admin-fade-card p-4 sm:p-5 bg-[#141414] border border-white/10 flex flex-col justify-between shadow-lg"
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400 uppercase mb-2">
                <span>{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-xl sm:text-3xl font-black font-mono text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] font-mono text-neutral-500 mt-2">
                {stat.change}
              </div>
            </div>
          ))}
        </section>

        <section className="flex items-center justify-between border-b border-white/10 pb-3 mb-6 font-mono text-xs uppercase overflow-x-auto [scrollbar-width:none]">
          <div className="flex items-center gap-2">
            {[
              { id: 'inventory', label: 'Products & Inventory' },
              { id: 'combos', label: 'Combos & Gift Sets' },
              { id: 'categories', label: 'Categories & Subcategories' },
              { id: 'crm', label: 'CRM & Customer Leads' },
              { id: 'orders', label: 'Order Fulfilment' },
              { id: 'reviews', label: 'Reviews & Tilted Section' },
              { id: 'currency', label: 'Geo & Currencies' },
              { id: 'analytics', label: 'Atelier Logistics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 px-3.5 transition-colors cursor-pointer font-bold tracking-wider shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'inventory' && (
            <button
              onClick={handleOpenAddProduct}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-1.5 text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 ml-4 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Real Article</span>
            </button>
          )}

          {activeTab === 'combos' && (
            <button
              onClick={() => setIsComboModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 ml-4 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Combo</span>
            </button>
          )}

          {activeTab === 'crm' && (
            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 ml-4 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV (Excel)</span>
            </button>
          )}
        </section>

        {activeTab === 'inventory' && (
          <section className="admin-fade-card bg-[#141414] border border-white/10 p-4 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10 font-mono text-xs">
              <div>
                <h3 className="text-sm font-bold uppercase text-white">Full Leather Catalog CRUD Hub</h3>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                  Direct sync with Neon PostgreSQL database and Cloudinary asset management.
                </p>
              </div>
              <div className="text-neutral-400 text-[10px]">
                Showing {products.length} live database articles
              </div>
            </div>

            {isLoadingProducts ? (
              <div className="py-20 flex flex-col items-center justify-center font-mono text-xs text-neutral-500">
                <Loader2 className="w-6 h-6 animate-spin text-red-500 mb-2" />
                <span>Fetching live catalog from Neon database...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center font-mono border border-dashed border-white/10 p-8 my-4">
                <Package className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <div className="text-neutral-300 font-bold uppercase text-sm">No Products In Database Yet</div>
                <p className="text-neutral-500 text-xs mt-1 max-w-sm mx-auto font-sans">
                  Click &quot;Add Real Article&quot; to upload your real leather products with separate cover flip and color variants.
                </p>
                <button
                  onClick={handleOpenAddProduct}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Product</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto [scrollbar-width:none]">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-500 text-[10px] uppercase tracking-wider">
                      <th className="pb-3">Primary / Hover Covers</th>
                      <th className="pb-3">Category &amp; Sub-Category</th>
                      <th className="pb-3">Price &amp; Strike MRP</th>
                      <th className="pb-3">Color Variants &amp; Sizes</th>
                      <th className="pb-3">New Arrival</th>
                      <th className="pb-3">Stock</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 flex items-center gap-2.5">
                          <div className="relative w-10 h-12 bg-neutral-900 border border-white/10 shrink-0 overflow-hidden" title="Primary Cover">
                            <img src={prod.coverPrimary || prod.images?.[0] || '/belt-macro.png'} alt="" className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] text-center text-white">Main</span>
                          </div>
                          <div className="relative w-10 h-12 bg-neutral-900 border border-white/10 shrink-0 overflow-hidden" title="Hover Cover">
                            <img src={prod.coverHover || prod.images?.[1] || prod.coverPrimary || '/belt-macro.png'} alt="" className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] text-center text-amber-400">Hover</span>
                          </div>
                          <div className="ml-1">
                            <div className="font-bold text-white uppercase text-xs">{prod.name}</div>
                            <div className="text-[9px] text-neutral-500">{(prod.images?.length || 0)} Gallery Shots</div>
                          </div>
                        </td>

                        <td className="py-3.5">
                          <span className="text-white font-bold block">{prod.category}</span>
                          <span className="text-amber-400/90 text-[10px] flex items-center gap-1 mt-0.5">
                            <FolderTree className="w-3 h-3 shrink-0" />
                            {prod.subCategory || 'General'}
                          </span>
                        </td>

                        <td className="py-3.5">
                          <span className="text-red-500 font-bold">₹{prod.price.toLocaleString('en-IN')}</span>
                          <span className="text-neutral-500 line-through ml-1.5 text-[10px]">₹{prod.mrp?.toLocaleString('en-IN') || ''}</span>
                        </td>

                        <td className="py-3.5">
                          {prod.hasColors && prod.colors && prod.colors.length > 0 ? (
                            <div className="space-y-1">
                              {prod.colors.map((c, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[10px]">
                                  <span className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: c.hex }} />
                                  <span className="text-neutral-300 font-bold uppercase">{c.name}:</span>
                                  <span className="text-neutral-500 font-mono text-[9px]">{c.sizes?.join(', ') || 'Free'}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-neutral-500 text-[10px]">{prod.sizes?.join(', ')}</span>
                          )}
                        </td>

                        <td className="py-3.5">
                          <button
                            type="button"
                            onClick={() => toggleNewArrivalBadge(prod.id, prod.isNewArrival ?? true)}
                            className={`text-[9px] uppercase font-bold px-2 py-0.5 border transition-colors cursor-pointer flex items-center gap-1 ${
                              prod.isNewArrival
                                ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                                : 'bg-white/5 text-neutral-500 border-white/10 hover:text-white'
                            }`}
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>{prod.isNewArrival ? 'New Arrival' : 'Standard'}</span>
                          </button>
                        </td>

                        <td className="py-3.5">
                          <button
                            type="button"
                            onClick={() => toggleStockStatus(prod.id, prod.inStock)}
                            className={`text-[9px] uppercase font-bold px-2 py-0.5 border transition-colors cursor-pointer ${
                              prod.inStock
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                                : 'bg-red-950/60 text-red-400 border-red-500/30'
                            }`}
                          >
                            {prod.inStock ? 'In Stock' : 'Sold Out'}
                          </button>
                        </td>

                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => toggleSaleBadge(prod.id, prod.featuredSale)}
                              className={`text-[9px] uppercase font-bold px-1.5 py-1 border transition-colors cursor-pointer ${
                                prod.featuredSale
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                                  : 'bg-white/5 text-neutral-500 border-white/10 hover:text-white'
                              }`}
                            >
                              {prod.featuredSale ? 'Sale On' : 'Sale Off'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer"
                              title="Edit Article"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 bg-red-950/40 hover:bg-red-900 border border-red-500/30 text-red-400 cursor-pointer"
                              title="Delete Article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === 'combos' && (
          <section className="admin-fade-card bg-[#141414] border border-white/10 p-4 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10 font-mono text-xs">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Gift className="w-4 h-4 text-purple-400" />
                  Combos, Bundles &amp; Gift Box Sets
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                  Manage discounted sets, curated leather pairings, and festive gift bundles displayed on the home page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsComboModalOpen(true)}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase cursor-pointer shrink-0"
              >
                + Add Combo Set
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {combos.map((combo) => (
                <div key={combo.id} className="p-4 bg-[#181818] border border-white/10 flex flex-col sm:flex-row gap-4 items-start font-mono text-xs">
                  <img src={combo.image} alt={combo.title} className="w-24 h-28 object-cover border border-white/10 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] bg-purple-950/80 border border-purple-500/40 text-purple-300 px-1.5 py-0.5 uppercase font-bold">
                      {combo.tag}
                    </span>
                    <h4 className="font-bold text-white uppercase text-sm mt-1">{combo.title}</h4>
                    <p className="text-[11px] text-neutral-400 font-sans mb-2">{combo.subTitle}</p>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-500 font-bold text-sm">₹{combo.comboPrice.toLocaleString('en-IN')}</span>
                      <span className="text-neutral-500 line-through text-xs">₹{combo.originalPrice.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="text-[10px] text-neutral-400 font-sans">
                      <span className="font-bold text-neutral-300">Items: </span>
                      {combo.includedItems.join(' • ')}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCombo(combo.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 cursor-pointer self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'categories' && (
          <section className="admin-fade-card bg-[#141414] border border-white/10 p-4 sm:p-6 shadow-xl font-mono text-xs">
            <h3 className="text-sm font-bold uppercase text-white mb-2 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-amber-400" />
              Dynamic Category &amp; Subcategory Architecture (Cloud Synced)
            </h3>
            <p className="text-neutral-400 font-sans mb-6">
              Add new product categories, create sub-collections, or prune obsolete categories.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 bg-[#181818] border border-white/10">
                <h4 className="text-xs uppercase font-bold text-white mb-3">1. Add New Master Category</h4>
                <form onSubmit={handleAddNewCategory} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Leather Office &amp; Stationery"
                    className="flex-1 bg-[#121212] border border-white/15 p-2 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-black font-bold uppercase text-xs cursor-pointer"
                  >
                    + Add Category
                  </button>
                </form>
              </div>

              <div className="p-4 bg-[#181818] border border-white/10">
                <h4 className="text-xs uppercase font-bold text-white mb-3">2. Add Subcategory To Category</h4>
                <form onSubmit={handleAddSubCategory} className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={targetCategoryForSub}
                      onChange={(e) => setTargetCategoryForSub(e.target.value)}
                      className="bg-[#121212] border border-white/15 p-2 text-xs text-white focus:outline-none"
                    >
                      {Object.keys(categorySubMap).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      value={newSubCategoryInput}
                      onChange={(e) => setNewSubCategoryInput(e.target.value)}
                      placeholder="e.g. Vintage Aviator Jackets"
                      className="flex-1 bg-[#121212] border border-white/15 p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-xs cursor-pointer"
                  >
                    + Attach Sub-Category
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h4 className="text-xs uppercase font-bold text-neutral-400">Current Catalog Architecture:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(categorySubMap).map(([cat, subs]) => (
                  <div key={cat} className="p-3 bg-[#121212] border border-white/10">
                    <div className="font-bold text-white uppercase text-xs pb-2 mb-2 border-b border-white/10 flex items-center justify-between">
                      <span>{cat}</span>
                      <span className="text-[10px] text-neutral-500 font-normal">{subs.length} sub-items</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {subs.map((sub) => (
                        <span key={sub} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 text-[10px] text-neutral-300">
                          <span>{sub}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubCategory(cat, sub)}
                            className="hover:text-red-400 cursor-pointer"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'crm' && (
          <section className="admin-fade-card bg-[#141414] border border-white/10 p-4 sm:p-6 shadow-xl font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Patron CRM &amp; Direct WhatsApp Broadcast
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                  Real customers, order history, lifetime value, CSV export, and WhatsApp re-engagement.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={crmSearch}
                  onChange={(e) => setCrmSearch(e.target.value)}
                  placeholder="Search buyer by name/phone/email..."
                  className="bg-[#1C1C1C] border border-white/15 px-3 py-1.5 text-xs text-white focus:outline-none w-64"
                />
              </div>
            </div>

            <div className="p-4 bg-[#181818] border border-emerald-500/20 mb-6 space-y-2">
              <label className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Pre-filled WhatsApp Broadcast Pitch</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoMessage}
                  onChange={(e) => setPromoMessage(e.target.value)}
                  className="flex-1 bg-[#121212] border border-white/15 p-2 text-xs text-neutral-200 focus:outline-none font-sans"
                />
              </div>
            </div>

            {isLoadingOrders ? (
              <div className="py-16 text-center text-neutral-400 flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mb-2" />
                <span>Fetching real buyers...</span>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-white/10 text-neutral-500 font-mono">
                No real customer orders in database yet. Orders placed on storefront will automatically profile here.
              </div>
            ) : (
              <div className="overflow-x-auto [scrollbar-width:none]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-500 text-[10px] uppercase tracking-wider">
                      <th className="pb-3">Buyer Profile</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Total Orders</th>
                      <th className="pb-3">Lifetime Value</th>
                      <th className="pb-3 text-right">WhatsApp Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeads.map((lead, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3">
                          <span className="font-bold text-white block uppercase">{lead.name}</span>
                          <span className="text-neutral-500 text-[10px]">{lead.email}</span>
                        </td>

                        <td className="py-3 font-mono">
                          <span className="text-neutral-300 block">{lead.phone}</span>
                          <span className="text-[9px] text-neutral-500">{lead.city}</span>
                        </td>

                        <td className="py-3">
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px]">
                            {lead.totalOrders} Orders
                          </span>
                        </td>

                        <td className="py-3 font-bold text-emerald-400">
                          ₹{lead.totalSpent.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 text-right">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${lead.name},\n\n${promoMessage}\n\nExplore: https://hidewood.in/products`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold uppercase text-[10px] transition-colors cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>WhatsApp Broadcast</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="admin-fade-card bg-[#141414] border border-white/10 p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase text-white">Live Dispatches &amp; Courier Status</h3>
              <span className="text-neutral-400">{orders.length} Real Orders</span>
            </div>

            {isLoadingOrders ? (
              <div className="py-20 flex flex-col items-center justify-center font-mono text-xs text-neutral-500">
                <Loader2 className="w-6 h-6 animate-spin text-red-500 mb-2" />
                <span>Fetching real customer orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-white/10 text-neutral-500 font-mono">
                No orders placed yet. Live purchases through checkout will appear here in real-time.
              </div>
            ) : (
              <div className="overflow-x-auto [scrollbar-width:none]">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-500 text-[10px] uppercase tracking-wider">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-bold text-white">{ord.id}</td>
                        <td className="py-3">
                          <span className="text-white block uppercase font-bold">{ord.customerName || ord.shippingAddr?.name || 'Customer'}</span>
                          <span className="text-neutral-500 text-[10px]">{ord.customerEmail} ({ord.shippingAddr?.city || 'India'})</span>
                        </td>
                        <td className="py-3 font-bold text-red-400">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <span className="text-[9px] uppercase px-2 py-0.5 border border-white/20">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                            className="bg-[#1C1C1C] border border-white/20 text-white text-[10px] py-1 px-2 focus:outline-none"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="CRAFTING">CRAFTING</option>
                            <option value="IN_TRANSIT">IN_TRANSIT</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === 'reviews' && (
          <section className="admin-fade-card bg-[#141414] border border-white/10 p-4 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10 font-mono text-xs">
              <div>
                <h3 className="text-sm font-bold uppercase text-white">Customer Reviews &amp; Tilted Section Control</h3>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                  Choose which reviews appear inside the 3D Tilted Tiles on Homepage.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-[#1A1A1A] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
                >
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white uppercase">{rev.author}</span>
                      <span className="text-neutral-500">&bull;</span>
                      <span className="text-amber-400 font-bold">★ {rev.rating}/5</span>
                      <span className="text-neutral-500">&bull;</span>
                      <span className="text-[10px] text-neutral-400">{rev.productName}</span>
                    </div>
                    <div className="font-bold text-neutral-200 mb-0.5">{rev.title}</div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">{rev.comment}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleTiltedHomeReview(rev.id)}
                      className={`py-1.5 px-3 text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                        rev.showOnTiltedHome
                          ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                          : 'bg-white/5 text-neutral-500 border-white/10 hover:text-white'
                      }`}
                    >
                      {rev.showOnTiltedHome ? '✓ Shown on Homepage 3D' : '+ Show on Homepage 3D'}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteReview(rev.id)}
                      className="p-2 bg-red-950/40 hover:bg-red-900 border border-red-500/30 text-red-400 transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'currency' && (
          <section className="admin-fade-card bg-[#141414] border border-white/10 p-6 font-mono text-xs">
            <h3 className="text-sm font-bold uppercase text-white mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Regional Domains &amp; Currency Engine
            </h3>
            <p className="text-neutral-400 font-sans mb-6">
              Configure strict geographical borders and display rates between Indian Domestic (.in) and International Global (.com) stores.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-white/10 bg-white/[0.02]">
                <div className="text-white font-bold uppercase mb-2">1. Domestic Storefront (.in)</div>
                <p className="text-neutral-400 font-sans text-[11px] mb-4">
                  Locks currency strictly to INR (₹). Restricts shipping addresses strictly to Indian PIN codes.
                </p>
                <div className="flex items-center justify-between p-2.5 bg-black border border-white/10">
                  <span>Domestic Currency</span>
                  <span className="text-emerald-400 font-bold">INR (₹) Locked</span>
                </div>
              </div>

              <div className="p-4 border border-white/10 bg-white/[0.02]">
                <div className="text-white font-bold uppercase mb-2">2. Global Storefront (.com)</div>
                <p className="text-neutral-400 font-sans text-[11px] mb-4">
                  Multi-currency checkout for worldwide clients with DHL Express international cargo rates.
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'United States Dollar (USD $)', key: 'usd' },
                    { label: 'Euro (EUR €)', key: 'eur' },
                    { label: 'British Pound (GBP £)', key: 'gbp' },
                    { label: 'UAE Dirham (AED)', key: 'aed' },
                  ].map((cur) => (
                    <label key={cur.key} className="flex items-center justify-between p-2 bg-black border border-white/10 cursor-pointer">
                      <span>{cur.label}</span>
                      <input
                        type="checkbox"
                        checked={(globalCurrencies as any)[cur.key]}
                        onChange={(e) => {
                          setGlobalCurrencies({ ...globalCurrencies, [cur.key]: e.target.checked });
                          triggerSaveToast('Currency Updated');
                        }}
                        className="accent-red-600 w-4 h-4"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'analytics' && (
          <section className="admin-fade-card bg-[#141414] border border-white/10 p-6 font-mono text-xs">
            <h3 className="text-sm font-bold uppercase text-white mb-2">Kanpur Atelier Logistics Hub</h3>
            <p className="text-neutral-400 leading-relaxed mb-6 font-sans">
              All parcels dispatch directly via BlueDart &amp; Delhivery Express services. Raw hide batches are inspected and vegetable-tanned locally.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="p-3 bg-white/5 border border-white/5">
                <div className="text-neutral-500 text-[10px] uppercase">Average Courier TAT</div>
                <div className="text-lg font-bold text-white mt-1">42 Hours</div>
              </div>
              <div className="p-3 bg-white/5 border border-white/5">
                <div className="text-neutral-500 text-[10px] uppercase">Exchange Rate</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">&lt; 1.2%</div>
              </div>
              <div className="p-3 bg-white/5 border border-white/5">
                <div className="text-neutral-500 text-[10px] uppercase">Payment Capture</div>
                <div className="text-lg font-bold text-white mt-1">Stripe 3D-Secure 2.0</div>
              </div>
            </div>
          </section>
        )}
      </main>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#141414] border border-white/20 p-6 font-mono text-xs text-white max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-5">
              <span className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-red-500" />
                {editingProductId ? 'Edit Product Details' : 'Add New Leather Article to Database'}
              </span>
              <button onClick={() => setIsProductModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. The Bridle Edition Belt"
                    className="w-full bg-[#1C1C1C] border border-white/15 p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      setFormCategory(e.target.value);
                      const subOpts = categorySubMap[e.target.value] || [];
                      setFormSubCategory(subOpts[0] || 'General');
                    }}
                    className="w-full bg-[#1C1C1C] border border-white/15 p-2.5 text-xs text-white focus:outline-none"
                  >
                    {Object.keys(categorySubMap).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                    Sub-Category
                  </label>
                  <select
                    value={formSubCategory}
                    onChange={(e) => setFormSubCategory(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-white/15 p-2.5 text-xs text-white focus:outline-none mb-1"
                  >
                    {(categorySubMap[formCategory] || ['General']).map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={customSubCategory}
                    onChange={(e) => setCustomSubCategory(e.target.value)}
                    placeholder="Or type custom subcategory..."
                    className="w-full bg-[#121212] border border-white/10 px-2 py-1 text-[10px] text-neutral-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#1C1C1C] border border-white/15 p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                    Original MRP (₹) (Cut-Price Strikethrough)
                  </label>
                  <input
                    type="number"
                    required
                    value={formMrp}
                    onChange={(e) => setFormMrp(Number(e.target.value))}
                    className="w-full bg-[#1C1C1C] border border-white/15 p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 bg-[#1C1C1C] border border-white/15 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsNewArrival}
                      onChange={(e) => setFormIsNewArrival(e.target.checked)}
                      className="accent-red-600 w-4 h-4 shrink-0"
                    />
                    <div>
                      <span className="font-bold uppercase text-[10px] text-purple-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Tag as New Arrival
                      </span>
                      <span className="text-[9px] text-neutral-400 block font-sans">
                        Featured on Home &amp; Drops section
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-[#1C1C1C] border border-white/10">
                <div className="mb-3">
                  <span className="text-[11px] font-bold uppercase flex items-center gap-1.5 text-white">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    Dedicated Covers (Homepage &amp; Product Grid Flip)
                  </span>
                  <span className="text-[9px] text-neutral-400 font-sans block mt-0.5">
                    Set 1st Default Primary image and 2nd Secondary image that flips on hover.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#141414] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-neutral-300">1. Default Primary Cover</span>
                      <label className="text-[9px] font-bold text-amber-300 hover:underline cursor-pointer flex items-center gap-1">
                        <Upload className="w-2.5 h-2.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          onChange={(e) => handleFileUpload(e, (url) => setFormCoverPrimary(url))}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {formCoverPrimary ? (
                      <div className="relative w-full h-32 bg-black border border-white/20 overflow-hidden group">
                        <img src={formCoverPrimary} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormCoverPrimary('')}
                          className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 rounded-full cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={formCoverPrimary}
                        onChange={(e) => setFormCoverPrimary(e.target.value)}
                        placeholder="Paste primary image URL or upload above..."
                        className="w-full bg-[#1A1A1A] border border-white/15 p-2 text-xs text-white focus:outline-none"
                      />
                    )}
                  </div>

                  <div className="p-3 bg-[#141414] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-neutral-300">2. Secondary Hover Cover</span>
                      <label className="text-[9px] font-bold text-amber-300 hover:underline cursor-pointer flex items-center gap-1">
                        <Upload className="w-2.5 h-2.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          onChange={(e) => handleFileUpload(e, (url) => setFormCoverHover(url))}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {formCoverHover ? (
                      <div className="relative w-full h-32 bg-black border border-white/20 overflow-hidden group">
                        <img src={formCoverHover} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormCoverHover('')}
                          className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 rounded-full cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={formCoverHover}
                        onChange={(e) => setFormCoverHover(e.target.value)}
                        placeholder="Paste hover flip image URL or upload above..."
                        className="w-full bg-[#1A1A1A] border border-white/15 p-2 text-xs text-white focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#1C1C1C] border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase flex items-center gap-1.5 text-white">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                      Product Detail Page Gallery (Texture, Hardware, Inside views)
                    </span>
                    <span className="text-[9px] text-neutral-400 font-sans">
                      Photos displayed inside the product page carousel/gallery.
                    </span>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/60 hover:bg-blue-900 border border-blue-500/40 text-blue-200 text-[10px] font-bold uppercase cursor-pointer shrink-0 transition-colors">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" />
                        <span>Upload Gallery Photos</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploading}
                      onChange={(e) => handleFileUpload(e, (cloudUrl) => setFormImages((prev) => [...prev, cloudUrl]))}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-2.5 mb-3">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-20 bg-neutral-900 border border-white/20 group overflow-hidden">
                      <img src={img} alt={`Gallery frame ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-center font-bold">
                        Detail {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormImages(formImages.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-black/80 text-red-400 hover:text-white p-0.5 rounded-full cursor-pointer"
                        title="Remove Image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageInputUrl}
                    onChange={(e) => setImageInputUrl(e.target.value)}
                    placeholder="Or paste Direct Image URL..."
                    className="flex-1 bg-[#121212] border border-white/15 px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageInputUrl.trim()) {
                        setFormImages([...formImages, imageInputUrl.trim()]);
                        setImageInputUrl('');
                      }
                    }}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[10px] cursor-pointer"
                  >
                    + Add URL
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-[#1C1C1C] border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-amber-400" />
                    Default Article Sizes (Inches / Units)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {formSizes.map((sz) => (
                    <span key={sz} className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 border border-white/15 text-[10px]">
                      <span>{sz}&quot;</span>
                      <button type="button" onClick={() => handleRemoveSize(sz)} className="text-neutral-400 hover:text-red-400 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    placeholder="e.g. 40 or L"
                    className="w-36 bg-[#121212] border border-white/15 px-2.5 py-1 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[10px] cursor-pointer"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#1C1C1C] border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-purple-400" />
                    Color Variations with Independent Sizes &amp; Galleries
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-[10px] uppercase font-bold text-neutral-300">
                    <input
                      type="checkbox"
                      checked={formHasColors}
                      onChange={(e) => setFormHasColors(e.target.checked)}
                      className="accent-red-600 w-3.5 h-3.5"
                    />
                    <span>Enable Colors</span>
                  </label>
                </div>

                {formHasColors ? (
                  <div>
                    {formColors.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {formColors.map((col, idx) => (
                          <div key={idx} className="p-3 bg-[#121212] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="w-4 h-4 rounded-full border border-white/30 shrink-0" style={{ backgroundColor: col.hex }} />
                                <span className="font-bold text-white uppercase text-xs">{col.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[9px] text-neutral-400">
                                <span className="font-bold text-amber-400 uppercase">Available Sizes:</span>
                                <span>{col.sizes?.join(', ') || 'Same as base'}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 overflow-x-auto">
                              {col.images.map((imgSrc, imgIdx) => (
                                <img key={imgIdx} src={imgSrc} alt="" className="w-9 h-9 object-cover border border-white/10 shrink-0" />
                              ))}
                              <button
                                type="button"
                                onClick={() => handleRemoveColorVariant(idx)}
                                className="text-neutral-500 hover:text-red-400 p-1.5 ml-2 cursor-pointer"
                                title="Delete Color Variant"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="p-3.5 bg-[#161616] border border-purple-500/20 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-neutral-400 uppercase block mb-1">Color Shade Name</label>
                          <input
                            type="text"
                            value={newColorName}
                            onChange={(e) => setNewColorName(e.target.value)}
                            placeholder="e.g. Vintage Chestnut"
                            className="w-full bg-[#121212] border border-white/15 p-2 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] text-neutral-400 uppercase block mb-1">Pick Color Hex Code</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={newColorHex}
                              onChange={(e) => setNewColorHex(e.target.value)}
                              className="w-8 h-8 bg-transparent cursor-pointer border border-white/20"
                            />
                            <input
                              type="text"
                              value={newColorHex}
                              onChange={(e) => setNewColorHex(e.target.value)}
                              className="w-28 bg-[#121212] border border-white/15 p-1.5 text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-[#111111] border border-white/5">
                        <label className="text-[9px] text-amber-400 uppercase font-bold block mb-1.5">
                          Specific Sizes Available in this Color:
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {newColorSizes.map((sz) => (
                            <span key={sz} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 text-[9px] border border-white/10">
                              <span>{sz}&quot;</span>
                              <button type="button" onClick={() => handleRemoveColorSize(sz)} className="text-neutral-400 hover:text-red-400 cursor-pointer">
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newColorSizeInput}
                            onChange={(e) => setNewColorSizeInput(e.target.value)}
                            placeholder="Add size for this color (e.g. 36)"
                            className="w-48 bg-[#181818] border border-white/15 px-2 py-1 text-xs text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddColorSize}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[9px] cursor-pointer"
                          >
                            + Add Size
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[9px] text-neutral-400 uppercase block">
                            Photos for this color ({newColorImagesList.length} Selected)
                          </label>
                          <label className="text-[9px] uppercase font-bold text-purple-300 hover:text-purple-200 cursor-pointer flex items-center gap-1 transition-colors">
                            {isUploading ? (
                              <>
                                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-2.5 h-2.5" />
                                <span>Upload from Device</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              disabled={isUploading}
                              onChange={(e) => handleFileUpload(e, (cloudUrl) => setNewColorImagesList((prev) => [...prev, cloudUrl]))}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {newColorImagesList.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {newColorImagesList.map((imgSrc, imgIdx) => (
                              <div key={imgIdx} className="relative w-12 h-14 border border-white/20">
                                <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setNewColorImagesList(newColorImagesList.filter((_, i) => i !== imgIdx))}
                                  className="absolute -top-1 -right-1 bg-black text-red-400 rounded-full cursor-pointer"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newColorSingleUrl}
                            onChange={(e) => setNewColorSingleUrl(e.target.value)}
                            placeholder="Or paste direct image URL..."
                            className="flex-1 bg-[#121212] border border-white/15 px-2.5 py-1 text-xs text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newColorSingleUrl.trim()) {
                                setNewColorImagesList([...newColorImagesList, newColorSingleUrl.trim()]);
                                setNewColorSingleUrl('');
                              }
                            }}
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[9px] cursor-pointer"
                          >
                            + Add Photo
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCommitColorVariant}
                        className="w-full py-2 bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 uppercase font-bold text-xs cursor-pointer"
                      >
                        Confirm &amp; Add Color Variant to Article
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-neutral-500 italic">
                    Color variations disabled. Article will render with base raw hide photos and default sizes.
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                  Technical Specifications
                </label>
                <input
                  type="text"
                  required
                  value={formSpec}
                  onChange={(e) => setFormSpec(e.target.value)}
                  placeholder="e.g. 4.2mm Real Hide • Solid Brass Buckle"
                  className="w-full bg-[#1C1C1C] border border-white/15 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                  Full Narrative &amp; Craft Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-white/15 p-2.5 text-xs text-white font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-white/5 uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isComboModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141414] border border-white/20 p-6 font-mono text-xs text-white shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <span className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-400" />
                Add Curated Combo / Gift Set
              </span>
              <button onClick={() => setIsComboModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCombo} className="space-y-3.5">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">Combo Bundle Title</label>
                <input
                  type="text"
                  required
                  value={comboTitle}
                  onChange={(e) => setComboTitle(e.target.value)}
                  placeholder="e.g. The Atelier Executive Box"
                  className="w-full bg-[#1A1A1A] border border-white/15 p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">Subtitle / Pairing Pitch</label>
                <input
                  type="text"
                  required
                  value={comboSubtitle}
                  onChange={(e) => setComboSubtitle(e.target.value)}
                  placeholder="e.g. Full-Grain Belt + Minimal Cardholder"
                  className="w-full bg-[#1A1A1A] border border-white/15 p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase block mb-1">Combo Special Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={comboPrice}
                    onChange={(e) => setComboPrice(Number(e.target.value))}
                    className="w-full bg-[#1A1A1A] border border-white/15 p-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={comboOriginalPrice}
                    onChange={(e) => setComboOriginalPrice(Number(e.target.value))}
                    className="w-full bg-[#1A1A1A] border border-white/15 p-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={comboTag}
                  onChange={(e) => setComboTag(e.target.value)}
                  placeholder="e.g. Festive Gift Box"
                  className="w-full bg-[#1A1A1A] border border-white/15 p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">Items Included (Comma-separated)</label>
                <input
                  type="text"
                  required
                  value={comboIncludedText}
                  onChange={(e) => setComboIncludedText(e.target.value)}
                  placeholder="Belt 38mm, Slim Bifold, Solid Brass Keyring"
                  className="w-full bg-[#1A1A1A] border border-white/15 p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-neutral-400 uppercase block">Combo Display Image</label>
                  <label className="text-[9px] font-bold text-purple-300 hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-2.5 h-2.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={(e) => handleFileUpload(e, (url) => setComboImage(url))}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={comboImage}
                  onChange={(e) => setComboImage(e.target.value)}
                  placeholder="Paste image URL or upload above..."
                  className="w-full bg-[#1A1A1A] border border-white/15 p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsComboModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 font-bold uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase text-xs shadow-lg cursor-pointer"
                >
                  Save Combo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}