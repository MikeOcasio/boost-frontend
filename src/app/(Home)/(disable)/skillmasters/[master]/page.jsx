const MasterPage = ({ params }) => {
  return (
    <div className="mt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4">
      {params.master}
    </div>
  );
};

export default MasterPage;
