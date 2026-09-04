import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createFolder,
    createShareLink,
    deleteFile,
    getFiles,
    getFolders,
    getSignedUrl,
    getTrash,
    renameFile,
    // renameFolder,
    restoreTrash,
    searchFiles,
    setFilePermission,
    updateFile,
    uploadFile,
} from "../services/DriveService";

/* =========================================================
   HELPERS
========================================================= */

const formatSize = (bytes = 0) => {
    const size = Number(bytes);

    if (!size) return "0 KB";

    if (size < 1024 * 1024) {
        return `${Math.max(1, Math.round(size / 1024))} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (value) => {
    if (!value) return "Recently";

    return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getFileType = (file) => {
    const mime = file?.mime_type || "";
    const name = file?.name || "";

    const extension = name.split(".").pop()?.toLowerCase();

    if (mime.startsWith("image/")) return "IMAGE";
    if (mime === "application/pdf" || extension === "pdf") return "PDF";

    if (["doc", "docx"].includes(extension)) {
        return "DOC";
    }

    if (["xls", "xlsx", "csv"].includes(extension)) {
        return "XLS";
    }

    if (["ppt", "pptx"].includes(extension)) {
        return "PPT";
    }

    if (["txt", "md", "json"].includes(extension)) {
        return "TXT";
    }

    if (["zip", "rar", "7z"].includes(extension)) {
        return "ZIP";
    }

    return "FILE";
};

const iconFor = (file) => {
    const mime = (file?.mime_type || "").toLowerCase();
    const name = (file?.name || file?.original_name || "").toLowerCase();

    if (mime.includes("pdf") || name.endsWith(".pdf")) {
        return "📄";
    }

    if (
        mime.includes("text") ||
        name.endsWith(".txt")
    ) {
        return "📝";
    }

    if (
        mime.includes("word") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx")
    ) {
        return "📘";
    }

    if (
        mime.includes("spreadsheet") ||
        mime.includes("excel") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsx")
    ) {
        return "📊";
    }

    if (
        mime.includes("presentation") ||
        name.endsWith(".ppt") ||
        name.endsWith(".pptx")
    ) {
        return "📙";
    }

    if (mime.includes("zip") || name.endsWith(".zip")) {
        return "🗜️";
    }

    return "📄";
};

const normalizeTrash = (data) => {
    return (
        data?.items ||
        data?.trash ||
        data?.files ||
        data?.data ||
        []
    );
};

/* =========================================================
   ICON
========================================================= */

function Icon({ name, size = 18 }) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    switch (name) {
        case "search":
            return (
                <svg {...common}>
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                </svg>
            );

        case "sun":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                </svg>
            );

        case "moon":
            return (
                <svg {...common}>
                    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" />
                </svg>
            );

        case "drive":
            return (
                <svg {...common}>
                    <path d="m8 3-5 9 5 9h8l5-9-5-9H8Z" />
                    <path d="m8 3 4 9 4-9" />
                    <path d="M3 12h18" />
                </svg>
            );

        case "star":
            return (
                <svg {...common}>
                    <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                </svg>
            );

        case "recent":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </svg>
            );

        case "shared":
            return (
                <svg {...common}>
                    <circle cx="18" cy="5" r="2.5" />
                    <circle cx="6" cy="12" r="2.5" />
                    <circle cx="18" cy="19" r="2.5" />
                    <path d="m8.2 10.8 7.6-4.6" />
                    <path d="m8.2 13.2 7.6 4.6" />
                </svg>
            );

        case "trash":
            return (
                <svg {...common}>
                    <path d="M4 7h16" />
                    <path d="M9 7V4h6v3" />
                    <path d="M7 7l1 13h8l1-13" />
                    <path d="M10 11v5" />
                    <path d="M14 11v5" />
                </svg>
            );

        case "folder":
            return (
                <svg {...common}>
                    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h5l2 2h8A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Z" />
                </svg>
            );

        case "plus":
            return (
                <svg {...common}>
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </svg>
            );

        case "upload":
            return (
                <svg {...common}>
                    <path d="M12 16V4" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M5 20h14" />
                </svg>
            );

        case "file":
            return (
                <svg {...common}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                </svg>
            );

        case "more":
            return (
                <svg {...common}>
                    <circle cx="5" cy="12" r="1" fill="currentColor" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                    <circle cx="19" cy="12" r="1" fill="currentColor" />
                </svg>
            );

        case "settings":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.5h.1A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.5v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.5h-.1a1.7 1.7 0 0 0-1.6 1Z" />
                </svg>
            );

        case "user":
            return (
                <svg {...common}>
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
            );

        case "logout":
            return (
                <svg {...common}>
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M21 4v16" />
                </svg>
            );

        case "link":
            return (
                <svg {...common}>
                    <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
                    <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 7 20l1.1-1.1" />
                </svg>
            );

        case "restore":
            return (
                <svg {...common}>
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 5v5h5" />
                </svg>
            );

        case "menu":
            return (
                <svg {...common}>
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                </svg>
            );

        case "close":
            return (
                <svg {...common}>
                    <path d="m6 6 12 12" />
                    <path d="M18 6 6 18" />
                </svg>
            );

        default:
            return null;
    }
}

/* =========================================================
   IMAGE THUMBNAIL
========================================================= */

function ImageThumbnail({ file, onOpen }) {
    const [url, setUrl] = useState("");

    useEffect(() => {
        let active = true;

        if (!file?.mime_type?.startsWith("image/")) {
            return undefined;
        }

        getSignedUrl(file.id)
            .then((response) => {
                if (active) {
                    setUrl(response.data.signed_url);
                }
            })
            .catch(() => { });

        return () => {
            active = false;
        };
    }, [file?.id, file?.mime_type]);

    if (!file?.mime_type?.startsWith("image/")) {
        return (
            <div className="grid h-full place-items-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#191f31] text-[10px] font-bold tracking-wide text-[#9b93ff]">
                    {iconFor(file)}
                </div>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onOpen}
            className="h-full w-full bg-transparent"
        >
            {url ? (
                <img
                    src={url}
                    alt={file.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="grid h-full place-items-center text-sm text-[#737f96]">
                    Loading preview…
                </div>
            )}
        </button>
    );
}

/* =========================================================
   FOLDER TREE
========================================================= */

function FolderTree({
    folders,
    currentFolderId,
    onOpen,
    darkMode,
}) {
    const roots = folders.filter(
        (folder) => folder.parent_folder_id == null
    );

    const renderChildren = (parentId, depth = 1) => {
        return folders
            .filter(
                (folder) =>
                    Number(folder.parent_folder_id) === Number(parentId)
            )
            .map((folder) => (
                <div key={folder.id}>
                    <button
                        type="button"
                        title={folder.name}
                        onClick={() => onOpen(folder.id)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${Number(currentFolderId) === Number(folder.id)
                            ? darkMode
                                ? "bg-[#211e50] text-[#aaa4ff]"
                                : "bg-[#efedff] text-[#5d53e9]"
                            : darkMode
                                ? "text-[#96a2b7] hover:bg-[#111b2d] hover:text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                        style={{
                            paddingLeft: `${12 + depth * 14}px`,
                        }}
                    >
                        <Icon name="folder" size={16} />
                        <span className="min-w-0 truncate">
                            {folder.name}
                        </span>
                    </button>

                    {renderChildren(folder.id, depth + 1)}
                </div>
            ));
    };

    return (
        <div className="mt-1 max-h-[38vh] overflow-y-auto pr-1">
            {roots.map((folder) => (
                <div key={folder.id}>
                    <button
                        type="button"
                        title={folder.name}
                        onClick={() => onOpen(folder.id)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${Number(currentFolderId) === Number(folder.id)
                            ? darkMode
                                ? "bg-[#211e50] text-[#aaa4ff]"
                                : "bg-[#efedff] text-[#5d53e9]"
                            : darkMode
                                ? "text-[#96a2b7] hover:bg-[#111b2d] hover:text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <Icon name="folder" size={16} />
                        <span className="min-w-0 truncate">
                            {folder.name}
                        </span>
                    </button>

                    {renderChildren(folder.id)}
                </div>
            ))}

            {roots.length === 0 && (
                <p
                    className={`px-3 py-2 text-xs ${darkMode ? "text-[#5e6b82]" : "text-gray-400"
                        }`}
                >
                    No folders yet
                </p>
            )}
        </div>
    );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard() {
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("vaultdrive-theme");

        if (savedTheme === "light") return false;
        if (savedTheme === "dark") return true;

        return true;
    });

    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [trash, setTrash] = useState([]);

    const [view, setView] = useState("drive");
    const [currentFolderId, setCurrentFolderId] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);

    const [sortBy, setSortBy] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [toast, setToast] = useState(null);

    const [openMenu, setOpenMenu] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);

    const [previewFile, setPreviewFile] = useState(null);

    const [shareFile, setShareFile] = useState(null);
    const [shareLink, setShareLink] = useState("");
    const [shareLoading, setShareLoading] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const [permissionFile, setPermissionFile] = useState(null);
    const [permissionEmail, setPermissionEmail] = useState("");
    const [permissionRole, setPermissionRole] = useState("viewer");
    const [permissionLoading, setPermissionLoading] = useState(false);

    const [deleteFileTarget, setDeleteFileTarget] = useState(null);

    const [renameFileTarget, setRenameFileTarget] = useState(null);
    const [renameFileName, setRenameFileName] = useState("");

    const [moveFileTarget, setMoveFileTarget] = useState(null);
    const [moveFolderId, setMoveFolderId] = useState("");

    const [fileView, setFileView] = useState(() => {
        return localStorage.getItem("vaultdrive-file-view") || "grid";
    });

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    /* =====================================================
       THEME
    ===================================================== */

    useEffect(() => {
        localStorage.setItem(
            "vaultdrive-theme",
            darkMode ? "dark" : "light"
        );
    }, [darkMode]);

    /* =====================================================
       DATA
    ===================================================== */

    const refresh = async () => {
        const [folderResponse, fileResponse] = await Promise.all([
            getFolders(),
            getFiles(),
        ]);

        setFolders(folderResponse.data.folders || []);
        setFiles(fileResponse.data.files || []);
    };

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                await refresh();
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load your VaultDrive."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    /* =====================================================
       SEARCH
    ===================================================== */

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!searchQuery.trim()) {
                setSearchResults(null);
                return;
            }

            try {
                const response = await searchFiles(
                    searchQuery.trim()
                );

                setSearchResults(
                    response.data.files || []
                );
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Search failed."
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        searchQuery,
        view,
        currentFolderId,
        sortBy,
        sortDirection,
    ]);

    /* =====================================================
       TOAST
    ===================================================== */

    const showToast = (message, type = "success") => {
        setToast({
            message,
            type,
        });

        window.setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    /* =====================================================
       CURRENT FOLDER
    ===================================================== */

    const currentFolder = folders.find(
        (folder) =>
            Number(folder.id) === Number(currentFolderId)
    );

    /* =====================================================
       FILE VIEWS
    ===================================================== */

    const visibleFiles = useMemo(() => {
        let list = [];

        if (searchResults !== null) {
            list = [...searchResults];
        } else if (view === "recent") {
            list = [...files].sort(
                (a, b) =>
                    new Date(
                        b.updated_at ||
                        b.created_at ||
                        0
                    ) -
                    new Date(
                        a.updated_at ||
                        a.created_at ||
                        0
                    )
            );

            list = list.slice(0, 20);
        } else if (view === "drive") {
            if (currentFolderId === null) {
                // My Drive = only files that are not inside a folder
                list = files.filter(
                    (file) => file.folder_id === null
                );
            } else {
                // Inside a folder = only files belonging to that folder
                list = files.filter(
                    (file) =>
                        Number(file.folder_id) ===
                        Number(currentFolderId)
                );
            }
        }

        if (sortBy === "name") {
            list.sort((a, b) =>
                (a.name || "")
                    .toLowerCase()
                    .localeCompare(
                        (b.name || "").toLowerCase()
                    )
            );
        }

        if (sortBy === "size") {
            list.sort(
                (a, b) =>
                    Number(a.size || 0) -
                    Number(b.size || 0)
            );
        }

        if (sortBy === "date") {
            list.sort(
                (a, b) =>
                    new Date(
                        a.updated_at ||
                        a.created_at ||
                        0
                    ) -
                    new Date(
                        b.updated_at ||
                        b.created_at ||
                        0
                    )
            );
        }

        if (sortDirection === "desc") {
            list.reverse();
        }

        return list;
    }, [
        files,
        currentFolderId,
        searchResults,
        view,
        sortBy,
        sortDirection,
    ]);

    const totalPages = Math.ceil(visibleFiles.length / ITEMS_PER_PAGE);

    const paginatedFiles = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

        return visibleFiles.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
        );
    }, [visibleFiles, currentPage]);

    useEffect(() => {
        localStorage.setItem("vaultdrive-file-view", fileView);
    }, [fileView]);

    /* =====================================================
       CREATE FOLDER
    ===================================================== */

    const handleCreateFolder = async () => {
        const name = window.prompt(
            "Enter folder name:"
        );

        if (!name?.trim()) return;

        try {
            await createFolder({
                name: name.trim(),
                ...(currentFolderId !== null
                    ? {
                        parent_folder_id:
                            currentFolderId,
                    }
                    : {}),
            });

            await refresh();

            showToast(
                "Folder created successfully."
            );
        } catch (err) {
            showToast(
                err.response?.data?.message ||
                "Failed to create folder.",
                "error"
            );
        }
    };

    /* =====================================================
       UPLOAD
    ===================================================== */

    const handleUpload = async (file) => {
        if (!file) return;

        try {
            setUploading(true);
            setUploadProgress(0);

            await uploadFile(file, (event) => {
                if (event.total) {
                    setUploadProgress(
                        Math.round(
                            (event.loaded * 100) /
                            event.total
                        )
                    );
                }
            });

            await refresh();

            showToast(
                "File uploaded successfully."
            );
        } catch (err) {
            showToast(
                err.response?.data?.message ||
                "Failed to upload file.",
                "error"
            );
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();

        setIsDragging(false);

        const file =
            event.dataTransfer.files?.[0];

        handleUpload(file);
    };

    /* =====================================================
       PREVIEW
    ===================================================== */

    const handlePreview = async (file) => {
        try {
            const response = await getSignedUrl(
                file.id
            );

            setPreviewFile({
                ...file,
                previewUrl:
                    response.data.signed_url,
            });
        } catch (err) {
            showToast(
                err.response?.data?.message ||
                "Failed to load preview.",
                "error"
            );
        }
    };

    /* =====================================================
       RENAME
    ===================================================== */

    const handleRenameFile = (file) => {
        setOpenMenu(null);
        setRenameFileTarget(file);
        setRenameFileName(file.name || "");
    };

    const confirmRenameFile = async () => {
        const newName = renameFileName.trim();

        if (!newName) {
            showToast("Please enter a file name.", "error");
            return;
        }

        if (newName === renameFileTarget.name) {
            setRenameFileTarget(null);
            return;
        }

        try {
            await renameFile(renameFileTarget.id, newName);
            await refresh();

            setRenameFileTarget(null);
            setRenameFileName("");

            showToast("File renamed successfully.", "success");
        } catch (err) {
            showToast(
                err.response?.data?.message || "Failed to rename file.",
                "error"
            );
        }
    };

    /* =====================================================
       MOVE
    ===================================================== */

    const handleMoveFile = (file) => {
        setOpenMenu(null);
        setMoveFileTarget(file);
        setMoveFolderId(file.folder_id ? String(file.folder_id) : "");
    };

    const confirmMoveFile = async () => {
        try {
            const targetFolderId = moveFolderId
                ? Number(moveFolderId)
                : null;

            await updateFile(moveFileTarget.id, {
                folder_id: targetFolderId
            });

            await refresh();

            setMoveFileTarget(null);
            setMoveFolderId("");

            showToast("File moved successfully.", "success");
        } catch (err) {
            showToast(
                err.response?.data?.message || "Failed to move file.",
                "error"
            );
        }
    };

    /* =====================================================
       DELETE
    ===================================================== */

    const handleDeleteFile = (file) => {
        setOpenMenu(null);
        setDeleteFileTarget(file);
    };

    const confirmDeleteFile = async () => {
        if (!deleteFileTarget) return;

        try {
            await deleteFile(deleteFileTarget.id);
            await refresh();

            setDeleteFileTarget(null);

            showToast("File moved to Trash.", "success");
        } catch (err) {
            showToast(
                err.response?.data?.message || "Failed to move file to Trash.",
                "error"
            );
        }
    };

    /* =====================================================
       SHARE
    ===================================================== */

    const handleShare = async (file) => {
        setShareFile(file);
        setShareLink("");
        setLinkCopied(false);
        setShareLoading(true);

        try {
            const response =
                await createShareLink(file.id);

            const token =
                response.data.share
                    .share_token;

            setShareLink(
                `${import.meta.env.VITE_API_URL}/api/share/access/${token}`
            );
        } catch (err) {
            setShareFile(null);

            showToast(
                err.response?.data?.message ||
                "Failed to create share link.",
                "error"
            );
        } finally {
            setShareLoading(false);
        }
    };

    /* =====================================================
       PERMISSIONS
    ===================================================== */

    const handlePermission = (file) => {
        setPermissionFile(file);
        setPermissionEmail("");
        setPermissionRole("viewer");
        setOpenMenu(null);
    };

    const savePermission = async () => {
        if (!permissionEmail.trim()) {
            showToast(
                "Please enter a user email.",
                "error"
            );
            return;
        }

        try {
            setPermissionLoading(true);

            await setFilePermission(
                permissionFile.id,
                permissionEmail.trim(),
                permissionRole
            );

            setPermissionFile(null);

            showToast(
                "Permission updated successfully."
            );
        } catch (err) {
            showToast(
                err.response?.data?.message ||
                "Failed to update permission.",
                "error"
            );
        } finally {
            setPermissionLoading(false);
        }
    };

    /* =====================================================
       TRASH
    ===================================================== */

    const loadTrash = async () => {
        try {
            const response = await getTrash();

            const trashItems = normalizeTrash(response.data);

            const sortedTrash = [...trashItems].sort(
                (a, b) =>
                    new Date(b.deleted_at || b.updated_at || b.created_at) -
                    new Date(a.deleted_at || a.updated_at || a.created_at)
            );

            setTrash(sortedTrash);
        } catch (err) {
            showToast(
                err.response?.data?.message || "Failed to load Trash.",
                "error"
            );
        }
    };

    const openTrash = async () => {
        setView("trash");
        setCurrentFolderId(null);
        setSearchQuery("");
        setSearchResults(null);

        await loadTrash();
    };

    const handleRestore = async (item) => {
        const type =
            item.type ||
            item.resource_type ||
            item.item_type ||
            (item.parent_folder_id !== undefined
                ? "folder"
                : "file");

        try {
            await restoreTrash(type, item.id);

            await refresh();
            await loadTrash();

            showToast("Item restored successfully.");
        } catch (err) {
            showToast(
                err.response?.data?.message ||
                "Failed to restore item.",
                "error"
            );
        }
    };

    /* =====================================================
       NAVIGATION
    ===================================================== */

    const openDrive = () => {
        setView("drive");
        setCurrentFolderId(null);
        setSearchQuery("");
        setSearchResults(null);
    };

    const openFolder = (folderId) => {
        setView("drive");
        setCurrentFolderId(folderId);
        setSearchQuery("");
        setSearchResults(null);
    };

    const openRecent = () => {
        setView("recent");
        setCurrentFolderId(null);
        setSearchQuery("");
        setSearchResults(null);
    };

    const openStarred = () => {
        setView("starred");
        setCurrentFolderId(null);
        setSearchQuery("");
        setSearchResults(null);
    };

    const openShared = () => {
        setView("shared");
        setCurrentFolderId(null);
        setSearchQuery("");
        setSearchResults(null);
    };

    /* =====================================================
       LOGOUT
    ===================================================== */

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    /* =====================================================
       TITLES
    ===================================================== */

    const pageTitle =
        view === "trash"
            ? "Trash"
            : view === "recent"
                ? "Recent"
                : view === "starred"
                    ? "Starred"
                    : view === "shared"
                        ? "Shared with me"
                        : currentFolder
                            ? currentFolder.name
                            : "My Drive";

    const isEmptyDrive =
        !loading &&
        view === "drive" &&
        visibleFiles.length === 0;

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${darkMode
                ? "bg-[#070b16] text-[#eef1f8]"
                : "bg-[#f7f8fc] text-[#111827]"
                }`}
            onClick={() => setOpenMenu(null)}
        >
            {/* =================================================
                TOAST
            ================================================= */}

            {toast && (
                <div className="fixed right-4 top-4 z-[100] flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-xl border border-[#2c3951] bg-[#101929] px-4 py-3 text-sm text-white shadow-2xl sm:right-6 sm:top-6">
                    <span
                        className={
                            toast.type === "error"
                                ? "text-red-400"
                                : toast.type === "info"
                                    ? "text-[#9d96ff]"
                                    : "text-emerald-400"
                        }
                    >
                        {toast.type === "error"
                            ? "!"
                            : toast.type === "info"
                                ? "i"
                                : "✓"}
                    </span>

                    <span>
                        {toast.message}
                    </span>
                </div>
            )}

            {/* =================================================
                NAVBAR
            ================================================= */}

            <header
                className={`sticky top-0 z-50 border-b ${darkMode
                    ? "border-white/5 bg-[#070b16]/95"
                    : "border-gray-200 bg-[#f7f8fc]/95"
                    } backdrop-blur-xl`}
            >
                <div className="grid min-h-[88px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:px-10 xl:px-16">

                    {/* BRAND */}

                    <div className="flex min-w-0 items-center gap-3">

                        {/* MOBILE MENU BUTTON */}
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                setMobileSidebarOpen(true);
                            }}
                            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition lg:hidden ${darkMode
                                ? "border-[#263148] bg-[#0f1828] text-[#aeb8ca] hover:border-[#394662] hover:text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                }`}
                            title="Open menu"
                        >
                            <Icon name="menu" size={20} />
                        </button>

                        {/* VAULTDRIVE BRAND */}
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex shrink-0 items-center gap-2.5"
                        >
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#6559ff] to-[#8a7dff] text-lg font-bold text-white shadow-[0_8px_22px_rgba(101,89,255,0.28)]">
                                V
                            </span>

                            <span
                                className={`hidden text-lg font-semibold sm:block ${darkMode
                                    ? "text-white"
                                    : "text-gray-900"
                                    }`}
                            >
                                VaultDrive
                            </span>
                        </button>

                    </div>

                    {/* SEARCH */}

                    <div
                        className={`mx-auto flex h-11 w-full max-w-[700px] items-center gap-3 rounded-xl border px-4 transition-colors ${darkMode
                            ? "border-[#253148] bg-[#0f1828] text-[#758197]"
                            : "border-gray-200 bg-white text-gray-400 shadow-sm"
                            }`}
                    >
                        <Icon
                            name="search"
                            size={18}
                        />

                        <input
                            value={searchQuery}
                            onChange={(event) => {
                                setSearchQuery(event.target.value);

                                if (event.target.value) {
                                    setView("drive");
                                }
                            }}
                            placeholder="Search your files..."
                            className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${darkMode
                                ? "text-white placeholder:text-[#66738a]"
                                : "text-gray-900 placeholder:text-gray-400"
                                }`}
                        />
                    </div>

                    {/* ACTIONS */}

                    <div className="relative flex items-center gap-2">

                        <button
                            type="button"
                            title="Toggle theme"
                            onClick={() =>
                                setDarkMode(
                                    !darkMode
                                )
                            }
                            className={`grid h-11 w-11 place-items-center rounded-xl border transition ${darkMode
                                ? "border-[#263148] bg-[#0f1828] text-[#aeb8ca] hover:border-[#394662] hover:text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                }`}
                        >
                            <Icon
                                name={
                                    darkMode
                                        ? "sun"
                                        : "moon"
                                }
                                size={19}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();

                                setProfileOpen(
                                    !profileOpen
                                );
                            }}
                            className={`flex h-11 items-center gap-2 rounded-xl border px-2 transition sm:px-3 ${darkMode
                                ? "border-[#263148] bg-[#0f1828] hover:border-[#394662]"
                                : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                        >
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#6559ff] text-sm font-bold text-white">
                                {user.name
                                    ?.charAt(
                                        0
                                    )
                                    ?.toUpperCase() ||
                                    "U"}
                            </span>

                            <span className="hidden max-w-[100px] truncate text-sm font-semibold sm:block">
                                {user.name ||
                                    "User"}
                            </span>

                            <span className="hidden text-xs sm:block">
                                ˅
                            </span>
                        </button>

                        {profileOpen && (
                            <div
                                onClick={(event) =>
                                    event.stopPropagation()
                                }
                                className={`absolute right-0 top-[54px] w-[230px] rounded-2xl border p-3 shadow-2xl ${darkMode
                                    ? "border-[#27344b] bg-[#0d1524]"
                                    : "border-gray-200 bg-white"
                                    }`}
                            >
                                <div className="border-b border-[#263148] px-2 pb-3">
                                    <p className="truncate text-sm font-semibold">
                                        {user.name ||
                                            "User"}
                                    </p>

                                    <p
                                        className={`mt-1 truncate text-xs ${darkMode
                                            ? "text-[#748198]"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {user.email ||
                                            ""}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={logout}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10"
                                >
                                    <Icon
                                        name="logout"
                                        size={17}
                                    />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* =================================================
                BODY
            ================================================= */}

            <div className="flex min-h-[calc(100vh-88px)]">
                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside
                    className={`hidden w-[250px] pt-3 shrink-0 border-r lg:flex lg:flex-col ${darkMode
                        ? "border-white/5 bg-[#0a101d]"
                        : "border-gray-200 bg-white"
                        }`}
                >


                    <nav className="space-y-1 px-3">
                        <button
                            type="button"
                            onClick={openDrive}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === "drive" &&
                                currentFolderId ===
                                null
                                ? darkMode
                                    ? "bg-[#211e50] text-[#aaa4ff]"
                                    : "bg-[#efedff] text-[#5d53e9]"
                                : darkMode
                                    ? "text-[#8d9ab0] hover:bg-[#111b2d] hover:text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <Icon
                                name="drive"
                                size={18}
                            />
                            My Drive
                        </button>

                        <button
                            type="button"
                            disabled
                            className={`flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium opacity-50 ${darkMode
                                ? "text-[#8d9ab0]"
                                : "text-gray-500"
                                }`}
                        >
                            <Icon name="star" size={18} />
                            Starred
                        </button>

                        <button
                            type="button"
                            onClick={openRecent}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === "recent"
                                ? darkMode
                                    ? "bg-[#211e50] text-[#aaa4ff]"
                                    : "bg-[#efedff] text-[#5d53e9]"
                                : darkMode
                                    ? "text-[#8d9ab0] hover:bg-[#111b2d] hover:text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <Icon
                                name="recent"
                                size={18}
                            />
                            Recent
                        </button>

                        <button
                            type="button"
                            onClick={openShared}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === "shared"
                                ? darkMode
                                    ? "bg-[#211e50] text-[#aaa4ff]"
                                    : "bg-[#efedff] text-[#5d53e9]"
                                : darkMode
                                    ? "text-[#8d9ab0] hover:bg-[#111b2d] hover:text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <Icon
                                name="shared"
                                size={18}
                            />
                            Shared with me
                        </button>
                    </nav>

                    <div
                        className={`mx-5 my-5 h-px ${darkMode
                            ? "bg-[#1f2a3e]"
                            : "bg-gray-200"
                            }`}
                    />

                    {/* FOLDERS */}

                    <div className="px-3">
                        <div className="flex items-center justify-between px-3">
                            <p
                                className={`text-[10px] font-bold uppercase tracking-[0.18em] ${darkMode
                                    ? "text-[#68758b]"
                                    : "text-gray-400"
                                    }`}
                            >
                                Folders
                            </p>

                            <button
                                type="button"
                                title="New folder"
                                onClick={
                                    handleCreateFolder
                                }
                                className={`grid h-7 w-7 place-items-center rounded-lg ${darkMode
                                    ? "text-[#77849b] hover:bg-[#151f31] hover:text-white"
                                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                    }`}
                            >
                                <Icon
                                    name="plus"
                                    size={16}
                                />
                            </button>
                        </div>

                        <FolderTree
                            folders={folders}
                            currentFolderId={
                                currentFolderId
                            }
                            onOpen={openFolder}
                            darkMode={darkMode}
                        />
                    </div>

                    {/* LOWER NAV */}
                    <div className="mt-auto px-3 pb-5">
                        <button
                            type="button"
                            onClick={openTrash}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === "trash"
                                ? darkMode
                                    ? "bg-[#211e50] text-[#aaa4ff]"
                                    : "bg-[#efedff] text-[#5d53e9]"
                                : darkMode
                                    ? "text-[#8d9ab0] hover:bg-[#111b2d] hover:text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <Icon
                                name="trash"
                                size={18}
                            />
                            Trash
                        </button>



                        <button
                            type="button"
                            onClick={() =>
                                showToast(
                                    "Account settings can be added next.",
                                    "info"
                                )
                            }
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${darkMode
                                ? "text-[#8d9ab0] hover:bg-[#111b2d] hover:text-white"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <Icon
                                name="user"
                                size={18}
                            />
                            Account
                        </button>
                    </div>
                </aside>

                {/* MOBILE SIDEBAR */}

                {mobileSidebarOpen && (
                    <>
                        {/* BACKDROP */}
                        <div
                            className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
                            onClick={() => setMobileSidebarOpen(false)}
                        />

                        {/* DRAWER */}
                        <aside
                            onClick={(event) => event.stopPropagation()}
                            className={`fixed left-0 top-0 z-[70] flex h-full w-[280px] flex-col border-r shadow-2xl lg:hidden ${darkMode
                                ? "border-[#202d42] bg-[#0a101d]"
                                : "border-gray-200 bg-white"
                                }`}
                        >
                            {/* DRAWER HEADER */}

                            <div
                                className={`flex h-[88px] shrink-0 items-center justify-between border-b px-5 ${darkMode
                                    ? "border-white/5"
                                    : "border-gray-200"
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileSidebarOpen(false);
                                        navigate("/");
                                    }}
                                    className="flex items-center gap-2.5"
                                >
                                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#6559ff] to-[#8a7dff] text-lg font-bold text-white shadow-[0_8px_22px_rgba(101,89,255,0.28)]">
                                        V
                                    </span>

                                    <span
                                        className={`text-lg font-semibold ${darkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                            }`}
                                    >
                                        VaultDrive
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileSidebarOpen(false)
                                    }
                                    className={`grid h-9 w-9 place-items-center rounded-lg ${darkMode
                                        ? "text-[#8d9ab0] hover:bg-[#151f31] hover:text-white"
                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                    title="Close menu"
                                >
                                    <Icon name="close" size={18} />
                                </button>
                            </div>

                            {/* NAVIGATION */}

                            <nav className="space-y-1 px-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        openDrive();
                                        setMobileSidebarOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === "drive" &&
                                        currentFolderId === null
                                        ? darkMode
                                            ? "bg-[#211e50] text-[#aaa4ff]"
                                            : "bg-[#efedff] text-[#5d53e9]"
                                        : darkMode
                                            ? "text-[#8d9ab0] hover:bg-[#111b2d] hover:text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon name="drive" size={18} />
                                    My Drive
                                </button>

                                <button
                                    type="button"
                                    disabled
                                    className={`flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium opacity-50 ${darkMode
                                        ? "text-[#8d9ab0]"
                                        : "text-gray-500"
                                        }`}
                                >
                                    <Icon name="star" size={18} />
                                    Starred
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        openRecent();
                                        setMobileSidebarOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === "recent"
                                        ? darkMode
                                            ? "bg-[#211e50] text-[#aaa4ff]"
                                            : "bg-[#efedff] text-[#5d53e9]"
                                        : darkMode
                                            ? "text-[#8d9ab0] hover:bg-[#111b2d] hover:text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon name="recent" size={18} />
                                    Recent
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        openShared();
                                        setMobileSidebarOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === "shared"
                                        ? darkMode
                                            ? "bg-[#211e50] text-[#aaa4ff]"
                                            : "bg-[#efedff] text-[#5d53e9]"
                                        : darkMode
                                            ? "text-[#8d9ab0] hover:bg-[#111b2d] hover:text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon name="shared" size={18} />
                                    Shared with me
                                </button>
                            </nav>

                            {/* DIVIDER */}

                            <div
                                className={`mx-5 my-5 h-px ${darkMode
                                    ? "bg-[#1f2a3e]"
                                    : "bg-gray-200"
                                    }`}
                            />

                            {/* FOLDERS */}

                            <div className="min-h-0 flex-1 overflow-y-auto px-3">
                                <div className="flex items-center justify-between px-3">
                                    <p
                                        className={`text-[10px] font-bold uppercase tracking-[0.18em] ${darkMode
                                            ? "text-[#68758b]"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        Folders
                                    </p>

                                    <button
                                        type="button"
                                        title="New folder"
                                        onClick={() => {
                                            setMobileSidebarOpen(false);
                                            handleCreateFolder();
                                        }}
                                        className={`grid h-7 w-7 place-items-center rounded-lg ${darkMode
                                            ? "text-[#77849b] hover:bg-[#151f31] hover:text-white"
                                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                            }`}
                                    >
                                        <Icon name="plus" size={16} />
                                    </button>
                                </div>

                                <FolderTree
                                    folders={folders}
                                    currentFolderId={currentFolderId}
                                    onOpen={(folderId) => {
                                        openFolder(folderId);
                                        setMobileSidebarOpen(false);
                                    }}
                                    darkMode={darkMode}
                                />
                            </div>

                            {/* LOWER NAV */}

                            <div className="shrink-0 px-3 pb-5 pt-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        openTrash();
                                        setMobileSidebarOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === "trash"
                                        ? darkMode
                                            ? "bg-[#211e50] text-[#aaa4ff]"
                                            : "bg-[#efedff] text-[#5d53e9]"
                                        : darkMode
                                            ? "text-[#8d9ab0] hover:bg-[#111b2d] hover:text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon name="trash" size={18} />
                                    Trash
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        showToast(
                                            "Account settings can be added next.",
                                            "info"
                                        )
                                    }
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${darkMode
                                        ? "text-[#8d9ab0] hover:bg-[#111b2d] hover:text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon name="user" size={18} />
                                    Account
                                </button>
                            </div>
                        </aside>
                    </>
                )}

                {/* =================================================
                    MAIN
                ================================================= */}
                <main className="min-w-0 flex-1">
                    <div className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 xl:px-14">

                        {/* HEADING */}
                        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="min-w-0">
                                <div
                                    className={`mb-2 flex flex-wrap items-center gap-2 text-xs ${darkMode
                                        ? "text-[#69768c]"
                                        : "text-gray-400"
                                        }`}
                                >
                                    <button
                                        type="button"
                                        onClick={
                                            openDrive
                                        }
                                        className="font-semibold text-[#746bff]"
                                    >
                                        My Drive
                                    </button>

                                    {currentFolder && (
                                        <>
                                            <span>
                                                /
                                            </span>

                                            <span
                                                className={`truncate ${darkMode
                                                    ? "text-[#8996ab]"
                                                    : "text-gray-500"
                                                    }`}
                                            >
                                                {
                                                    currentFolder.name
                                                }
                                            </span>
                                        </>
                                    )}
                                </div>

                                <h1
                                    className={`truncate text-3xl font-semibold tracking-[-0.035em] sm:text-4xl ${darkMode
                                        ? "text-white"
                                        : "text-gray-900"
                                        }`}
                                >
                                    {pageTitle}
                                </h1>

                                <p
                                    className={`mt-2 text-sm ${darkMode
                                        ? "text-[#77849a]"
                                        : "text-gray-500"
                                        }`}
                                >
                                    {view ===
                                        "trash"
                                        ? "Files and folders you've moved to Trash."
                                        : view ===
                                            "recent"
                                            ? "Your recently updated files."
                                            : view ===
                                                "starred"
                                                ? "Files you've marked as important."
                                                : view ===
                                                    "shared"
                                                    ? "Files shared with your account."
                                                    : currentFolder
                                                        ? "Files inside this folder."
                                                        : "Your files, organized in one secure workspace."}
                                </p>
                            </div>

                            {view ===
                                "drive" && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleCreateFolder
                                        }
                                        className="flex w-fit items-center gap-2 rounded-xl bg-[#6559ff] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(101,89,255,0.2)] transition hover:bg-[#7167ff]"
                                    >
                                        <Icon
                                            name="plus"
                                            size={17}
                                        />
                                        New folder
                                    </button>
                                )}
                        </div>

                        {/* =================================================
                            UPLOAD AREA — ONLY UPLOAD ENTRY POINT
                        ================================================= */}

                        {view ===
                            "drive" && (
                                <div
                                    onDragOver={(
                                        event
                                    ) => {
                                        event.preventDefault();
                                        setIsDragging(
                                            true
                                        );
                                    }}
                                    onDragLeave={() =>
                                        setIsDragging(
                                            false
                                        )
                                    }
                                    onDrop={
                                        handleDrop
                                    }
                                    className={`mb-9 flex min-h-[210px] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 text-center transition sm:min-h-[230px] ${isDragging
                                        ? darkMode
                                            ? "border-[#766dff] bg-[#171b45]"
                                            : "border-[#6559ff] bg-[#efedff]"
                                        : darkMode
                                            ? "border-[#2d3a51] bg-[#0b1322]"
                                            : "border-gray-300 bg-white"
                                        }`}
                                >
                                    <div
                                        className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl ${darkMode
                                            ? "bg-[#171f33] text-[#9992ff]"
                                            : "bg-[#efedff] text-[#6559ff]"
                                            }`}
                                    >
                                        <Icon
                                            name="upload"
                                            size={24}
                                        />
                                    </div>

                                    <h2
                                        className={`text-base font-semibold sm:text-lg ${darkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                            }`}
                                    >
                                        {uploading
                                            ? `Uploading… ${uploadProgress}%`
                                            : "Drag & drop files here"}
                                    </h2>

                                    <p
                                        className={`mt-2 max-w-md text-xs leading-6 sm:text-sm ${darkMode
                                            ? "text-[#758197]"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {uploading
                                            ? "Please keep this window open while your file is uploading."
                                            : "Drop a file anywhere in this area, or choose one from your device."}
                                    </p>

                                    <label
                                        className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${darkMode
                                            ? "border-[#34425a] bg-[#101929] text-[#dbe1ec] hover:border-[#4a5975]"
                                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        <Icon
                                            name="upload"
                                            size={16}
                                        />
                                        {uploading
                                            ? "Uploading…"
                                            : "Choose file"}

                                        <input
                                            type="file"
                                            hidden
                                            disabled={
                                                uploading
                                            }
                                            onChange={(
                                                event
                                            ) => {
                                                handleUpload(
                                                    event
                                                        .target
                                                        .files?.[0]
                                                );

                                                event.target.value =
                                                    "";
                                            }}
                                        />
                                    </label>
                                </div>
                            )}

                        {/* ERROR */}

                        {error && (
                            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                <span>
                                    {error}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setError(
                                            ""
                                        )
                                    }
                                    className="text-lg"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {loading ? (
                            <div
                                className={`flex min-h-[320px] flex-col items-center justify-center rounded-2xl border ${darkMode
                                    ? "border-[#202d42] bg-[#0d1524]"
                                    : "border-gray-200 bg-white"
                                    }`}
                            >
                                <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#303d55] border-t-[#6559ff]" />

                                <p
                                    className={`mt-4 text-sm ${darkMode
                                        ? "text-[#77849a]"
                                        : "text-gray-500"
                                        }`}
                                >
                                    Loading your drive…
                                </p>
                            </div>
                        ) : view ===
                            "trash" ? (
                            /* =================================================
                               TRASH
                            ================================================= */

                            <section>
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Deleted items
                                        </h2>

                                        <p
                                            className={`mt-1 text-xs ${darkMode
                                                ? "text-[#69768c]"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            {trash.length}{" "}
                                            item
                                            {trash.length !==
                                                1
                                                ? "s"
                                                : ""}
                                        </p>
                                    </div>
                                </div>

                                {trash.length ===
                                    0 ? (
                                    <div
                                        className={`flex min-h-[310px] flex-col items-center justify-center rounded-2xl border text-center ${darkMode
                                            ? "border-[#202d42] bg-[#0d1524]"
                                            : "border-gray-200 bg-white"
                                            }`}
                                    >
                                        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#191f31] text-[#858fa3]">
                                            <Icon
                                                name="trash"
                                                size={24}
                                            />
                                        </div>

                                        <h2 className="text-lg font-semibold">
                                            Trash is empty
                                        </h2>

                                        <p
                                            className={`mt-2 text-sm ${darkMode
                                                ? "text-[#748198]"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            Items you delete
                                            will appear
                                            here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {trash.map(
                                            (
                                                item
                                            ) => (
                                                <div
                                                    key={`${item.type || "file"}-${item.id}`}
                                                    className={`flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center ${darkMode
                                                        ? "border-[#222e43] bg-[#0d1524]"
                                                        : "border-gray-200 bg-white"
                                                        }`}
                                                >
                                                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#171f33] text-[9px] font-bold text-[#938cff]">
                                                        {iconFor(
                                                            item
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold">
                                                            {
                                                                item.name
                                                            }
                                                        </p>

                                                        <p
                                                            className={`mt-1 text-xs ${darkMode
                                                                ? "text-[#69768c]"
                                                                : "text-gray-500"
                                                                }`}
                                                        >
                                                            Deleted{" "}
                                                            {formatDate(
                                                                item.deleted_at ||
                                                                item.updated_at
                                                            )}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRestore(
                                                                item
                                                            )
                                                        }
                                                        className="flex items-center justify-center gap-2 rounded-lg border border-[#6559ff] px-3 py-2 text-xs font-bold text-[#8d86ff] transition hover:bg-[#6559ff]/10"
                                                    >
                                                        <Icon
                                                            name="restore"
                                                            size={
                                                                15
                                                            }
                                                        />
                                                        Restore
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </section>
                        ) : view ===
                            "starred" ||
                            view ===
                            "shared" ? (
                            /* =================================================
                               STARRED / SHARED PLACEHOLDER
                            ================================================= */

                            <div
                                className={`flex min-h-[310px] flex-col items-center justify-center rounded-2xl border text-center ${darkMode
                                    ? "border-[#202d42] bg-[#0d1524]"
                                    : "border-gray-200 bg-white"
                                    }`}
                            >
                                <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#191f31] text-[#858fa3]">
                                    <Icon
                                        name={
                                            view ===
                                                "starred"
                                                ? "star"
                                                : "shared"
                                        }
                                        size={24}
                                    />
                                </div>

                                <h2 className="text-lg font-semibold">
                                    {view ===
                                        "starred"
                                        ? "No starred files yet"
                                        : "No shared files yet"}
                                </h2>

                                <p
                                    className={`mt-2 max-w-md px-4 text-sm leading-6 ${darkMode
                                        ? "text-[#748198]"
                                        : "text-gray-500"
                                        }`}
                                >
                                    {view ===
                                        "starred"
                                        ? "Starred-file persistence needs a dedicated backend field/API. We won't fake it with temporary UI state."
                                        : "Shared-with-me needs a dedicated backend query for permissions received by your account."}
                                </p>
                            </div>
                        ) : (
                            /* =================================================
                               FILES
                            ================================================= */

                            <section>
                                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            {searchQuery
                                                ? "Search results"
                                                : view ===
                                                    "recent"
                                                    ? "Recently updated"
                                                    : "Files"}
                                        </h2>

                                        <p
                                            className={`mt-1 text-xs ${darkMode
                                                ? "text-[#69768c]"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            {
                                                visibleFiles.length
                                            }{" "}
                                            item
                                            {visibleFiles.length !==
                                                1
                                                ? "s"
                                                : ""}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`hidden text-xs sm:block ${darkMode
                                                ? "text-[#68758b]"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            Sort by
                                        </span>

                                        <select
                                            value={
                                                sortBy
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setSortBy(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className={`rounded-lg border px-3 py-2 text-xs outline-none ${darkMode
                                                ? "border-[#29354a] bg-[#101929] text-[#d6dce7]"
                                                : "border-gray-200 bg-white text-gray-700"
                                                }`}
                                        >
                                            <option value="date">
                                                Date
                                            </option>

                                            <option value="name">
                                                Name
                                            </option>

                                            <option value="size">
                                                Size
                                            </option>
                                        </select>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSortDirection(
                                                    sortDirection ===
                                                        "asc"
                                                        ? "desc"
                                                        : "asc"
                                                )
                                            }
                                            className={`grid h-9 w-9 place-items-center rounded-lg border text-sm ${darkMode
                                                ? "border-[#29354a] bg-[#101929] text-[#d6dce7]"
                                                : "border-gray-200 bg-white text-gray-700"
                                                }`}
                                            title="Reverse order"
                                        >
                                            {sortDirection ===
                                                "asc"
                                                ? "↑"
                                                : "↓"}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Grid / List View */}
                                        <div
                                            className={`flex items-center rounded-lg border p-1 ${darkMode
                                                ? "border-white/10 bg-white/[0.03]"
                                                : "border-gray-200 bg-white"
                                                }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setFileView("grid")}
                                                title="Grid view"
                                                className={`grid h-8 w-8 place-items-center rounded-md text-sm transition ${fileView === "grid"
                                                    ? "bg-[#6c5ce7] text-white"
                                                    : darkMode
                                                        ? "text-[#78859b] hover:bg-white/5 hover:text-white"
                                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                                    }`}
                                            >
                                                ▦
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setFileView("list")}
                                                title="List view"
                                                className={`grid h-8 w-8 place-items-center rounded-md text-sm transition ${fileView === "list"
                                                    ? "bg-[#6c5ce7] text-white"
                                                    : darkMode
                                                        ? "text-[#78859b] hover:bg-white/5 hover:text-white"
                                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                                    }`}
                                            >
                                                ☰
                                            </button>
                                        </div>

                                    </div>
                                </div>

                                {isEmptyDrive ? (
                                    <div
                                        className={`flex min-h-[310px] flex-col items-center justify-center rounded-2xl border text-center ${darkMode
                                            ? "border-[#202d42] bg-[#0d1524]"
                                            : "border-gray-200 bg-white"
                                            }`}
                                    >
                                        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#191f31] text-[#858fa3]">
                                            <Icon
                                                name="file"
                                                size={25}
                                            />
                                        </div>

                                        <h2 className="text-lg font-semibold">
                                            This folder is
                                            empty
                                        </h2>

                                        <p
                                            className={`mt-2 text-sm ${darkMode
                                                ? "text-[#748198]"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            Upload a file here
                                            to start building
                                            your VaultDrive.
                                        </p>
                                    </div>
                                ) : visibleFiles.length ===
                                    0 ? (
                                    <div
                                        className={`flex min-h-[310px] flex-col items-center justify-center rounded-2xl border text-center ${darkMode
                                            ? "border-[#202d42] bg-[#0d1524]"
                                            : "border-gray-200 bg-white"
                                            }`}
                                    >
                                        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#191f31] text-[#858fa3]">
                                            <Icon
                                                name="search"
                                                size={24}
                                            />
                                        </div>

                                        <h2 className="text-lg font-semibold">
                                            No files found
                                        </h2>

                                        <p
                                            className={`mt-2 text-sm ${darkMode
                                                ? "text-[#748198]"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            Try another search.
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            fileView === "grid"
                                                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                                                : "flex flex-col gap-3"
                                        }
                                    >
                                        {paginatedFiles.map((file) => {
                                            const isImage = file.mime_type?.startsWith("image/");
                                            const fileType = getFileType(file);

                                            return (
                                                <article
                                                    key={file.id}
                                                    className={
                                                        fileView === "grid"
                                                            ? `group relative overflow-visible rounded-2xl border transition-all duration-200 ${darkMode
                                                                ? "border-white/10 bg-[#111827] hover:border-white/20 hover:bg-[#151d2d]"
                                                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                                                            }`
                                                            : `group relative flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-200 ${darkMode
                                                                ? "border-white/10 bg-[#111827] hover:border-white/20 hover:bg-[#151d2d]"
                                                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                                                            }`
                                                    }
                                                >
                                                    {/* FILE PREVIEW / ICON */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePreview(file)}
                                                        className={
                                                            fileView === "grid"
                                                                ? "block w-full text-left"
                                                                : "flex min-w-0 flex-1 items-center gap-4 text-left"
                                                        }
                                                    >
                                                        {fileView === "grid" ? (
                                                            <>
                                                                <div className="h-[165px] w-full overflow-hidden rounded-t-2xl">
                                                                    {isImage ? (
                                                                        <ImageThumbnail file={file} />
                                                                    ) : (
                                                                        <div
                                                                            className={`grid h-full w-full place-items-center ${darkMode
                                                                                ? "bg-[#0b1220]"
                                                                                : "bg-gray-50"
                                                                                }`}
                                                                        >
                                                                            <div className="flex flex-col items-center gap-2">
                                                                                <span className="text-4xl">
                                                                                    {iconFor(file)}
                                                                                </span>

                                                                                <span
                                                                                    className={`text-xs font-semibold uppercase ${darkMode
                                                                                        ? "text-[#78859b]"
                                                                                        : "text-gray-400"
                                                                                        }`}
                                                                                >
                                                                                    {fileType}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="p-4">
                                                                    <p
                                                                        className={`truncate text-sm font-semibold ${darkMode
                                                                            ? "text-white"
                                                                            : "text-gray-900"
                                                                            }`}
                                                                        title={file.name}
                                                                    >
                                                                        {file.name}
                                                                    </p>

                                                                    <div className="mt-1 flex items-center gap-2">
                                                                        <span
                                                                            className={`text-xs ${darkMode
                                                                                ? "text-[#78859b]"
                                                                                : "text-gray-500"
                                                                                }`}
                                                                        >
                                                                            {formatSize(file.size)}
                                                                        </span>

                                                                        <span
                                                                            className={
                                                                                darkMode
                                                                                    ? "text-[#3c4658]"
                                                                                    : "text-gray-300"
                                                                            }
                                                                        >
                                                                            •
                                                                        </span>

                                                                        <span
                                                                            className={`text-xs ${darkMode
                                                                                ? "text-[#78859b]"
                                                                                : "text-gray-500"
                                                                                }`}
                                                                        >
                                                                            {fileType}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                                                                    {isImage ? (
                                                                        <ImageThumbnail file={file} />
                                                                    ) : (
                                                                        <div
                                                                            className={`grid h-full w-full place-items-center ${darkMode
                                                                                ? "bg-[#0b1220]"
                                                                                : "bg-gray-50"
                                                                                }`}
                                                                        >
                                                                            <span className="text-2xl">
                                                                                {iconFor(file)}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <p
                                                                        className={`truncate text-sm font-semibold ${darkMode
                                                                            ? "text-white"
                                                                            : "text-gray-900"
                                                                            }`}
                                                                        title={file.name}
                                                                    >
                                                                        {file.name}
                                                                    </p>

                                                                    <div className="mt-1 flex items-center gap-2">
                                                                        <span
                                                                            className={`text-xs ${darkMode
                                                                                ? "text-[#78859b]"
                                                                                : "text-gray-500"
                                                                                }`}
                                                                        >
                                                                            {fileType}
                                                                        </span>

                                                                        <span
                                                                            className={
                                                                                darkMode
                                                                                    ? "text-[#3c4658]"
                                                                                    : "text-gray-300"
                                                                            }
                                                                        >
                                                                            •
                                                                        </span>

                                                                        <span
                                                                            className={`text-xs ${darkMode
                                                                                ? "text-[#78859b]"
                                                                                : "text-gray-500"
                                                                                }`}
                                                                        >
                                                                            {formatSize(file.size)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </button>

                                                    {/* RIGHT SIDE INFO + 3 DOT MENU */}
                                                    <div
                                                        className={
                                                            fileView === "grid"
                                                                ? "flex items-center justify-between border-t px-4 py-3"
                                                                : "flex shrink-0 items-center gap-5"
                                                        }
                                                        style={{
                                                            borderColor: darkMode
                                                                ? "rgba(255,255,255,0.06)"
                                                                : "rgb(243,244,246)",
                                                        }}
                                                    >
                                                        <span
                                                            className={`text-xs ${darkMode ? "text-[#667187]" : "text-gray-400"
                                                                }`}
                                                        >
                                                            {formatDate(file.updated_at || file.created_at)}
                                                        </span>

                                                        {/* 3 DOT MENU */}
                                                        <div className="relative">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenMenu(
                                                                        openMenu === file.id ? null : file.id
                                                                    );
                                                                }}
                                                                className={`grid h-8 w-8 place-items-center rounded-lg transition ${darkMode
                                                                    ? "text-[#8b96a9] hover:bg-white/10 hover:text-white"
                                                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                                                    }`}
                                                                aria-label="File options"
                                                            >
                                                                <span className="text-xl leading-none">⋮</span>
                                                            </button>

                                                            {openMenu === file.id && (
                                                                <div
                                                                    className={`absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border py-1 shadow-xl ${darkMode
                                                                        ? "border-white/10 bg-[#151d2d]"
                                                                        : "border-gray-200 bg-white"
                                                                        }`}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setOpenMenu(null);
                                                                            handlePreview(file);
                                                                        }}
                                                                        className={`flex w-full items-center px-4 py-2.5 text-left text-sm ${darkMode
                                                                            ? "text-[#d9dfeb] hover:bg-white/5"
                                                                            : "text-gray-700 hover:bg-gray-50"
                                                                            }`}
                                                                    >
                                                                        Preview
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setOpenMenu(null);
                                                                            handleRenameFile(file);
                                                                        }}
                                                                        className={`flex w-full items-center px-4 py-2.5 text-left text-sm ${darkMode
                                                                            ? "text-[#d9dfeb] hover:bg-white/5"
                                                                            : "text-gray-700 hover:bg-gray-50"
                                                                            }`}
                                                                    >
                                                                        Rename
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setOpenMenu(null);
                                                                            handleMoveFile(file);
                                                                        }}
                                                                        className={`flex w-full items-center px-4 py-2.5 text-left text-sm ${darkMode
                                                                            ? "text-[#d9dfeb] hover:bg-white/5"
                                                                            : "text-gray-700 hover:bg-gray-50"
                                                                            }`}
                                                                    >
                                                                        Move
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setOpenMenu(null);
                                                                            handleShare(file);
                                                                        }}
                                                                        className={`flex w-full items-center px-4 py-2.5 text-left text-sm ${darkMode
                                                                            ? "text-[#d9dfeb] hover:bg-white/5"
                                                                            : "text-gray-700 hover:bg-gray-50"
                                                                            }`}
                                                                    >
                                                                        Share
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            handlePermission(file);
                                                                        }}
                                                                        className={`flex w-full items-center px-4 py-2.5 text-left text-sm ${darkMode
                                                                            ? "text-[#d9dfeb] hover:bg-white/5"
                                                                            : "text-gray-700 hover:bg-gray-50"
                                                                            }`}
                                                                    >
                                                                        Permissions
                                                                    </button>

                                                                    <div
                                                                        className={`my-1 border-t ${darkMode
                                                                            ? "border-white/5"
                                                                            : "border-gray-100"
                                                                            }`}
                                                                    />

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setOpenMenu(null);
                                                                            handleDeleteFile(file);
                                                                        }}
                                                                        className="flex w-full items-center px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-500/10"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                )}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex items-center justify-center">
                                        <div
                                            className={`flex items-center gap-1 rounded-xl p-1 ${darkMode
                                                    ? "bg-[#0d1524]"
                                                    : "bg-gray-50"
                                                }`}
                                        >
                                            {/* Previous */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentPage((page) => Math.max(1, page - 1))
                                                }
                                                disabled={currentPage === 1}
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition ${currentPage === 1
                                                        ? "cursor-not-allowed opacity-30"
                                                        : darkMode
                                                            ? "text-[#78859b] hover:bg-white/5 hover:text-white"
                                                            : "text-gray-400 hover:bg-white hover:text-gray-900"
                                                    }`}
                                                aria-label="Previous page"
                                            >
                                                ‹
                                            </button>

                                            {/* Page numbers */}
                                            {Array.from({ length: totalPages }, (_, index) => {
                                                const page = index + 1;

                                                return (
                                                    <button
                                                        key={page}
                                                        type="button"
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm transition ${currentPage === page
                                                                ? "bg-[#6c5ce7] font-semibold text-white"
                                                                : darkMode
                                                                    ? "text-[#78859b] hover:bg-white/5 hover:text-white"
                                                                    : "text-gray-500 hover:bg-white hover:text-gray-900"
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}

                                            {/* Next */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentPage((page) =>
                                                        Math.min(totalPages, page + 1)
                                                    )
                                                }
                                                disabled={currentPage === totalPages}
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition ${currentPage === totalPages
                                                        ? "cursor-not-allowed opacity-30"
                                                        : darkMode
                                                            ? "text-[#78859b] hover:bg-white/5 hover:text-white"
                                                            : "text-gray-400 hover:bg-white hover:text-gray-900"
                                                    }`}
                                                aria-label="Next page"
                                            >
                                                ›
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </section>
                        )}
                    </div>

                    {deleteFileTarget && (
                        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
                            <div
                                className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode
                                    ? "border-white/10 bg-[#111827]"
                                    : "border-gray-200 bg-white"
                                    }`}
                            >
                                <div className="mb-5 flex items-start gap-4">
                                    <div
                                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${darkMode
                                            ? "bg-red-500/10 text-red-400"
                                            : "bg-red-50 text-red-500"
                                            }`}
                                    >
                                        <Icon name="trash" size={20} />
                                    </div>

                                    <div>
                                        <h3
                                            className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"
                                                }`}
                                        >
                                            Move to Trash?
                                        </h3>

                                        <p
                                            className={`mt-1 text-sm leading-6 ${darkMode ? "text-[#8d99ad]" : "text-gray-500"
                                                }`}
                                        >
                                            Are you sure you want to move{" "}
                                            <span
                                                className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"
                                                    }`}
                                            >
                                                "{deleteFileTarget.name}"
                                            </span>{" "}
                                            to Trash?
                                        </p>
                                    </div>
                                </div>

                                <p
                                    className={`mb-6 text-sm ${darkMode ? "text-[#6f7b90]" : "text-gray-400"
                                        }`}
                                >
                                    You can restore this file later from Trash.
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setDeleteFileTarget(null)}
                                        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${darkMode
                                            ? "border border-white/10 text-gray-300 hover:bg-white/5"
                                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={confirmDeleteFile}
                                        className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                                    >
                                        Move to Trash
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {renameFileTarget && (
                        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
                            <div
                                className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode
                                    ? "border-white/10 bg-[#111827]"
                                    : "border-gray-200 bg-white"
                                    }`}
                            >
                                <div className="mb-6">
                                    <h3
                                        className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        Rename file
                                    </h3>

                                    <p
                                        className={`mt-1 text-sm ${darkMode ? "text-[#8d99ad]" : "text-gray-500"
                                            }`}
                                    >
                                        Enter a new name for your file.
                                    </p>
                                </div>

                                <input
                                    type="text"
                                    value={renameFileName}
                                    onChange={(e) => setRenameFileName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            confirmRenameFile();
                                        }
                                    }}
                                    autoFocus
                                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${darkMode
                                        ? "border-white/10 bg-[#0b1120] text-white placeholder:text-[#596579] focus:border-[#6c5ce7]"
                                        : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-[#6c5ce7]"
                                        }`}
                                    placeholder="Enter file name"
                                />

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRenameFileTarget(null);
                                            setRenameFileName("");
                                        }}
                                        className={`rounded-xl px-4 py-2.5 text-sm font-medium ${darkMode
                                            ? "border border-white/10 text-gray-300 hover:bg-white/5"
                                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={confirmRenameFile}
                                        className="rounded-xl bg-[#6c5ce7] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b4bd6]"
                                    >
                                        Rename
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {moveFileTarget && (
                        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
                            <div
                                className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode
                                    ? "border-white/10 bg-[#111827]"
                                    : "border-gray-200 bg-white"
                                    }`}
                            >
                                <div className="mb-6">
                                    <h3
                                        className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        Move file
                                    </h3>

                                    <p
                                        className={`mt-1 text-sm ${darkMode ? "text-[#8d99ad]" : "text-gray-500"
                                            }`}
                                    >
                                        Choose the folder where you want to move{" "}
                                        <span
                                            className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"
                                                }`}
                                        >
                                            "{moveFileTarget.name}"
                                        </span>
                                        .
                                    </p>
                                </div>

                                <div
                                    className={`max-h-64 overflow-y-auto rounded-xl border p-2 ${darkMode
                                        ? "border-white/10 bg-[#0b1020]"
                                        : "border-gray-200 bg-gray-50"
                                        }`}
                                >
                                    {/* My Drive */}
                                    <button
                                        type="button"
                                        onClick={() => setMoveFolderId("")}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${moveFolderId === ""
                                            ? darkMode
                                                ? "bg-[#6c5ce7]/15 text-white"
                                                : "bg-purple-50 text-purple-700"
                                            : darkMode
                                                ? "text-[#b8c2d4] hover:bg-white/5"
                                                : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        <span className="text-base">🏠</span>
                                        <span className="font-medium">My Drive</span>

                                        {moveFolderId === "" && (
                                            <span className="ml-auto text-xs text-[#8b7cf6]">
                                                ✓
                                            </span>
                                        )}
                                    </button>

                                    {/* Folder hierarchy */}
                                    {(() => {
                                        const renderMoveFolders = (parentId = null, level = 0) => {
                                            return folders
                                                .filter((folder) => {
                                                    const folderParent =
                                                        folder.parent_folder_id ?? null;

                                                    return Number(folderParent) === Number(parentId);
                                                })
                                                .map((folder) => {
                                                    const hasChildren = folders.some(
                                                        (child) =>
                                                            Number(child.parent_folder_id ?? null) ===
                                                            Number(folder.id)
                                                    );

                                                    return (
                                                        <div key={folder.id}>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setMoveFolderId(String(folder.id))
                                                                }
                                                                className={`flex w-full items-center gap-2 rounded-lg py-2.5 pr-3 text-left text-sm transition ${moveFolderId === String(folder.id)
                                                                    ? darkMode
                                                                        ? "bg-[#6c5ce7]/15 text-white"
                                                                        : "bg-purple-50 text-purple-700"
                                                                    : darkMode
                                                                        ? "text-[#b8c2d4] hover:bg-white/5"
                                                                        : "text-gray-700 hover:bg-gray-100"
                                                                    }`}
                                                                style={{
                                                                    paddingLeft: `${12 + level * 22}px`,
                                                                }}
                                                            >
                                                                <span className="w-4 text-xs opacity-60">
                                                                    {hasChildren ? "▸" : ""}
                                                                </span>

                                                                <span className="text-base">
                                                                    📁
                                                                </span>

                                                                <span className="min-w-0 flex-1 truncate">
                                                                    {folder.name}
                                                                </span>

                                                                {moveFolderId === String(folder.id) && (
                                                                    <span className="text-xs text-[#8b7cf6]">
                                                                        ✓
                                                                    </span>
                                                                )}
                                                            </button>

                                                            {renderMoveFolders(folder.id, level + 1)}
                                                        </div>
                                                    );
                                                });
                                        };

                                        return renderMoveFolders();
                                    })()}
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMoveFileTarget(null);
                                            setMoveFolderId("");
                                        }}
                                        className={`rounded-xl px-4 py-2.5 text-sm font-medium ${darkMode
                                            ? "border border-white/10 text-gray-300 hover:bg-white/5"
                                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={confirmMoveFile}
                                        className="rounded-xl bg-[#6c5ce7] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b4bd6]"
                                    >
                                        Move
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {/* =====================================================
    PREVIEW MODAL
===================================================== */}

            {previewFile && (
                <div
                    className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4 backdrop-blur-sm sm:p-6"
                    onClick={() => setPreviewFile(null)}
                >
                    <div
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className={`flex max-h-[92vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl border shadow-2xl ${darkMode
                            ? "border-[#29364d] bg-[#0c1423] text-white"
                            : "border-gray-200 bg-white text-gray-900"
                            }`}
                    >
                        {/* Header */}
                        <div
                            className={`flex items-center justify-between border-b px-4 py-4 sm:px-5 ${darkMode
                                ? "border-[#222e43]"
                                : "border-gray-200"
                                }`}
                        >
                            <div className="min-w-0">
                                <p
                                    className={`truncate text-sm font-semibold ${darkMode
                                        ? "text-white"
                                        : "text-gray-900"
                                        }`}
                                >
                                    {previewFile.name}
                                </p>

                                <p
                                    className={`mt-1 text-xs ${darkMode
                                        ? "text-[#77849a]"
                                        : "text-gray-500"
                                        }`}
                                >
                                    {previewFile.mime_type || "File"}{" "}
                                    ·{" "}
                                    {formatSize(previewFile.size)}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setPreviewFile(null)
                                }
                                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${darkMode
                                    ? "text-[#8b97ab] hover:bg-[#182236] hover:text-white"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <Icon
                                    name="close"
                                    size={18}
                                />
                            </button>
                        </div>

                        {/* Preview area */}
                        <div
                            className={`grid min-h-[300px] flex-1 place-items-center overflow-auto p-4 sm:p-6 ${darkMode
                                ? "bg-[#080e19]"
                                : "bg-gray-50"
                                }`}
                        >
                            {previewFile.mime_type?.startsWith(
                                "image/"
                            ) ? (
                                <img
                                    src={previewFile.previewUrl}
                                    alt={previewFile.name}
                                    className="max-h-[75vh] max-w-full rounded-xl object-contain"
                                />
                            ) : previewFile.mime_type ===
                                "application/pdf" ? (
                                <iframe
                                    src={previewFile.previewUrl}
                                    title={previewFile.name}
                                    className="h-[75vh] w-full rounded-lg border-0 bg-white"
                                />
                            ) : [
                                "text/plain",
                                "text/csv",
                                "application/json",
                            ].includes(
                                previewFile.mime_type
                            ) ? (
                                <iframe
                                    src={previewFile.previewUrl}
                                    title={previewFile.name}
                                    className="h-[75vh] w-full rounded-lg border-0 bg-white"
                                />
                            ) : (
                                <div className="text-center">
                                    <div
                                        className={`mx-auto mb-5 grid h-20 w-20 place-items-center rounded-2xl text-sm font-bold ${darkMode
                                            ? "bg-[#171f33] text-[#958eff]"
                                            : "bg-gray-100 text-[#6559ff]"
                                            }`}
                                    >
                                        {iconFor(previewFile)}
                                    </div>

                                    <h3
                                        className={`text-lg font-semibold ${darkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                            }`}
                                    >
                                        Preview isn't available
                                    </h3>

                                    <p
                                        className={`mt-2 max-w-md text-sm leading-6 ${darkMode
                                            ? "text-[#77849a]"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        This file type cannot be
                                        previewed directly in
                                        VaultDrive.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
    SHARE MODAL
===================================================== */}

            {shareFile && (
                <div
                    className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
                    onClick={() => setShareFile(null)}
                >
                    <div
                        onClick={(event) => event.stopPropagation()}
                        className={`w-full max-w-[650px] overflow-hidden rounded-2xl border shadow-2xl ${darkMode
                            ? "border-[#29364d] bg-[#0c1423] text-white"
                            : "border-gray-200 bg-white text-gray-900"
                            }`}
                    >
                        {/* Header */}
                        <div
                            className={`flex items-center justify-between border-b px-5 py-4 ${darkMode
                                ? "border-[#222e43]"
                                : "border-gray-200"
                                }`}
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-semibold">
                                    Share file
                                </p>

                                <p
                                    className={`mt-1 truncate text-xs ${darkMode
                                        ? "text-[#77849a]"
                                        : "text-gray-500"
                                        }`}
                                >
                                    {shareFile.name}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShareFile(null)}
                                className={`grid h-9 w-9 place-items-center rounded-lg ${darkMode
                                    ? "text-[#8b97ab] hover:bg-[#182236] hover:text-white"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <Icon
                                    name="close"
                                    size={18}
                                />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="space-y-6 p-5 sm:p-6">

                            {/* Add people */}
                            <div>
                                <label
                                    className={`mb-2 block text-xs font-bold ${darkMode
                                        ? "text-[#cbd3e0]"
                                        : "text-gray-700"
                                        }`}
                                >
                                    Add people
                                </label>

                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_110px_75px]">

                                    <input
                                        type="email"
                                        value={permissionEmail}
                                        onChange={(event) =>
                                            setPermissionEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter email address"
                                        className={`rounded-lg border px-3 py-2.5 text-sm outline-none ${darkMode
                                            ? "border-[#29354a] bg-[#101929] text-white placeholder:text-[#627087] focus:border-[#6559ff]"
                                            : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-[#6559ff]"
                                            }`}
                                    />

                                    <select
                                        value={permissionRole}
                                        onChange={(event) =>
                                            setPermissionRole(
                                                event.target.value
                                            )
                                        }
                                        className={`rounded-lg border px-3 py-2.5 text-sm outline-none ${darkMode
                                            ? "border-[#29354a] bg-[#101929] text-white"
                                            : "border-gray-200 bg-gray-50 text-gray-900"
                                            }`}
                                    >
                                        <option value="viewer">
                                            Viewer
                                        </option>

                                        <option value="editor">
                                            Editor
                                        </option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={savePermission}
                                        className="rounded-lg bg-[#6559ff] px-3 py-2.5 text-sm font-bold text-white hover:bg-[#7167ff]"
                                    >
                                        Share
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div
                                className={`h-px ${darkMode
                                    ? "bg-[#222e43]"
                                    : "bg-gray-200"
                                    }`}
                            />

                            {/* General access */}
                            <div>
                                <label
                                    className={`mb-2 block text-xs font-bold ${darkMode
                                        ? "text-[#cbd3e0]"
                                        : "text-gray-700"
                                        }`}
                                >
                                    General access
                                </label>

                                <div
                                    className={`flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center ${darkMode
                                        ? "border-[#29364d]"
                                        : "border-gray-200"
                                        }`}
                                >
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#1d244c] text-[#958eff]">
                                        <Icon
                                            name="link"
                                            size={18}
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold">
                                            Anyone with the link
                                        </p>

                                        <p
                                            className={`mt-1 text-xs ${darkMode
                                                ? "text-[#77849a]"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            Viewer access
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={
                                            shareLoading ||
                                            !shareLink
                                        }
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(
                                                shareLink
                                            );

                                            setLinkCopied(true);

                                            setTimeout(
                                                () =>
                                                    setLinkCopied(
                                                        false
                                                    ),
                                                2000
                                            );
                                        }}
                                        className={`rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-50 ${darkMode
                                            ? "border-[#39465f] bg-[#151f31] text-[#dbe1ec]"
                                            : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {shareLoading
                                            ? "Creating…"
                                            : linkCopied
                                                ? "Copied"
                                                : "Copy link"}
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <p
                                className={`text-xs leading-5 ${darkMode
                                    ? "text-[#68758b]"
                                    : "text-gray-500"
                                    }`}
                            >
                                Secure sharing lets other people access
                                this file without exposing your
                                VaultDrive credentials.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
    PERMISSION MODAL
===================================================== */}

            {permissionFile && (
                <div
                    className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
                    onClick={() => setPermissionFile(null)}
                >
                    <div
                        onClick={(event) => event.stopPropagation()}
                        className={`w-full max-w-[450px] overflow-hidden rounded-2xl border shadow-2xl ${darkMode
                            ? "border-[#29364d] bg-[#0c1423] text-white"
                            : "border-gray-200 bg-white text-gray-900"
                            }`}
                    >
                        {/* Header */}
                        <div
                            className={`flex items-center justify-between border-b px-5 py-4 ${darkMode
                                ? "border-[#222e43]"
                                : "border-gray-200"
                                }`}
                        >
                            <div className="min-w-0">
                                <p
                                    className={`text-sm font-semibold ${darkMode
                                        ? "text-white"
                                        : "text-gray-900"
                                        }`}
                                >
                                    Manage permissions
                                </p>

                                <p
                                    className={`mt-1 truncate text-xs ${darkMode
                                        ? "text-[#77849a]"
                                        : "text-gray-500"
                                        }`}
                                >
                                    {permissionFile.name}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setPermissionFile(null)}
                                className={`grid h-9 w-9 place-items-center rounded-lg transition ${darkMode
                                    ? "text-[#8b97ab] hover:bg-[#182236] hover:text-white"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <Icon
                                    name="close"
                                    size={18}
                                />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="space-y-5 p-5 sm:p-6">
                            <label
                                className={`block text-xs font-bold ${darkMode
                                    ? "text-[#cbd3e0]"
                                    : "text-gray-700"
                                    }`}
                            >
                                User email

                                <input
                                    type="email"
                                    value={permissionEmail}
                                    onChange={(event) =>
                                        setPermissionEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="person@example.com"
                                    className={`mt-2 w-full rounded-lg border px-3 py-2.5 text-sm outline-none ${darkMode
                                        ? "border-[#29354a] bg-[#101929] text-white placeholder:text-[#627087] focus:border-[#6559ff]"
                                        : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#6559ff]"
                                        }`}
                                />
                            </label>

                            <label
                                className={`block text-xs font-bold ${darkMode
                                    ? "text-[#cbd3e0]"
                                    : "text-gray-700"
                                    }`}
                            >
                                Permission

                                <select
                                    value={permissionRole}
                                    onChange={(event) =>
                                        setPermissionRole(
                                            event.target.value
                                        )
                                    }
                                    className={`mt-2 w-full rounded-lg border px-3 py-2.5 text-sm outline-none ${darkMode
                                        ? "border-[#29354a] bg-[#101929] text-white"
                                        : "border-gray-300 bg-white text-gray-900"
                                        }`}
                                >
                                    <option value="viewer">
                                        Viewer
                                    </option>

                                    <option value="editor">
                                        Editor
                                    </option>
                                </select>
                            </label>

                            <button
                                type="button"
                                onClick={savePermission}
                                disabled={permissionLoading}
                                className="w-full rounded-lg bg-[#6559ff] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#7167ff] disabled:opacity-50"
                            >
                                {permissionLoading
                                    ? "Saving…"
                                    : "Save permission"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}