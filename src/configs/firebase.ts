import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_GOOGLE_CREDENTIALS || '';

if (process.env.NODE_ENV === 'development') {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
} else admin.initializeApp();

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export default db;
