import { Container } from "./ui/container";
import { Facebook, Twitter, Instagram, Youtube, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/90 text-gray-400 py-12 mt-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">ALIENFLIX</h3>
            <p className="text-sm">
              A movie and TV show streaming platform clone built with React,
              Vite, and TMDB API.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/movies"
                  className="hover:text-white transition-colors"
                >
                  Movies
                </a>
              </li>
              <li>
                <a href="/tv" className="hover:text-white transition-colors">
                  TV Shows
                </a>
              </li>
              <li>
                <a
                  href="/coming-soon"
                  className="hover:text-white transition-colors"
                >
                  Coming Soon
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  DMCA
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a
                href="https://github.com"
                className="hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>
            &copy; {currentYear} ALIENFLIX. This is a clone website for
            educational purposes only.
          </p>
          <p className="mt-2">
            Powered by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              TMDB API
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
