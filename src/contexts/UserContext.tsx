import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDatabase } from './DatabaseContext';

interface UserInfo {
  id: number;
  name: string;
  birthDate: string;
  birthTime: string;
}

interface UserContextType {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { database, isReady } = useDatabase();

  useEffect(() => {
    if (isReady) {
      loadUserFromStorage();
    }
  }, [isReady]);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_info');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserState(parsedUser);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUser = async (userInfo: UserInfo) => {
    try {
      await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
      setUserState(userInfo);
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };

  const clearUser = async () => {
    try {
      await AsyncStorage.removeItem('user_info');
      setUserState(null);
    } catch (error) {
      console.error('Error clearing user from storage:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
