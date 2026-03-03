/**
 * Manages Chrome extension permissions for audio capture
 * Handles permission requests and status checking
 */
export class PermissionManager {
    async requestDisplayMediaPermission() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async requestMicrophonePermission() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async checkTabCapturePermission() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    getPermissionStatus() {
        // Implementation will be added in subsequent tasks
        throw new Error('Not implemented yet');
    }
    async checkPermission(name) {
        try {
            const result = await navigator.permissions.query({ name });
            return result.state;
        }
        catch (error) {
            console.warn(`Permission check failed for ${name}:`, error);
            return 'prompt';
        }
    }
}
//# sourceMappingURL=PermissionManager.js.map