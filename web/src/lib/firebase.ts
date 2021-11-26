import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";

let credentials;
const serviceAccountKeyPath = "./serviceAccountKey.json";

if (existsSync(serviceAccountKeyPath)) {
  credentials = JSON.parse(readFileSync(serviceAccountKeyPath).toString());
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      credentials ?? {
        client_id: process.env.CLIENT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
      },
    ),
    databaseURL: "https://music-quiz-e2298-default-rtdb.europe-west1.firebasedatabase.app",
  });
}

export const firebase = admin.firestore();
