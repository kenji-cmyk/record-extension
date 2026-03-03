import { PopupController } from './ui/PopupController.js';

/**
 * Popup entry point for user interface
 * Initializes popup controller and UI interactions
 */

// Initialize popup controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    const popupController = new PopupController();
    console.log('Popup controller initialized');
  } catch (error) {
    console.error('Failed to initialize popup controller:', error);
  }
});