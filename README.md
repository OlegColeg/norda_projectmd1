# Norda - Star Map (React + Vite + Tailwind)

This is a small Vite + React project containing the Norda UI you provided. It uses Tailwind CSS for styling and lucide-react for icons.

How to run locally

1. Install dependencies:

```bash
cd /Users/macbook/Desktop/SkyMaps/WebSite/norda_projectmd
npm install
# Norda - Instrucțiuni de configurare (Română)

Acest fișier explică pas-cu-pas cum să configurezi proiectul pentru a salva comenzile în Firebase Firestore și să trimiți emailuri de confirmare prin EmailJS. Am scris instrucțiunile clar, pas-cu-pas, pentru test local și deploy pe Vercel.

---

## Ce face proiectul acum
- Când un utilizator trimite o comandă din formularul `Contact`, aplicația:
  - salvează comanda în colecția `orders` din Firestore (din client) sau
  - opțional, postează comanda la un endpoint server (`/api/order`) care salvează în Firestore folosind SDK-ul Admin (recomandat pentru producție)
  - trimite un email de confirmare folosind EmailJS (client-side sau server-side, în funcție de configurare)

## Pași pentru test local (simplu)
1. Deschide directorul proiectului în terminal.
2. Copiază fișierul `.env.example` în `.env` în rădăcina proiectului:

```bash
cp .env.example .env
```

3. Deschide `.env` și pune valorile tale (cel puțin EmailJS):
- VITE_EMAILJS_SERVICE_ID (ex: service_p5j9ak4)
- VITE_EMAILJS_TEMPLATE_ID (ex: template_g52eb3e)
- VITE_EMAILJS_PUBLIC_KEY (ex: 6B2jTwTuges4knKMw)

Opțional (folosește propriul proiect Firebase pentru producție):
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID

4. Instalează dependențele (dacă nu sunt instalate):

```bash
npm install
```

5. Rulează serverul de dezvoltare:

```bash
npm run dev
```

6. Deschide aplicația în browser (de obicei http://localhost:5173). Completează formularul din pagina Contact și trimite o comandă.

7. Verifică:
- Firestore: în colecția `orders` trebuie să apară un document nou (dacă ai pus variabile Firebase sau folosești config din repo).
- Email: adresa introdusă în formular ar trebui să primească emailul de confirmare (dacă EmailJS e configurat corect și template-ul conține câmpurile folosite).

Dacă apare o eroare, deschide consola browser (F12) și vezi mesajul de eroare. Trimite-mi acel mesaj și te ajut să-l rezolv.

---

## Recomandare pentru producție (Vercel)
1. Copiază valorile din `.env.example` în Settings → Environment Variables din proiectul Vercel:
	- Pentru `Production` setează: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.
	- Dacă vrei să folosești endpoint server-side (recomandat): setează `FIREBASE_SERVICE_ACCOUNT` (JSON serializat) în Vercel și `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`.

2. Alegerea modulului de lucru:
	- Mod implicit (client-side): aplicația salvează direct în Firestore și trimite email via EmailJS din browser. E ușor, dar mai puțin sigur.
	- Mod recomandat (server-side): setează `VITE_USE_SERVER_ORDER=true` în Vercel (sau local `.env`) și adaugă un Service Account JSON în `FIREBASE_SERVICE_ACCOUNT` (valoare JSON). Astfel, comanda va fi trimisă la `/api/order` (endpoint serverless) care folosește SDK Admin pentru a salva comanda și trimite emailul de confirmare.

3. Deploy:
	- Conectează repo-ul la Vercel, asigură-te că env vars sunt setate.
	- Deploy (Vercel va rula `npm run build` și va publica site-ul).

---

## Securitate Firestore
Fișierul `firestore.rules` curent permite scrierea temporară (expiră) — asta e periculos în producție. Recomand să schimbi regulile astfel încât doar endpoint-ul serverless (sau utilizator autentificat) să poată scrie în `orders`.

Exemplu simplu (recomandare): permite scriere doar dacă cererea conține un câmp special `token` validat prin funcție server-side sau folosește autentificare Firebase.

---

Dacă vrei, fac eu următoarele imediat (alege opțiunea):
- A: Te ghidez pas-cu-pas pentru test local (îți dau comenzile exacte și ce să pui în `.env`) — ideal dacă vrei să testezi singur.
- B: Configurez endpoint-ul serverless (am adăugat `/api/order.js`) și te ajut să pui `FIREBASE_SERVICE_ACCOUNT` în Vercel, apoi testăm împreună.

Spune ce variantă vrei și-ți explic exact următorii pași în română simplu.
