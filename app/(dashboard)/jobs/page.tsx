export default async function Jobs() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
      </div>
      <div>
        <div className="h-80 bg-gray-800 rounded-lg"></div>
      </div>
    </div>
  );
}
