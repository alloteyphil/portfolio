import About from "./components/About";
import { Header } from "./components/Header";
import IconList from "./components/IconList";
import NavBar from "./components/NavBar";
import Skills from "./components/Skills";

export default async function Home() {
  return (
    <div className="max-h-screen overflow-y-scroll snap-y snap-mandatory">
      <NavBar />
      <Header />
      <IconList />
      <About />
      <Skills />
    </div>
  );
}
