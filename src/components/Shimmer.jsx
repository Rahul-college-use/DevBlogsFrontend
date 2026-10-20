export function ShimmerDemo({ message = "Loading " }) {
  return (
    <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl flex items-center justify-center border border-gray-200 w-full">
      <p className="shimmer text-sm font-semibold">
        {message}&hellip;
      </p>
    </div>
  );
}