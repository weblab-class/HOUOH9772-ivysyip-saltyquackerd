import React, { createContext, useState, useContext } from "react";

// Create Context
const PopupContext = createContext();

// Custom Hook to use the Popup Context
export const usePopup = () => useContext(PopupContext);

// Provider Component
export const PopupProvider = ({ children }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  return (
    <PopupContext.Provider value={{ isPopupOpen, setPopupOpen }}>{children}</PopupContext.Provider>
  );
};
