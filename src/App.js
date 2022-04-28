import React, { useState } from 'react';
import firebase from './utils/firebase';
import 'firebase/compat/auth';
import Auth from './pages/Auth';  
import { ToastContainer } from 'react-toastify';
import LoggedUser from './layout/loggedUser';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadUser, setReloadUser] = useState(false);

  firebase.auth().onAuthStateChanged( usuarioActual => {
    
    if(usuarioActual?.emailVerified){
      setUser(usuarioActual);
    } else {
      setUser(null);
    }

    setIsLoading(false);
  })

  if(isLoading){
    return null;
  }

  return (
    <div>
      {!user ? <Auth /> : <LoggedUser user={user} setReloadUser={setReloadUser} />}
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        pauseOnVisibilityChange
      />
    </div>
  );
}



export default App;
