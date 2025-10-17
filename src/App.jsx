import React, { useState, useEffect } from 'react';
import { Star, Moon, Sparkles, Mail, Phone, MapPin, Instagram, Plus, Trash2, Edit2, Save, X, Calendar, Clock, Type, Palette } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function NordaStarMaps() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Starea pentru comanda personalizată
  const [customOrder, setCustomOrder] = useState({
    productName: 'Hartă Stelară Clasică',
    design: 'Noapte înstelată',
    date: '',
    time: '',
    location: '',
    message: '',
  });

  const defaultProducts = [
    {
      name: 'Hartă Stelară Clasică',
      description: 'Hartă stelară personalizată cu rama din lemn și iluminare LED caldă',
      price: '450 MDL',
      image: '/public/images/norda-warm-led-front.jpg',
      details: 'Dimensiuni: 30x40cm, Lemn natural, LED-uri calde, Text personalizat inclus'
    },
    {
      name: 'Hartă Stelară Premium',
      description: 'Design elegant cu constelații detaliate și gravare text personalizat',
      price: '550 MDL',
      image: '',
      details: 'Dimensiuni: 40x50cm, Rama premium din lemn masiv, Gravare laser inclusă'
    },
    {
      name: 'Hartă Stelară Blue',
      description: 'Iluminare LED albastră pentru un efect magic și cosmic special',
      price: '500 MDL',
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

  const Header = () => (
    <header className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <img src="/public/images/norda.svg" alt="Norda Logo" width={90}/>
            {/* <Sparkles className="text-yellow-400" size={32} />
            <h1 className="text-2xl font-bold text-white">Norda</h1> */}
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
                <img src="/public/images/norda.svg" alt="Norda Logo" width={200} />
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-800/50 backdrop-blur rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-400 transition transform hover:-translate-y-2">
                <div className="h-64 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-300 mb-3">{product.description}</p>
                  <p className="text-sm text-gray-400 mb-4">{product.details}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-yellow-400">{product.price}</span>
                    <button 
                      onClick={() => {
                        setCustomOrder({...customOrder, productName: product.name});
                        setCurrentPage('order');
                      }}
                      className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition"
                    >
                      Personalizează
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
  
  // NOUA PAGINĂ DE COMANDĂ PERSONALIZATĂ
  const CustomOrderPage = () => {
    const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
    const [submitting, setSubmitting] = useState(false);
    
    const handleSubmit = async () => {
      if (!contactInfo.name || !contactInfo.email || !contactInfo.phone || !customOrder.date || !customOrder.location) {
        alert('Te rog completează toate câmpurile obligatorii (*)!');
        return;
      }

      try {
        setSubmitting(true);
        await addDoc(collection(db, "orders"), {
          contact: contactInfo,
          order: customOrder,
          status: 'pending',
          createdAt: serverTimestamp()
        });
        alert('Mulțumim pentru comandă! Vă vom contacta în curând pentru confirmare.');
        setCustomOrder({ productName: 'Hartă Stelară Clasică', design: 'Noapte înstelată', date: '', time: '', location: '', message: '' });
        setContactInfo({ name: '', email: '', phone: '' });
      } catch (error) {
        console.error("Eroare la salvarea comenzii:", error);
        alert('A apărut o eroare. Te rog încearcă din nou.');
      } finally {
        setSubmitting(false);
      }
    };
    
    const selectedProduct = products.find(p => p.name === customOrder.productName) || products[0];

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Creează Harta Ta Stelară
          </h2>
          <p className="text-gray-300 text-center mb-12 text-lg">
            Urmează pașii de mai jos pentru a crea un cadou de neuitat.
          </p>

          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Coloana de personalizare */}
            <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">1. Detaliile Evenimentului</h3>
              
              <div className="space-y-5">
                {/* Selector Produs */}
                <div>
                  <label className="text-white font-semibold mb-2 flex items-center gap-2"><Star size={18} className="text-yellow-400"/> Alege Modelul</label>
                  <select
                    value={customOrder.productName}
                    onChange={(e) => setCustomOrder({...customOrder, productName: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"
                  >
                    {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                
                {/* Data și Ora */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-semibold mb-2 flex items-center gap-2"><Calendar size={18} className="text-yellow-400"/> Data Evenimentului *</label>
                    <input type="date" value={customOrder.date} onChange={(e) => setCustomOrder({...customOrder, date: e.target.value})} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
                  </div>
                  <div>
                    <label className="text-white font-semibold mb-2 flex items-center gap-2"><Clock size={18} className="text-yellow-400"/> Ora (Opțional)</label>
                    <input type="time" value={customOrder.time} onChange={(e) => setCustomOrder({...customOrder, time: e.target.value})} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
                  </div>
                </div>
                
                {/* Locația */}
                <div>
                  <label className="text-white font-semibold mb-2 flex items-center gap-2"><MapPin size={18} className="text-yellow-400"/> Locația (Oraș / Adresă) *</label>
                  <input type="text" placeholder="Ex: Chișinău, Moldova" value={customOrder.location} onChange={(e) => setCustomOrder({...customOrder, location: e.target.value})} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
                </div>

                {/* Mesaj Personalizat */}
                <div>
                  <label className="text-white font-semibold mb-2 flex items-center gap-2"><Type size={18} className="text-yellow-400"/> Mesaj Personalizat</label>
                  <textarea placeholder="Ex: Sub acest cer ne-am întâlnit..." value={customOrder.message} onChange={(e) => setCustomOrder({...customOrder, message: e.target.value})} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none h-24"/>
                </div>
                
                 {/* Design */}
                <div>
                  <label className="text-white font-semibold mb-2 flex items-center gap-2"><Palette size={18} className="text-yellow-400"/> Alege Designul</label>
                   <select
                    value={customOrder.design}
                    onChange={(e) => setCustomOrder({...customOrder, design: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"
                  >
                    <option>Noapte înstelată</option>
                    <option>Albastru Cosmic</option>
                    <option>Minimalist Alb</option>
                  </select>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-6 mt-10">2. Date de Contact</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Numele tău *" value={contactInfo.name} onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
                <input type="email" placeholder="Email *" value={contactInfo.email} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
                <input type="tel" placeholder="Telefon (WhatsApp) *" value={contactInfo.phone} onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"/>
              </div>

            </div>

            {/* Coloana de sumar și previzualizare */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 bg-gray-800/50 backdrop-blur p-6 rounded-2xl border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-4">Sumar Comandă</h3>
                <div className="h-48 w-full bg-gray-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img src={selectedProduct?.image} alt={selectedProduct?.name} className="w-full h-full object-cover"/>
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
                    <p className="text-sm pt-2">
                        <span className="font-semibold text-white">Mesaj: </span>
                        {customOrder.message || 'Fără mesaj'}
                    </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-600">
                    <div className="flex justify-between items-center text-2xl font-bold">
                        <span className="text-white">Total:</span>
                        <span className="text-yellow-400">{selectedProduct?.price}</span>
                    </div>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full mt-6 bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition disabled:opacity-50"
                >
                  {submitting ? 'Se trimite...' : 'Trimite Comanda'}
                </button>
                <p className="text-gray-400 text-xs text-center mt-3">* Câmpuri obligatorii</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdminPage = () => {
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '', details: '' });
    const [adding, setAdding] = useState(false);

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
              <input type="text" placeholder="Preț (ex: 450 MDL) *" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400"/>
              <input type="text" placeholder="URL imagine (optional)" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400 md:col-span-2"/>
              <textarea placeholder="Descriere scurtă" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400 h-24"/>
              <textarea placeholder="Detalii tehnice" value={newProduct.details} onChange={(e) => setNewProduct({...newProduct, details: e.target.value})} className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400 h-24"/>
            </div>
            <button onClick={addProduct} disabled={adding} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition flex items-center gap-2 disabled:opacity-50"><Plus size={20} /> {adding ? 'Se adaugă...' : 'Adaugă Produs'}</button>
          </div>
          <h3 className="text-2xl font-bold text-white mb-6">Produse Existente ({products.length})</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-4">
                {editingProduct?.id === product.id ? (
                  <div className="space-y-3">
                    <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 outline-none" placeholder="Nume"/>
                    <input type="text" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 outline-none" placeholder="Preț"/>
                    <input type="text" value={editingProduct.image} onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 outline-none" placeholder="URL imagine"/>
                    <textarea value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm h-20 border border-gray-600 outline-none" placeholder="Descriere"/>
                    <textarea value={editingProduct.details} onChange={(e) => setEditingProduct({...editingProduct, details: e.target.value})} className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm h-20 border border-gray-600 outline-none" placeholder="Detalii"/>
                    <div className="flex gap-2">
                      <button onClick={updateProduct} className="flex-1 bg-green-500 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-green-600 transition"><Save size={16} /> Salvează</button>
                      <button onClick={() => setEditingProduct(null)} className="flex-1 bg-gray-600 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-gray-500 transition"><X size={16} /> Anulează</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
                    <h4 className="text-white font-bold mb-1 text-lg">{product.name}</h4>
                    <p className="text-gray-300 text-sm mb-2">{product.description}</p>
                    <p className="text-yellow-400 font-bold mb-3 text-lg">{product.price}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProduct(product)} className="flex-1 bg-blue-500 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-blue-600 transition"><Edit2 size={16} /> Editează</button>
                      <button onClick={() => deleteProduct(product.id)} className="flex-1 bg-red-500 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-red-600 transition"><Trash2 size={16} /> Șterge</button>
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
      
      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'catalog' && <CatalogPage />}
        {currentPage === 'order' && <CustomOrderPage />}
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