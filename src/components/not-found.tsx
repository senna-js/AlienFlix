import { Container } from "./ui/container";
import { Button } from "./ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen pt-16">
      <Container className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-red-600 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-400 max-w-md mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="w-full max-w-xs h-1 bg-gray-800 mb-8"></div>
        <Link to="/">
          <Button className="bg-red-600 hover:bg-red-700">
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </Container>
    </div>
  );
}
