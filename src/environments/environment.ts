export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export const environment: { production: boolean; firebaseConfig: FirebaseConfig } = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCqqy03xjS8XmkH50tNrLPuqDwNnhMc8jo",
    authDomain: "gardeniaapp-366ee.firebaseapp.com",
    projectId: "gardeniaapp-366ee",
    storageBucket: "gardeniaapp-366ee.appspot.com",
    messagingSenderId: "71915271929",
    appId: "1:71915271929:web:498b2f844882ca214ed428",
    measurementId: "G-XDCE8WR8BE",
  },
};
