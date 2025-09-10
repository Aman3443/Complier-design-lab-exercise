import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Header />
      <main className="container py-8">{children}</main>
      <Footer />
    </div>
  );
}