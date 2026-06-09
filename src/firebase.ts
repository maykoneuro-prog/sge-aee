import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: Uses the provisioned database ID */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const registerUserOnSecondaryApp = async (email: string, password: string) => {
  const appName = `SecondaryApp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const secondaryApp = initializeApp(firebaseConfig, appName);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    return userCredential.user;
  } finally {
    try {
      await deleteApp(secondaryApp);
    } catch (e) {
      console.error("Error deleting secondary app:", e);
    }
  }
};

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase Firestore connected successfully.");
    
    // Silent seeding of default administrators in Firebase Auth
    const seedAdmins = async () => {
      const admins = [
        { email: 'administrador@sgepsicologia.com', password: '12345678' },
        { email: 'maykon.euro@gmail.com', password: '12345678' }
      ];
      for (const admin of admins) {
        try {
          await registerUserOnSecondaryApp(admin.email, admin.password);
          console.log(`Successfully auto-seeded default administrator auth account: ${admin.email}`);
        } catch (authErr: any) {
          if (authErr.code !== 'auth/email-already-in-use') {
            console.warn(`Could not auto-seed administrator auth account ${admin.email}:`, authErr.message);
          }
        }
      }
    };
    seedAdmins();
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: Client is offline.");
    } else {
      console.log("Firebase connection test complete (database exists).");
    }
  }
}
testConnection();
