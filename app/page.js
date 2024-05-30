import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { Header } from "./components/Header";
import IconList from "./components/IconList";
import MobileNav from "./components/MobileNav";
import NavBar from "./components/NavBar";
import Project from "./components/Project";
import Skills from "./components/Skills";

export default async function Home() {
  return (
    <div className="max-h-screen max-lg:overflow-x-hidden max-lg:px-6 overflow-y-scroll snap-y snap-mandatory">
      <NavBar />
      <MobileNav />
      <Header />
      <IconList />
      <About />
      <Skills />
      <Project />
      <Contact />
      <Footer />
    </div>
  );
}
