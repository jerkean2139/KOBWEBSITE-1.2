import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { APP_TITLE } from "@/const";

export default function Navigation({ logoVariant = "default" }: { logoVariant?: "default" | "red" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    menuToggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobileMenu();
        return;
      }

      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl?.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, closeMobileMenu]);

  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      const firstFocusable = mobileMenuRef.current.querySelector<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [mobileMenuOpen]);

  const navigateToSection = (sectionId: string) => {
    const isHomePage = window.location.pathname === "/" || window.location.pathname === "";
    
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.assign(`/#${sectionId}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <header>
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0f172a]/95 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-[#0f172a]"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="/"
            className="hover:opacity-80 transition-opacity shrink-0 mr-8"
            aria-label="Go to homepage"
          >
            {logoVariant === "red" ? (
              <span className="flex items-baseline gap-1">
                <span className="text-red-500 font-bold text-2xl tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>KEAN</span>
                <span className="text-white/60 font-normal text-sm tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>ON</span>
                <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>BIZ</span>
              </span>
            ) : (
              <img 
                src="/kean-on-biz-logo.png" 
                alt="Kean on Biz" 
                className="h-auto w-[185px]"
              />
            )}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 ml-auto">
            <a
              href="/about"
              className="text-white hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide"
            >
              About
            </a>
            <a
              href="/#services"
              onClick={(e) => { e.preventDefault(); navigateToSection("services"); }}
              className="text-white hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide"
            >
              Services
            </a>
            <a
              href="/blog"
              className="text-white hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide"
            >
              Blog
            </a>
            <a
              href="/contact"
              className="text-white hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuToggleRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-primary transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="md:hidden bg-[#0f172a] border-t border-white/10 fixed inset-x-0 top-20 bottom-0 overflow-y-auto"
        >
          <div className="container py-6 flex flex-col gap-2">
            <a
              href="/about"
              onClick={() => closeMobileMenu()}
              className="text-left text-white hover:text-primary transition-colors font-medium py-4 px-2 text-sm uppercase tracking-wide min-h-[44px] flex items-center"
            >
              About
            </a>
            <a
              href="/#services"
              onClick={(e) => { e.preventDefault(); navigateToSection("services"); closeMobileMenu(); }}
              className="text-left text-white hover:text-primary transition-colors font-medium py-4 px-2 text-sm uppercase tracking-wide min-h-[44px] flex items-center"
            >
              Services
            </a>
            <a
              href="/blog"
              onClick={() => closeMobileMenu()}
              className="text-left text-white hover:text-primary transition-colors font-medium py-4 px-2 text-sm uppercase tracking-wide min-h-[44px] flex items-center"
            >
              Blog
            </a>
            <a
              href="/contact"
              onClick={() => closeMobileMenu()}
              className="text-left text-white hover:text-primary transition-colors font-medium py-4 px-2 text-sm uppercase tracking-wide min-h-[44px] flex items-center"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
    </header>
  );
}
