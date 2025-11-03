import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
            <Footer />
        </div>
    );
}