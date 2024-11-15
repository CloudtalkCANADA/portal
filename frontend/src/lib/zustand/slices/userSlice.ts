import { StateCreator } from "zustand";

export interface UserSlice {
  userData: {
    isAuthenticated: boolean;
    isAdmin: boolean;
    email: string;
    username: string;
    contact_name_given: string;
    contact_name_family: string;
    token: string;
    expireTime: number;
    loginTime: number;
  };
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setEmail: (email: string) => void;
  setUserName: (username: string) => void;
  setToken: (token: string) => void;
  setExpireTime: (expireTime: number) => void;
  setLoginTime: (loginTime: number) => void;
  setUserData: (
    isAuthenticated: boolean,
    isAdmin: boolean,
    email: string,
    username: string,
    contact_name_given: string,
    contact_name_family: string,
    token: string,
    expireTime: number,
    loginTime: number
  ) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  userData: {
    isAuthenticated: false,
    isAdmin: false,
    email: "",
    username: "",
    contact_name_given: "",
    contact_name_family: "",
    token: "",
    expireTime: 0,
    loginTime: 0,
  },
  setIsAuthenticated: (isAuthenticated: boolean) => {
    const userData = get().userData;
    userData.isAuthenticated = isAuthenticated;

    set({ userData });
  },
  setIsAdmin: (isAdmin: boolean) => {
    const userData = get().userData;
    userData.isAdmin = isAdmin;

    set({ userData });
  },
  setEmail: (email: string) => {
    const userData = get().userData;
    userData.email = email;

    set({ userData });
  },
  setUserName: (username: string) => {
    const userData = get().userData;
    userData.username = username;

    set({ userData });
  },
  setToken: (token: string) => {
    const userData = get().userData;
    userData.token = token;

    set({ userData });
  },
  setExpireTime: (expireTime: number) => {
    const userData = get().userData;
    userData.expireTime = expireTime;

    set({ userData });
  },
  setLoginTime: (loginTime: number) => {
    const userData = get().userData;
    userData.loginTime = loginTime;

    set({ userData });
  },
  setUserData: (
    isAuthenticated: boolean,
    isAdmin: boolean,
    email: string,
    username: string,
    contact_name_given: string,
    contact_name_family: string,
    token: string,
    expireTime: number,
    loginTime: number
  ) => {
    const userData = get().userData;
    userData.isAuthenticated = isAuthenticated;
    userData.isAdmin = isAdmin;
    userData.email = email;
    userData.username = username;
    userData.contact_name_given = contact_name_given;
    userData.contact_name_family = contact_name_family;
    userData.token = token;
    userData.expireTime = expireTime;
    userData.loginTime = loginTime;

    set({ userData });
  },
});
