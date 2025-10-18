const isProduction = typeof window !== 'undefined' && 
  !window.location.hostname.includes('localhost') &&
  !window.location.hostname.includes('127.0.0.1') &&
  !window.location.hostname.includes('replit.dev') &&
  (window.location.hostname.includes('replit.app') ||
   window.location.hostname.includes('vercel.app') || 
   window.location.hostname.includes('axlgamester.com'));

export const environment = {
  production: isProduction,
  youtubeChannelId: 'UCU6JmBJ7J8WeuwBOrJmeMKA',
  firebaseConfig: {    
    apiKey: "AIzaSyDjn_vBgS__i94WVb1Vveqs1fW3ipBHR3c",
    authDomain: "axlgamester.firebaseapp.com",
    projectId: "axlgamester",
    storageBucket: "axlgamester.appspot.com",
    messagingSenderId: "318323788910",
    appId: "1:318323788910:web:ea383c51fd2efd6ea7f",
    measurementId: "G-E2LNERSCTR",
  },
};

export const dev = {
  production: false,
  youtubeChannelId: 'UCU6JmBJ7J8WeuwBOrJmeMKA',
  firebaseConfig: {    
    apiKey: "AIzaSyDjn_vBgS__i94WVb1Vveqs1fW3ipBHR3c",
    authDomain: "axlgamester.firebaseapp.com",
    projectId: "axlgamester",
    storageBucket: "axlgamester.appspot.com",
    messagingSenderId: "318323788910",
    appId: "1:318323788910:web:ea383c51fd2efd6ea7f",
    measurementId: "G-E2LNERSCTR",
  },
};