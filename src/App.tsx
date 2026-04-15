import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { ShoppingProvider } from "./contexts/ShoppingContext";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Household from "./pages/Household";
import Inventory from "./pages/Inventory";
import Shopping from "./pages/Shopping";
import Suggestions from "./pages/Suggestions";
import Achievements from "./pages/Achievements";
import History from "./pages/History";
import "./App.css";

function App() {
  return (
    <AppProvider>
      <ShoppingProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/household" element={<Household />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/shopping" element={<Shopping />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ShoppingProvider>
    </AppProvider>
  );
}

export default App;
