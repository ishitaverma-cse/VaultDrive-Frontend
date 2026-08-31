import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await loginUser({
                email: email,
                password: password
            });

            console.log("LOGIN RESPONSE:", res.data);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/dashboard");

        } catch (err) {
            console.log("LOGIN ERROR:", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* LOGO */}
                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4">
                        <span className="text-2xl">🔐</span>
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        VaultDrive
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Secure. Simple. Yours.
                    </p>

                </div>

                {/* LOGIN CARD */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

                    <h2 className="text-2xl font-semibold text-white mb-2">
                        Welcome Back
                    </h2>

                    <p className="text-slate-400 text-sm mb-6">
                        Sign in to access your files.
                    </p>

                    <form onSubmit={handleLogin}>

                        {/* EMAIL */}
                        <div className="mb-5">

                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                required
                            />

                        </div>

                        {/* PASSWORD */}
                        <div className="mb-6">

                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                required
                            />

                        </div>

                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                        >
                            Sign In
                        </button>

                    </form>

                    {/* SIGNUP */}
                    <p className="text-center text-sm text-slate-400 mt-6">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Create Account
                        </button>
                    </p>

                </div>

            </div>

        </div>
    );
}