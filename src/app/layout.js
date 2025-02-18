"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import Nav from "../components/Nav";
import "./globals.css";
import { AuthContextProvider } from "@/config/AuthContext";
import { ErrorContext } from "@/context/ErrorContext";
import Error from "@/components/Error";
import { DialogContext } from "@/context/DialogContext";
import { AppUserContextProvider } from "@/context/AppUserContext";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/maps/maps.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://api.tomtom.com/maps-sdk-for-web/cdn/plugins/SearchBox/3.2.0/SearchBox.css"
        />
      </head>
      <body>
        <AuthContextProvider>
          <AppUserContextProvider>
            <DialogContext>
              <ErrorContext>
                <Nav />
                <div className="main">
                  <div className="gradient" />
                </div>
                <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
                <Error />
              </ErrorContext>
            </DialogContext>
          </AppUserContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
