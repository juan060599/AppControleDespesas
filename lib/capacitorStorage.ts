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
      console.log('CapacitorStorage: Getting item -', key)
      
      // Always use Preferences (Capacitor native storage)
      // Never use localStorage on native
      const { value } = await Preferences.get({ key })
      console.log('CapacitorStorage: Got value -', key, !!value)
      return value || null
    } catch (error) {
      console.error('CapacitorStorage: Error getting item:', error)
      return null
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      console.log('CapacitorStorage: Setting item -', key)
      
      // Always use Preferences (Capacitor native storage)
      await Preferences.set({ key, value })
      console.log('CapacitorStorage: Set item -', key)
    } catch (error) {
      console.error('CapacitorStorage: Error setting item:', error)
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      console.log('CapacitorStorage: Removing item -', key)
      await Preferences.remove({ key })
      console.log('CapacitorStorage: Removed item -', key)
    } catch (error) {
      console.error('CapacitorStorage: Error removing item:', error)
    }
  }
}

export const capacitorStorage = new CapacitorStorage()
