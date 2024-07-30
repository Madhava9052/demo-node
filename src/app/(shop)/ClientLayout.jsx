"use client"
import React from "react";
import SimpleBarReact from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import ScrollToTopButton from "../components/ScrollToTopButton";

//seperating client side logic from RootLayout
const ClientLayout = ({ children }) => {
    const scrollableNodeRef = React.createRef();
    return (
        <SimpleBarReact scrollableNodeProps={{ ref: scrollableNodeRef }} style={{ maxHeight: "100vh" }}>
            {children}
            <ScrollToTopButton scrollableNodeRef={scrollableNodeRef} />
        </SimpleBarReact>
    );
};

export default ClientLayout;