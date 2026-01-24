import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

// Custom Storage interface compatible with Supabase
interface StorageAdapter {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
}

export class CapacitorStorage implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      if (!Capacitor.isNativePlatform()) {
        return typeof window !== 'undefined' ? localStorage.getItem(key) : null
      }

      const { value } = await Preferences.get({ key })
      return value || null
    } catch (error) {
      console.error('Error getting item from storage:', error)
      return null
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (!Capacitor.isNativePlatform()) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, value)
        }
        return
      }

      await Preferences.set({ key, value })
    } catch (error) {
      console.error('Error setting item in storage:', error)
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (!Capacitor.isNativePlatform()) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(key)
        }
        return
      }

      await Preferences.remove({ key })
    } catch (error) {
      console.error('Error removing item from storage:', error)
    }
  }
}

export const capacitorStorage = new CapacitorStorage()
