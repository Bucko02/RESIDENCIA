// services/apiService.ts
const API_URL = process.env.API_URL;

export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  blocked: boolean;
};

// Obtener todos los usuarios
export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error("Error al obtener los usuarios");
  }
  const data = await response.json();
  return data;
};

// Crear un nuevo usuario
export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error("Error al crear el usuario");
  }
  return response.json();
};

// Actualizar un usuario
export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar el usuario");
  }
  return response.json();
};

// Eliminar un usuario
export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar el usuario");
  }
};