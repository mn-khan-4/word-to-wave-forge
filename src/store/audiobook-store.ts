import { create } from 'zustand';

export type JobStatus = 
  | 'queued' 
  | 'uploading' 
  | 'chunking' 
  | 'synthesizing' 
  | 'merging' 
  | 'packaging' 
  | 'completed' 
  | 'failed';

export interface AudiobookFile {
  id: string;
  name: string;
  size: number;
  type: string;
  pages?: number;
  content?: string;
  createdAt: Date;
}

export interface AudiobookJob {
  id: string;
  file: AudiobookFile;
  status: JobStatus;
  progress: number;
  eta?: string;
  substatus?: string;
  error?: string;
  audioUrl?: string;
  downloadUrl?: string;
  duration?: number;
}

export interface VoiceSettings {
  language: string;
  voiceId: string;
  emotion: number; // 0-100, Calm to Energetic
  rate: number; // 0.5-2.0
  pitch: number; // -20 to +20
}

export interface OutputSettings {
  format: 'mp3' | 'm4b';
  sampleRate: 22050 | 44100 | 48000;
  bitrate: 64 | 128 | 192 | 320;
  chapterDetection: boolean;
  normalizeAudio: boolean;
  backgroundMusic: boolean;
  bgMusicVolume: number;
}

export interface AdvancedSettings {
  model: 'standard' | 'neural' | 'premium';
  ssml: string;
  pronunciationDict: Record<string, string>;
}

export interface Settings {
  voice: VoiceSettings;
  output: OutputSettings;
  advanced: AdvancedSettings;
}

export interface AudioState {
  currentJobId?: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}

interface AudiobookStore {
  files: AudiobookFile[];
  jobs: AudiobookJob[];
  settings: Settings;
  audio: AudioState;
  
  // File management
  addFiles: (files: File[]) => void;
  addPastedText: (text: string, title: string) => void;
  removeFile: (id: string) => void;
  
  // Job management
  startJob: (fileId: string) => void;
  cancelJob: (id: string) => void;
  retryJob: (id: string) => void;
  removeJob: (id: string) => void;
  
  // Settings
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  updateOutputSettings: (settings: Partial<OutputSettings>) => void;
  updateAdvancedSettings: (settings: Partial<AdvancedSettings>) => void;
  
  // Audio playback
  playJob: (jobId: string) => void;
  pauseAudio: () => void;
  seekTo: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  
  // Utils
  clearAll: () => void;
  getEstimate: () => { time: string; cost: string };
}

// Mock voices data
export const VOICES = [
  { id: 'aria', name: 'Aria', gender: 'female', accent: 'US', preview: '/voices/aria.mp3' },
  { id: 'roger', name: 'Roger', gender: 'male', accent: 'UK', preview: '/voices/roger.mp3' },
  { id: 'sarah', name: 'Sarah', gender: 'female', accent: 'US', preview: '/voices/sarah.mp3' },
  { id: 'callum', name: 'Callum', gender: 'male', accent: 'UK', preview: '/voices/callum.mp3' },
  { id: 'charlotte', name: 'Charlotte', gender: 'female', accent: 'AU', preview: '/voices/charlotte.mp3' },
];

export const LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'en-AU', name: 'English (AU)', flag: '🇦🇺' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
];

// Mock processing pipeline
const simulateJobProgress = async (jobId: string, updateJob: (id: string, updates: Partial<AudiobookJob>) => void) => {
  const steps: { status: JobStatus; substatus: string; duration: number }[] = [
    { status: 'uploading', substatus: 'Uploading file...', duration: 1000 },
    { status: 'chunking', substatus: 'Breaking into chapters...', duration: 2000 },
    { status: 'synthesizing', substatus: 'Converting to speech...', duration: 8000 },
    { status: 'merging', substatus: 'Combining audio files...', duration: 2000 },
    { status: 'packaging', substatus: 'Final processing...', duration: 1000 },
    { status: 'completed', substatus: 'Ready for download!', duration: 0 },
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const progress = ((i + 1) / steps.length) * 100;
    const eta = i < steps.length - 1 ? `${Math.ceil((steps.length - i - 1) * 2)}m` : undefined;
    
    updateJob(jobId, {
      status: step.status,
      substatus: step.substatus,
      progress: Math.floor(progress),
      eta,
    });

    if (step.duration > 0) {
      // Simulate gradual progress within each step
      const intervals = 5;
      const intervalDuration = step.duration / intervals;
      
      for (let j = 0; j < intervals; j++) {
        await new Promise(resolve => setTimeout(resolve, intervalDuration));
        const stepProgress = (j + 1) / intervals;
        const totalProgress = ((i + stepProgress) / steps.length) * 100;
        updateJob(jobId, { progress: Math.floor(totalProgress) });
      }
    }
  }

  // Add mock audio URL when completed
  updateJob(jobId, {
    audioUrl: `/audio/demo-${jobId}.mp3`,
    downloadUrl: `/downloads/${jobId}.mp3`,
    duration: 1800, // 30 minutes
  });
};

const defaultSettings: Settings = {
  voice: {
    language: 'en-US',
    voiceId: 'aria',
    emotion: 30,
    rate: 1.0,
    pitch: 0,
  },
  output: {
    format: 'mp3',
    sampleRate: 44100,
    bitrate: 128,
    chapterDetection: true,
    normalizeAudio: true,
    backgroundMusic: false,
    bgMusicVolume: 20,
  },
  advanced: {
    model: 'neural',
    ssml: '',
    pronunciationDict: {},
  },
};

export const useAudiobookStore = create<AudiobookStore>((set, get) => ({
  files: [],
  jobs: [],
  settings: defaultSettings,
  audio: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
  },

  addFiles: (files: File[]) => {
    const newFiles: AudiobookFile[] = files.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      pages: Math.floor(Math.random() * 300) + 50, // Mock page count
      createdAt: new Date(),
    }));
    
    set(state => ({ files: [...state.files, ...newFiles] }));
  },

  addPastedText: (text: string, title: string) => {
    const file: AudiobookFile = {
      id: crypto.randomUUID(),
      name: `${title}.txt`,
      size: text.length,
      type: 'text/plain',
      content: text,
      pages: Math.ceil(text.length / 2000), // Rough page estimate
      createdAt: new Date(),
    };
    
    set(state => ({ files: [...state.files, file] }));
  },

  removeFile: (id: string) => {
    set(state => ({ files: state.files.filter(f => f.id !== id) }));
  },

  startJob: (fileId: string) => {
    const file = get().files.find(f => f.id === fileId);
    if (!file) return;

    const job: AudiobookJob = {
      id: crypto.randomUUID(),
      file,
      status: 'queued',
      progress: 0,
    };

    set(state => ({ jobs: [...state.jobs, job] }));

    // Start processing simulation
    const updateJob = (id: string, updates: Partial<AudiobookJob>) => {
      set(state => ({
        jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates } : j)
      }));
    };

    simulateJobProgress(job.id, updateJob);
  },

  cancelJob: (id: string) => {
    set(state => ({
      jobs: state.jobs.map(j => 
        j.id === id ? { ...j, status: 'failed' as JobStatus, error: 'Cancelled by user' } : j
      )
    }));
  },

  retryJob: (id: string) => {
    const job = get().jobs.find(j => j.id === id);
    if (!job) return;

    set(state => ({
      jobs: state.jobs.map(j => 
        j.id === id ? { ...j, status: 'queued' as JobStatus, progress: 0, error: undefined } : j
      )
    }));

    const updateJob = (id: string, updates: Partial<AudiobookJob>) => {
      set(state => ({
        jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates } : j)
      }));
    };

    simulateJobProgress(id, updateJob);
  },

  removeJob: (id: string) => {
    set(state => ({ jobs: state.jobs.filter(j => j.id !== id) }));
  },

  updateVoiceSettings: (settings: Partial<VoiceSettings>) => {
    set(state => ({
      settings: {
        ...state.settings,
        voice: { ...state.settings.voice, ...settings }
      }
    }));
  },

  updateOutputSettings: (settings: Partial<OutputSettings>) => {
    set(state => ({
      settings: {
        ...state.settings,
        output: { ...state.settings.output, ...settings }
      }
    }));
  },

  updateAdvancedSettings: (settings: Partial<AdvancedSettings>) => {
    set(state => ({
      settings: {
        ...state.settings,
        advanced: { ...state.settings.advanced, ...settings }
      }
    }));
  },

  playJob: (jobId: string) => {
    set(state => ({
      audio: {
        ...state.audio,
        currentJobId: jobId,
        isPlaying: true,
      }
    }));
  },

  pauseAudio: () => {
    set(state => ({
      audio: { ...state.audio, isPlaying: false }
    }));
  },

  seekTo: (time: number) => {
    set(state => ({
      audio: { ...state.audio, currentTime: time }
    }));
  },

  setPlaybackRate: (rate: number) => {
    set(state => ({
      audio: { ...state.audio, playbackRate: rate }
    }));
  },

  clearAll: () => {
    set({ files: [], jobs: [] });
  },

  getEstimate: () => {
    const { files, settings } = get();
    const totalPages = files.reduce((sum, f) => sum + (f.pages || 0), 0);
    const estimatedMinutes = totalPages * 2; // 2 min per page estimate
    const estimatedCost = totalPages * 0.05; // $0.05 per page estimate
    
    return {
      time: `${estimatedMinutes}m`,
      cost: `$${estimatedCost.toFixed(2)}`,
    };
  },
}));