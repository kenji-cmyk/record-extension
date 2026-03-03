import {
  PermissionManager as IPermissionManager,
  PermissionStatus
} from '../types/index.js';

/**
 * Manages Chrome extension permissions for audio capture
 * Handles permission requests and status checking
 */
export class PermissionManager implements IPermissionManager {
  async requestDisplayMediaPermission(): Promise<boolean> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  async requestMicrophonePermission(): Promise<boolean> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  async checkTabCapturePermission(): Promise<boolean> {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  getPermissionStatus(): PermissionStatus {
    // Implementation will be added in subsequent tasks
    throw new Error('Not implemented yet');
  }

  private async checkPermission(name: PermissionName): Promise<'granted' | 'denied' | 'prompt'> {
    try {
      const result = await navigator.permissions.query({ name });
      return result.state;
    } catch (error) {
      console.warn(`Permission check failed for ${name}:`, error);
      return 'prompt';
    }
  }
}