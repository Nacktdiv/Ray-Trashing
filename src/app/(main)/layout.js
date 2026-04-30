import {Navbar} from "../components/shared/navbar";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
