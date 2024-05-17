import { Header } from "./components/Header";
import IconList from "./components/IconList";
import NavBar from "./components/NavBar";

export default async function Home() {
  return (
    <>
      <NavBar />
      <Header />
      <Header />
      <IconList />
    </>
  );
}
