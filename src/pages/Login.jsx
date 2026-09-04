import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";

export default function Login() {
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("vaultdrive-theme");
        return savedTheme !== "light";
    });

    useEffect(() => {
        const handleStorage = () => {
            const savedTheme = localStorage.getItem("vaultdrive-theme");
            setDarkMode(savedTheme !== "light");
        };

        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setServerError("");
    };

    const validate = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
        ) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!form.password) {
            newErrors.password = "Password is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        setServerError("");

        try {
            const response = await loginUser({
                email: form.email.trim(),
                password: form.password,
            });

            localStorage.setItem("token", response.data.token);

            if (response.data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
            }

            navigate("/dashboard");
        } catch (error) {
            setServerError(
                error.response?.data?.message ||
                    "Unable to sign in. Please check your email and password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 lg:px-8 ${
                darkMode
                    ? "bg-[#070b16] text-white"
                    : "bg-[#f7f8fc] text-gray-900"
            }`}
        >
            <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[1180px] items-center">
                <div
                    className={`grid w-full overflow-hidden rounded-3xl border shadow-[0_25px_80px_rgba(0,0,0,0.12)] lg:grid-cols-2 ${
                        darkMode
                            ? "border-[#202a3d] bg-[#0c1321]"
                            : "border-gray-200 bg-white"
                    }`}
                >
                    {/* LEFT PANEL */}
                    <div
                        className={`relative hidden min-h-[680px] overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between ${
                            darkMode
                                ? "bg-gradient-to-br from-[#11182a] via-[#0c1321] to-[#090e19]"
                                : "bg-gradient-to-br from-white via-[#f8f8fc] to-[#f1efff]"
                        }`}
                    >
                        {/* Brand */}
                        <div>
                            <Link
                                to="/"
                                className="flex items-center gap-3"
                            >
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#6c5ce7] text-xl font-bold text-white">
                                    V
                                </div>

                                <span
                                    className={`text-lg font-semibold ${
                                        darkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                    }`}
                                >
                                    VaultDrive
                                </span>
                            </Link>
                        </div>

                        {/* Main message */}
                        <div className="relative z-10 max-w-[430px]">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6c5ce7]">
                                Welcome back
                            </p>

                            <h1
                                className={`mt-5 text-5xl font-medium leading-[1.05] tracking-[-0.04em] ${
                                    darkMode
                                        ? "text-white"
                                        : "text-gray-900"
                                }`}
                            >
                                Your files are
                                <br />
                                waiting for you.
                            </h1>

                            <p
                                className={`mt-6 max-w-[390px] text-base leading-7 ${
                                    darkMode
                                        ? "text-[#8d99ae]"
                                        : "text-gray-500"
                                }`}
                            >
                                Sign in to access your files, folders and
                                everything you've organized in VaultDrive.
                            </p>

                            {/* Informational feature */}
                            <div className="mt-10 flex max-w-[390px] items-start gap-4">
                                <div
                                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg ${
                                        darkMode
                                            ? "bg-[#6c5ce7]/10"
                                            : "bg-[#6c5ce7]/10"
                                    }`}
                                >
                                    🔒
                                </div>

                                <div>
                                    <p
                                        className={`text-sm font-medium ${
                                            darkMode
                                                ? "text-[#e5e9f1]"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        Private by design
                                    </p>

                                    <p
                                        className={`mt-1 text-sm leading-6 ${
                                            darkMode
                                                ? "text-[#748198]"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        Your files stay protected behind
                                        authenticated access.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p
                            className={`text-xs ${
                                darkMode
                                    ? "text-[#566177]"
                                    : "text-gray-400"
                            }`}
                        >
                            Secure storage. Simple sharing.
                        </p>
                    </div>

                    {/* RIGHT PANEL */}
                    <div
                        className={`flex min-h-[680px] items-center justify-center p-7 sm:p-10 lg:p-12 ${
                            darkMode
                                ? "bg-[#0c1321]"
                                : "bg-white"
                        }`}
                    >
                        <div className="w-full max-w-[400px]">
                            {/* Mobile brand */}
                            <div className="mb-10 lg:hidden">
                                <Link
                                    to="/"
                                    className="flex items-center gap-3"
                                >
                                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#6c5ce7] font-bold text-white">
                                        V
                                    </div>

                                    <span
                                        className={`font-semibold ${
                                            darkMode
                                                ? "text-white"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        VaultDrive
                                    </span>
                                </Link>
                            </div>

                            <div className="mb-8">
                                <h2
                                    className={`text-3xl font-semibold tracking-tight ${
                                        darkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                    }`}
                                >
                                    Sign in
                                </h2>

                                <p
                                    className={`mt-2 text-sm leading-6 ${
                                        darkMode
                                            ? "text-[#7f8ba1]"
                                            : "text-gray-500"
                                    }`}
                                >
                                    Access your VaultDrive account.
                                </p>
                            </div>

                            {/* Server error */}
                            {serverError && (
                                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                                    {serverError}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {/* EMAIL */}
                                <div>
                                    <label
                                        className={`mb-2 block text-sm font-medium ${
                                            darkMode
                                                ? "text-[#d9deea]"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        Email address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition ${
                                            darkMode
                                                ? "bg-[#080e1a] text-white placeholder:text-[#536075]"
                                                : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                                        } ${
                                            errors.email
                                                ? "border-red-500/60"
                                                : darkMode
                                                ? "border-[#263149] focus:border-[#6c5ce7]"
                                                : "border-gray-200 focus:border-[#6c5ce7]"
                                        }`}
                                    />

                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-red-400">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <label
                                        className={`mb-2 block text-sm font-medium ${
                                            darkMode
                                                ? "text-[#d9deea]"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            className={`w-full rounded-xl border px-4 py-3.5 pr-14 text-sm outline-none transition ${
                                                darkMode
                                                    ? "bg-[#080e1a] text-white placeholder:text-[#536075]"
                                                    : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                                            } ${
                                                errors.password
                                                    ? "border-red-500/60"
                                                    : darkMode
                                                    ? "border-[#263149] focus:border-[#6c5ce7]"
                                                    : "border-gray-200 focus:border-[#6c5ce7]"
                                            }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (prev) => !prev
                                                )
                                            }
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs transition ${
                                                darkMode
                                                    ? "text-[#77849a] hover:text-white"
                                                    : "text-gray-400 hover:text-gray-700"
                                            }`}
                                        >
                                            {showPassword
                                                ? "Hide"
                                                : "Show"}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <p className="mt-1.5 text-xs text-red-400">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* SIGN IN */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-[#6257f6] py-3.5 text-sm font-semibold text-white transition hover:bg-[#7167ff] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Signing in..."
                                        : "Sign in"}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="my-7 flex items-center gap-3">
                                <div
                                    className={`h-px flex-1 ${
                                        darkMode
                                            ? "bg-[#202a3d]"
                                            : "bg-gray-200"
                                    }`}
                                />

                                <span
                                    className={`text-xs ${
                                        darkMode
                                            ? "text-[#5f6b80]"
                                            : "text-gray-400"
                                    }`}
                                >
                                    OR
                                </span>

                                <div
                                    className={`h-px flex-1 ${
                                        darkMode
                                            ? "bg-[#202a3d]"
                                            : "bg-gray-200"
                                    }`}
                                />
                            </div>

                            {/* Google */}
                            <button
                                type="button"
                                className={`flex w-full items-center justify-center gap-3 rounded-xl border py-3.5 text-sm font-medium transition ${
                                    darkMode
                                        ? "border-[#263149] bg-[#080e1a] text-[#dce2ed] hover:border-[#394661] hover:bg-[#0b1220]"
                                        : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <span className="font-bold">G</span>
                                Continue with Google
                            </button>

                            <p
                                className={`mt-7 text-center text-sm ${
                                    darkMode
                                        ? "text-[#77849a]"
                                        : "text-gray-500"
                                }`}
                            >
                                Don't have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="font-medium text-[#6c5ce7] hover:text-[#584bd6]"
                                >
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}