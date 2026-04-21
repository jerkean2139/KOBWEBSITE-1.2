import Navigation from "./Navigation";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  navVariant?: "red";
  noFooter?: boolean;
  noNav?: boolean;
  footerVariant?: "default" | "insurance";
}

export default function Layout({
  children,
  navVariant,
  noFooter = false,
  noNav = false,
  footerVariant = "default",
}: LayoutProps) {
  return (
    <>
      {!noNav && <Navigation logoVariant={navVariant} />}
      {children}
      {!noFooter && <Footer variant={footerVariant} />}
    </>
  );
}
