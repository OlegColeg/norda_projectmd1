/*
  Usage:
    node setAdminClaim.js /path/to/serviceAccountKey.json ADMIN_UID

  This script sets the custom claim { admin: true } on the specified user.
  Run it from a trusted environment (your machine or server).
*/

const admin = require('firebase-admin');
const path = require('path');

if (process.argv.length < 4) {
  console.error('Usage: node setAdminClaim.js /path/to/serviceAccountKey.json ADMIN_UID');
  process.exit(1);
}

const serviceAccountPath = path.resolve(process.argv[2]);
const adminUid = process.argv[3];

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath))
});

admin.auth().setCustomUserClaims(adminUid, { admin: true })
  .then(() => {
    console.log(`Admin claim set for UID=${adminUid}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error setting admin claim:', err);
    process.exit(2);
  });
