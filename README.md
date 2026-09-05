# VaultDrive

VaultDrive is a full-stack file management system that allows users to securely upload, manage, organize, search, share, star, version, and delete files through a modern web interface.

## Features

- User registration and login
- JWT-based authentication
- Google OAuth authentication
- Secure file upload and storage
- File rename and update
- Folder creation and organization
- Folder hierarchy and navigation
- File sharing with permissions
- Search functionality
- Pagination and lazy loading
- Recent files
- Starred files
- Trash management
- File restoration
- Permanent file and folder deletion
- File versioning and version history
- Account section
- Responsive dashboard
- Light and dark mode
- Toast notifications and error handling

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- Axios
- Supabase Authentication

### Backend
- Node.js
- Express.js
- PostgreSQL
- Supabase
- JWT
- bcrypt
- Multer

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Supabase PostgreSQL
- File Storage: Supabase Storage

## Project Structure

```text
VaultDrive-Frontend/
├── public/
├── src/
│   ├── components/
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── services/
│   │   └── DriveService.js
│   └── ...
├── .env
├── package.json
└── README.md

## Authentication

VaultDrive supports two authentication methods:

1. Email and password authentication using bcrypt and JWT.
2. Google OAuth authentication using Supabase Auth.

After successful authentication, the application receives a VaultDrive JWT token which is used to access protected backend APIs.

## File Management

Users can securely manage their files through the VaultDrive dashboard.

Supported operations include:

- Upload files
- Download files
- Rename files
- Update files
- Delete files
- Restore deleted files
- Permanently delete files
- Star and unstar files
- View recent files
- Search files
- Organize files into folders

## Folder Management

VaultDrive provides folder-based file organization.

Users can:

- Create folders
- Open folders
- Navigate through folder hierarchy
- Rename folders
- Delete folders
- Restore deleted folders
- Permanently delete folders

## File Sharing & Permissions

VaultDrive supports secure file sharing through shareable links and permission-based access.

Features include:

- Generate shareable file links
- Role-based file permissions
- Secure access to shared files
- Signed URLs for protected file downloads

## Search & Pagination

VaultDrive uses PostgreSQL full-text search to provide efficient file searching.

The dashboard also supports pagination to avoid loading large numbers of files at once.

Additional optimization features include:

- Search result pagination
- Lazy loading
- Sorting by name, size, and date
- Recent file filtering

## Starred Files

Users can mark important files as starred for quick access.

The Starred section provides:

- Star a file
- Unstar a file
- View all starred files
- Persistent starred status through the backend

## Trash Management

Deleted files and folders are moved to the Trash using soft deletion.

Users can:

- View deleted files and folders
- Restore files
- Restore folders
- Permanently delete files
- Permanently delete folders

Permanent deletion removes the corresponding database record and stored file from Supabase Storage.

## File Versioning

VaultDrive maintains version history for updated files.

Each file version stores:

- Version number
- File name
- Storage path
- File size
- MIME type
- Creation timestamp

This allows file changes to be tracked over time.

## Account Management

The Account section provides access to the currently authenticated user's account information.

It displays:

- User name
- Email address
- Authentication information
- Logout functionality

## Responsive Design

The VaultDrive dashboard is designed to work across different screen sizes.

The frontend includes:

- Responsive sidebar navigation
- Mobile-friendly dashboard layout
- Responsive file cards
- Responsive search and sorting controls
- Mobile-friendly pagination
- Adaptive UI components

## Theme Support

VaultDrive supports both:

- Light mode
- Dark mode

The dashboard adapts its navigation, cards, buttons, text, and other UI elements according to the selected theme.

## Error Handling

The application provides user-friendly feedback through toast notifications and error messages.

Error handling is implemented for:

- Authentication failures
- File upload failures
- File operation failures
- Search failures
- Trash operations

- Starred file operations
- Network/API errors

## Environment Variables

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL= your_backend_url
VITE_SUPABASE_URL= your_supabase_url
VITE_SUPABASE_ANON_KEY= your_supabase_publishable_key

## Development Progress

VaultDrive was developed incrementally through a 14-day implementation cycle. Each phase focused on a specific part of the application, followed by testing and verification.

---

### Day 1 – Project Setup

**Focus:** Backend initialization and database connectivity.

Implemented:

- Initialized the VaultDrive backend
- Set up Node.js and Express
- Connected PostgreSQL using Supabase
- Configured environment variables
- Established database connectivity
- Created the initial backend project structure

**Evidence:**

![Day 1 – Backend Project Setup](docs/day-1/day-1-project-setup.png)

---

### Day 2 – Authentication

**Focus:** Secure user authentication.

Implemented:

- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Authentication middleware
- Protected API routes
- Google OAuth authentication using Supabase Auth

**Evidence:**

![Day 2 – Authentication](docs/day-2/day-2-authentication.png)

---

### Day 3 – File Upload & Storage

**Focus:** Secure file uploading and cloud storage.

Implemented:

- File upload API
- Multer middleware
- File size validation
- Supabase Storage integration
- Secure storage paths
- User-specific file storage
- File upload testing using Postman

**Evidence:**

![Day 3 – File Upload](docs/day-3/day-3-file-upload.png)

---

### Day 4 – File Management APIs

**Focus:** File and folder management.

Implemented:

- File CRUD operations
- File rename functionality
- File update functionality
- Folder creation
- Folder hierarchy
- Soft deletion
- Trash APIs
- Folder management APIs

**Evidence:**

![Day 4 – File Management APIs](docs/day-4/day-4-file-management.png)

---

### Day 5 – Sharing & Permissions

**Focus:** Secure file sharing and access control.

Implemented:

- Shareable file links
- Role-based permissions
- Permission-based file access
- Secure shared file access
- Signed URLs for protected downloads
- Sharing and permission API testing

**Evidence:**

![Day 5 – Sharing and Permissions](docs/day-5/day-5-sharing-permissions.png)

---

### Day 6 – Search & Optimization

**Focus:** Efficient file discovery and API optimization.

Implemented:

- PostgreSQL full-text search
- File search API
- Search result pagination
- Pagination for file retrieval
- Lazy loading
- Sorting functionality
- Optimized file retrieval queries

**Evidence:**

![Day 6 – Search API](docs/day-6/day-6-search-api.png)

---

### Day 7 – Testing & Backend Deployment

**Focus:** Backend testing and production deployment.

Implemented:

- API testing using Postman
- Jest test setup
- Supertest API testing
- Authentication API testing
- File management API testing
- Folder API testing
- Sharing and permission API testing
- Search and pagination API testing
- Backend deployment using Render

**Evidence:**

![Day 7 – Backend Testing](docs/day-7/day-7-testing.png)

![Day 7 – Backend Deployment](docs/day-7/day-7-deployment.png)

---

### Day 8 – Frontend Setup

**Focus:** React frontend initialization.

Implemented:

- Created React frontend using Vite
- Configured Tailwind CSS
- Added Axios
- Configured Supabase client
- Connected frontend with backend APIs
- Created login interface
- Created initial dashboard structure
- Configured frontend environment variables

**Evidence:**

![Day 8 – Frontend Setup](docs/day-8/day-8-frontend-setup.png)

---

### Day 9 – Dashboard UI

**Focus:** Building the main VaultDrive user interface.

Implemented:

- VaultDrive dashboard
- Sidebar navigation
- File and folder display
- File cards and previews
- Search interface
- Sorting controls
- Recent files section
- Account section
- Light and dark mode
- Responsive dashboard components

**Evidence:**

![Day 9 – Dashboard](docs/day-9/day-9-dashboard.png)

---

### Day 10 – File Upload Management

**Focus:** Connecting the dashboard with file management APIs.

Implemented:

- Frontend file upload
- File upload interface
- File upload API integration
- File rename
- File update
- File download
- File deletion
- File operation feedback
- Improved file management interactions

**Evidence:**

![Day 10 – File Upload Management](docs/day-10/day-10-file-management.png)

---

### Day 11 – File Organization & Dashboard Features

**Focus:** Improving file organization and dashboard functionality.

Implemented:

- Folder navigation
- Folder hierarchy
- Folder creation
- Folder rename
- Folder deletion
- Recent files
- Starred files
- Star and unstar functionality
- Account functionality
- Responsive navigation
- Improved dashboard interactions

**Evidence:**

![Day 11 – File Organization](docs/day-11/day-11-file-organization.png)

---

### Day 12 – Search Optimization & Pagination

**Focus:** Improving search performance and navigation.

Implemented:

- Frontend search integration
- PostgreSQL full-text search integration
- Search result pagination
- Numbered pagination controls
- Gmail-style pagination
- Lazy loading
- Sorting and filtering
- Improved search result handling
- Improved pagination UI

**Evidence:**

![Day 12 – Search and Pagination](docs/day-12/day-12-search-pagination.png)

---

### Day 13 – Trash, Versioning & Final Testing

**Focus:** Completing file lifecycle management and version tracking.

Implemented:

- Trash management
- Deleted file and folder listing
- File restoration
- Folder restoration
- Permanent file deletion
- Permanent folder deletion
- File versioning
- File version history
- Version number tracking
- File metadata tracking for each version
- Version history API testing
- Trash operation testing
- Permanent deletion testing
- Final backend testing

**Version History Verification:**

![Day 13 – File Version History](docs/day-13/day-13-version-history.png)

**Trash & Restore Verification:**

![Day 13 – Trash Management](docs/day-13/day-13-trash.png)

**Permanent Delete Verification:**

![Day 13 – Permanent Delete](docs/day-13/day-13-permanent-delete.png)

---

### Day 14 – Deployment & Final Touches

**Focus:** Production deployment, responsive improvements, and final verification.

Implemented:

- Prepared frontend for production deployment
- Configured production environment variables
- Connected frontend with the deployed backend
- Deployed frontend using Vercel
- Improved mobile responsiveness
- Optimized dashboard layouts
- Fixed final UI issues
- Fixed final functionality issues
- Improved application performance
- Performed final end-to-end testing

**Evidence:**

![Day 14 – Frontend Deployment](docs/day-14/day-14-vercel-deployment.png)

![Day 14 – Responsive Dashboard](docs/day-14/day-14-responsive-dashboard.png)

---

## Testing & Verification

VaultDrive was tested throughout development using both automated and manual testing.

### Automated Testing

Backend API tests were implemented using **Jest** and **Supertest**.

Final test result:

```text
Test Suites: 7 passed, 7 total
Tests:       10 passed, 10 total