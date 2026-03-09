// Vercel Serverless Function to accept orders, save to Firestore via Admin SDK, and send confirmation via EmailJS REST
// This file runs on server (Vercel). Configure environment variables in Vercel:
// - FIREBASE_ADMIN_TYPE (if using service account JSON fields separately) OR use a single environment variable FIREBASE_SERVICE_ACCOUNT (JSON string)
// - EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY

const admin = require('firebase-admin');

// Initialize Firebase Admin using a service account JSON stored in env var FIREBASE_SERVICE_ACCOUNT
if (!admin.apps.length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    console.error('FIREBASE_SERVICE_ACCOUNT env var not set');
  } else {
    try {
      const serviceAccount = JSON.parse(raw);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } catch (err) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', err);
    }
  }
}

const db = admin.firestore ? admin.firestore() : null;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body || {};
  if (!data.customerEmail || !data.customerName) {
    return res.status(400).json({ error: 'Missing customerEmail or customerName' });
  }

  try {
    // Save order
    const orderDoc = await db.collection('orders').add({
      ...data,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const orderId = orderDoc.id;

    // Build email params
    const emailParams = {
      to_email: data.customerEmail,
      order_id: orderId,
      customer_name: data.customerName,
      email: data.customerEmail,
      date: new Date().toLocaleString(),
      orders: (data.items || []).map(i => ({
        name: i.name || 'Item',
        units: i.units || 1,
        price: i.price || 0,
        image_url: i.image_url || ''
      })),
      cost: {
        shipping: data.shipping || 0,
        tax: data.tax || 0,
        total: data.total || 0
      }
    };

    // Send email via EmailJS REST API
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.warn('EmailJS env vars not set; skipping email send');
    } else {
      // EmailJS REST endpoint
      const body = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: emailParams
      };

      // node fetch available in modern node; fallback to require('node-fetch') if not
      let fetchFn = global.fetch;
      if (!fetchFn) {
        try { fetchFn = require('node-fetch'); } catch (e) { fetchFn = null; }
      }

      if (fetchFn) {
        await fetchFn('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } else {
        console.warn('No fetch available; cannot send email from server');
      }
    }

    return res.status(200).json({ id: orderId });
  } catch (err) {
    console.error('Server order error:', err);
    return res.status(500).json({ error: String(err) });
  }
};
