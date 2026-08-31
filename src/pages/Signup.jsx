import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";

export default function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const res = await registerUser({
                name: name,
                email: email,
                password: password
            });

            console.log("SIGNUP RESPONSE:", res.data);

        } catch (err) {
            console.log("SIGNUP ERROR:", err);
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

                {/* SIGNUP CARD */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

                    <h2 className="text-2xl font-semibold text-white mb-2">
                        Create Account
                    </h2>

                    <p className="text-slate-400 text-sm mb-6">
                        Create your VaultDrive account.
                    </p>

                    <form onSubmit={handleSignup}>

                        {/* NAME */}
                        <div className="mb-5">

                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Name
                            </label>

                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                required
                            />

                        </div>

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
                                placeholder="Create a password"
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                required
                            />

                        </div>

                        {/* SIGNUP BUTTON */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                        >
                            Create Account
                        </button>

                    </form>

                    {/* LOGIN */}
                    <p className="text-center text-sm text-slate-400 mt-6">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Sign In
                        </button>
                    </p>

                </div>

            </div>

        </div>
    );
}