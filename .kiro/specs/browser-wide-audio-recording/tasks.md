# Implementation Plan: Browser-Wide Audio Recording

## Overview

Triển khai cải thiện Chrome extension ghi âm từ single-tab capture thành browser-wide audio recording. Implementation sử dụng TypeScript với getDisplayMedia API làm phương pháp chính và chrome.tabCapture API làm fallback, kết hợp Web Audio API để trộn nhiều nguồn âm thanh.

## Tasks

- [x] 1. Setup project structure and core interfaces
  - Update manifest.json với permissions cần thiết (displayCapture, tabCapture, offscreen)
  - Tạo TypeScript interfaces cho tất cả core components
  - Setup build configuration cho TypeScript
  - Create all core class files with proper structure
  - _Requirements: 6.1, 6.4_

- [-] 1.1 Setup testing framework and infrastructure
  - [x] 1.1.1 Install and configure testing framework (Vitest or Jest)
    - Add testing dependencies to package.json
    - Configure test runner with TypeScript support
    - Setup test scripts in package.json
  
  - [x] 1.1.2 Setup property-based testing library
    - Install fast-check for property-based testing
    - Configure property test utilities and generators
    - Create test helpers for audio stream mocking
  
  - [ ] 1.1.3 Setup Chrome extension testing environment
    - Configure Chrome APIs mocking (chrome.tabCapture, chrome.runtime)
    - Setup Web APIs mocking (MediaDevices, MediaRecorder, AudioContext)
    - Create test fixtures and utilities

- [ ] 2. Implement Permission Manager
  - [ ] 2.1 Implement PermissionManager class với permission checking và requesting
    - Complete implementation of requestDisplayMediaPermission() và requestMicrophonePermission()
    - Complete implementation of checkTabCapturePermission() và getPermissionStatus()
    - Add proper error handling and user feedback
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [ ]* 2.2 Write property test for permission handling resilience
    - **Property 10: Permission Handling Resilience**
    - **Validates: Requirements 6.3, 6.5**
  
  - [ ]* 2.3 Write unit tests for permission flows
    - Test permission request flows và error scenarios
    - Test permission revocation handling
    - _Requirements: 6.3, 6.5_

- [ ] 3. Implement Audio Capture Manager
  - [ ] 3.1 Complete AudioCaptureManager class với multiple capture methods
    - Complete implementation of initializeSystemAudio() using getDisplayMedia API
    - Complete implementation of initializeMicrophone() using getUserMedia API
    - Complete implementation of initializeTabCapture() as fallback method
    - Complete implementation of releaseAllStreams() with proper cleanup
    - _Requirements: 1.1, 1.5, 2.1, 2.2_
  
  - [ ]* 3.2 Write property test for system audio capture completeness
    - **Property 1: System Audio Capture Completeness**
    - **Validates: Requirements 1.1**
  
  - [ ]* 3.3 Write property test for API fallback reliability
    - **Property 12: API Fallback Reliability**
    - **Validates: Requirements 8.1**
  
  - [ ]* 3.4 Write property test for microphone integration
    - **Property 3: Microphone Integration**
    - **Validates: Requirements 2.2, 2.3**

- [ ] 4. Implement Audio Mixer
  - [ ] 4.1 Complete WebAudioMixer class với Web Audio API
    - Complete implementation of addAudioSource(), removeAudioSource(), setSourceVolume()
    - Implement proper AudioContext setup và MediaStreamAudioDestinationNode management
    - Add proper cleanup and disposal methods
    - _Requirements: 3.1, 3.4, 3.5_
  
  - [ ]* 4.2 Write property test for audio mixing preservation
    - **Property 4: Audio Mixing Preservation**
    - **Validates: Requirements 3.1, 3.3**
  
  - [ ]* 4.3 Write property test for volume control independence
    - **Property 5: Volume Control Independence**
    - **Validates: Requirements 3.4**
  
  - [ ]* 4.4 Write unit tests for audio mixer edge cases
    - Test adding/removing audio sources during mixing
    - Test volume control boundaries và invalid inputs
    - _Requirements: 3.1, 3.4_

- [ ] 5. Checkpoint - Core audio components complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement Media Recorder Manager
  - [ ] 6.1 Complete WebMRecorderManager class với MediaRecorder API
    - Complete implementation of startRecording(), pauseRecording(), resumeRecording(), stopRecording()
    - Add support for both WebM và MP3 output formats
    - Implement progress tracking và data collection with proper chunk handling
    - Add proper error handling and recovery mechanisms
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2_
  
  - [ ]* 6.2 Write property test for recording state transitions
    - **Property 6: Recording State Transitions**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**
  
  - [ ]* 6.3 Write property test for file export completeness
    - **Property 8: File Export Completeness**
    - **Validates: Requirements 5.1, 5.2**
  
  - [ ]* 6.4 Write property test for audio quality standards
    - **Property 11: Audio Quality Standards**
    - **Validates: Requirements 7.1, 7.2**

- [ ] 7. Implement Recording Controller
  - [ ] 7.1 Complete RecordingController class để orchestrate toàn bộ process
    - Complete integration of PermissionManager, AudioCaptureManager, AudioMixer, MediaRecorderManager
    - Complete implementation of startRecording(), pauseRecording(), resumeRecording(), stopRecording()
    - Complete implementation of getRecordingState() và getRecordingDuration() with proper timing
    - Add proper state management and error handling
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 7.2 Write property test for recording resilience
    - **Property 2: Recording Resilience**
    - **Validates: Requirements 1.3, 2.4**
  
  - [ ]* 7.3 Write property test for real-time duration tracking
    - **Property 7: Real-time Duration Tracking**
    - **Validates: Requirements 4.5**

- [ ] 8. Implement Error Handling System
  - [ ] 8.1 Complete ErrorHandler class với comprehensive error management
    - Complete implementation of handlePermissionError(), handleStreamInterruption(), handleRecordingError()
    - Implement graceful degradation strategies for various failure scenarios
    - Implement data recovery mechanisms and partial recording saving
    - Add proper user notification and error reporting
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 8.2 Write property test for error recovery with data preservation
    - **Property 13: Error Recovery with Data Preservation**
    - **Validates: Requirements 8.2, 8.3**
  
  - [ ]* 8.3 Write property test for error communication
    - **Property 14: Error Communication**
    - **Validates: Requirements 8.4**
  
  - [ ]* 8.4 Write unit tests for error scenarios
    - Test various error conditions và recovery mechanisms
    - Test partial data saving functionality
    - _Requirements: 8.2, 8.3, 8.4_

- [ ] 9. Implement Extension Infrastructure
  - [ ] 9.1 Complete service worker với extension lifecycle management
    - Complete extension installation và permission setup handling
    - Complete offscreen document creation và management cho background recording
    - Complete message passing between service worker, offscreen document, and popup
    - Add proper extension lifecycle event handling
    - _Requirements: 6.1, 6.2_
  
  - [ ] 9.2 Complete offscreen document cho audio processing
    - Complete audio capture và processing trong offscreen context
    - Complete audio stream management và recording operations
    - Add proper communication with service worker and popup
    - _Requirements: 1.1, 2.2, 3.1_
  
  - [ ]* 9.3 Write integration tests for extension infrastructure
    - Test service worker và offscreen document communication
    - Test extension lifecycle events
    - _Requirements: 6.1, 6.2_

- [ ] 10. Implement User Interface
  - [ ] 10.1 Complete popup UI với recording controls
    - Complete implementation of start, pause, resume, stop buttons with proper state management
    - Complete recording status, duration, và progress display with real-time updates
    - Complete audio source indicators (system audio, microphone) with visual feedback
    - Add proper error display and user notifications
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 10.2 Complete file export interface
    - Complete file save dialog với format selection (WebM/MP3)
    - Complete export progress display và handle export errors gracefully
    - Add file naming and location selection functionality
    - _Requirements: 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 10.3 Write property test for export progress indication
    - **Property 9: Export Progress Indication**
    - **Validates: Requirements 5.4, 5.5**
  
  - [ ]* 10.4 Write unit tests for UI interactions
    - Test button states và user interactions
    - Test progress display và error messaging
    - _Requirements: 4.5, 5.4, 5.5_

- [ ] 11. Integration and Testing
  - [ ] 11.1 Wire all components together trong main application
    - Connect UI controls với RecordingController with proper event handling
    - Setup proper state management và component communication
    - Ensure proper cleanup và resource management across all components
    - Add comprehensive error handling and user feedback
    - _Requirements: All requirements_
  
  - [ ]* 11.2 Write comprehensive integration tests
    - Test end-to-end recording workflows from UI to file export
    - Test error scenarios và recovery paths across components
    - Test different browser configurations and permission states
    - _Requirements: All requirements_
  
  - [ ]* 11.3 Write property-based tests for system behavior
    - Test system behavior với random inputs và configurations
    - Validate all correctness properties với minimum 100 iterations per test
    - Test edge cases and boundary conditions across the entire system
    - _Requirements: All requirements_

- [ ] 12. Final checkpoint and optimization
  - Ensure all tests pass, optimize performance, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- TypeScript provides type safety for complex audio stream management
- Extension uses Manifest V3 with service worker architecture
- Core structure is complete but implementations need to be finished
- Testing framework needs to be set up before implementing test tasks
- Focus on completing core implementations before optional testing tasks