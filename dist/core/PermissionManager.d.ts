import { PermissionManager as IPermissionManager, PermissionStatus } from '../types/index.js';
/**
 * Manages Chrome extension permissions for audio capture
 * Handles permission requests and status checking
 */
export declare class PermissionManager implements IPermissionManager {
    requestDisplayMediaPermission(): Promise<boolean>;
    requestMicrophonePermission(): Promise<boolean>;
    checkTabCapturePermission(): Promise<boolean>;
    getPermissionStatus(): PermissionStatus;
    private checkPermission;
}
//# sourceMappingURL=PermissionManager.d.ts.map