"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store/store";
import { RefineContext } from "./_refine_context";
import Sidebar from "./Sidebar/sidebar";
import Navbar from "./Navbar/navbar";
import "../styles/global.css";
import { Toaster } from "@/components/ui/sonner";
import { TabProvider } from "./context/TabContext";
//import LoginPage from "./LoginPage/page";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body className="m-0 p-0">
       
          <RefineContext>
            <TabProvider>
            <div className="flex h-[100vh]">
              <Sidebar />
              <div className="flex flex-1 flex-col">
                <Navbar />

                <div className="flex-1 overflow-y-auto">{children}</div>
                <Toaster richColors position="top-center"/>
              </div>
            </div>
            </TabProvider>
          </RefineContext>
          {/* <LoginPage/> */}
       
      </body>
    </html>
  );
}
