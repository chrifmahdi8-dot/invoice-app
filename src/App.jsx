import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppProvider from './context/AppContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceList from './pages/InvoiceList';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import { useApp } from './context/AppContext';

// مكون التخطيط الرئيسي
function AppLayout() {
  const { isRTL } = useApp();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
      {/* شريط التنقل العلوي */}
      <Navbar />
      
      {/* القائمة الجانبية */}
      <Sidebar />
      
      {/* المحتوى الرئيسي */}
      <main className={`pt-16 ${isRTL ? 'mr-64' : 'ml-64'} min-h-screen transition-all duration-300`}>
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateInvoice />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </Router>
  );
}

export default App;
