import React from "react";
import TopNav from "./TopNav";
import IconNavBar from "./IconNavBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <TopNav />
      <IconNavBar />
      {children}
    </>
  );
};

export default Layout;
