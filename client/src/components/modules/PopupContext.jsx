import React, { createContext, useContext, useState } from "react";

// Create Context
const PopupContext = createContext();

// Custom Hook to use the Popup Context
export const usePopup = () => useContext(PopupContext);

// Provider Component
export const PopupProvider = ({ children }) => {
  const [activePopup, setActivePopup] = useState(null); // "settings", "dailyFeed", or null

  return (
    <PopupContext.Provider value={{ activePopup, setActivePopup }}>
      {children}
    </PopupContext.Provider>
  );
};
