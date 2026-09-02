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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 flex flex-col">
      {/* شريط التنقل العلوي */}
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* خلفية معتمة تظهر فقط في الجوال عندما تكون القائمة مفتوحة */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* القائمة الجانبية */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      {/* المحتوى الرئيسي */}
      <main className={`pt-16 ${isRTL ? 'lg:mr-64' : 'lg:ml-64'} min-h-screen transition-all duration-300 w-full overflow-x-hidden`}>
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full">
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
