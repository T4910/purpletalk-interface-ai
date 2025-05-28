import { Link } from "@tanstack/react-router"; // Changed import
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Home,
  MessageSquare,
  Search,
  Building,
  Key,
  Compass,
  Github,
} from "lucide-react";
import { TextAnimate } from "@/components/magicui/text-animate";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { useIsAuthenticated } from "@/services/provider/auth";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-chat-bg to-gray-950 text-white overflow-auto">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-lg bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/c/new"
            className="text-2xl font-bold text-primary flex items-center gap-2"
          >
            <Home className="h-6 w-6" />
            Realyze
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              hash="features"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              to="/"
              hash="how-it-works"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            {/* <Link
              to="/login"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link> */}
          </nav>
          <HeaderActionBtn />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 lg:pt-56 md:pb-32 lg:min-h-screen overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedGradientText
              speed={2}
              colorFrom="#a888fb"
              colorTo="#a680ea"
              className="text-4xl md:text-6xl font-bold"
            >
              <TextAnimate
                animation="slideUp"
                by="word"
                as="span"
                duration={1}
                once
              >
                Find Your Dream Home with AI-Powered Real Estate
              </TextAnimate>
            </AnimatedGradientText>
            <p
              className={`text-lg md:text-xl text-gray-300 mt-6 mb-8 max-w-2xl mx-auto transition-all duration-700 delay-300`}
            >
              Realyze uses AI to understand your preferences and help you
              discover the perfect property faster and easier than ever before.
            </p>
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500`}
            >
              <CallToAction />
            </div>
          </div>
        </div>

        {/* Animated gradient blob */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-transparent to-gray-900"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Powerful Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div
              className={`bg-secondary/20 border border-white/10 rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Chat Assistant</h3>
              <p className="text-gray-300">
                Chat naturally with our AI to describe your ideal property. No
                more endless form filling or complex searches.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className={`bg-secondary/20 border border-white/10 rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg`}
              style={{ transitionDelay: "150ms" }}
            >
              <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Search className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Property Search</h3>
              <p className="text-gray-300">
                Our AI understands your needs and preferences, showing you only
                properties that truly match what you're looking for.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className={`bg-secondary/20 border border-white/10 rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Building className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Detailed Insights</h3>
              <p className="text-gray-300">
                Get in-depth information about neighborhoods, property values,
                and market trends to make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-b from-gray-900 to-chat-bg"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Chat with AI</h3>
              <p className="text-gray-300">
                Describe your ideal property in natural language, just like
                talking to a real estate agent.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Discover Properties</h3>
              <p className="text-gray-300">
                Browse AI-curated listings that match your unique requirements
                and preferences.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Find Your Home</h3>
              <p className="text-gray-300">
                Connect with sellers or agents to visit properties and make your
                dream home a reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-b from-chat-bg to-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  See Realyze in Action
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Watch how easy it is to find your perfect property using our
                  AI-powered chat interface. No more endless browsing through
                  listings.
                </p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/signup">Try it yourself</Link>
                </Button>
              </div>
              <div className="bg-gradient-to-tr from-primary/20 to-accent/20 rounded-xl p-3">
                <AspectRatio
                  ratio={16 / 9}
                  className="overflow-hidden rounded-lg"
                >
                  <div className="w-full h-full bg-chat-bg border border-white/10 rounded-lg flex items-center justify-center">
                    <div className="text-center p-4">
                      <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                      <p className="text-white text-lg font-medium">
                        AI Chat Demo
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Interactive demo would be displayed here
                      </p>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-chat-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who've already found their perfect
              property with Realyze's AI-powered search.
            </p>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg"
            >
              <Link to="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <Link
                to="/"
                className="text-xl font-bold text-primary flex items-center gap-2"
              >
                <Home className="h-5 w-5" />
                Realyze
              </Link>
              <p className="text-gray-400 mt-2 text-sm">
                AI-powered real estate discovery
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h3 className="text-white font-medium mb-4">Product</h3>
                <ul className="space-y-2 flex-col">
                  <li>
                    <Link
                      to="/"
                      hash="features"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      hash="how-it-works"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      How it Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-4">Support</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      hash=""
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      hash=""
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      hash=""
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1 mt-8 md:mt-0">
                <h3 className="text-white font-medium mb-4">Contributors</h3>
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <Link
                    href="https://github.com/T4910/purpletalk-interface-ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Github className="h-5 w-5" />
                      <span className="text-sm">GitHub</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Realyze. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const CallToAction = () => {
  const isAuth = useIsAuthenticated();

  return (
    <>
      {isAuth ? (
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg z-20"
        >
          <Link to="/c/dashboard">Go to Dashboard</Link>
        </Button>
      ) : (
        <>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg z-20"
          >
            <Link to="/signup">Get Started</Link>
          </Button>
          {/* <Button
            asChild
            variant="outline"
            className="border-white/20 hover:bg-white/10 px-8 py-6 text-lg max-md:hidden"
          >
            <Link to="/login">Sign In</Link>
          </Button> */}
        </>
      )}
    </>
  );
};

const HeaderActionBtn = () => {
  const isAuth = useIsAuthenticated();

  return (
    <>
      {isAuth ? (
        <Button
          asChild
          size="sm"
          variant="outline"
          className="border-white/20 hover:bg-white/10"
        >
          <Link to="/c/new">New Chat</Link>
        </Button>
      ) : (
        <Button
          asChild
          size="sm"
          variant="outline"
          className="border-white/20 hover:bg-white/10"
        >
          <Link to="/login">Sign In</Link>
        </Button>
      )}
    </>
  );
};

export default Landing;
