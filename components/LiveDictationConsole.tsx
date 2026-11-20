'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Globe,
  Mic,
  Pause,
  Play,
  Square,
  Type,
} from 'lucide-react';
import { DICTATION_LANGUAGES } from '@/lib/types';
import { formatDuration } from '@/lib/transcript-utils';
import {
  formatSpokenPunctuation,
  VOICE_PUNCTUATION_COMMANDS,
} from '@/lib/voice-punctuation';

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [altIndex: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface LiveDictationConsoleProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  onAppendFinalText: (text: string) => void;
  onInterimChange: (interim: string) => void;
  onDurationTick: (seconds: number) => void;
  initialDuration: number;
  theme: 'light' | 'dark';
  voicePunctuation: boolean;
  onToggleVoicePunctuation: () => void;
  existingText: string;
  onInsertPunctuation: (insertText: string) => void;
}

type DictationStatus = 'idle' | 'listening' | 'paused';

const subscribeNoop = () => () => {};
const getSpeechSupportSnapshot = () => {
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
};
const getSpeechSupportServerSnapshot = () => true;

export default function LiveDictationConsole({
  language,
  onLanguageChange,
  onAppendFinalText,
  onInterimChange,
  onDurationTick,
  initialDuration,
  theme,
  voicePunctuation,
  onToggleVoicePunctuation,
  existingText,
  onInsertPunctuation,
}: LiveDictationConsoleProps) {
  const [status, setStatus] = useState<DictationStatus>('idle');
  const isSupported = useSyncExternalStore(
    subscribeNoop,
    getSpeechSupportSnapshot,
    getSpeechSupportServerSnapshot
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(initialDuration);
  const [interimText, setInterimText] = useState<string>('');
  const [showCommandsGuide, setShowCommandsGuide] = useState(false);

  const statusRef = useRef<DictationStatus>('idle');
  const themeRef = useRef<'light' | 'dark'>(theme);
  const voicePunctuationRef = useRef<boolean>(voicePunctuation);
  const existingTextRef = useRef<string>(existingText);
  const languageRef = useRef<string>(language);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<number>(initialDuration);

  const onAppendFinalRef = useRef(onAppendFinalText);
  const onInterimRef = useRef(onInterimChange);
  const onDurationTickRef = useRef(onDurationTick);

  useEffect(() => {
    onAppendFinalRef.current = onAppendFinalText;
  }, [onAppendFinalText]);

  useEffect(() => {
    onInterimRef.current = onInterimChange;
  }, [onInterimChange]);

  useEffect(() => {
    onDurationTickRef.current = onDurationTick;
  }, [onDurationTick]);

  useEffect(() => {
    voicePunctuationRef.current = voicePunctuation;
  }, [voicePunctuation]);

  useEffect(() => {
    existingTextRef.current = existingText;
  }, [existingText]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const drawIdleWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    const barCount = Math.max(36, Math.floor(rect.width / 8));
    const gap = 4;
    const barWidth = Math.max(2, (rect.width - gap * (barCount - 1)) / barCount);
    const centerY = rect.height / 2;

    const idleColor =
      themeRef.current === 'dark'
        ? 'rgba(255, 255, 255, 0.14)'
        : 'rgba(15, 23, 42, 0.16)';

    for (let i = 0; i < barCount; i++) {
      const x = i * (barWidth + gap);
      const barHeight = 3;
      ctx.fillStyle = idleColor;
      ctx.beginPath();
      ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 1.5);
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    themeRef.current = theme;
    if (statusRef.current !== 'listening') {
      drawIdleWaveform();
    }
  }, [theme, drawIdleWaveform]);

  useEffect(() => {
    drawIdleWaveform();
    const handleResize = () => {
      if (statusRef.current !== 'listening') {
        drawIdleWaveform();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawIdleWaveform]);

  const stopAudioMeter = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    drawIdleWaveform();
  }, [drawIdleWaveform]);

  const startAudioMeter = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (statusRef.current !== 'listening') {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      mediaStreamRef.current = stream;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.78;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const renderFrame = () => {
        if (statusRef.current !== 'listening' || !analyserRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          if (canvas.width !== Math.floor(rect.width * dpr)) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
          }
          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.clearRect(0, 0, rect.width, rect.height);

          analyserRef.current.getByteFrequencyData(dataArray);

          const barCount = Math.max(36, Math.floor(rect.width / 8));
          const gap = 4;
          const barWidth = Math.max(
            2,
            (rect.width - gap * (barCount - 1)) / barCount
          );
          const centerY = rect.height / 2;
          const maxBarHeight = rect.height - 8;

          for (let i = 0; i < barCount; i++) {
            // Mirror frequency bins slightly from center for balanced studio meter
            const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
            const binIndex = Math.min(
              dataArray.length - 1,
              Math.floor(distFromCenter * (dataArray.length * 0.7))
            );
            const rawAmp = dataArray[binIndex] / 255;
            const boosted = Math.min(1, rawAmp * 1.35);
            const barHeight = Math.max(4, boosted * maxBarHeight);
            const x = i * (barWidth + gap);

            const isDark = themeRef.current === 'dark';
            ctx.fillStyle =
              boosted > 0.65
                ? isDark
                  ? '#F59E0B'
                  : '#D97706'
                : boosted > 0.2
                ? isDark
                  ? 'rgba(245, 158, 11, 0.75)'
                  : 'rgba(217, 119, 6, 0.8)'
                : isDark
                ? 'rgba(255, 255, 255, 0.22)'
                : 'rgba(15, 23, 42, 0.22)';
            ctx.beginPath();
            ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 1.5);
            ctx.fill();
          }
          ctx.restore();
        }

        rafRef.current = requestAnimationFrame(renderFrame);
      };

      rafRef.current = requestAnimationFrame(renderFrame);
    } catch {
      // Waveform is visual; SpeechRecognition handles its own mic error if denied
    }
  }, []);

  const releaseMediaResources = useCallback(() => {
    statusRef.current = 'idle';
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors
      }
      recognitionRef.current = null;
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const stopAll = useCallback(
    (nextStatus: DictationStatus) => {
      statusRef.current = nextStatus;
      setStatus(nextStatus);
      setInterimText('');
      onInterimRef.current('');

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.stop();
        } catch {
          // Ignore stop errors
        }
        recognitionRef.current = null;
      }

      stopAudioMeter();
    },
    [stopAudioMeter]
  );

  const startRecognition = useCallback(
    (langCode: string) => {
      const win = window as unknown as {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      };
      const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (!SpeechRec) {
        setErrorMsg(
          'Live browser speech recognition is not supported in this browser. Try Chrome or Edge for real-time dictation.'
        );
        return;
      }

      setErrorMsg(null);
      statusRef.current = 'listening';
      setStatus('listening');

      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = langCode;

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let interim = '';
        let finalized = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptPiece = result[0]?.transcript ?? '';
          if (result.isFinal) {
            finalized += transcriptPiece;
          } else {
            interim += transcriptPiece;
          }
        }

        if (finalized.trim()) {
          onAppendFinalRef.current(finalized.trim());
        }
        const formattedInterim = interim.trim()
          ? formatSpokenPunctuation(interim, {
              enabled: voicePunctuationRef.current,
              existingText: existingTextRef.current,
              language: languageRef.current,
            })
          : '';
        setInterimText(formattedInterim);
        onInterimRef.current(formattedInterim);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        if (event.error === 'no-speech') {
          return;
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMsg(
            'Microphone access was blocked. Allow microphone permissions in your browser settings and try again.'
          );
          stopAll('idle');
          return;
        }
        if (event.error === 'audio-capture') {
          setErrorMsg(
            'No working microphone was detected on this device.'
          );
          stopAll('idle');
          return;
        }
        if (event.error === 'network') {
          setErrorMsg(
            'Browser speech recognition lost network connectivity. Check your connection and resume dictation.'
          );
          stopAll('paused');
        }
      };

      recognition.onend = () => {
        if (statusRef.current === 'listening') {
          try {
            recognition.start();
          } catch {
            stopAll('paused');
          }
        }
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch {
        setErrorMsg('Unable to start microphone dictation. Please try again.');
        stopAll('idle');
        return;
      }

      startAudioMeter();

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        const next = elapsedRef.current;
        setElapsedSeconds(next);
        onDurationTickRef.current(next);
      }, 1000);
    },
    [startAudioMeter, stopAll]
  );

  // Restart recognition smoothly if user switches language while listening
  const handleLanguageSelect = (newLang: string) => {
    onLanguageChange(newLang);
    if (statusRef.current === 'listening') {
      stopAll('paused');
      setTimeout(() => startRecognition(newLang), 150);
    }
  };

  useEffect(() => {
    return () => {
      releaseMediaResources();
    };
  }, [releaseMediaResources]);

  return (
    <section
      id="dictation-console"
      aria-label="Live dictation console"
      className="rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#161920] p-5 transition-colors duration-150"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {status === 'listening' ? (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400">
              <span
                className="h-2 w-2 rounded-full bg-red-500 animate-pulse"
                aria-hidden="true"
              />
              <span>Recording</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <Mic className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>{status === 'paused' ? 'Paused' : 'Microphone Ready'}</span>
            </div>
          )}

          <span className="text-zinc-300 dark:text-zinc-600" aria-hidden="true">
            ·
          </span>

          <span className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-200 tabular-nums">
            {formatDuration(elapsedSeconds)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <Globe className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
            <select
              value={language}
              onChange={(e) => handleLanguageSelect(e.target.value)}
              aria-label="Dictation language"
              className="h-10 rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-[#F6F7F9] dark:bg-[#0B0D10] pl-8 pr-8 text-xs font-medium text-zinc-900 dark:text-zinc-200 focus:border-amber-500/60 focus:outline-none"
            >
              {DICTATION_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {status === 'idle' && (
            <button
              type="button"
              disabled={!isSupported}
              onClick={() => startRecognition(language)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber-500 px-5 text-xs font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Mic className="h-4 w-4" />
              <span>Start Dictation</span>
            </button>
          )}

          {status === 'listening' && (
            <>
              <button
                type="button"
                onClick={() => stopAll('paused')}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-300 dark:border-white/[0.12] bg-zinc-100 dark:bg-white/[0.04] px-4 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-white/[0.08] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Pause className="h-3.5 w-3.5" />
                <span>Pause</span>
              </button>
              <button
                type="button"
                onClick={() => stopAll('idle')}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/15 border border-red-300 dark:border-red-500/30 px-4 text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/25 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Stop</span>
              </button>
            </>
          )}

          {status === 'paused' && (
            <>
              <button
                type="button"
                onClick={() => startRecognition(language)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber-500 px-4 text-xs font-semibold text-zinc-950 hover:bg-amber-400 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Resume</span>
              </button>
              <button
                type="button"
                onClick={() => stopAll('idle')}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-300 dark:border-white/[0.12] bg-zinc-100 dark:bg-white/[0.04] px-4 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/[0.08] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Square className="h-3.5 w-3.5" />
                <span>Finish</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Live audio waveform canvas */}
      <div className="mt-4 rounded-lg border border-zinc-200 dark:border-white/[0.06] bg-[#F1F3F6] dark:bg-[#0B0D10] px-3 py-2.5">
        <canvas
          ref={canvasRef}
          className="h-14 w-full block"
          aria-label="Live microphone level meter"
        />
      </div>

      {/* Spoken Punctuation Bar & Commands Guide */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5 border-t border-zinc-200/80 dark:border-white/[0.06] pt-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <button
            type="button"
            role="switch"
            aria-checked={voicePunctuation}
            onClick={onToggleVoicePunctuation}
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              voicePunctuation
                ? 'border-amber-500/60 bg-amber-50 text-amber-800 dark:border-amber-500/45 dark:bg-amber-500/10 dark:text-amber-300'
                : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:bg-white/[0.06]'
            }`}
          >
            <Type className="h-3.5 w-3.5" />
            <span>Voice Punctuation: {voicePunctuation ? 'On' : 'Off'}</span>
          </button>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {voicePunctuation
              ? 'Say "period", "comma", "question mark", or "new paragraph" as you speak.'
              : 'Spoken punctuation words will be transcribed literally.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCommandsGuide((prev) => !prev)}
          aria-expanded={showCommandsGuide}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.03] px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.07] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <span>Punctuation Commands</span>
          {showCommandsGuide ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {showCommandsGuide && (
        <div
          aria-label="Spoken punctuation commands reference"
          className="mt-3 rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-[#F8F9FB] dark:bg-[#11141A] p-3.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span>
              Speak any phrase below while dictating, or click a command to insert it directly.
            </span>
            <span className="font-mono tabular-nums">
              {VOICE_PUNCTUATION_COMMANDS.length} commands
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
            {VOICE_PUNCTUATION_COMMANDS.map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => onInsertPunctuation(cmd.insertText)}
                title={`Say "${cmd.spokenExamples.join('" or "')}" — click to insert`}
                className="flex items-center justify-between gap-2 rounded-md border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#161920] px-2.5 py-2 text-left text-xs hover:border-amber-500/50 hover:bg-amber-50/40 dark:hover:bg-amber-500/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <span className="truncate text-zinc-700 dark:text-zinc-300">
                  &ldquo;{cmd.spokenExamples[0]}&rdquo;
                </span>
                <span className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400 shrink-0">
                  {cmd.symbolLabel}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live interim speech preview */}
      {interimText && (
        <div className="mt-3 flex items-start gap-2.5 text-sm text-amber-700 dark:text-amber-300/90">
          <span className="font-mono text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400/80 pt-1 shrink-0">
            Live
          </span>
          <p className="leading-relaxed italic whitespace-pre-wrap">{interimText}</p>
        </div>
      )}

      {!isSupported && (
        <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p>
            Your current browser does not support the Web Speech Recognition API. Use Chrome or Edge for live microphone dictation.
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-3.5 py-2.5 text-xs text-red-900 dark:text-red-200">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}
    </section>
  );
}
