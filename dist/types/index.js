// Core Types and Interfaces for Browser-Wide Audio Recording Extension
export var RecordingState;
(function (RecordingState) {
    RecordingState["IDLE"] = "idle";
    RecordingState["STARTING"] = "starting";
    RecordingState["RECORDING"] = "recording";
    RecordingState["PAUSED"] = "paused";
    RecordingState["STOPPING"] = "stopping";
    RecordingState["ERROR"] = "error";
})(RecordingState || (RecordingState = {}));
export var AudioQuality;
(function (AudioQuality) {
    AudioQuality["LOW"] = "low";
    AudioQuality["MEDIUM"] = "medium";
    AudioQuality["HIGH"] = "high";
    AudioQuality["LOSSLESS"] = "lossless"; // 320 kbps
})(AudioQuality || (AudioQuality = {}));
//# sourceMappingURL=index.js.map