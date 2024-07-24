import create from "zustand";
import { UserService } from "./UserService";

const useUserStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  fetchUserById: async (userId) => {
    const token = localStorage.getItem("token");
    const user = await UserService.getUserById(userId, token);
    set({ user });
  },
  updateUser: async (updatedAttributes) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;
    const updatedUser = { ...user, ...updatedAttributes };

    await UserService.updateUser({
      ...updatedUser,
      token,
    });

    set({ user: updatedUser });
    localStorage.setItem("user", JSON.stringify(updatedUser));
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    set({ user: null, token: null });
  },
}));

export default useUserStore;
