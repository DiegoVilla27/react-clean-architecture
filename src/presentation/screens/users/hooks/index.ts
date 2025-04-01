import { useEffect, useState } from 'react';
import userUseCases from '@core/services/users';
import { UserEntity } from '@domain/entities/users';
import { ETypeToast, IToast } from '@presentation/shared/toast';

/**
 * Custom hook to manage user data and toast notifications.
 * 
 * This hook provides functionalities to fetch, create, edit, and delete users,
 * while also managing toast notifications for each operation. It initializes
 * with an empty list of users and no active toast. The hook returns the current
 * list of users, the active toast, and functions to create, edit, and delete users.
 * 
 * @returns {Object} An object containing:
 * - `users`: The current list of users.
 * - `toast`: The current toast notification, if any.
 * - `createFn`: Function to create a new user.
 * - `editFn`: Function to edit an existing user.
 * - `deleteFn`: Function to delete a user by ID.
 */
export const useUsers = () => {

  const [users, setUsers] = useState<UserEntity[]>([]);
  const [toast, setToast] = useState<IToast | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const allUsers = await userUseCases.getAllUsers();
    setUsers(allUsers.users);
  };

  const createFn = async (user: UserEntity) => {
    const userCreated = await userUseCases.createUser(user);
    showToast(`User ${userCreated.name} created`, ETypeToast.SUCCESS);
    await fetchUsers();
  }

  const editFn = async (user: UserEntity) => {
    const userUpdated = await userUseCases.updateUser(user);
    showToast(`User ${userUpdated.name} updated`, ETypeToast.SUCCESS);
    await fetchUsers();
  }

  const deleteFn = async (id: string) => {
    const userDeleted = await userUseCases.deleteUser(id);
    showToast(`User ${userDeleted.name} deleted`, ETypeToast.SUCCESS);
    await fetchUsers();
  }

  /**
   * Displays a toast notification with a specified message and type.
   * 
   * @param message - The message to be displayed in the toast.
   * @param type - The type of the toast, which determines its styling and behavior.
   */
  const showToast = (message: string, type: ETypeToast) => {
    setToast(null);

    setTimeout(() => {
      setToast({ message, type });
    }, 100);
  };

  return {
    toast,
    users,
    createFn,
    editFn,
    deleteFn,
  }
}

export default useUsers;