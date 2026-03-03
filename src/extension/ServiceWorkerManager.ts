import {
  ServiceWorkerManager as IServiceWorkerManager,
  ExtensionMessage
} from '../types/index.js';

/**
 * Service worker manager for Chrome extension lifecycle
 * Handles extension installation, offscreen document management, and message routing
 */
export class ServiceWorkerManager implements IServiceWorkerManager {
  async handleExtensionInstall(): Promise<void> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  async createOffscreenDocument(): Promise<void> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  async handleMessage(message: ExtensionMessage): Promise<void> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  private async updateExtensionIcon(recording: boolean): Promise<void> {
    const iconPath = recording ? '/icons/recording.png' : '/icons/not-recording.png';
    await chrome.action.setIcon({ path: iconPath });
  }

  private async getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab;
  }

  private canRecordTab(tab: chrome.tabs.Tab): boolean {
    if (!tab || !tab.url) return false;
    
    return !tab.url.startsWith('chrome://') && 
           !tab.url.startsWith('chrome-extension://');
  }
}