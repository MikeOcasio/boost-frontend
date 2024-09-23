import Link from "next/link";

const AdminLayout = ({ children }) => {
  const isAdmin = true;

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6 text-center">
        You are not authorized to access this page
        <div className="mt-4">
          <Link href="/">
            <button className="bg-gray-500 px-4 py-2 rounded-md text-white">
              Go Back
            </button>
          </Link>
        </div>
      </div>
    );
  }
  return <div>{children}</div>;
};

export default AdminLayout;
