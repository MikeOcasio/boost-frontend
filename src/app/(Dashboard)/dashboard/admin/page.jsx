import AdminTabs from "../../_components/AdminTabs";

const UserDashboard = () => {
  const user = { name: "Nikhil", isAdmin: true };

  return (
    <div className="px-4 space-y-6">
      <h2 className="text-center text-lg font-semibold">
        Welcome, {user.name}
      </h2>

      {/* Admin tab*/}
      {user.isAdmin && (
        <>
          <AdminTabs />
          {/* featured Games */}
          {/* active Users */}
          {/* recent Orders */}
        </>
      )}
    </div>
  );
};

export default UserDashboard;
