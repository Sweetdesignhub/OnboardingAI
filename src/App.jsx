import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/NewDashboard";
import ChatAvatar from "./pages/ChatAvatar";
import Documents from "./pages/Documents";
import "./App.css";
import Header from "./components/Header";
import Training from "./pages/Training";

function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatAvatar" element={<ChatAvatar />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/training" element={<Training />} />

          <Route path="*" element={<Navigate to="/chatAvatar" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
