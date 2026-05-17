/**
 * Manages Chrome extension permissions for tab audio capture.
 */
export class PermissionManager {
    async checkTabCapturePermission() {
        return chrome.permissions.contains({ permissions: ['tabCapture'] });
    }
    getPermissionStatus() {
        return {
            tabCapture: chrome.runtime.getManifest().permissions?.includes('tabCapture') ? 'granted' : 'denied'
        };
    }
}
//# sourceMappingURL=PermissionManager.js.map