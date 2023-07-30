import { Form, Notification as Toast } from 'rsuite';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported, onMessage } from 'firebase/messaging';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBtM5wC4mhMaweWfeogtmldwZigngr7pEE",
  authDomain: "chat-web-app-610f0.firebaseapp.com",
  projectId: "chat-web-app-610f0",
  storageBucket: "chat-web-app-610f0.appspot.com",
  messagingSenderId: "298574476022",
  appId: "1:298574476022:web:0917818919b7c8db0772d7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'europe-west3');

export const messaging = isSupported() ? getMessaging(app) : null;

if (messaging) {
  onMessage(messaging, ({ notification }) => {
    const { title, body } = notification;
    Toast.info({ title, description: body, duration: 0 });
  });
}

// if (true) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
// }