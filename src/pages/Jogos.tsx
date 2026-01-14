import LiveGames from "../components/LiveGames";
import Navbar from "../components/Navbar";
import Footer from "../components/sections/Footer";

export default function Jogos() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <LiveGames />
      </div>
      <Footer />
    </div>
  );
}