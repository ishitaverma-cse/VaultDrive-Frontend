import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";

export default function App() {
    return (
        <BrowserRouter>

            <Routes>
                {/* Public landing page */}
                <Route path="/" element={<Landing />} />

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>

        </BrowserRouter>
    );
}