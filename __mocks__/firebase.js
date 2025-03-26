/* eslint-disable no-undef */
export const initializeApp = jest.fn();
export const getAuth = jest.fn();
export const getFirestore = jest.fn();
export const getDatabase = jest.fn();

export const auth = {
  currentUser: null,
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
};

export const db = {
  collection: jest.fn(),
  doc: jest.fn(),
};

export const realtimeDb = {
  ref: jest.fn(),
};
