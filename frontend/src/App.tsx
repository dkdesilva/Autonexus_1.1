import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/main/ThemeContext';
import LandingPage from './pages/main/LandingPage';
import GetStarted from './pages/main/GetStarted';
import SignUp from './pages/main/SignUp';
import SignIn from './pages/main/SignIn';
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
import GarageProfileForm from './forms/grage/GarageProfileForm';
import GrageProfile from './pages/main/garage/GrageProfile';
import VehicleDealershipProfile from './pages/main/vehicle_dealership/VehicleDealershipProfile';
import VehicleAddMultiStepForm from './forms/create_vehicleadd_form/VehicleAddMultiStepForm';
import SparePartsAddMultiStepForm from './forms/create_sparepartsadd_form/SparePartsAddMultiStepForm';
import SparePartsDetailedView from './pages/main/SparePartsDetailedView';
import AdminDashboard from './pages/main/admin/AdminDashboard';
import AdminSignup from './pages/main/admin/AdminSignup';
import AdminLogin from './pages/main/admin/AdminLogin';
import DealershipProfileCustomerView from './pages/main/DealershipProfileCustomerView';
import GarageMap from './pages/main/garage/GarageMap';
import CustomerSellerDetails from './pages/main/CustomerSellerDetails';

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
          <Route path="/details/:id" element={<DetailedView />} />
          <Route path="/sparedetails/:id" element={<SparePartsDetailedView />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/spare-parts" element={<SpareParts />} />
          <Route path="/garages" element={<Garages />} />
          <Route path="/dealerships" element={<Dealerships />} />

          <Route path="/customer-profile" element={<CustomerProfile />} />
          <Route path="/sparepart-profile" element={<SparePartsProfle />} />
          <Route path="/garage-profile" element={<GrageProfile />} />
          <Route path="/dealership-profile" element={<VehicleDealershipProfile />} />

          <Route path="/customer-signin" element={<CustomerSignIn />} />
          <Route path="/customer-signup" element={<CustomerSignUp />} />
          <Route path="/sparepart-signin" element={<SparePartShopSignIn />} />
          <Route path="/sparepart-signup" element={<SparePartShopSignUp />} />
          <Route path="/vehicledealer-signin" element={<VehicleDealershipSignIn />} />
          <Route path="/vehicledealer-signup" element={<VehicleDealershipSignUp />} />
          <Route path="/garage-signin" element={<GarageSignIn />} />
          <Route path="/garage-signup" element={<GarageSignUp />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
          <Route path="/admin-signin" element={<AdminLogin />} />



          <Route path="/cusform" element={<CustomerProfileForm />} />
          <Route path="/garageform" element={<GarageProfileForm />} />
          <Route path="/create-vehicle-add" element={<VehicleAddMultiStepForm />} />
          <Route path="/create-sparepart-add" element={<SparePartsAddMultiStepForm />} />
          
          <Route path="/admindashboard" element={<AdminDashboard />} />

          <Route path="/dealership/:id" element={<DealershipProfileCustomerView />} />

          <Route path="/seller/:userId" element={<CustomerSellerDetails />} />
          

          {/* <Route path="/garagemap" element={<GarageMap />} /> */}


        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;