import React from "react";
import TopNav from "./TopNav";
import IconNavBar from "./IconNavBar";
import { Box } from "@chakra-ui/core";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <TopNav />
      <IconNavBar />
      <Box p={4} maxW="75rem" mx="auto">
        {children}
      </Box>
    </>
  );
};

export default Layout;
