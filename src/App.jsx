import React, { useState, useEffect } from 'react';
import { Star, Moon, Sparkles, Mail, Phone, MapPin, Instagram, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export default function NordaStarMaps() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const defaultProducts = [
    {
      id: 1,
      name: 'Hartă Stelară Clasică',
      description: 'Hartă stelară personalizată cu rama din lemn și iluminare LED caldă',
      price: '450 MDL',
      image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop',
      details: 'Dimensiuni: 30x40cm, Lemn natural, LED-uri calde, Text personalizat inclus'
    },
    {
      id: 2,
      name: 'Hartă Stelară Premium',
      description: 'Design elegant cu constelații detaliate și gravare text personalizat',
      price: '550 MDL',
      image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&auto=format&fit=crop',
      details: 'Dimensiuni: 40x50cm, Rama premium din lemn masiv, Gravare laser inclusă'
    },
    {
      id: 3,
      name: 'Hartă Stelară Blue',
      description: 'Iluminare LED albastră pentru un efect magic și cosmic special',
      price: '500 MDL',
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop',
      details: 'Dimensiuni: 30x40cm, LED-uri albastre intense, Efect neon unic'
    }
  ];

  useEffect(() => {
    const savedProducts = localStorage.getItem('nordaProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('nordaProducts', JSON.stringify(defaultProducts));
    }
  }, []);

  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('nordaProducts', JSON.stringify(newProducts));
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
            <Sparkles className="text-yellow-400" size={32} />
            <h1 className="text-2xl font-bold text-white">Norda</h1>
          </div>
          <nav className="flex gap-6 items-center">
            <button onClick={() => setCurrentPage('home')} className="text-gray-300 hover:text-white transition">Acasă</button>
            <button onClick={() => setCurrentPage('catalog')} className="text-gray-300 hover:text-white transition">Catalog</button>
            <button onClick={() => setCurrentPage('contact')} className="text-gray-300 hover:text-white transition">Contact</button>
            <button onClick={() => setShowAdminLogin(true)} className="text-gray-400 hover:text-yellow-400 transition text-sm">Admin</button>
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
              <div className="relative">
                <Moon className="text-yellow-300 animate-pulse" size={80} />
                <Star className="absolute -top-4 -right-4 text-white animate-bounce" size={24} />
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
              onClick={() => setCurrentPage('catalog')}
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition transform hover:scale-105"
            >
              Vezi Catalogul
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

  const CatalogPage = () => (
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
            <div key={product.id} className="bg-gray-800/50 backdrop-blur rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-400 transition transform hover:scale-105">
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
                    onClick={() => setCurrentPage('contact')}
                    className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition"
                  >
                    Comandă
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', product: '' });
    
    const handleSubmit = () => {
      if (!formData.name || !formData.email || !formData.phone || !formData.product) {
        alert('Te rog completează toate câmpurile obligatorii!');
        return;
      }
      alert('Mulțumim pentru comandă! Vă vom contacta în curând pe WhatsApp sau email.');
      setFormData({ name: '', email: '', phone: '', message: '', product: '' });
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Contactează-ne
          </h2>
          <p className="text-gray-300 text-center mb-12 text-lg">
            Suntem aici să transformăm visul tău într-o realitate stelară
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Informații Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Instagram className="text-yellow-400" size={24} />
                  <span>@norda_projectmd</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="text-yellow-400" size={24} />
                  <span>+373 XXX XXX XX</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="text-yellow-400" size={24} />
                  <span>contact@norda.md</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="text-yellow-400" size={24} />
                  <span>Chișinău, Moldova</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
                <p className="text-yellow-400 font-semibold mb-2">Program de lucru:</p>
                <p className="text-gray-300 text-sm">Luni - Vineri: 10:00 - 19:00</p>
                <p className="text-gray-300 text-sm">Sâmbătă: 11:00 - 16:00</p>
                <p className="text-gray-300 text-sm">Duminică: Închis</p>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Plasează Comanda</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Numele tău *"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"
                />
                <input
                  type="tel"
                  placeholder="Telefon (WhatsApp) *"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"
                />
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none"
                >
                  <option value="">Alege produsul *</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <textarea
                  placeholder="Mesajul tău (dată, locație, text personalizat)"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 outline-none h-32"
                />
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
                >
                  Trimite Comanda
                </button>
                <p className="text-gray-400 text-sm text-center">* Câmpuri obligatorii</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdminPage = () => {
    const [newProduct, setNewProduct] = useState({
      name: '', description: '', price: '', image: '', details: ''
    });

    const addProduct = () => {
      if (!newProduct.name || !newProduct.price) {
        alert('Completează numele și prețul produsului!');
        return;
      }
      const product = { 
        ...newProduct, 
        id: Date.now(),
        image: newProduct.image || 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800'
      };
      saveProducts([...products, product]);
      setNewProduct({ name: '', description: '', price: '', image: '', details: '' });
      alert('Produs adăugat cu succes!');
    };

    const deleteProduct = (id) => {
      if (confirm('Sigur vrei să ștergi acest produs?')) {
        saveProducts(products.filter(p => p.id !== id));
      }
    };

    const updateProduct = () => {
      saveProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      alert('Produs actualizat cu succes!');
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-white">Panou Admin</h2>
            <button 
              onClick={() => {setIsAdmin(false); setCurrentPage('home');}}
              className="text-red-400 hover:text-red-300 transition"
            >
              Deconectare
            </button>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="text-yellow-400" size={28} />
              Adaugă Produs Nou
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nume produs *"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400"
              />
              <input
                type="text"
                placeholder="Preț (ex: 450 MDL) *"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400"
              />
              <input
                type="text"
                placeholder="URL imagine (optional)"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400 md:col-span-2"
              />
              <textarea
                placeholder="Descriere scurtă"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400 h-24"
              />
              <textarea
                placeholder="Detalii tehnice"
                value={newProduct.details}
                onChange={(e) => setNewProduct({...newProduct, details: e.target.value})}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-yellow-400 h-24"
              />
            </div>
            <button 
              onClick={addProduct} 
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition flex items-center gap-2"
            >
              <Plus size={20} /> Adaugă Produs
            </button>
          </div>

          <h3 className="text-2xl font-bold text-white mb-6">
            Produse Existente ({products.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-4">
                {editingProduct?.id === product.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 outline-none"
                      placeholder="Nume"
                    />
                    <input
                      type="text"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 outline-none"
                      placeholder="Preț"
                    />
                    <input
                      type="text"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 outline-none"
                      placeholder="URL imagine"
                    />
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm h-20 border border-gray-600 outline-none"
                      placeholder="Descriere"
                    />
                    <textarea
                      value={editingProduct.details}
                      onChange={(e) => setEditingProduct({...editingProduct, details: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm h-20 border border-gray-600 outline-none"
                      placeholder="Detalii"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={updateProduct} 
                        className="flex-1 bg-green-500 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-green-600 transition"
                      >
                        <Save size={16} /> Salvează
                      </button>
                      <button 
                        onClick={() => setEditingProduct(null)} 
                        className="flex-1 bg-gray-600 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-gray-500 transition"
                      >
                        <X size={16} /> Anulează
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
                    <h4 className="text-white font-bold mb-1 text-lg">{product.name}</h4>
                    <p className="text-gray-300 text-sm mb-2">{product.description}</p>
                    <p className="text-yellow-400 font-bold mb-3 text-lg">{product.price}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingProduct(product)} 
                        className="flex-1 bg-blue-500 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-blue-600 transition"
                      >
                        <Edit2 size={16} /> Editează
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)} 
                        className="flex-1 bg-red-500 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} /> Șterge
                      </button>
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
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'catalog' && <CatalogPage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'admin' && isAdmin && <AdminPage />}

      {showAdminLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Login Admin</h3>
            <input
              type="password"
              placeholder="Introdu parola"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none mb-4 focus:border-yellow-400"
            />
            <div className="flex gap-3">
              <button 
                onClick={handleAdminLogin} 
                className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
              >
                Login
              </button>
              <button 
                onClick={() => {setShowAdminLogin(false); setAdminPassword('');}} 
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition"
              >
                Anulează
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-4 text-center">Parola implicită: <span className="text-yellow-400 font-mono">norda2024</span></p>
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
          <div className="flex justify-center gap-4">
            <a href="https://instagram.com/norda_projectmd" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}