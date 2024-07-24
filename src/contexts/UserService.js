export const UserService = {
  getUserById: async (userId, token) => {
    const response = await fetch(
      `https://lotusproject.azurewebsites.net/api/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Kullanıcı bilgileri alınamadı");
    }

    return response.json();
  },

  updateUser: async ({
    userId,
    userName,
    surname,
    pregnancyStatus,
    email,
    image,
    token,
  }) => {
    const formData = new FormData();
    formData.append("userName", userName || "");
    formData.append("surname", surname || "");
    formData.append("pregnancyStatus", pregnancyStatus || "");
    formData.append("email", email || "");

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(
      `https://lotusproject.azurewebsites.net/api/user/${userId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Kullanıcı güncellenemedi");
    }
  },
};
