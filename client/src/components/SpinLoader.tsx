import { Loader } from "lucide-react";

const SpinLoader = ({ className }: { className?: string }) => {
  return <Loader className={`animate-spin size-3 ${className}`} />;
};

export default SpinLoader;
