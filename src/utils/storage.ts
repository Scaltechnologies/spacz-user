import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const memoryStore = new Map<string, string>();

function webStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    const storage = webStorage();
    if (storage) {
      storage.setItem(key, value);
      return;
    }
    memoryStore.set(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    const storage = webStorage();
    if (storage) return storage.getItem(key);
    return memoryStore.get(key) ?? null;
  }
  return SecureStore.getItemAsync(key);
}

export async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    const storage = webStorage();
    if (storage) {
      storage.removeItem(key);
      return;
    }
    memoryStore.delete(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const StorageKeys = {
  authToken: 'spacz.auth.token',
  userId: 'spacz.auth.userId',
} as const;

export async function saveToken(token: string): Promise<void> {
  await setItem(StorageKeys.authToken, token);
}

export async function getToken(): Promise<string | null> {
  return getItem(StorageKeys.authToken);
}

export async function removeToken(): Promise<void> {
  await removeItem(StorageKeys.authToken);
}
