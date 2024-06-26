import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { Header } from "./components/Header";
import MobileNav from "./components/MobileNav";
import NavBar from "./components/NavBar";
import Project from "./components/Project";
import Skills from "./components/Skills";

export default async function Home() {
  return (
    <div className="max-h-screen max-lg:overflow-x-hidden max-lg:px-6 overflow-y-scroll snap-y snap-mandatory max-lg:text-sm">
      <NavBar />
      <MobileNav />
      <Header />
      <About />
      <Skills />
      <Project />
      <Contact />
      <Footer />
    </div>
  );
}
