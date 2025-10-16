import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_p5j9ak4";
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_g52eb3e";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "6B2jTwTuges4knKMw";

// orderData shape (recommended):
// {
//   customerName, customerEmail, customerPhone,
//   items: [{ name, units, price, image_url }],
//   shipping, tax, total
// }
export const saveOrder = async (orderData) => {
  // If VITE_USE_SERVER_ORDER=true, post to serverless endpoint instead (safer for production)
  const useServer = import.meta.env.VITE_USE_SERVER_ORDER === 'true' || false;
  if (useServer) {
    try {
      const resp = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error('Server order failed: ' + resp.status + ' ' + body);
      }
      const json = await resp.json();
      return json.id;
    } catch (err) {
      console.error('Error sending order to server endpoint:', err);
      throw err;
    }
  }

  try {
    // Save order to Firestore directly from client
    let docRef;
    try {
      docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: new Date(),
        status: "pending"
      });
    } catch (fsErr) {
      console.error('Firestore save error:', fsErr);
      throw new Error('firestore:' + (fsErr.message || fsErr));
    }

    // Build email params compatible with the provided HTML template (mustache style)
    const emailParams = {
      // send confirmation to the customer by default; you can also include an admin email in your template
      to_email: orderData.customerEmail || orderData.email || "ooale47@gmail.com",
      order_id: docRef.id,
      customer_name: orderData.customerName || "Customer",
      email: orderData.customerEmail || orderData.email || "",
      date: new Date().toLocaleString(),
      // Mustache/EmailJS supports iterating over an array using {{#orders}} ... {{/orders}}
      orders: (orderData.items || []).map(item => ({
        name: item.name || item.title || "Item",
        units: item.units || item.qty || 1,
        price: item.price != null ? item.price : item.unitPrice || 0,
        image_url: item.image_url || item.image || ''
      })),
      cost: {
        shipping: orderData.shipping != null ? orderData.shipping : 0,
        tax: orderData.tax != null ? orderData.tax : 0,
        total: orderData.total != null ? orderData.total : (
          (orderData.items || []).reduce((s, it) => s + (Number(it.price) || 0) * (it.units || 1), 0) + (orderData.shipping || 0) + (orderData.tax || 0)
        )
      }
    };

    // Send email via EmailJS
    try {
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, emailParams, EMAILJS_PUBLIC_KEY);
    } catch (emailErr) {
      console.error('EmailJS send error:', emailErr);
      throw new Error('emailjs:' + (emailErr.message || emailErr));
    }

    return docRef.id;
  } catch (error) {
    console.error("Error processing order:", error);
    throw error;
  }
};