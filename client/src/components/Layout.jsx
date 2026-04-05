import { Navbar } from "./Navbar";

export const Layout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    <main>{children}</main>
  </div>
);
