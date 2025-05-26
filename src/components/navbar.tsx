import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container } from "./ui/container";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Search,
  Menu,
  X,
  Home,
  Film,
  Tv,
  Heart,
  Clock,
  LogIn,
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="mr-2 h-4 w-4" /> },
    {
      name: "Movies",
      path: "/movies",
      icon: <Film className="mr-2 h-4 w-4" />,
    },
    { name: "TV Shows", path: "/tv", icon: <Tv className="mr-2 h-4 w-4" /> },
    {
      name: "Watchlist",
      path: "/watchlist",
      icon: <Heart className="mr-2 h-4 w-4" />,
    },
    {
      name: "Coming Soon",
      path: "/coming-soon",
      icon: <Clock className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/90 shadow-md" : "bg-gradient-to-b from-black/80 to-transparent"}`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-red-600">ALIENFLIX</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center text-sm font-medium text-gray-200 hover:text-white transition-colors"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="text-gray-200 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Login Button */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden text-gray-200 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-3 px-2 absolute top-16 left-0 right-0 bg-black/90">
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                placeholder="Search for movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white"
                autoFocus
              />
              <Button
                type="submit"
                className="ml-2 bg-red-600 hover:bg-red-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-black/90 border-t border-gray-800">
            <nav className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center px-4 py-3 text-gray-200 hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex items-center justify-start px-4 py-3 text-red-600 hover:bg-gray-800"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
