import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Chatbot from './components/Chatbot';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/AdminRoute';
import AdminLogin from './pages/AdminLogin';
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/admin/login' element={<AdminLogin />} />

        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/search' element={<Search />} />
          <Route path='/listing/:listingId' element={<Listing />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
          <Route element={<AdminRoute />}>
            <Route path='/admin' element={<AdminPanel />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
      <Chatbot />
    </BrowserRouter>
  );
}
