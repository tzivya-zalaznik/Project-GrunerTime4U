import logo from './logo.svg';
import './App.css';
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "primeflex/primeflex.css"
import NavBar from './Components/NavBar';
import { Route, Routes } from 'react-router-dom';
import Login from './Components/Pages/Login';
import Register from './Components/Pages/Register';
import Gallery from './Components/Pages/Gallery';
import Favorite from './Components/Pages/Favorit';
import Home from './Components/Pages/Home';
import RequireAuth from './Components/RequireAuth';
import Sales from './Components/Pages/Sales';
import AdminGallery from './Components/Pages/AdminGallery';
import Company from './Components/Pages/Company';
import Footer from './Components/Footer';
import NotFound from './Components/Pages/NotFound';
import ForgotPassword from './Components/Pages/ForgotPassword';

function App() {
  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route element={<RequireAuth allowRoles={["Admin", "User"]} />}>
          <Route path="/favorite" element={<Favorite />} />
          <Route element={<RequireAuth allowRoles={["Admin"]} />}>
            <Route path="/adminGallery" element={<AdminGallery />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/company" element={<Company />} />
          </Route>
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
