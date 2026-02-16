import React, { useState, useEffect, useRef } from 'react';
import { Star, Moon, Sparkles, Mail, Phone, MapPin, Instagram, Plus, Trash2, Edit2, Save, X, Calendar, Clock, Type, Palette } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

// Inițializez EmailJS (înlocuiește YOUR_SERVICE_ID cu valoarea ta)
emailjs.init('6B2jTwTuges4knKMw');

// Componentă stabilă pentru pagina de comandă (definită la nivel top-level pentru a evita remounturi)
function CustomOrderPage({ products, customOrder, setCustomOrder, contactInfo, setContactInfo, submitting, handleSubmit }) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log('CustomOrderPage render', renderCount.current);
  });

  useEffect(() => {
    console.log('CustomOrderPage mounted');
    return () => console.log('CustomOrderPage unmounted');
  }, []);

  useEffect(() => {
    console.log('Watch: products length', products.length);
  }, [products]);

  const selectedProduct = products.find(p => p.name === customOrder.productName) || products[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">Creează Harta Ta Stelară</h2>
        <p className="text-gray-300 text-center mb-12 text-lg">Urmează pașii de mai jos pentru a crea un cadou de neuitat.</p>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">1. Detaliile Evenimentului</h3>
            <div className="space-y-5">
              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2"><Star size={18} className="text-yellow-400"/> Alege Modelul</label>
                <select value={customOrder.productName} onChange={(e) => setCustomOrder(prev => ({...prev, productName: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none">
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold mb-2 flex items-center gap-2"><Calendar size={18} className="text-yellow-400"/> Data Evenimentului *</label>
                  <input type="date" value={customOrder.date} onChange={(e) => setCustomOrder(prev => ({...prev, date: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
                </div>
                <div>
                  <label className="text-white font-semibold mb-2 flex items-center gap-2"><Clock size={18} className="text-yellow-400"/> Ora (Opțional)</label>
                  <input type="time" value={customOrder.time} onChange={(e) => setCustomOrder(prev => ({...prev, time: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
                </div>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2"><MapPin size={18} className="text-yellow-400"/> Locația (Oraș / Adresă) *</label>
                <input type="text" placeholder="Ex: Chișinău, Moldova" value={customOrder.location} onFocus={() => console.log('location focused')} onChange={(e) => { setCustomOrder(prev => ({...prev, location: e.target.value})); console.log('location change', e.target.value); }} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2"><Type size={18} className="text-yellow-400"/> Mesaj Personalizat</label>
                <textarea placeholder="Ex: Sub acest cer ne-am întâlnit..." value={customOrder.message} onFocus={() => console.log('message focused')} onChange={(e) => { setCustomOrder(prev => ({...prev, message: e.target.value})); console.log('message change', e.target.value); }} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none h-24"/>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2"><Palette size={18} className="text-yellow-400"/> Alege Designul</label>
                <select value={customOrder.design} onChange={(e) => setCustomOrder(prev => ({...prev, design: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none">
                  <option>Noapte înstelată</option>
                  <option>Albastru Cosmic</option>
                  <option>Minimalist Alb</option>
                </select>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 mt-10">2. Date de Contact</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Numele tău *" value={contactInfo.name} onChange={(e) => setContactInfo(prev => ({...prev, name: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
              <input type="email" placeholder="Email *" value={contactInfo.email} onChange={(e) => setContactInfo(prev => ({...prev, email: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
              <input type="tel" placeholder="Telefon (WhatsApp) *" value={contactInfo.phone} onChange={(e) => setContactInfo(prev => ({...prev, phone: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-28 bg-gray-800/50 backdrop-blur p-6 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Sumar Comandă</h3>
              <div className="aspect-[3/4] w-full bg-gray-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden cursor-pointer group" onClick={() => setSelectedImage(selectedProduct?.image)}>
                <img src={selectedProduct?.image} alt={selectedProduct?.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>

              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Model:</span>
                  <span>{customOrder.productName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Design:</span>
                  <span>{customOrder.design}</span>
                </div>
                <hr className="border-gray-600"/>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Dată:</span>
                  <span>{customOrder.date || 'Nespecificat'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Locație:</span>
                  <span className="truncate max-w-[150px]">{customOrder.location || 'Nespecificat'}</span>
                </div>
                <hr className="border-gray-600"/>
                <p className="text-sm pt-2"><span className="font-semibold text-white">Mesaj: </span>{customOrder.message || 'Fără mesaj'}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-600">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-yellow-400">{selectedProduct?.price} MDL</span>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={submitting} className="w-full mt-6 bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition disabled:opacity-50">
                {submitting ? 'Se trimite...' : 'Trimite Comanda'}
              </button>
              <p className="text-gray-400 text-xs text-center mt-3">* Câmpuri obligatorii</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NordaStarMaps() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Starea pentru comanda personalizată
  const [customOrder, setCustomOrder] = useState({
    productName: 'Hartă Stelară Clasică',
    design: 'Noapte înstelată',
    date: '',
    time: '',
    location: '',
    message: '',
  });

  // Date de contact pentru comanda personalizată (lifted state)
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const defaultProducts = [
    {
      name: 'Hartă Stelară Clasică',
      description: 'Hartă stelară personalizată cu rama din lemn și iluminare LED caldă',
      price: '450',
      image: '/public/images/norda-warm-led-front.jpg',
      details: 'Dimensiuni: 30x40cm, Lemn natural, LED-uri calde, Text personalizat inclus'
    },
    {
      name: 'Hartă Stelară Premium',
      description: 'Design elegant cu constelații detaliate și gravare text personalizat',
      price: '550',
      image: '',
      details: 'Dimensiuni: 40x50cm, Rama premium din lemn masiv, Gravare laser inclusă'
    },
    {
      name: 'Hartă Stelară Blue',
      description: 'Iluminare LED albastră pentru un efect magic și cosmic special',
      price: '500',
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop',
      details: 'Dimensiuni: 30x40cm, LED-uri albastre intense, Efect neon unic'
    }
  ];

  // Încarcă produsele din Firestore
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (productsData.length === 0) {
        await initializeDefaultProducts();
      } else {
        setProducts(productsData);
      }
    } catch (error) {
      console.error("Eroare la încărcarea produselor:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultProducts = async () => {
    try {
      for (const product of defaultProducts) {
        await addDoc(collection(db, "products"), {
          ...product,
          createdAt: serverTimestamp()
        });
      }
      await loadProducts();
    } catch (error) {
      console.error("Eroare la inițializarea produselor:", error);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'norda2024') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setCurrentPage('admin');
    } else {
      alert('Parolă incorectă!');
    }
  };

  const handleSubmit = async () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone || !customOrder.date || !customOrder.location) {
      alert('Te rog completează toate câmpurile obligatorii (*)!');
      return;
    }

    try {
      setSubmitting(true);

      const orderRef = await addDoc(collection(db, "orders"), {
        contact: contactInfo,
        order: customOrder,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      const selectedProduct = products.find(p => p.name === customOrder.productName);
      await emailjs.send('service_4r99bm7', 'template_ql0ymii', {
        to_email: contactInfo.email,
        customer_name: contactInfo.name,
        customer_phone: contactInfo.phone,
        product_name: customOrder.productName,
        design: customOrder.design,
        event_date: customOrder.date,
        event_time: customOrder.time || 'Nespecificat',
        location: customOrder.location,
        message: customOrder.message || 'Fără mesaj',
        product_price: selectedProduct?.price ? `${selectedProduct.price} MDL` : 'Preț la cerere',
        order_id: orderRef.id
      });

      alert('Mulțumim pentru comandă! Confirmarea a fost trimisă pe emailul tău. Vă vom contacta în curând!');
      setCustomOrder({ productName: 'Hartă Stelară Clasică', design: 'Noapte înstelată', date: '', time: '', location: '', message: '' });
      setContactInfo({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error("Eroare la salvarea comenzii sau trimiterea emailului:", error);
      alert('A apărut o eroare la trimiterea comenzii. Te rog încearcă din nou.');
    } finally {
      setSubmitting(false);
    }
  };

  const Header = () => (
    <header className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
<div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
 <div className="w-[90px] h-[38px] flex-shrink-0">
  <img
    src="/images/norda.svg"
    alt="Norda Logo"
    className="w-full h-full object-contain"
  />
</div>
</div>
          <nav className="flex gap-6 items-center">
            <button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-white transition">Acasă</button>
            <button onClick={() => setCurrentPage('catalog')} className="text-gray-300 hover:text-white transition">Catalog</button>
            <button onClick={() => setCurrentPage('order')} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition">Comanda Acum</button>
          </nav>
        </div>
      </div>
    </header>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative animate-pulse">
                <img src="/images/norda.svg" alt="Norda Logo" width={200} />
                <Sparkles className="absolute -top-4 -right-4 text-yellow-400 animate-bounce" size={24} />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Hărți Stelare<br/>
              <span className="text-yellow-400">Personalizate</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Surprinde momentul perfect sub cerul înstelat. Fiecare hartă este creată manual cu atenție la detalii, 
              iluminată cu LED-uri calde și montată în rame din lemn natural.
            </p>
            <button 
              onClick={() => setCurrentPage('order')}
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition transform hover:scale-105"
            >
              Creează Harta Ta
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700 hover:border-yellow-400 transition">
              <Sparkles className="text-yellow-400 mb-4" size={40} />
              <h3 className="text-xl font-bold text-white mb-3">Personalizare Completă</h3>
              <p className="text-gray-300">Alege data, locația și mesajul tău special pentru un cadou unic</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700 hover:border-yellow-400 transition">
              <Star className="text-yellow-400 mb-4" size={40} />
              <h3 className="text-xl font-bold text-white mb-3">Calitate Premium</h3>
              <p className="text-gray-300">Materiale de înaltă calitate și atenție la fiecare detaliu</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700 hover:border-yellow-400 transition">
              <Moon className="text-yellow-400 mb-4" size={40} />
              <h3 className="text-xl font-bold text-white mb-3">Iluminare LED</h3>
              <p className="text-gray-300">Efecte luminoase magice care dau viață constelațiilor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const ImageModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row items-stretch gap-6 bg-gray-800/50 backdrop-blur rounded-2xl border border-gray-700 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          
          {/* Buton X - sus dreapta */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full p-2 transition transform hover:scale-110 z-10"
            aria-label="Închide"
          >
            <X size={24} />
          </button>

          {/* Imagine */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-900 p-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Detalii */}
          <div className="w-full md:w-1/2 flex flex-col p-6 md:p-8">
            <h2 className="text-3xl font-bold text-white mb-4 pr-10">{product.name}</h2>
            
            <div className="scrollable-text flex-grow mb-6 max-h-60">
              <p className="text-gray-300 mb-4">{product.description}</p>
              <p className="text-gray-400 text-sm">{product.details}</p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-600 pt-4">
              <span className="text-3xl font-bold text-yellow-400">{product.price} MDL</span>
              <button 
                onClick={() => {
                  setCustomOrder(prev => ({...prev, productName: product.name}));
                  setCurrentPage('order');
                  onClose();
                }}
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-full font-bold transition"
              >
                Comanda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CatalogPage = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pt-32 pb-20 flex items-center justify-center">
          <div className="text-white text-xl">Se încarcă produsele...</div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Colecția Noastră
          </h2>
          <p className="text-gray-300 text-center mb-12 text-lg">
            Descoperă hărțile stelare care transformă amintirile în artă
          </p>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-800/50 backdrop-blur rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-400 transition transform hover:-translate-y-2 flex flex-col h-full">
                <div className="aspect-square overflow-hidden cursor-pointer group flex-shrink-0" onClick={() => setSelectedProduct(product)}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                  <div className="flex-grow overflow-hidden flex flex-col">
                    <p className="text-gray-300 mb-2 text-sm line-clamp-3">{product.description?.length > 90 ? product.description.substring(0, 90) + '...' : product.description}</p>
                    <div className="scrollable-text flex-grow max-h-16">
                      <p className="text-xs text-gray-400 line-clamp-2">{product.details?.length > 300 ? product.details.substring(0, 300) + '...' : product.details}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-600">
                    <span className="text-lg font-bold text-yellow-400">{product.price} MDL</span>
                      <button 
                      onClick={() => {
                        setCustomOrder(prev => ({...prev, productName: product.name}));
                        setCurrentPage('order');
                      }}
                      className="bg-yellow-400 text-gray-900 px-4 py-1 text-sm rounded-full font-bold hover:bg-yellow-300 transition"
                    >
                      Comanda
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // CustomOrderPage moved to top-level to avoid remounts

  const AdminPage = () => {
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '', details: '' });
    const [adding, setAdding] = useState(false);
    const MAX_DESCRIPTION = 90;
    const MAX_DETAILS = 300;

    const addProduct = async () => {
      if (!newProduct.name || !newProduct.price) {
        alert('Completează numele și prețul produsului!');
        return;
      }
      try {
        setAdding(true);
        await addDoc(collection(db, "products"), {
          ...newProduct,
          image: newProduct.image || 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800',
          createdAt: serverTimestamp()
        });
        setNewProduct({ name: '', description: '', price: '', image: '', details: '' });
        await loadProducts();
        alert('Produs adăugat cu succes!');
      } catch (error) {
        console.error("Eroare la adăugarea produsului:", error);
      } finally {
        setAdding(false);
      }
    };

    const deleteProduct = async (id) => {
      if (confirm('Sigur vrei să ștergi acest produs?')) {
        try {
          await deleteDoc(doc(db, "products", id));
          await loadProducts();
          alert('Produs șters cu succes!');
        } catch (error) {
          console.error("Eroare la ștergerea produsului:", error);
        }
      }
    };

    const updateProduct = async () => {
      try {
        const productRef = doc(db, "products", editingProduct.id);
        await updateDoc(productRef, {
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          image: editingProduct.image,
          details: editingProduct.details,
          updatedAt: serverTimestamp()
        });
        setEditingProduct(null);
        await loadProducts();
        alert('Produs actualizat cu succes!');
      } catch (error) {
        console.error("Eroare la actualizarea produsului:", error);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-white">Panou Admin</h2>
            <button onClick={() => {setIsAdmin(false); setCurrentPage('home');}} className="text-red-400 hover:text-red-300 transition">Deconectare</button>
          </div>
          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Plus className="text-yellow-400" size={28} /> Adaugă Produs Nou</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Nume produs *" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400"/>
              <div className="relative">
                <input type="number" placeholder="450" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400" />
                <span className="absolute right-4 top-3 text-gray-400 font-semibold">MDL</span>
              </div>
              <input type="text" placeholder="URL imagine (optional)" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400 md:col-span-2"/>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-300 text-sm">Descriere Scurtă *</label>
                  <span className={`text-xs ${newProduct.description.length > MAX_DESCRIPTION ? 'text-red-400' : 'text-gray-400'}`}>{newProduct.description.length}/{MAX_DESCRIPTION}</span>
                </div>
                <textarea placeholder="Max 90 caractere" value={newProduct.description} onChange={(e) => {
                  if (e.target.value.length <= MAX_DESCRIPTION) {
                    setNewProduct({...newProduct, description: e.target.value});
                  }
                }} className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg border outline-none focus:border-yellow-400 h-20 ${newProduct.description.length > MAX_DESCRIPTION ? 'border-red-500' : 'border-gray-600'}`}/>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-300 text-sm">Detalii Tehnice *</label>
                  <span className={`text-xs ${newProduct.details.length > MAX_DETAILS ? 'text-red-400' : 'text-gray-400'}`}>{newProduct.details.length}/{MAX_DETAILS}</span>
                </div>
                <textarea placeholder="Max 300 caractere" value={newProduct.details} onChange={(e) => {
                  if (e.target.value.length <= MAX_DETAILS) {
                    setNewProduct({...newProduct, details: e.target.value});
                  }
                }} className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg border outline-none focus:border-yellow-400 h-20 ${newProduct.details.length > MAX_DETAILS ? 'border-red-500' : 'border-gray-600'}`}/>
              </div>
            </div>
            <button onClick={addProduct} disabled={adding || newProduct.description.length === 0 || newProduct.details.length === 0} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition flex items-center gap-2 disabled:opacity-50"><Plus size={20} /> {adding ? 'Se adaugă...' : 'Adaugă Produs'}</button>
          </div>
          <h3 className="text-2xl font-bold text-white mb-6">Produse Existente ({products.length})</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-800/50 backdrop-blur rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-400 transition transform hover:-translate-y-2 flex flex-col h-full">
                {editingProduct?.id === product.id ? (
                  <div className="p-4 space-y-3 flex-grow flex flex-col">
                    <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 outline-none" placeholder="Nume"/>
                    <div className="relative">
                      <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 outline-none pr-10" placeholder="Preț"/>
                      <span className="absolute right-3 top-2 text-gray-400 text-sm">MDL</span>
                    </div>
                    <input type="text" value={editingProduct.image} onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 outline-none" placeholder="URL imagine"/>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-gray-300 text-xs">Descriere ({editingProduct.description.length}/{MAX_DESCRIPTION})</label>
                      </div>
                      <textarea value={editingProduct.description} onChange={(e) => {
                        if (e.target.value.length <= MAX_DESCRIPTION) {
                          setEditingProduct({...editingProduct, description: e.target.value});
                        }
                      }} className={`w-full bg-gray-700 text-white px-3 py-2 rounded text-sm h-16 border outline-none ${editingProduct.description.length > MAX_DESCRIPTION ? 'border-red-500' : 'border-gray-600'}`} placeholder="Descriere (max 90)"/>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-gray-300 text-xs">Detalii ({editingProduct.details.length}/{MAX_DETAILS})</label>
                      </div>
                      <textarea value={editingProduct.details} onChange={(e) => {
                        if (e.target.value.length <= MAX_DETAILS) {
                          setEditingProduct({...editingProduct, details: e.target.value});
                        }
                      }} className={`w-full bg-gray-700 text-white px-3 py-2 rounded text-sm h-16 border outline-none ${editingProduct.details.length > MAX_DETAILS ? 'border-red-500' : 'border-gray-600'}`} placeholder="Detalii (max 300)"/>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button onClick={updateProduct} className="flex-1 bg-green-500 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-green-600 transition"><Save size={16} /> Salvează</button>
                      <button onClick={() => setEditingProduct(null)} className="flex-1 bg-gray-600 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-gray-500 transition"><X size={16} /> Anulează</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="aspect-square overflow-hidden cursor-pointer group flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h4 className="text-lg font-bold text-white mb-2">{product.name}</h4>
                      <p className="text-gray-300 text-sm mb-2 line-clamp-3">{product.description}</p>
                      <div className="scrollable-text flex-grow max-h-16">
                        <p className="text-xs text-gray-400 line-clamp-2">{product.details}</p>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-600">
                        <span className="text-lg font-bold text-yellow-400">{product.price} MDL</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => setEditingProduct(product)} className="flex-1 bg-blue-500 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-blue-600 transition"><Edit2 size={14} /> Editează</button>
                        <button onClick={() => deleteProduct(product.id)} className="flex-1 bg-red-500 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-red-600 transition"><Trash2 size={14} /> Șterge</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <ImageModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'catalog' && <CatalogPage />}
        {currentPage === 'order' && (
          <CustomOrderPage
            products={products}
            customOrder={customOrder}
            setCustomOrder={setCustomOrder}
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
            submitting={submitting}
            handleSubmit={handleSubmit}
          />
        )}
        {currentPage === 'admin' && isAdmin && <AdminPage />}
      </main>

      {showAdminLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Login Admin</h3>
            <input type="password" placeholder="Introdu parola" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none mb-4 focus:border-yellow-400"/>
            <div className="flex gap-3">
              <button onClick={handleAdminLogin} className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition">Login</button>
              <button onClick={() => {setShowAdminLogin(false); setAdminPassword('');}} className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition">Anulează</button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Sparkles className="text-yellow-400" size={20} />
            <p className="text-lg font-semibold text-white">Norda</p>
          </div>
          <p className="mb-2">© 2024 Norda - Hărți Stelare Personalizate</p>
          <p className="text-sm mb-3">Creat cu ❤️ în Moldova</p>
          <div className="flex justify-center gap-4 mb-4">
            <a href="https://instagram.com/norda_projectmd" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
              <Instagram size={20} />
            </a>
          </div>
          <button onClick={() => setShowAdminLogin(true)} className="text-xs text-gray-600 hover:text-gray-500 transition">
            Admin Panel
          </button>
        </div>
      </footer>
    </div>
  );
}