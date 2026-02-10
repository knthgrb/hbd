import { useCallback, useEffect, useRef, useState } from "react";

const BLOW_THRESHOLD = 0.08;
const BLOW_SUSTAIN_MS = 200;
const FFT_SIZE = 2048;
const SMOOTHING = 0.6;

export function useBlowDetection(onBlow: () => void) {
  const [allowed, setAllowed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const blowStartRef = useRef<number | null>(null);
  const triggeredRef = useRef(false);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    if (audioContextRef.current?.state !== "closed") {
      audioContextRef.current?.close();
    }
    audioContextRef.current = null;
    setListening(false);
    triggeredRef.current = false;
  }, []);

  const start = useCallback(() => {
    if (listening) return;
    setError(null);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        analyser.smoothingTimeConstant = SMOOTHING;
        source.connect(analyser);
        analyserRef.current = analyser;
        setAllowed(true);
        setListening(true);

        const data = new Float32Array(analyser.fftSize);

        function tick() {
          if (!analyserRef.current) return;
          analyserRef.current.getFloatTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            sum += data[i] * data[i];
          }
          const rms = Math.sqrt(sum / data.length);

          if (rms >= BLOW_THRESHOLD) {
            const now = Date.now();
            if (blowStartRef.current === null) blowStartRef.current = now;
            if (now - blowStartRef.current >= BLOW_SUSTAIN_MS && !triggeredRef.current) {
              triggeredRef.current = true;
              onBlow();
            }
          } else {
            blowStartRef.current = null;
          }
          rafRef.current = requestAnimationFrame(tick);
        }
        rafRef.current = requestAnimationFrame(tick);
      })
      .catch((err) => {
        setError(err.message || "Microphone access denied");
        setAllowed(false);
      });
  }, [listening, onBlow]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { start, stop, allowed, error, listening };
}
