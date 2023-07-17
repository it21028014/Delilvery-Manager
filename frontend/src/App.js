import { Routes, BrowserRouter, Route } from "react-router-dom";
import Home from "./Components/Home/index";
import Order from "./Components/OrderDetails/index";
import DeliveryPartner from "./Components/DeliveryPartner/index";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/deliveryPartner" element={<DeliveryPartner />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
