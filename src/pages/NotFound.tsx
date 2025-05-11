import { useEffect } from "react";
import { useRouterState, Link } from "@tanstack/react-router"; // Changed import and added Link

const NotFound = () => {
  const routerState = useRouterState(); // Get the router state
  const pathname = routerState.location.pathname; // Access pathname

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        {/* Changed anchor tag to Link component */}
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
