import React, { createContext, useContext } from "react";
import PopupComponent, { usePopup, PopupProps } from "@/components/PopupComponent";

interface PopupContextType {
  openPopup: (props: Partial<PopupProps>) => void;
  closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | null>(null);

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, openPopup, closePopup, popupProps } = usePopup();

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}

      {/* Global popup */}
      <PopupComponent
        isOpen={isOpen}
        onClose={closePopup}
        {...popupProps}
      />
    </PopupContext.Provider>
  );
};

export const useGlobalPopup = () => {
  const context = useContext(PopupContext);
  if (!context) throw new Error("useGlobalPopup must be used inside PopupProvider");
  return context;
};
