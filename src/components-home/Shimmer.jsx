// src/components/Shimmer.jsx
const Shimmer = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
          <div className="w-full h-32 sm:h-40 bg-gray-200 animate-pulse rounded-md mb-3"></div>
          <div className="h-4 bg-gray-200 animate-pulse mb-2 rounded"></div>
          <div className="h-3 bg-gray-200 animate-pulse mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default Shimmer;