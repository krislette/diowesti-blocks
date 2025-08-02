import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LogIn from "./pages/LogIn";
import Register from "./pages/Register";

import Main from "./layout/Main";
import Dashboard from "./pages/Dashboard";
import Audit from "./pages/Audit";
import Library from "./pages/Library";
import Help from "./pages/Help";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login route and register */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />

        {/* Main app routes */}
        <Route path="/" element={<Main />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="audit" element={<Audit />} />
          <Route path="library" element={<Library />} />
          <Route path="help" element={<Help />} />
        </Route>

        {/* Then catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
