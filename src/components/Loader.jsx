import { Loader } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <Loader className="animate-spin w-12 h-12 text-gray-600" />
    </div>
  );
};