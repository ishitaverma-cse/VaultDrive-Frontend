import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";

export default function Signup() {
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
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

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

        if (!form.name.trim()) {
            newErrors.name = "Name is required.";
        } else if (form.name.trim().length < 2) {
            newErrors.name =
                "Name must contain at least 2 characters.";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
        ) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!form.password) {
            newErrors.password = "Password is required.";
        } else if (form.password.length < 6) {
            newErrors.password =
                "Password must contain at least 6 characters.";
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword =
                "Please confirm your password.";
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword =
                "Passwords do not match.";
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
            const response = await registerUser({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
            });

            if (response.data.token) {
                localStorage.setItem(
                    "token",
                    response.data.token
                );

                if (response.data.user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(response.data.user)
                    );
                }

                navigate("/dashboard");
            } else {
                navigate("/login");
            }
        } catch (error) {
            setServerError(
                error.response?.data?.message ||
                    "Unable to create your account. Please try again."
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
                        className={`relative hidden min-h-[720px] overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between ${
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
                        <div className="relative z-10 max-w-[440px]">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6c5ce7]">
                                Create your space
                            </p>

                            <h1
                                className={`mt-5 text-5xl font-medium leading-[1.05] tracking-[-0.04em] ${
                                    darkMode
                                        ? "text-white"
                                        : "text-gray-900"
                                }`}
                            >
                                Everything you need
                                <br />
                                for your files.
                            </h1>

                            <p
                                className={`mt-6 max-w-[400px] text-base leading-7 ${
                                    darkMode
                                        ? "text-[#8d99ae]"
                                        : "text-gray-500"
                                }`}
                            >
                                Store, organize and share your files
                                from one simple, secure workspace.
                            </p>

                            {/* FEATURES — informational list, NOT cards */}
                            <div className="mt-10 max-w-md">
                                <div className="flex items-start gap-4 py-4">
                                    <span
                                        className={`mt-0.5 text-lg ${
                                            darkMode
                                                ? "text-[#8f84ff]"
                                                : "text-[#6c5ce7]"
                                        }`}
                                    >
                                        ✓
                                    </span>

                                    <div>
                                        <h3
                                            className={`text-sm font-semibold ${
                                                darkMode
                                                    ? "text-white"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            Secure storage
                                        </h3>

                                        <p
                                            className={`mt-1 text-sm leading-6 ${
                                                darkMode
                                                    ? "text-[#7f8ba1]"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            Keep your files protected.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`h-px ${
                                        darkMode
                                            ? "bg-white/5"
                                            : "bg-gray-200"
                                    }`}
                                />

                                <div className="flex items-start gap-4 py-4">
                                    <span
                                        className={`mt-0.5 text-lg ${
                                            darkMode
                                                ? "text-[#8f84ff]"
                                                : "text-[#6c5ce7]"
                                        }`}
                                    >
                                        ☁
                                    </span>

                                    <div>
                                        <h3
                                            className={`text-sm font-semibold ${
                                                darkMode
                                                    ? "text-white"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            Easy organization
                                        </h3>

                                        <p
                                            className={`mt-1 text-sm leading-6 ${
                                                darkMode
                                                    ? "text-[#7f8ba1]"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            Manage files and folders with ease.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`h-px ${
                                        darkMode
                                            ? "bg-white/5"
                                            : "bg-gray-200"
                                    }`}
                                />

                                <div className="flex items-start gap-4 py-4">
                                    <span
                                        className={`mt-0.5 text-lg ${
                                            darkMode
                                                ? "text-[#8f84ff]"
                                                : "text-[#6c5ce7]"
                                        }`}
                                    >
                                        ↗
                                    </span>

                                    <div>
                                        <h3
                                            className={`text-sm font-semibold ${
                                                darkMode
                                                    ? "text-white"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            Simple sharing
                                        </h3>

                                        <p
                                            className={`mt-1 text-sm leading-6 ${
                                                darkMode
                                                    ? "text-[#7f8ba1]"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            Share files with controlled access.
                                        </p>
                                    </div>
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
                            Your files. Your space. Your control.
                        </p>
                    </div>

                    {/* RIGHT PANEL */}
                    <div
                        className={`flex min-h-[720px] items-center justify-center p-7 sm:p-10 lg:p-12 ${
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
                                    Create account
                                </h2>

                                <p
                                    className={`mt-2 text-sm leading-6 ${
                                        darkMode
                                            ? "text-[#7f8ba1]"
                                            : "text-gray-500"
                                    }`}
                                >
                                    Get started with your VaultDrive
                                    workspace.
                                </p>
                            </div>

                            {serverError && (
                                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                                    {serverError}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                {/* NAME */}
                                <div>
                                    <label
                                        className={`mb-2 block text-sm font-medium ${
                                            darkMode
                                                ? "text-[#d9deea]"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        Full name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        autoComplete="name"
                                        className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition ${
                                            darkMode
                                                ? "bg-[#080e1a] text-white placeholder:text-[#536075]"
                                                : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                                        } ${
                                            errors.name
                                                ? "border-red-500/60"
                                                : darkMode
                                                ? "border-[#263149] focus:border-[#6c5ce7]"
                                                : "border-gray-200 focus:border-[#6c5ce7]"
                                        }`}
                                    />

                                    {errors.name && (
                                        <p className="mt-1.5 text-xs text-red-400">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

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
                                            placeholder="Create a password"
                                            autoComplete="new-password"
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

                                {/* CONFIRM PASSWORD */}
                                <div>
                                    <label
                                        className={`mb-2 block text-sm font-medium ${
                                            darkMode
                                                ? "text-[#d9deea]"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        Confirm password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Repeat your password"
                                            autoComplete="new-password"
                                            className={`w-full rounded-xl border px-4 py-3.5 pr-14 text-sm outline-none transition ${
                                                darkMode
                                                    ? "bg-[#080e1a] text-white placeholder:text-[#536075]"
                                                    : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                                            } ${
                                                errors.confirmPassword
                                                    ? "border-red-500/60"
                                                    : darkMode
                                                    ? "border-[#263149] focus:border-[#6c5ce7]"
                                                    : "border-gray-200 focus:border-[#6c5ce7]"
                                            }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (prev) => !prev
                                                )
                                            }
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs transition ${
                                                darkMode
                                                    ? "text-[#77849a] hover:text-white"
                                                    : "text-gray-400 hover:text-gray-700"
                                            }`}
                                        >
                                            {showConfirmPassword
                                                ? "Hide"
                                                : "Show"}
                                        </button>
                                    </div>

                                    {errors.confirmPassword && (
                                        <p className="mt-1.5 text-xs text-red-400">
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 w-full rounded-xl bg-[#6257f6] py-3.5 text-sm font-semibold text-white transition hover:bg-[#7167ff] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Creating account..."
                                        : "Create account"}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="my-6 flex items-center gap-3">
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
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-medium text-[#6c5ce7] hover:text-[#584bd6]"
                                >
                                    Sign in
                                </Link>
                            </p>

                            <p
                                className={`mt-5 text-center text-xs leading-5 ${
                                    darkMode
                                        ? "text-[#59657a]"
                                        : "text-gray-400"
                                }`}
                            >
                                By creating an account, you agree to use
                                VaultDrive responsibly and securely.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}