# 📧 Instrucțiuni Setup EmailJS - Confirmări pe Email

## ⚡ Pasul 1: Creează cont EmailJS

1. Mergi pe [https://www.emailjs.com](https://www.emailjs.com)
2. Apasă **"Sign Up Free"**
3. Completează formularul (email, parolă)
4. Verifică emailul și confirma contul

## 🔑 Pasul 2: Obține PUBLIC KEY

1. Log în pe [https://dashboard.emailjs.com](https://dashboard.emailjs.com)
2. Merge la **"Account"** (în meniu stânga)
3. Cauta **"PUBLIC KEY"**
4. Copiază cheia (ceva de genul: `abc123xyz...`)

## 📮 Pasul 3: Conectează Email Service

### Opțiunea 1: Gmail (Recomandată)

1. În dashboard, merge la **"Email Services"** (stânga jos)
2. Apasă **"Add Service"**
3. Alege **"Gmail"**
4. Urmează pașii:
   - Selectează contul Google tău
   - Apasă "Connect"
   - Apasă "Save"

### Opțiunea 2: Orice alt email

1. Merge la **"Email Services"**
2. Alege **"Other Services"** și completeaza datele SMTP

## 📋 Pasul 4: Creează Email Template

1. Merge la **"Email Templates"** (stânga)
2. Apasă **"Create New Template"**
3. Denumește template-ul: `norda_order_confirmation`
4. **IMPORTANT**: Completează după cum urmează:

### Email Template Content:

```
Subject: 
Confirmarea Comenzii #{{order_id}} - Norda Star Maps

Content (HTML):
<html>
  <body style="font-family: Arial, sans-serif; background-color: #111827; color: #f3f4f6; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1f2937; padding: 30px; border-radius: 10px; border: 1px solid #374151;">
      
      <h2 style="color: #fbbf24; text-align: center;">Norda - Hartă Stelară</h2>
      <p style="text-align: center; color: #d1d5db; margin-bottom: 20px;">Mulțumim pentru comandă!</p>
      
      <hr style="border: none; border-top: 1px solid #4b5563; margin: 20px 0;">
      
      <h3 style="color: #fbbf24;">Detaliile Comenzii</h3>
      <p><strong>Detalii Contact:</strong></p>
      <ul style="list-style: none; padding: 0;">
        <li>📛 Nume: {{customer_name}}</li>
        <li>📧 Email: {{to_email}}</li>
        <li>📱 Telefon: {{customer_phone}}</li>
      </ul>
      
      <p style="margin-top: 15px;"><strong>Detaliile Hărții Stelare:</strong></p>
      <ul style="list-style: none; padding: 0;">
        <li>⭐ Model: {{product_name}}</li>
        <li>🎨 Design: {{design}}</li>
        <li>📅 Data Evenimentului: {{event_date}}</li>
        <li>🕐 Ora: {{event_time}}</li>
        <li>📍 Locația: {{location}}</li>
        <li>💬 Mesaj Personalizat: {{message}}</li>
        <li style="color: #fbbf24; margin-top: 10px;"><strong>💰 Preț: {{product_price}}</strong></li>
      </ul>
      
      <hr style="border: none; border-top: 1px solid #4b5563; margin: 20px 0;">
      
      <p style="background-color: #111827; padding: 15px; border-radius: 5px;">
        <strong>ID Comandă: #{{order_id}}</strong><br>
        <span style="color: #9ca3af; font-size: 12px;">Vom confirma comanda prin WhatsApp la {{customer_phone}} în cel mai scurt timp.</span>
      </p>
      
      <p style="color: #6b7280; text-align: center; margin-top: 20px; font-size: 12px;">
        © 2024 Norda - Hărți Stelare Personalizate<br>
        Creat cu ❤️ în Moldova
      </p>
    </div>
  </body>
</html>
```

5. Apasă **"Save"**

## 🔧 Pasul 5: Obține SERVICE ID și TEMPLATE ID

1. Mergi din nou la **"Email Templates"**
2. Deschide template-ul pe care l-ai creat
3. Copiază **SERVICE ID** (din URL: `/service/xxxxxxx`)
4. Copiaza **TEMPLATE ID** (pe pagina template-ului)

## ✏️ Pasul 6: Actualizează App.jsx

Deschide `/src/App.jsx` și înlocuiește valorile:

```javascript
// LINIA 6 - Înlocuiește YOUR_PUBLIC_KEY
emailjs.init('PUBLIC_KEY_TAU_AICI');

// LINIA 260 - Înlocuiește YOUR_SERVICE_ID și YOUR_TEMPLATE_ID
await emailjs.send('SERVICE_ID_TAU_AICI', 'TEMPLATE_ID_TAU_AICI', {
```

### Exemplu:
```javascript
emailjs.init('abc123xyz_abc123xyz...');

await emailjs.send('service_abc123def', 'template_xyz789abc', {
```

## 🧪 Pasul 7: Testare

1. Rulează aplicația: `npm run dev`
2. Merge la pagina **"Comanda Acum"**
3. Completează formularul complet
4. Apasă **"Trimite Comanda"**
5. Verifica dacă ai primit email confirmând comanda

## 📌 VARIABILELE DISPONIBILE ÎN EMAIL

Poți folosi aceste variabile în template-ul EmailJS:

- `{{to_email}}` - Email-ul clientului
- `{{customer_name}}` - Numele clientului
- `{{customer_phone}}` - Telefonul clientului
- `{{product_name}}` - Numele produsului (ex: Hartă Stelară Clasică)
- `{{design}}` - Design-ul ales
- `{{event_date}}` - Data evenimentului
- `{{event_time}}` - Ora evenimentului
- `{{location}}` - Locația
- `{{message}}` - Mesajul personalizat
- `{{product_price}}` - Prețul produsului
- `{{order_id}}` - ID-ul comenzii

## ⚙️ LIMITE FREE PLAN

- **200 emailuri/lună** (gratuit)
- Suficient pentru o mică afacere la început
- Poți upgrada oricând dacă ai nevoie de mai mult

## 🚀 LIVE DEPLOYMENT

Când publici site-ul pe Vercel/Netlify:
- Variabilele PUBLIC_KEY, SERVICE_ID și TEMPLATE_ID se vor transmite automat (sunt în cod)
- Emailurile vor funcționa și pe producție

## ❓ TROUBLESHOOTING

**Emailul nu se trimite?**
- Verifică că KEY-urile sunt corecte în App.jsx
- Verifică spam folder
- Accesează [EmailJS Activity](https://dashboard.emailjs.com/admin/account) pentru a vedea erorile

**Domain verification?**
- Nu e necesară pentru FREE plan cu Gmail
- Dacă folosești alt provider, EmailJS te va ghida

---

✅ **Gata!** Sistemul de email confirmări este funcțional!
