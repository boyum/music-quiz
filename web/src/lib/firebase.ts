import admin from "firebase-admin";
import credentials from "../../serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      // @ts-expect-error The ServiceAccount type wrongfully expects `projectId` instead of `project_id`
      client_id: credentials.client_id ?? process.env.CLIENT_ID,
      client_email: credentials.client_email ?? process.env.FIREBASE_CLIENT_EMAIL,
      project_id: credentials.project_id ?? process.env.FIREBASE_PROJECT_ID,
      private_key_id: credentials.private_key_id ?? process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: credentials.private_key ?? process.env.FIREBASE_PRIVATE_KEY,
    }),
    databaseURL: "https://music-quiz-e2298-default-rtdb.europe-west1.firebasedatabase.app",
  });
}

export const firebase = admin.firestore();
