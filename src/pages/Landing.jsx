import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/hero.png";

export default function Landing() {
    const navigate = useNavigate();

    // Read saved theme when the page loads
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("vaultdrive-theme");

        if (savedTheme === "light") return false;
        if (savedTheme === "dark") return true;

        return true;
    });

    // Save theme whenever it changes
    useEffect(() => {
        localStorage.setItem(
            "vaultdrive-theme",
            darkMode ? "dark" : "light"
        );
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode((previous) => !previous);
    };

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${darkMode
                ? "bg-[#070b16] text-[#eef1f8]"
                : "bg-[#f7f8fc] text-[#111827]"
                }`}
        >

            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <header
                className={`border-b transition-colors duration-300 ${darkMode
                    ? "border-white/5"
                    : "border-gray-200"
                    }`}
            >
                <div
                    className="
                        grid
                        h-[99px]
                        w-full
                        grid-cols-[1fr_auto_1fr]
                        items-center
                        px-6
                        lg:px-20
                    "
                >

                    {/* ---------------- BRAND ---------------- */}

                    <button
                        onClick={() => navigate("/")}
                        className="flex w-fit items-center gap-2.5 border-0 bg-transparent p-0"
                    >
                        <span
                            className="
                                grid
                                h-9
                                w-9
                                place-items-center
                                rounded-[11px]
                                bg-gradient-to-br
                                from-[#6559ff]
                                to-[#8a7dff]
                                font-extrabold
                                text-white
                                shadow-[0_8px_22px_rgba(101,89,255,0.28)]
                            "
                        >
                            V
                        </span>

                        <span
                            className={`text-base font-extrabold ${darkMode
                                ? "text-white"
                                : "text-gray-900"
                                }`}
                        >
                            VaultDrive
                        </span>
                    </button>


                    {/* ---------------- CENTER NAV ---------------- */}

                    <nav className="hidden items-center justify-center gap-8 md:flex">

                        <a
                            href="#features"
                            className={`text-sm transition ${darkMode
                                ? "text-[#9ba6bc] hover:text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Features
                        </a>

                        <a
                            href="#security"
                            className={`text-sm transition ${darkMode
                                ? "text-[#9ba6bc] hover:text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Security
                        </a>

                        <a
                            href="#how-it-works"
                            className={`text-sm transition ${darkMode
                                ? "text-[#9ba6bc] hover:text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            How it works
                        </a>

                    </nav>


                    {/* ---------------- RIGHT ACTIONS ---------------- */}

                    <div className="flex justify-self-end gap-2.5">

                        {/* THEME BUTTON */}

                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className={`grid h-10 w-10 place-items-center rounded-[11px] border text-base transition ${darkMode
                                ? "border-[#2b3449] bg-transparent text-[#cbd2e5] hover:bg-[#111827]"
                                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {darkMode ? "☀️" : "🌙"}
                        </button>


                        {/* SIGN IN */}

                        <button
                            onClick={() => navigate("/login")}
                            className={`rounded-[11px] border px-4 py-2.5 font-bold transition ${darkMode
                                ? "border-[#2b3449] bg-transparent text-[#cbd2e5] hover:border-[#3b4760] hover:bg-[#111827]"
                                : "border-gray-200 bg-white text-gray-800 hover:bg-gray-100"
                                }`}
                        >
                            Sign in
                        </button>


                        {/* GET STARTED */}

                        <button
                            onClick={() => navigate("/signup")}
                            className="
                                rounded-[11px]
                                bg-[#6257f6]
                                px-4
                                py-2.5
                                font-bold
                                text-white
                                shadow-[0_10px_24px_rgba(98,87,246,0.22)]
                                transition
                                hover:-translate-y-px
                                hover:bg-[#7167ff]
                            "
                        >
                            Get started
                        </button>

                    </div>

                </div>
            </header>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main>
                {/* =================================================
                    HERO
                ================================================= */}

                <section
                    className="
                        mx-auto
                        grid
                        min-h-[610px]
                        w-full
                        max-w-[1320px]
                        grid-cols-1
                        items-center
                        gap-8
                        px-8
                        py-14
                        sm:px-10
                        lg:grid-cols-[1.05fr_0.95fr]
                        lg:gap-12
                        lg:px-16
                        lg:py-16
                        xl:px-20
                    "
                >

                    {/* HERO TEXT */}
                    <div>
                        <span
                            className="
                                text-[11px]
                                font-extrabold
                                tracking-[0.16em]
                                text-[#8178ff]
                            "
                        >
                            PRIVATE CLOUD STORAGE, REIMAGINED
                        </span>


                        <h1
                            className={`mt-5 max-w-[680px] text-5xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[68px] xl:text-[72px] ${darkMode
                                ? "text-white"
                                : "text-gray-950"
                                }`}
                        >
                            Your files.
                            <br />

                            <span className="text-[#8279ff]">
                                Organized & secure.
                            </span>
                        </h1>


                        <p
                            className={`mt-6 max-w-[610px] text-base leading-8 sm:text-lg ${darkMode
                                ? "text-[#9ba6bc]"
                                : "text-gray-600"
                                }`}
                        >
                            VaultDrive gives you one calm, secure place
                            to store, organize, preview and share
                            everything that matters.
                        </p>


                        {/* HERO BUTTONS */}

                        <div className="mt-7 flex flex-wrap gap-3">

                            <button
                                onClick={() => navigate("/signup")}
                                className="
                                    rounded-[11px]
                                    bg-[#6257f6]
                                    px-5
                                    py-3.5
                                    font-bold
                                    text-white
                                    shadow-[0_10px_24px_rgba(98,87,246,0.22)]
                                    transition
                                    hover:-translate-y-px
                                    hover:bg-[#7167ff]
                                "
                            >
                                Create your free account →
                            </button>


                            <button
                                onClick={() => navigate("/login")}
                                className={`rounded-[11px] border px-5 py-3.5 font-bold transition ${darkMode
                                    ? "border-[#2b3449] bg-transparent text-[#cbd2e5] hover:border-[#3b4760] hover:bg-[#111827]"
                                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                                    }`}
                            >
                                I already have an account
                            </button>

                        </div>


                        {/* HERO POINTS */}

                        <div
                            className={`mt-6 flex flex-wrap gap-5 text-sm ${darkMode
                                ? "text-[#aeb7c9]"
                                : "text-gray-600"
                                }`}
                        >
                            <span>✓ Secure file storage</span>
                            <span>✓ Smart organization</span>
                            <span>✓ Easy sharing</span>
                        </div>

                    </div>


                    {/* HERO PREVIEW */}

                    <div className="relative flex justify-center">

                        <div
                            className={`absolute h-[70%] w-[70%] blur-[90px] ${darkMode
                                ? "bg-[#6559ff] opacity-20"
                                : "bg-[#8b83ff] opacity-10"
                                }`}
                        ></div>


                        <div
                            className={`relative w-full max-w-[410px] overflow-hidden rounded-[18px] border p-2 shadow-[0_28px_70px_rgba(0,0,0,0.20)] transition-colors ${darkMode
                                ? "border-[#2b3449] bg-[#0e1525]"
                                : "border-gray-200 bg-white"
                                }`}
                        >

                            <div className="flex gap-1.5 px-2 py-1.5">

                                <span
                                    className={`h-2 w-2 rounded-full ${darkMode
                                        ? "bg-[#38435a]"
                                        : "bg-gray-300"
                                        }`}
                                ></span>

                                <span
                                    className={`h-2 w-2 rounded-full ${darkMode
                                        ? "bg-[#38435a]"
                                        : "bg-gray-300"
                                        }`}
                                ></span>

                                <span
                                    className={`h-2 w-2 rounded-full ${darkMode
                                        ? "bg-[#38435a]"
                                        : "bg-gray-300"
                                        }`}
                                ></span>

                            </div>


                            <img
                                src={hero}
                                alt="VaultDrive workspace preview"
                                className="block w-full rounded-[11px]"
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    FEATURES
                ================================================= */}

                <section
                    id="features"
                    className={`mx-auto w-[calc(100%-40px)] max-w-[1180px] border-t py-24 ${darkMode
                        ? "border-white/5"
                        : "border-gray-200"
                        }`}
                >

                    <div className="mb-10 max-w-[700px]">

                        <span className="text-[11px] font-extrabold tracking-[0.16em] text-[#8178ff]">
                            FEATURES
                        </span>


                        <h2
                            className={`mt-3 text-4xl font-medium tracking-[-0.035em] sm:text-5xl ${darkMode
                                ? "text-white"
                                : "text-gray-950"
                                }`}
                        >
                            Everything you need,
                            <br />
                            without the clutter.
                        </h2>


                        <p
                            className={`mt-4 text-base leading-7 ${darkMode
                                ? "text-[#8995aa]"
                                : "text-gray-600"
                                }`}
                        >
                            VaultDrive keeps your files organized,
                            accessible and easy to share.
                        </p>

                    </div>


                    <div className="grid gap-5 md:grid-cols-3">

                        <FeatureCard
                            darkMode={darkMode}
                            icon="▣"
                            title="One organized drive"
                            description="Keep your files and folders together in a clean workspace that's easy to navigate."
                        />

                        <FeatureCard
                            darkMode={darkMode}
                            icon="↗"
                            title="Share in seconds"
                            description="Share files with secure links and control who can view or edit them."
                        />

                        <FeatureCard
                            darkMode={darkMode}
                            icon="⌕"
                            title="Find what matters"
                            description="Search your storage and quickly find the files you need."
                        />

                    </div>

                </section>


                {/* =================================================
                    SECURITY
                ================================================= */}

                <section
                    id="security"
                    className={`mx-auto w-[calc(100%-40px)] max-w-[1180px] border-t py-24 ${darkMode
                        ? "border-white/5"
                        : "border-gray-200"
                        }`}
                >

                    <div className="mb-12">

                        <span className="text-[11px] font-extrabold tracking-[0.16em] text-[#8178ff]">
                            SECURITY
                        </span>


                        <h2
                            className={`mt-3 text-4xl font-medium tracking-[-0.04em] sm:text-5xl lg:text-6xl ${darkMode
                                ? "text-white"
                                : "text-gray-950"
                                }`}
                        >
                            Your files stay{" "}

                            <span className="text-[#8279ff]">
                                yours.
                            </span>
                        </h2>


                        <p
                            className={`mt-5 max-w-[760px] text-base leading-8 sm:text-lg ${darkMode
                                ? "text-[#9ba6bc]"
                                : "text-gray-600"
                                }`}
                        >
                            VaultDrive is designed around secure access
                            and controlled file sharing. Your account is
                            protected with authenticated access, while
                            your files remain inside your private storage.
                        </p>

                    </div>


                    {/* SECURITY CARDS */}

                    <div className="grid gap-5 md:grid-cols-3">

                        <SecurityCard
                            darkMode={darkMode}
                            icon="🔐"
                            title="Authenticated access"
                            description="Only signed-in users can access their personal drive."
                        />

                        <SecurityCard
                            darkMode={darkMode}
                            icon="🛡️"
                            title="Controlled sharing"
                            description="Share files while controlling who can access them."
                        />

                        <SecurityCard
                            darkMode={darkMode}
                            icon="☁️"
                            title="Secure storage"
                            description="Files are stored using cloud storage infrastructure."
                        />

                    </div>

                </section>


                {/* =================================================
                    HOW IT WORKS
                ================================================= */}

                <section
                    id="how-it-works"
                    className={`mx-auto w-[calc(100%-40px)] max-w-[1180px] border-t py-24 ${darkMode
                        ? "border-white/5"
                        : "border-gray-200"
                        }`}
                >

                    <div className="mb-12">

                        <span className="text-[11px] font-extrabold tracking-[0.16em] text-[#8179ff]">
                            HOW IT WORKS
                        </span>


                        <h2
                            className={`mt-3 text-4xl font-medium tracking-[-0.04em] sm:text-5xl lg:text-6xl ${darkMode
                                ? "text-white"
                                : "text-gray-950"
                                }`}
                        >
                            Simple from upload
                            <br />
                            to share.
                        </h2>

                    </div>


                    {/* STEPS */}

                    <div className="grid gap-5 md:grid-cols-3">

                        <StepCard
                            darkMode={darkMode}
                            number="01"
                            title="Create your account"
                            description="Sign up for VaultDrive and enter your personal workspace."
                        />

                        <StepCard
                            darkMode={darkMode}
                            number="02"
                            title="Upload your files"
                            description="Drag and drop files into your drive and organize them into folders."
                        />

                        <StepCard
                            darkMode={darkMode}
                            number="03"
                            title="Share when needed"
                            description="Preview your files and share them with the right people using permissions."
                        />

                    </div>

                </section>


                {/* =================================================
                    FINAL CTA
                ================================================= */}

                <section
                    className={`mx-auto mb-24 w-[calc(100%-40px)] max-w-[900px] rounded-3xl border px-6 py-20 text-center shadow-[0_25px_70px_rgba(0,0,0,0.12)] ${darkMode
                        ? "border-[#242e44] bg-[#0c1321]"
                        : "border-gray-200 bg-white"
                        }`}
                >

                    <span className="text-[11px] font-extrabold tracking-[0.16em] text-[#8178ff]">
                        READY WHEN YOU ARE
                    </span>


                    <h2
                        className={`mt-3 text-4xl font-medium tracking-[-0.04em] sm:text-5xl ${darkMode
                            ? "text-white"
                            : "text-gray-950"
                            }`}
                    >
                        Your files deserve
                        <br />
                        a better home.
                    </h2>


                    <p
                        className={`mx-auto mt-4 max-w-[550px] ${darkMode
                            ? "text-[#8995aa]"
                            : "text-gray-600"
                            }`}
                    >
                        Start organizing your digital life with VaultDrive.
                    </p>


                    <button
                        onClick={() => navigate("/signup")}
                        className="
                            mt-7
                            rounded-[11px]
                            bg-[#6257f6]
                            px-5
                            py-3.5
                            font-bold
                            text-white
                            shadow-[0_10px_24px_rgba(98,87,246,0.22)]
                            transition
                            hover:-translate-y-px
                            hover:bg-[#7167ff]
                        "
                    >
                        Get started with VaultDrive →
                    </button>

                </section>

            </main>

            <footer
                className={`border-t transition-colors duration-300 ${darkMode
                        ? "border-white/5 bg-[#070b16]"
                        : "border-gray-200 bg-[#f7f8fc]"
                    }`}
            >
                <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-6 py-6 lg:px-15">

                    {/* VaultDrive */}
                    <div className="flex items-center gap-2 ">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#6c5ce7] text-sm font-bold text-white">
                            V
                        </div>

                        <span
                            className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            VaultDrive
                        </span>
                    </div>

                    {/* Owner / Developer */}
                    <p
                        className={`text-xs sm:text-sm ${darkMode ? "text-[#78859b]" : "text-gray-500"
                            }`}
                    >
                        Built & designed by{" "}
                        <span
                            className={`font-medium ${darkMode ? "text-[#aeb8c9]" : "text-gray-700"
                                }`}
                        >
                            Ishita Verma
                        </span>
                    </p>

                    {/* Copyright */}
                    <p
                        className={`hidden text-xs sm:block ${darkMode ? "text-[#667187]" : "text-gray-400"
                            }`}
                    >
                        © {new Date().getFullYear()} VaultDrive
                    </p>
                </div>
            </footer>



        </div>
    );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
    darkMode,
    icon,
    title,
    description,
}) {
    return (
        <article
            className={`rounded-[18px] border p-7 transition hover:-translate-y-1 ${darkMode
                ? "border-[#1f2a3e] bg-[#0d1423] hover:border-[#394461]"
                : "border-gray-200 bg-white hover:border-gray-300"
                }`}
        >

            <div
                className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${darkMode
                    ? "bg-[#191c4a] text-[#8b83ff]"
                    : "bg-[#eeecff] text-[#6257f6]"
                    }`}
            >
                {icon}
            </div>


            <h3
                className={`mt-5 text-lg font-bold ${darkMode
                    ? "text-white"
                    : "text-gray-900"
                    }`}
            >
                {title}
            </h3>


            <p
                className={`mt-2 text-sm leading-6 ${darkMode
                    ? "text-[#8995aa]"
                    : "text-gray-600"
                    }`}
            >
                {description}
            </p>

        </article>
    );
}


/* =========================================================
   SECURITY CARD
========================================================= */

function SecurityCard({
    darkMode,
    icon,
    title,
    description,
}) {
    return (
        <article
            className={`rounded-[18px] border p-7 transition hover:-translate-y-1 ${darkMode
                ? "border-[#1f2a3e] bg-[#0c1321] hover:border-[#394461]"
                : "border-gray-200 bg-white hover:border-gray-300"
                }`}
        >

            <div className="mb-6 text-2xl">
                {icon}
            </div>


            <h3
                className={`text-lg font-bold ${darkMode
                    ? "text-white"
                    : "text-gray-900"
                    }`}
            >
                {title}
            </h3>


            <p
                className={`mt-3 text-sm leading-6 ${darkMode
                    ? "text-[#8995aa]"
                    : "text-gray-600"
                    }`}
            >
                {description}
            </p>

        </article>
    );
}


/* =========================================================
   STEP CARD
========================================================= */

function StepCard({
    darkMode,
    number,
    title,
    description,
}) {
    return (
        <article
            className={`rounded-[18px] border p-7 transition hover:-translate-y-1 ${darkMode
                ? "border-[#1f2a3e] bg-[#0c1321] hover:border-[#394461]"
                : "border-gray-200 bg-white hover:border-gray-300"
                }`}
        >

            <span className="text-sm font-extrabold tracking-[0.12em] text-[#8178ff]">
                {number}
            </span>


            <h3
                className={`mt-7 text-lg font-bold ${darkMode
                    ? "text-white"
                    : "text-gray-900"
                    }`}
            >
                {title}
            </h3>


            <p
                className={`mt-3 text-sm leading-6 ${darkMode
                    ? "text-[#8995aa]"
                    : "text-gray-600"
                    }`}
            >
                {description}
            </p>

        </article>
    );
}