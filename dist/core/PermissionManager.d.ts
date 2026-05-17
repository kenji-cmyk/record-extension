import { PermissionManager as IPermissionManager, PermissionStatus } from '../types/index.js';
/**
 * Manages Chrome extension permissions for tab audio capture.
 */
export declare class PermissionManager implements IPermissionManager {
    checkTabCapturePermission(): Promise<boolean>;
    getPermissionStatus(): PermissionStatus;
}
//# sourceMappingURL=PermissionManager.d.ts.map