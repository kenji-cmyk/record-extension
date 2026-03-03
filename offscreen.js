let recorder;
let data = [];
let activeStreams = [];

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === "offscreen") {
    switch (message.type) {
      case "start-recording":
        startRecording(message.data);
        break;
      case "stop-recording":
        stopRecording();
        break;
      default:
        throw new Error("Unrecognized message:", message.type);
    }
  }
});

async function startRecording(streamId) {
  if (recorder?.state === "recording") {
    throw new Error("Called startRecording while recording is in progress.");
  }

  await stopAllStreams();

  try {
    console.log("🎬 Starting recording process...");
    
    // Get tab audio stream
    console.log("📺 Requesting tab audio...");
    const tabStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId,
        },
      },
      video: false,
    });
    console.log("✅ Tab audio OK");

    // Get microphone stream
    console.log("🎤 Requesting microphone...");
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    console.log("✅ Microphone OK");
    
    // Debug: Check mic track details
    const micTrack = micStream.getAudioTracks()[0];
    console.log("🎤 Mic track:", {
      label: micTrack.label,
      enabled: micTrack.enabled,
      muted: micTrack.muted,
      readyState: micTrack.readyState,
      settings: micTrack.getSettings()
    });

    activeStreams.push(tabStream, micStream);

    // Simple approach: Mix audio using Web Audio API
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    // Add tab audio
    const tabSource = audioContext.createMediaStreamSource(tabStream);
    const tabGain = audioContext.createGain();
    tabGain.gain.value = 1.0; // Normal volume
    tabSource.connect(tabGain);
    tabGain.connect(destination); // To recorder
    tabGain.connect(audioContext.destination); // To speakers (so user can hear)

    // Add microphone
    const micSource = audioContext.createMediaStreamSource(micStream);
    const micGain = audioContext.createGain();
    micGain.gain.value = 8.0; // MASSIVE boost for low volume mic
    micSource.connect(micGain);
    micGain.connect(destination); // To recorder only (no echo)

    console.log("🔊 Audio mixed - Tab (vol: 1.0) + Mic (vol: 8.0)");
    
    // Add live mic level monitoring
    const micAnalyser = audioContext.createAnalyser();
    micAnalyser.fftSize = 256;
    micGain.connect(micAnalyser);
    
    const micLevelCheck = setInterval(() => {
      const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);
      micAnalyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
      // With 8.0 gain, even low input (30) will become 240, so use lower threshold
      console.log(`🎤 LIVE Mic Level: ${avg.toFixed(1)} ${avg > 50 ? "✅ SPEAKING!" : "⚠️ Too quiet (increase Windows mic volume to 100%)"}`);
    }, 1000);
    
    // Stop monitoring after 10 seconds
    setTimeout(() => {
      clearInterval(micLevelCheck);
      console.log("🎤 Mic monitoring stopped. Check if you saw levels > 10 when speaking!");
    }, 10000);

    // Start recording the mixed stream
    recorder = new MediaRecorder(destination.stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        data.push(event.data);
      }
    };

    recorder.onstop = async () => {
      console.log("🛑 Recording stopped");
      const blob = new Blob(data, { type: "audio/webm" });
      console.log("📦 File size:", (blob.size / 1024).toFixed(2), "KB");

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
      console.log("💾 Downloaded:", a.download);

      URL.revokeObjectURL(url);
      recorder = undefined;
      data = [];

      chrome.runtime.sendMessage({
        type: "recording-stopped",
        target: "service-worker",
      });
    };

    recorder.start();
    console.log("🔴 Recording started!");
    window.location.hash = "recording";

    chrome.runtime.sendMessage({
      type: "update-icon",
      target: "service-worker",
      recording: true,
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
    chrome.runtime.sendMessage({
      type: "recording-error",
      target: "popup",
      error: error.message,
    });
  }
}

async function stopRecording() {
  if (recorder && recorder.state === "recording") {
    recorder.stop();
  }

  await stopAllStreams();
  window.location.hash = "";

  chrome.runtime.sendMessage({
    type: "update-icon",
    target: "service-worker",
    recording: false,
  });
}

async function stopAllStreams() {
  activeStreams.forEach((stream) => {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  });

  activeStreams = [];
  await new Promise((resolve) => setTimeout(resolve, 100));
}
