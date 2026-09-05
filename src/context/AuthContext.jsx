import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  isFirebaseConfigured,
  subscribeCollection,
  saveDocument,
  updateDocument,
  deleteDocument
} from '../services/firebase';

const INITIAL_USERS = [
  {
    id: 'usr-1',
    username: 'superadmin',
    password: 'super123',
    name: 'Hendra Wijaya',
    role: 'superadmin',
    roleLabel: 'Super Admin',
    email: 'superadmin@violettravel.id',
    phone: '0812-1111-2222',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-2',
    username: 'admin',
    password: 'admin123',
    name: 'Siti Rahma',
    role: 'admin',
    roleLabel: 'Admin Operasional',
    email: 'siti.rahma@violettravel.id',
    phone: '0813-2222-3333',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-3',
    username: 'sopir.budi',
    password: 'sopir123',
    name: 'Budi Santoso',
    role: 'sopir',
    roleLabel: 'Sopir HiAce',
    driverId: 'drv-1',
    phone: '0812-3456-7801',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-4',
    username: 'sopir.agus',
    password: 'sopir123',
    name: 'Agus Prabowo',
    role: 'sopir',
    roleLabel: 'Sopir Innova',
    driverId: 'drv-2',
    phone: '0813-4567-8902',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
  }
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('vt_auth_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vt_auth_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const usersSeededRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('vt_auth_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vt_auth_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vt_auth_current_user');
    }
  }, [currentUser]);

  // Real-time synchronization for users collection
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsub = subscribeCollection('users', async (remoteUsers) => {
      if (remoteUsers && remoteUsers.length > 0) {
        setUsers(remoteUsers);
        // If current user is logged in, sync any profile changes
        if (currentUser) {
          const updatedSelf = remoteUsers.find((u) => u.id === currentUser.id);
          if (updatedSelf) {
            setCurrentUser(updatedSelf);
          }
        }
      } else if (!usersSeededRef.current) {
        usersSeededRef.current = true;
        // Auto-seed initial users to Firestore
        try {
          for (const u of INITIAL_USERS) {
            await saveDocument('users', u.id, u);
          }
        } catch (e) {
          console.warn('Initial users seeding skipped:', e);
        }
      }
    });

    return () => unsub();
  }, [currentUser?.id]);

  // Login handler
  const login = (username, password) => {
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Username atau password yang Anda masukkan salah.' };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
  };

  // User CRUD for Super Admin
  const addUser = async (userData) => {
    const newUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    setUsers((prev) => [newUser, ...prev]);

    if (isFirebaseConfigured) {
      try {
        await saveDocument('users', newUser.id, newUser);
      } catch (err) {
        console.error('Error saving user to Firestore:', err);
      }
    }
    return newUser;
  };

  const updateUser = async (id, updatedData) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u)));
    if (currentUser && currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updatedData }));
    }

    if (isFirebaseConfigured) {
      try {
        await updateDocument('users', id, updatedData);
      } catch (err) {
        console.error('Error updating user in Firestore:', err);
      }
    }
  };

  const deleteUser = async (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
    }

    if (isFirebaseConfigured) {
      try {
        await deleteDocument('users', id);
      } catch (err) {
        console.error('Error deleting user from Firestore:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        isSuperAdmin: currentUser?.role === 'superadmin',
        isAdmin: currentUser?.role === 'admin' || currentUser?.role === 'superadmin',
        isSopir: currentUser?.role === 'sopir'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
