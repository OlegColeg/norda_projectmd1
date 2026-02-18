import React, { useState, useEffect, useRef } from 'react';
import { Star, Moon, Sparkles, Mail, Phone, MapPin, Instagram, Plus, Trash2, Edit2, Save, X, Calendar, Clock, Type, Palette } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
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
  
  // Calculate price based on format
  const calculatePrice = () => {
    const basePrice = parseFloat(selectedProduct?.price || 0);
    if (customOrder.format === 'A4') {
      return Math.round(basePrice * 0.65); // -35% from original price
    }
    return basePrice;
  };

  const finalPrice = calculatePrice();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">Creează Harta Ta Stelară Personalizată</h2>
        <p className="text-gray-300 text-center mb-12 text-lg">Urmează pașii pentru a crea un cadou de neuitat. Selectează data, locația și designul tău special.</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur p-6 md:p-8 rounded-2xl border border-gray-700">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">1. Detaliile Evenimentului</h3>
            <div className="space-y-5">
              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2 text-sm md:text-base"><Star size={18} className="text-yellow-400"/> Alege Modelul</label>
                <select value={customOrder.productName} onChange={(e) => setCustomOrder(prev => ({...prev, productName: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none text-sm md:text-base">
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold mb-2 flex items-center gap-2 text-sm md:text-base"><Calendar size={18} className="text-yellow-400"/> Data Evenimentului *</label>
                  <input required type="date" value={customOrder.date} onChange={(e) => setCustomOrder(prev => ({...prev, date: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none mobile-input text-sm md:text-base"/>
                </div>
                <div>
                  <label className="text-white font-semibold mb-2 flex items-center gap-2 text-sm md:text-base"><Clock size={18} className="text-yellow-400"/> Ora (Opțional)</label>
                  <input type="time" value={customOrder.time} onChange={(e) => setCustomOrder(prev => ({...prev, time: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none mobile-input text-sm md:text-base"/>
                </div>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2 text-sm md:text-base"><Calendar size={18} className="text-yellow-400"/> Data Finiș (Livrare) *</label>
                <input required type="date" value={customOrder.completionDate} onChange={(e) => setCustomOrder(prev => ({...prev, completionDate: e.target.value}))} 
                  min={new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0]}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none mobile-input text-sm md:text-base" />
                <p className="text-gray-400 text-xs mt-1">Minimum +3 zile de la azi</p>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2 text-sm md:text-base"><MapPin size={18} className="text-yellow-400"/> Locația (Oraș / Adresă) *</label>
                <input required type="text" placeholder="Ex: Chișinău, Moldova" value={customOrder.location} onFocus={() => console.log('location focused')} onChange={(e) => { setCustomOrder(prev => ({...prev, location: e.target.value})); console.log('location change', e.target.value); }} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none mobile-input text-sm md:text-base" autoComplete="street-address"/>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="hasSecondLocation" 
                  checked={customOrder.hasSecondLocation} 
                  onChange={(e) => setCustomOrder(prev => ({...prev, hasSecondLocation: e.target.checked}))}
                  className="w-5 h-5 accent-yellow-400 cursor-pointer"
                />
                <label htmlFor="hasSecondLocation" className="text-white font-semibold cursor-pointer text-sm md:text-base">
                  Hartă cu două locații (dual-location)
                </label>
              </div>

              {customOrder.hasSecondLocation && (
                <div>
                  <label className="text-white font-semibold mb-2 flex items-center gap-2 text-sm md:text-base"><MapPin size={18} className="text-yellow-400"/> A Doua Locație *</label>
                  <input required type="text" placeholder="Ex: Băilești, Moldova" value={customOrder.location2} onChange={(e) => setCustomOrder(prev => ({...prev, location2: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none mobile-input text-sm md:text-base" autoComplete="street-address"/>
                </div>
              )}

              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2 text-sm md:text-base"><Type size={18} className="text-yellow-400"/> Mesaj Personalizat</label>
                <textarea placeholder="Ex: Sub acest cer ne-am întâlnit..." value={customOrder.message} onFocus={() => console.log('message focused')} onChange={(e) => { setCustomOrder(prev => ({...prev, message: e.target.value})); console.log('message change', e.target.value); }} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none h-24 mobile-textarea text-sm md:text-base"/>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2 text-sm md:text-base"><Palette size={18} className="text-yellow-400"/> Format Hartă *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setCustomOrder(prev => ({...prev, format: 'A3'}))}
                    className={`py-3 px-3 md:px-4 rounded-lg font-semibold transition text-sm md:text-base ${customOrder.format === 'A3' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-white border border-gray-600 hover:border-yellow-400'}`}
                  >
                    A3 (Standard)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCustomOrder(prev => ({...prev, format: 'A4'}))}
                    className={`py-3 px-3 md:px-4 rounded-lg font-semibold transition text-sm md:text-base ${customOrder.format === 'A4' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-white border border-gray-600 hover:border-yellow-400'}`}
                  >
                    A4 (-35%)
                  </button>
                </div>
              </div>

              {/* Design selection removed until feature is available */}

              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2 text-sm md:text-base"><Type size={18} className="text-yellow-400"/> Cerințe/Comentarii Suplimentare (Opțional)</label>
                <textarea placeholder="Ex: Vreau culori mai calde, sau alte detalii speciale..." value={customOrder.clientNotes} onChange={(e) => setCustomOrder(prev => ({...prev, clientNotes: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none h-20 mobile-textarea text-sm md:text-base"/>
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 mt-10">2. Date de Contact</h3>
            <div className="space-y-4">
              <input required type="text" placeholder="Numele tău *" value={contactInfo.name} onChange={(e) => setContactInfo(prev => ({...prev, name: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none mobile-input text-sm md:text-base" autoComplete="name"/>
              <input required type="email" placeholder="Email *" value={contactInfo.email} onChange={(e) => setContactInfo(prev => ({...prev, email: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none mobile-input text-sm md:text-base" autoComplete="email"/>
              <input required type="tel" placeholder="Telefon (WhatsApp) *" value={contactInfo.phone} onChange={(e) => setContactInfo(prev => ({...prev, phone: e.target.value}))} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none mobile-input text-sm md:text-base" autoComplete="tel" inputMode="tel"/>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-28 bg-gray-800/50 backdrop-blur p-6 rounded-2xl border border-gray-700">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Sumar Comandă</h3>
              <div className="aspect-[3/4] w-full bg-gray-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden cursor-pointer group" onClick={() => setSelectedImage(selectedProduct?.image)}>
                <img src={selectedProduct?.image || 'https://via.placeholder.com/800x800?text=No+Image'} alt={selectedProduct?.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>

              <div className="space-y-2 text-gray-300 text-sm md:text-base">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-white">Model:</span>
                  <span className="text-right">{customOrder.productName}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-white">Format:</span>
                  <span className="bg-gray-700 px-3 py-1 rounded text-xs md:text-sm">{customOrder.format} {customOrder.format === 'A4' && '(-35%)'}</span>
                </div>
                {/* Design hidden until feature is enabled */}
                <hr className="border-gray-600"/>
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-white">Data Evenimentului:</span>
                  <span className="text-right">{customOrder.date || 'Nespecificat'}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-white">Data Finisării:</span>
                  <span className="text-right">{customOrder.completionDate || 'Nespecificat'}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-white">Locație:</span>
                  <span className="text-right truncate max-w-[150px]">{customOrder.location || 'Nespecificat'}</span>
                </div>
                {customOrder.hasSecondLocation && (
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-semibold text-white">A 2-a Locație:</span>
                    <span className="text-right truncate max-w-[150px]">{customOrder.location2 || 'Nespecificat'}</span>
                  </div>
                )}
                <hr className="border-gray-600"/>
                <p className="text-xs md:text-sm pt-2"><span className="font-semibold text-white">Mesaj: </span><span className="text-gray-400">{customOrder.message || 'Fără mesaj'}</span></p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-600">
                <div className="flex justify-between items-center text-xl md:text-2xl font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-yellow-400">{finalPrice} MDL</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-900/30 border border-orange-600 rounded-lg">
                <p className="text-orange-200 text-xs md:text-sm leading-relaxed">
                  <span className="font-bold text-orange-300">⚠️ Important:</span> Ramele și unele culori pot varia ușor în dependență de ecran și disponibilitatea în stoc. Produsele finale pot diferi ușor de imaginile din catalog, deoarece ramele sunt componente core și nu sunt mereu identice cu cele prezentate. Calitatea și funcționalitatea rămân 100% garantate.
                </p>
              </div>

              <button onClick={handleSubmit} disabled={submitting} className="w-full mt-6 bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition disabled:opacity-50 text-sm md:text-base">
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
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeOrdersTab, setActiveOrdersTab] = useState('active');

  // Starea pentru comanda personalizată
  const [customOrder, setCustomOrder] = useState({
    productName: 'Momentul Nostru',
    design: 'Noapte înstelată',
    date: '',
    time: '',
    location: '',
    hasSecondLocation: false,
    location2: '',
    message: '',
    completionDate: '',
    clientNotes: '',
    format: 'A3',
  });

  // Date de contact pentru comanda personalizată (lifted state)
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const defaultProducts = [
    {
      name: 'Hartă Stelară Clasică',
      description: 'Hartă stelară personalizată cu rama din lemn natural - cadou elegant și memorabil',
      price: '450',
      image: '',
      details: 'Cadou personalizat elegant: Dimensiuni 30x40cm, Lemn natural masiv, Text personalizat cu data și locația, Perfect pentru aniversări și momente speciale'
    },
    {
      name: 'Hartă Stelară Premium',
      description: 'Design elegant cu constelații detaliate și gravare laser text personalizat premium',
      price: '550',
      image: '',
      details: 'Hartă cer noapte premium: Dimensiuni 40x50cm, Rama din lemn masiv, Gravare laser inclusă, Constelații detaliate, Cadou aniversare și nuntă de lux'
    },
    {
      name: 'Hartă Stelară Blue',
      description: 'Hartă stelară cu constelații albastre cosmic pentru efect special și unic',
      price: '500',
      image: '',
      details: 'Hartă stele albastra cosmic: Dimensiuni 30x40cm, Constelații albastre intense, Efect cosmic unic, Cadou romantic și special pentru momente importante'
    }
  ];

  // Încarcă produsele din Firestore
  useEffect(() => {
    loadProducts();
    loadOrders();
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

  const loadOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Comenzi încărcate:', ordersData.length, ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Eroare la încărcarea comenzilor:", error);
    }
  };

  const toggleOrderStatus = async (orderId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'completed' : 'active';
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      await loadOrders();
    } catch (error) {
      console.error("Eroare la actualizarea statusului comenzii:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (confirm('Sigur vrei să ștergi această comandă?')) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        await loadOrders();
        alert('Comandă ștearsă cu succes!');
      } catch (error) {
        console.error("Eroare la ștergerea comenzii:", error);
      }
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      try {
        const idTokenResult = await getIdTokenResult(user, /* forceRefresh */ false);
        const adminClaim = idTokenResult.claims && idTokenResult.claims.admin;
        setIsAdmin(!!adminClaim);
      } catch (err) {
        console.error('Error checking token claims', err);
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  const handleAdminLogin = async () => {
    if (!adminEmail || !adminPassword) {
      alert('Completează email și parola!');
      return;
    }
    try {
      const credential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const user = credential.user;
      const idTokenResult = await getIdTokenResult(user);
      if (idTokenResult.claims && idTokenResult.claims.admin) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setCurrentPage('admin');
      } else {
        alert('Contul nu are permisiuni de admin.');
        await signOut(auth);
      }
    } catch (error) {
      console.error('Login error', error);
      alert('Eroare la autentificare: verifică email/parola.');
    }
  };

  const handleSubmit = async () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone || !customOrder.date || !customOrder.location || !customOrder.completionDate) {
      alert('Te rog completează toate câmpurile obligatorii (*)!');
      return;
    }

    // Validare: data finisării trebuie să fie cel puțin +3 zile de azi
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minCompletionDate = new Date(today);
    minCompletionDate.setDate(minCompletionDate.getDate() + 3);
    
    const selectedCompletionDate = new Date(customOrder.completionDate);
    selectedCompletionDate.setHours(0, 0, 0, 0);

    if (selectedCompletionDate < minCompletionDate) {
      const minDateFormatted = minCompletionDate.toLocaleDateString('ro-RO');
      alert(`Data finiș trebuie să fie cel puțin +3 zile de azi. Data minimă: ${minDateFormatted}`);
      return;
    }

    try {
      setSubmitting(true);

      // Calculate finalPrice based on format
      // Caută produsul în array-ul local dacă nu e în Firebase
      let selectedProduct = products.find(p => p.name === customOrder.productName);
      if (!selectedProduct) {
        selectedProduct = defaultProducts.find(p => p.name === customOrder.productName);
      }
      
      const basePrice = parseFloat(selectedProduct?.price || 0);
      const finalPrice = customOrder.format === 'A4' ? Math.round(basePrice * 0.65) : basePrice;
      // Folosește imaginea din produs, dacă nu are, nu trimite nimic (EmailJS nu va afișa secțiunea)
      const productImage = selectedProduct?.image || '';

      // Genereaza numar de comanda simplu (timestamp-based)
      const orderNumber = Math.floor(Date.now() / 1000) % 1000000;

      const orderRef = await addDoc(collection(db, "orders"), {
        contact: contactInfo,
        order: customOrder,
        orderNumber: orderNumber,
        finalPrice: finalPrice,
        format: customOrder.format,
        status: 'active',
        createdAt: serverTimestamp()
      });

      await emailjs.send('service_q8hkkw5', 'template_ql0ymii', {
        to_email: contactInfo.email,
        customer_name: contactInfo.name,
        customer_phone: contactInfo.phone,
        product_name: customOrder.productName,
        design: customOrder.design,
        event_date: customOrder.date,
        event_time: customOrder.time || 'Nespecificat',
        location: customOrder.location,
        location2: customOrder.location2 || 'N/A',
        has_second_location: customOrder.hasSecondLocation ? 'Da (dual-location)' : 'Nu',
        message: customOrder.message || 'Fără mesaj',
        completion_date: customOrder.completionDate || 'Nespecificat',
        client_notes: customOrder.clientNotes || 'Fără comentarii',
        format: customOrder.format,
        product_price: finalPrice,
        product_image: productImage,
        order_number: orderNumber,
        order_id: orderRef.id
      });

      alert('Mulțumim pentru comandă! Confirmarea a fost trimisă pe emailul tău. Vă vom contacta în curând!');
      setCustomOrder({ productName: 'Momentul Nostru', design: 'Noapte înstelată', date: '', time: '', location: '', message: '', completionDate: '', clientNotes: '', format: 'A3' });
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
              <img src="/images/norda.svg" alt="Norda Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          <nav className="hidden sm:flex gap-6 items-center">
            <button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-white transition">Acasă</button>
            <button onClick={() => setCurrentPage('catalog')} className="text-gray-300 hover:text-white transition">Catalog</button>
            <button onClick={() => setCurrentPage('order')} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition">Comanda Acum</button>
          </nav>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button onClick={() => setShowMobileMenu(prev => !prev)} aria-label="Meniu" className="p-2 rounded-md bg-gray-800/60 text-gray-200">
              {showMobileMenu ? <X size={20} /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay menu */}
      {showMobileMenu && (
        <div className="sm:hidden fixed inset-0 bg-black/70 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute top-16 left-4 right-4 bg-gray-800/90 rounded-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-4">
              <button onClick={() => { setCurrentPage('home'); setShowMobileMenu(false); }} className="text-left text-white text-lg">Acasă</button>
              <button onClick={() => { setCurrentPage('catalog'); setShowMobileMenu(false); }} className="text-left text-white text-lg">Catalog</button>
              <button onClick={() => { setCurrentPage('order'); setShowMobileMenu(false); }} className="w-full bg-yellow-400 text-gray-900 px-4 py-3 rounded-full font-bold hover:bg-yellow-300 transition">Comanda Acum</button>
            </div>
          </div>
        </div>
      )}
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
              Creează o hartă stelară personalizată cu data și locația unui moment special. Cadouri unice cu iluminare LED caldă și design premium pentru aniversări, nunți și momente romantice.
            </p>
            <button 
              onClick={() => setCurrentPage('catalog')}
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition transform hover:scale-105"
            >
              Creează Harta Ta
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700 hover:border-yellow-400 transition">
              <Sparkles className="text-yellow-400 mb-4" size={40} />
              <h3 className="text-xl font-bold text-white mb-3">Personalizare Completă</h3>
              <p className="text-gray-300">Creează cadou personalizat: alege data, locația și mesajul tău special pentru un dar unic și memorable</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700 hover:border-yellow-400 transition">
              <Star className="text-yellow-400 mb-4" size={40} />
              <h3 className="text-xl font-bold text-white mb-3">Calitate Premium</h3>
              <p className="text-gray-300">Hartă stelară premium cu lemn natural, gravare laser și constelații detaliate. Atenție maximă la fiecare detaliu</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700 hover:border-yellow-400 transition">
              <Moon className="text-yellow-400 mb-4" size={40} />
              <h3 className="text-xl font-bold text-white mb-3">Design Premium</h3>
              <p className="text-gray-300">Constelații detaliate și design elegant. Perfectă pentru a prinde frumusețea unui moment special sub cer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const ImageModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
        <div className="relative w-full max-w-5xl my-auto bg-gray-800/50 backdrop-blur rounded-2xl border border-gray-700 overflow-hidden flex flex-col md:flex-row items-stretch gap-0" onClick={(e) => e.stopPropagation()}>
          
          {/* Buton X - sus dreapta */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full p-2 transition transform hover:scale-110 z-10"
            aria-label="Închide"
          >
            <X size={24} />
          </button>

          {/* Imagine */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-900 p-4 md:p-6">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full max-h-96 md:max-h-none object-contain rounded-lg"
            />
          </div>

          {/* Detalii - cu scroll independent */}
          <div className="w-full md:w-1/2 flex flex-col p-6 md:p-8 max-h-96 md:max-h-none overflow-y-auto scrollable-text">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 pr-10 flex-shrink-0">{product.name}</h2>
            
            <div className="flex-grow overflow-y-auto mb-6">
              <p className="text-gray-300 mb-4">{product.description}</p>
              <p className="text-gray-400 text-sm">{product.details}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-600 pt-4 gap-3 flex-shrink-0">
              <span className="text-2xl md:text-3xl font-bold text-yellow-400">{product.price} MDL</span>
              <button 
                onClick={() => {
                  setCustomOrder(prev => ({...prev, productName: product.name}));
                  setCurrentPage('order');
                  onClose();
                }}
                className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-full font-bold transition"
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
            Catalog - Colecția Noastră de Hărți Stelare
          </h2>
          <p className="text-gray-300 text-center mb-12 text-lg">
            Descoperă hărțile stelare personalizate care transformă amintirile în artă. Cadouri premium cu iluminare LED pentru momente speciale.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-800/50 backdrop-blur rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-400 transition transform hover:-translate-y-2 flex flex-col h-full">
                <div className="aspect-square overflow-hidden cursor-pointer group flex-shrink-0" onClick={() => setSelectedProduct(product)}>
                  <img src={product.image || 'https://via.placeholder.com/800x800?text=No+Image'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
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
                      className="bg-yellow-400 text-gray-900 px-4 py-2 text-sm rounded-full font-bold hover:bg-yellow-300 transition w-full sm:w-auto"
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
            <button onClick={async () => { try { await signOut(auth); setIsAdmin(false); setCurrentPage('home'); } catch(err) { console.error('Logout error', err); setIsAdmin(false); setCurrentPage('home'); } }} className="text-red-400 hover:text-red-300 transition">Deconectare</button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        {currentPage === 'admin' && isAdmin && (
          <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-white">Panou Admin</h2>
                <div className="flex gap-4">
                  <button onClick={() => setCurrentPage('admin-orders')} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Comenzi</button>
                  <button onClick={() => {setIsAdmin(false); setCurrentPage('home');}} className="text-red-400 hover:text-red-300 transition">Deconectare</button>
                </div>
              </div>
              <AdminPage />
            </div>
          </div>
        )}
        {currentPage === 'admin-orders' && isAdmin && (
          <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-white">Comenzi</h2>
                <div className="flex gap-4">
                  <button onClick={() => setCurrentPage('admin')} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Produse</button>
                  <button onClick={() => {setIsAdmin(false); setCurrentPage('home');}} className="text-red-400 hover:text-red-300 transition">Deconectare</button>
                </div>
              </div>
              
              <div className="flex gap-4 mb-8">
                <button onClick={() => setActiveOrdersTab('active')} className={`px-6 py-2 rounded-lg font-bold transition ${activeOrdersTab === 'active' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>Comenzi Active ({orders.filter(o => o.status === 'active').length})</button>
                <button onClick={() => setActiveOrdersTab('completed')} className={`px-6 py-2 rounded-lg font-bold transition ${activeOrdersTab === 'completed' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>Arhivă ({orders.filter(o => o.status === 'completed').length})</button>
              </div>

              <div className="space-y-4">
                {orders.filter(o => o.status === activeOrdersTab).length === 0 ? (
                  <div className="text-center text-gray-400 py-10">Nicio comandă în această secțiune</div>
                ) : (
                  orders.filter(o => o.status === activeOrdersTab).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).map(order => {
                    const product = products.find(p => p.name === order.order.productName);
                    return (
                    <div key={order.id} className="bg-gray-800/50 backdrop-blur p-6 rounded-2xl border border-gray-700 hover:border-yellow-400 transition">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden">
                          <img src={product?.image || 'https://via.placeholder.com/800x800?text=Produs'} alt={order.order.productName} className="w-full h-full object-cover aspect-square" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-yellow-400 mb-4">#Comandă {order.orderNumber}</h3>
                          <div className="space-y-2 text-gray-300">
                            <p><span className="font-semibold text-white">Client:</span> {order.contact.name}</p>
                            <p><span className="font-semibold text-white">Email:</span> {order.contact.email}</p>
                            <p><span className="font-semibold text-white">Telefon:</span> {order.contact.phone}</p>
                            <p><span className="font-semibold text-white">Produs:</span> {order.order.productName}</p>
                            <p><span className="font-semibold text-white">Format:</span> <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded">{order.order.format || 'A3'}</span></p>
                            <p><span className="font-semibold text-white">Preț:</span> {order.finalPrice} MDL</p>
                            {/* Design hidden until feature is enabled */}
                            <p><span className="font-semibold text-white">Data Evenimentului:</span> {order.order.date}</p>
                            <p><span className="font-semibold text-white">Data Finisării:</span> {order.order.completionDate}</p>
                            <p><span className="font-semibold text-white">Locație 1:</span> {order.order.location}</p>
                            {order.order.hasSecondLocation && <p><span className="font-semibold text-white">Locație 2:</span> {order.order.location2}</p>}
                          </div>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm mb-2"><span className="font-semibold text-white">Mesaj Personalizat:</span></p>
                          <p className="text-gray-300 mb-4 min-h-8">{order.order.message || 'Fără mesaj'}</p>
                          <p className="text-gray-400 text-sm mb-2"><span className="font-semibold text-white">Comentarii Speciale:</span></p>
                          <p className="text-gray-300 mb-4 min-h-8">{order.order.clientNotes || 'Fără comentarii'}</p>
                          <div className="flex gap-2 mt-6">
                            <button onClick={() => toggleOrderStatus(order.id, order.status)} className={`flex-1 py-2 rounded text-sm font-bold transition ${activeOrdersTab === 'active' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                              {activeOrdersTab === 'active' ? 'Marchează ca Realizată' : 'Reactivează'}
                            </button>
                            <button onClick={() => deleteOrder(order.id)} className="flex-1 bg-red-500 text-white py-2 rounded text-sm font-bold hover:bg-red-600 transition">Șterge</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-md w-full">
            {!isAdmin ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Login Admin</h3>
                <input type="email" placeholder="Email admin" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none mb-3 focus:border-yellow-400" />
                <input type="password" placeholder="Introdu parola" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none mb-4 focus:border-yellow-400"/>
                <div className="flex gap-3">
                  <button onClick={handleAdminLogin} className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition">Login</button>
                  <button onClick={() => {setShowAdminLogin(false); setAdminPassword(''); setAdminEmail('');}} className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition">Anulează</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-4">Ești autentificat ca admin</h3>
                <p className="text-gray-300 mb-6">Ai deja acces de administrator. Poți deschide panoul admin sau te poți deconecta.</p>
                <div className="flex gap-3">
                  <button onClick={() => { setShowAdminLogin(false); setCurrentPage('admin'); }} className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition">Deschide Panou</button>
                  <button onClick={async () => { try { await signOut(auth); setIsAdmin(false); setShowAdminLogin(false); setCurrentPage('home'); } catch(err) { console.error('Logout error', err); } }} className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition">Deconectează</button>
                </div>
              </>
            )}
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