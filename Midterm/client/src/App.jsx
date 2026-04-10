import './styles/main.css';
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Home from './views/Home';
import Sneaker from './views/Sneaker';
import Signup from './views/Signup';
import Signin from './views/Signin';
import Account from './views/Account';
import { AuthContextProvider } from './context/AuthContext';
import { BasketContextProvider } from './context/BasketContext';
import { FavoriteContextProvider } from './context/FavoriteContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Shop from './views/Shop';
import Checkout from './views/Checkout';
import Verifcation from './views/Verification';

function App() {
  return (
    <AuthContextProvider>
      <BasketContextProvider>
        <FavoriteContextProvider>
          <BrowserRouter>
            <Navigation />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sneakers/:id" element={<Sneaker />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/shop" element={<Shop />} />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/verification" 
                element={
                  <ProtectedRoute>
                    <Verifcation />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </BrowserRouter>
        </FavoriteContextProvider>
      </BasketContextProvider>
    </AuthContextProvider>
  );
}

export default App;
