import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/main/ThemeContext';
import LandingPage from './pages/main/LandingPage';
import GetStarted from './pages/main/GetStarted';
import SignUp from './pages/main/SignUp';
import SignIn from './pages/main/SignIn';
import Home from './pages/main/Home';
import DetailedView from './pages/main/DetailedView';
import Vehicles from './pages/main/Vehicles';
import SpareParts from './pages/main/SpareParts';
import Garages from './pages/main/Garages';
import Dealerships from './pages/main/Dealerships';
import CommernLandingPage from './pages/landing/CommonLandingPage';
import CustomerSignIn from './pages/main/customer/CustomerSignIn';
import CustomerSignUp from './pages/main/customer/CustomerSignUp';
import SparePartShopSignIn from './pages/main/spare_part_shop/SparePartShopSignIn';
import SparePartShopSignUp from './pages/main/spare_part_shop/SparePartShopSignUp';
import VehicleDealershipSignIn from './pages/main/vehicle_dealership/VehicleDealershipSignIn';
import VehicleDealershipSignUp from './pages/main/vehicle_dealership/VehicleDealershipSignUp';
import GarageSignIn from './pages/main/garage/GarageSignIn';
import GarageSignUp from './pages/main/garage/GarageSignUp';
import CustomerProfile from './pages/main/customer/CustomerProfile';
import SparePartsProfle from './pages/main/spare_part_shop/SparePartsProfle';
import CustomerProfileForm from './forms/customer/CustomerProfileForm';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CommernLandingPage />} />
          <Route path="/main-land" element={<LandingPage />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/details/:id" element={<DetailedView />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/spare-parts" element={<SpareParts />} />
          <Route path="/garages" element={<Garages />} />
          <Route path="/dealerships" element={<Dealerships />} />
          <Route path="/customer-profile" element={<CustomerProfile />} />
          <Route path="/sparepart-profile" element={<SparePartsProfle />} />

          <Route path="/customer-signin" element={<CustomerSignIn />} />
          <Route path="/customer-signup" element={<CustomerSignUp />} />
          <Route path="/sparepart-signin" element={<SparePartShopSignIn />} />
          <Route path="/sparepart-signup" element={<SparePartShopSignUp />} />
          <Route path="/vehicledealer-signin" element={<VehicleDealershipSignIn />} />
          <Route path="/vehicledealer-signup" element={<VehicleDealershipSignUp />} />
          <Route path="/garage-signin" element={<GarageSignIn />} />
          <Route path="/garage-signup" element={<GarageSignUp />} />



          <Route path="/cusform" element={<CustomerProfileForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;