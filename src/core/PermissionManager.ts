import {
  PermissionManager as IPermissionManager,
  PermissionStatus
} from '../types/index.js';

/**
 * Manages Chrome extension permissions for tab audio capture.
 */
export class PermissionManager implements IPermissionManager {
  async checkTabCapturePermission(): Promise<boolean> {
    return chrome.permissions.contains({ permissions: ['tabCapture'] });
  }

  getPermissionStatus(): PermissionStatus {
    return {
      tabCapture: chrome.runtime.getManifest().permissions?.includes('tabCapture') ? 'granted' : 'denied'
    };
  }
}
