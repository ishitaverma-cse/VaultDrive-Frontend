import { useEffect, useState } from "react";
import { getFiles, getFolders, createFolder, updateFile, uploadFile, searchFiles, deleteFile, renameFile } from "../services/DriveService";

export default function Dashboard() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("vaultdrive-theme") === "dark";
    });

    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        localStorage.setItem(
            "vaultdrive-theme",
            darkMode ? "dark" : "light"
        );
    }, [darkMode]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                const [foldersResponse, filesResponse] = await Promise.all([
                    getFolders(),
                    getFiles()
                ]);

                console.log("FOLDERS:", foldersResponse.data);
                console.log("FILES:", filesResponse.data);

                console.log(
                    "FILE DETAILS:",
                    filesResponse.data.files.map(file => ({
                        id: file.id,
                        name: file.name,
                        folder_id: file.folder_id,
                        folder_id_type: typeof file.folder_id
                    }))
                );

                console.log(
                    "FOLDER DETAILS:",
                    foldersResponse.data.folders.map(folder => ({
                        id: folder.id,
                        name: folder.name,
                        parent_folder_id: folder.parent_folder_id,
                        parent_type: typeof folder.parent_folder_id
                    }))
                );

                setFolders(foldersResponse.data.folders || []);
                setFiles(filesResponse.data.files || []);
            } catch (err) {
                console.error("DASHBOARD DATA ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load your files and folders"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const visibleFolders = folders.filter((folder) => {
        if (currentFolderId === null) {
            return folder.parent_folder_id === null;
        }

        return Number(folder.parent_folder_id) === Number(currentFolderId);
    });

    const visibleFiles = files.filter((file) => {
        if (currentFolderId === null) {
            return file.folder_id === null;
        }

        return Number(file.folder_id) === Number(currentFolderId);
    });

    const displayedFiles =
        searchResults !== null
            ? searchResults
            : visibleFiles;

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 KB";

        if (bytes < 1024 * 1024) {
            return `${Math.round(bytes / 1024)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (date) => {
        if (!date) return "Recently modified";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const handleOpenFolder = (folderId) => {
        setCurrentFolderId(folderId);
    };

    const handleCreateFolder = async () => {
        const folderName = window.prompt("Enter folder name:");

        if (!folderName || folderName.trim() === "") {
            return;
        }

        try {
            await createFolder({
                name: folderName.trim()
            });

            const response = await getFolders();

            setFolders(response.data.folders || []);

        } catch (err) {
            console.error("CREATE FOLDER ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to create folder"
            );
        }
    };

    const handleMoveFile = async (fileId) => {
        if (folders.length === 0) {
            alert("No folders available.");
            return;
        }

        const folderList = folders
            .map((folder, index) => `${index + 1}. ${folder.name}`)
            .join("\n");

        const choice = window.prompt(
            `Enter the number of the folder:\n\n${folderList}`
        );

        if (!choice) {
            return;
        }

        const folderIndex = parseInt(choice) - 1;

        if (
            isNaN(folderIndex) ||
            folderIndex < 0 ||
            folderIndex >= folders.length
        ) {
            alert("Invalid folder selection.");
            return;
        }

        const selectedFolder = folders[folderIndex];

        try {
            await updateFile(fileId, {
                folder_id: selectedFolder.id
            });

            // Refresh files after moving
            const response = await getFiles();

            setFiles(response.data.files || []);

            alert(`File moved to "${selectedFolder.name}" successfully.`);
        } catch (err) {
            console.error("MOVE FILE ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to move file"
            );
        }
    };

    const handleUploadFile = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        try {
            await uploadFile(file);

            const response = await getFiles();

            setFiles(response.data.files || []);

            alert("File uploaded successfully.");
        } catch (err) {
            console.error("UPLOAD FILE ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to upload file"
            );
        }

        event.target.value = "";
    };

    const handleSearch = async (event) => {
        const value = event.target.value;

        setSearchQuery(value);

        if (value.trim() === "") {
            setSearchResults(null);
            return;
        }

        try {
            const response = await searchFiles(value);

            setSearchResults(response.data.files || []);
        } catch (err) {
            console.error("SEARCH ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to search files"
            );
        }
    };

    const handleRenameFile = async (fileId, currentName) => {
        const newName = window.prompt("Enter new file name:", currentName);

        if (!newName || newName.trim() === "") {
            return;
        }

        try {
            await renameFile(fileId, newName.trim());

            const response = await getFiles();
            setFiles(response.data.files || []);

            alert("File renamed successfully.");
        } catch (err) {
            console.error("RENAME FILE ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to rename file"
            );
        }
    };

    const handleDeleteFile = async (fileId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to move this file to trash?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteFile(fileId);

            const response = await getFiles();
            setFiles(response.data.files || []);

            alert("File moved to trash successfully.");
        } catch (err) {
            console.error("DELETE FILE ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to delete file"
            );
        }
    };

    return (
        <div
            className={
                darkMode
                    ? "min-h-screen bg-slate-950 text-white transition-colors duration-300"
                    : "min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300"
            }
        >

            {/* ================= TOP NAVBAR ================= */}
            <header
                className={
                    darkMode
                        ? "h-[70px] flex items-center gap-8 px-7 bg-slate-900 border-b border-slate-700"
                        : "h-[70px] flex items-center gap-8 px-7 bg-white border-b border-slate-200"
                }
            >

                {/* Logo */}

                <div className="min-w-[180px] text-2xl font-bold">
                    🔐 VaultDrive
                </div>


                {/* Search */}

                <div
                    className={
                        darkMode
                            ? "flex-1 max-w-[600px] h-11 flex items-center gap-3 px-4 rounded-xl bg-slate-700"
                            : "flex-1 max-w-[600px] h-11 flex items-center gap-3 px-4 rounded-xl bg-slate-100"
                    }
                >

                    <span>🔍</span>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search files and folders..."
                        className={
                            darkMode
                                ? "w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-300"
                                : "w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-500"
                        }
                    />

                </div>


                {/* Right Side */}

                <div className="ml-auto flex items-center gap-5">

                    {/* Theme Toggle */}

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={
                            darkMode
                                ? "w-10 h-10 rounded-full border border-slate-600 bg-slate-800 flex items-center justify-center text-lg hover:bg-slate-700 transition"
                                : "w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-lg hover:bg-slate-100 transition"
                        }
                        title={
                            darkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                    >
                        {darkMode ? "☀️" : "🌙"}
                    </button>


                    {/* Profile */}

                    <div className="flex items-center gap-2.5">

                        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>

                        <span className="text-sm font-semibold">
                            {user.name || "User"}
                        </span>

                    </div>

                </div>

            </header>


            {/* ================= DASHBOARD BODY ================= */}

            <div className="flex min-h-[calc(100vh-70px)]">


                {/* ================= SIDEBAR ================= */}
                <aside
                    className={
                        darkMode
                            ? "w-[230px] shrink-0 p-6 bg-slate-900 border-r border-slate-700"
                            : "w-[230px] shrink-0 p-6 bg-white border-r border-slate-200"
                    }
                >

                    {/* New Button */}
                    <div className="flex flex-col gap-3 mb-8">

                        <button
                            onClick={handleCreateFolder}
                            className="w-full py-3 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
                        >
                            ＋ New Folder
                        </button>

                        <label
                            className="w-full py-3 px-5 rounded-xl border border-indigo-500 text-indigo-500 hover:bg-indigo-50 font-semibold text-center cursor-pointer transition"
                        >
                            ⬆ Upload File

                            <input
                                type="file"
                                className="hidden"
                                onChange={handleUploadFile}
                            />
                        </label>

                    </div>


                    {/* Navigation */}
                    <nav className="flex flex-col gap-2">

                        {/* Home */}
                        <div
                            className={
                                darkMode
                                    ? "flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-900 text-indigo-300 font-semibold cursor-pointer"
                                    : "flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-100 text-indigo-600 font-semibold cursor-pointer"
                            }
                        >
                            🏠
                            <span>Home</span>
                        </div>


                        {/* My Drive */}
                        <div
                            className={
                                darkMode
                                    ? "flex items-center gap-3 px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-800 cursor-pointer transition"
                                    : "flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer transition"
                            }
                        >
                            📁
                            <span>My Drive</span>
                        </div>


                        {/* Trash */}
                        <div
                            className={
                                darkMode
                                    ? "flex items-center gap-3 px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-800 cursor-pointer transition"
                                    : "flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer transition"
                            }
                        >
                            🗑️
                            <span>Trash</span>
                        </div>

                    </nav>

                </aside>


                {/* ================= MAIN CONTENT ================= */}
                <main className="flex-1 overflow-y-auto px-12 py-9">


                    {/* Page Header */}
                    <div className="mb-7">

                        <h1 className="text-3xl font-bold">
                            My Drive
                        </h1>

                        <p
                            className={
                                darkMode
                                    ? "mt-2 text-sm text-slate-400"
                                    : "mt-2 text-sm text-slate-500"
                            }
                        >
                            Your files and folders
                        </p>

                    </div>


                    {/* ================= BREADCRUMB ================= */}
                    <div
                        className={
                            darkMode
                                ? "mb-8 px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm"
                                : "mb-8 px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm shadow-sm"
                        }
                    >

                        <button
                            onClick={() => setCurrentFolderId(null)}
                            className="font-semibold text-indigo-500 hover:text-indigo-400 transition"
                        >
                            🏠 My Drive
                        </button>

                        {currentFolderId !== null && (
                            <>
                                <span className="mx-2 text-slate-400">/</span>

                                <span className="font-semibold">
                                    📁{" "}
                                    {folders.find(
                                        (folder) => folder.id === currentFolderId
                                    )?.name}
                                </span>
                            </>
                        )}

                    </div>


                    {/* ================= ERROR ================= */}
                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-lg bg-red-100 text-red-700 border border-red-200">
                            {error}
                        </div>
                    )}


                    {/* ================= LOADING ================= */}
                    {loading ? (
                        <div
                            className={
                                darkMode
                                    ? "py-16 text-center text-slate-400"
                                    : "py-16 text-center text-slate-500"
                            }
                        >
                            Loading your files and folders...
                        </div>
                    ) : (
                        <>


                            {/* ================= FOLDERS ================= */}
                            <section className="mb-9">

                                <h2 className="mb-4 text-lg font-semibold">
                                    Folders
                                </h2>


                                {visibleFolders.length === 0 ? (
                                    <div
                                        className={
                                            darkMode
                                                ? "py-8 text-sm text-slate-400"
                                                : "py-8 text-sm text-slate-500"
                                        }
                                    >
                                        No folders found.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">

                                        {visibleFolders.map((folder) => (
                                            <div
                                                key={folder.id}
                                                onClick={() => handleOpenFolder(folder.id)}
                                                className={
                                                    darkMode
                                                        ? "p-5 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 cursor-pointer hover:border-indigo-500 hover:-translate-y-0.5 transition"
                                                        : "p-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-indigo-500 hover:-translate-y-0.5 shadow-sm transition"
                                                }
                                            >

                                                <span className="text-3xl">
                                                    📁
                                                </span>

                                                <span className="text-sm font-semibold">
                                                    {folder.name}
                                                </span>

                                            </div>
                                        ))}

                                    </div>
                                )}

                            </section>


                            {/* ================= FILES ================= */}
                            <section>

                                <h2 className="mb-4 text-lg font-semibold">
                                    Files
                                </h2>


                                {displayedFiles.length === 0 ? (
                                    <div
                                        className={
                                            darkMode
                                                ? "py-8 text-sm text-slate-400"
                                                : "py-8 text-sm text-slate-500"
                                        }
                                    >
                                        No files found.
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            darkMode
                                                ? "overflow-hidden rounded-xl border border-slate-700 bg-slate-800"
                                                : "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                                        }
                                    >

                                        {displayedFiles.map((file, index) => (
                                            <div
                                                key={file.id}
                                                className={
                                                    darkMode
                                                        ? `min-h-[70px] px-5 py-3 flex items-center ${index !== displayedFiles.length - 1
                                                            ? "border-b border-slate-700"
                                                            : ""
                                                        } hover:bg-slate-700 transition`
                                                        : `min-h-[70px] px-5 py-3 flex items-center ${index !== displayedFiles.length - 1
                                                            ? "border-b border-slate-200"
                                                            : ""
                                                        } hover:bg-slate-50 transition`
                                                }
                                            >

                                                {/* File Info */}
                                                <div className="flex-1 flex items-center gap-4">

                                                    <span className="text-3xl">
                                                        📄
                                                    </span>

                                                    <div>

                                                        <div className="mb-1 text-sm font-semibold">
                                                            {file.name}
                                                        </div>

                                                        <div
                                                            className={
                                                                darkMode
                                                                    ? "text-xs text-slate-400"
                                                                    : "text-xs text-slate-500"
                                                            }
                                                        >
                                                            {file.mime_type || "File"} •{" "}
                                                            {formatFileSize(file.size)}
                                                        </div>

                                                    </div>

                                                </div>


                                                {/* Date */}
                                                <div
                                                    className={
                                                        darkMode
                                                            ? "mr-6 text-sm text-slate-400"
                                                            : "mr-6 text-sm text-slate-500"
                                                    }
                                                >
                                                    {formatDate(file.updated_at || file.created_at)}
                                                </div>


                                                {/* Menu */}
                                                <div className="flex items-center gap-2">

                                                    <button
                                                        onClick={() => handleRenameFile(file.id, file.name)}
                                                        className={
                                                            darkMode
                                                                ? "px-3 py-1.5 text-xs rounded-lg border border-slate-600 hover:bg-slate-700 transition"
                                                                : "px-3 py-1.5 text-xs rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                                                        }
                                                    >
                                                        Rename
                                                    </button>

                                                    <button
                                                        onClick={() => handleMoveFile(file.id)}
                                                        className={
                                                            darkMode
                                                                ? "px-3 py-1.5 text-xs rounded-lg border border-slate-600 hover:bg-slate-700 transition"
                                                                : "px-3 py-1.5 text-xs rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                                                        }
                                                    >
                                                        Move
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteFile(file.id)}
                                                        className="px-3 py-1.5 text-xs rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>

                                        ))}

                                    </div>
                                )}

                            </section>

                        </>
                    )}

                </main>

            </div>

        </div>
    );
}