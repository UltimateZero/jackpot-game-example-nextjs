import { createContext, useContext, ReactNode, useState } from "react";
import { createAccount, getAccount } from "../lib/get-account";

type authContextType = {
  user: string | null;
  balance: number;
  credit: number;
  updateCredit: (credit: number) => void;
  updateBalance: (balance: number) => void;
  login: () => Promise<void>;
  logout: () => void;
};

const authContextDefaultValues: authContextType = {
  user: null,
  balance: 0,
  credit: 0,
  updateCredit: () => {},
  updateBalance: () => {},
  login: async () => {},
  logout: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);

  const getFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accountId");
    }
    return null;
  };

  const saveToLocalStorage = (accountId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accountId", accountId);
    }
  };

  const login = async () => {
    const accountId = getFromLocalStorage();
    if (accountId) {
      setUser(accountId);
      return getAccount(accountId).then(({ data }) => {
        setBalance(data.balance);
        setCredit(data.credit);
        return data
      });
    } else {
        console.log("create account");
      return createAccount().then(({ data }) => {
        saveToLocalStorage(data.id);
        setUser(data.id);
        setBalance(data.balance);
        setCredit(data.credit);
        return data
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateCredit = (credit: number) => {
    setCredit(credit);
  }
  const updateBalance = (balance: number) => {
    setBalance(balance);
  }



  const value = {
    user,
    balance,
    credit,
    login,
    logout,
    updateCredit,
    updateBalance
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
