"use client";

import { createContext, useContext, useState } from "react";

const UserProfileContext = createContext({});

export const UserProfileWrapper = ({ children }) => {
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [route, setRoute] = useState("console");
  return (
    <UserProfileContext.Provider
      value={{
        connectedWallet,
        setConnectedWallet,
        route,
        setRoute,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => useContext(UserProfileContext);
