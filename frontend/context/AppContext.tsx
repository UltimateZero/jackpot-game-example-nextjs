import { createContext, useContext, ReactNode, useState } from "react";

type appContextType = {
  soundEffectsEnabled: boolean;
  toggleSoundEffectsEnabled: () => void;
};

const appContextDefaultValues: appContextType = {
  soundEffectsEnabled: true,
  toggleSoundEffectsEnabled: () => {},
};

const AppContext = createContext<appContextType>(appContextDefaultValues);

export function useApp() {
  return useContext(AppContext);
}

type Props = {
  children: ReactNode;
};

export function AppProvider({ children }: Props) {
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);

  const toggleSoundEffectsEnabled = () => {
    setSoundEffectsEnabled(!soundEffectsEnabled);
  };

  const value = {
    soundEffectsEnabled,
    toggleSoundEffectsEnabled,
  };

  return (
    <>
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </>
  );
}
