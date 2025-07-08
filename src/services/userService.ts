import type { User, ApiResponse, UserUpdateData } from '@/types/User';

/**
 * Service layer for user-related API operations
 */
export const userService = {
  /**
   * Fetches user data from the API
   * @param userId - The user ID to fetch
   * @returns Promise resolving to user data
   * @example
   * const user = await userService.getUser('123');
   */
  async getUser(userId: string): Promise<ApiResponse<User>> {
    console.log('Fetching user data for ID:', userId);
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User data fetched successfully:', data);
      
      return {
        data,
        message: 'User fetched successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      
      return {
        data: {} as User,
        message: 'Failed to fetch user',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Updates user data
   * @param userId - The user ID to update
   * @param updateData - Data to update
   * @returns Promise resolving to updated user data
   * @example
   * const updatedUser = await userService.updateUser('123', { name: 'New Name' });
   */
  async updateUser(userId: string, updateData: UserUpdateData): Promise<ApiResponse<User>> {
    console.log('Updating user:', userId, 'with data:', updateData);
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User updated successfully:', data);
      
      return {
        data,
        message: 'User updated successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      
      return {
        data: {} as User,
        message: 'Failed to update user',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Deletes a user
   * @param userId - The user ID to delete
   * @returns Promise resolving to deletion confirmation
   * @example
   * const result = await userService.deleteUser('123');
   */
  async deleteUser(userId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    console.log('Deleting user:', userId);
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = { deleted: true };
      console.log('User deleted successfully');
      
      return {
        data,
        message: 'User deleted successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      
      return {
        data: { deleted: false },
        message: 'Failed to delete user',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Fetches all users with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of users per page (default: 10)
   * @returns Promise resolving to paginated user list
   * @example
   * const users = await userService.getAllUsers(1, 20);
   */
  async getAllUsers(page = 1, limit = 10): Promise<ApiResponse<User[]>> {
    console.log('Fetching all users:', { page, limit });
    
    try {
      const response = await fetch(`/api/users?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Users fetched successfully:', data);
      
      return {
        data,
        message: 'Users fetched successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      
      return {
        data: [],
        message: 'Failed to fetch users',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
}; 