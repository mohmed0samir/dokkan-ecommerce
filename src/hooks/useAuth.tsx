import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  onAuthStateChanged,
  Auth,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User as UserType, UserRole, UserPreferences, Address } from '../types';

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

interface ProfileUpdateData {
  fullName?: string;
  email?: string;
  phone?: string;
  photoURL?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Fetch user profile from Firestore
  const fetchUserProfile = useCallback(async (firebaseUser: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserType;
        setUser({
          ...userData,
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || userData.displayName,
          photoURL: firebaseUser.photoURL || userData.photoURL,
          emailVerified: firebaseUser.emailVerified,
        });
      } else {
        // Create new user profile
        const newUser: UserType = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          role: 'customer',
          emailVerified: firebaseUser.emailVerified,
          createdAt: new Date(),
          updatedAt: new Date(),
          preferences: {
            locale: 'ar',
            currency: 'SAR',
            notifications: { email: true, sms: true, push: true },
            theme: 'system',
          },
          addresses: [],
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        setUser(newUser);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setError(null);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, data.email, data.password);

      await updateProfile(firebaseUser, {
        displayName: data.fullName,
      });

      await sendEmailVerification(firebaseUser);

      const newUser: UserType = {
        uid: firebaseUser.uid,
        email: data.email,
        displayName: data.fullName,
        photoURL: '',
        role: 'customer',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: data.phone,
        preferences: {
          locale: 'ar',
          currency: 'SAR',
          notifications: { email: true, sms: true, push: true },
          theme: 'system',
        },
        addresses: [],
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setUser(newUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      throw err;
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setError(null);
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser || !firebaseUser.email) throw new Error('No user logged in');

      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password change failed';
      setError(message);
      throw err;
    }
  }, []);

  const updateProfileData = useCallback(async (data: ProfileUpdateData) => {
    setError(null);
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('No user logged in');

      await updateProfile(firebaseUser, {
        displayName: data.fullName,
        photoURL: data.photoURL,
      });

      if (data.email && data.email !== firebaseUser.email) {
        // Email change requires re-authentication, handled separately
      }

      if (user) {
        const updates: Partial<UserType> = {
          ...data,
          updatedAt: new Date(),
        };
        await updateDoc(doc(db, 'users', user.uid), updates);
        setUser({ ...user, ...updates });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Profile update failed';
      setError(message);
      throw err;
    }
  }, [user]);

  const updatePreferences = useCallback(async (preferences: Partial<UserPreferences>) => {
    setError(null);
    try {
      if (!user) throw new Error('No user logged in');

      const updatedPreferences = { ...user.preferences, ...preferences };
      await updateDoc(doc(db, 'users', user.uid), {
        preferences: updatedPreferences,
        updatedAt: new Date(),
      });
      setUser({ ...user, preferences: updatedPreferences });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Preferences update failed';
      setError(message);
      throw err;
    }
  }, [user]);

  const addAddress = useCallback(async (address: Omit<Address, 'id'>) => {
    setError(null);
    try {
      if (!user) throw new Error('No user logged in');

      const newAddress: Address = {
        ...address,
        id: `addr_${Date.now()}`,
      };

      // If this is the first address or marked as default, make it default
      const addresses = user.addresses || [];
      const updatedAddresses = addresses.length === 0 || address.isDefault
        ? addresses.map(a => ({ ...a, isDefault: a.id === newAddress.id }))
        : [...addresses, newAddress];

      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses,
        updatedAt: new Date(),
      });
      setUser({ ...user, addresses: updatedAddresses });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add address';
      setError(message);
      throw err;
    }
  }, [user]);

  const updateAddress = useCallback(async (addressId: string, address: Partial<Address>) => {
    setError(null);
    try {
      if (!user) throw new Error('No user logged in');

      const updatedAddresses = (user.addresses || []).map(a =>
        a.id === addressId ? { ...a, ...address } : a
      );

      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses,
        updatedAt: new Date(),
      });
      setUser({ ...user, addresses: updatedAddresses });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update address';
      setError(message);
      throw err;
    }
  }, [user]);

  const deleteAddress = useCallback(async (addressId: string) => {
    setError(null);
    try {
      if (!user) throw new Error('No user logged in');

      const updatedAddresses = (user.addresses || []).filter(a => a.id !== addressId);

      // If deleted address was default, make first one default
      const hasDefault = updatedAddresses.some(a => a.isDefault);
      if (!hasDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }

      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses,
        updatedAt: new Date(),
      });
      setUser({ ...user, addresses: updatedAddresses });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete address';
      setError(message);
      throw err;
    }
  }, [user]);

  const setDefaultAddress = useCallback(async (addressId: string) => {
    setError(null);
    try {
      if (!user) throw new Error('No user logged in');

      const updatedAddresses = (user.addresses || []).map(a => ({
        ...a,
        isDefault: a.id === addressId,
      }));

      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses,
        updatedAt: new Date(),
      });
      setUser({ ...user, addresses: updatedAddresses });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to set default address';
      setError(message);
      throw err;
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    changePassword,
    updateProfile: updateProfileData,
    updatePreferences,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}