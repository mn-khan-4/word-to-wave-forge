import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Download, 
  Share2,
  X,
  FileAudio
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAudiobookStore } from '@/store/audiobook-store';
import { useHotkeys } from 'react-hotkeys-hook';

export function MiniPlayer() {
  const { 
    jobs, 
    audio, 
    pauseAudio, 
    playJob, 
    seekTo, 
    setPlaybackRate 
  } = useAudiobookStore();

  const currentJob = jobs.find(j => j.id === audio.currentJobId);
  const isVisible = !!currentJob && currentJob.status === 'completed';

  // Keyboard shortcuts
  useHotkeys('space', (e) => {
    e.preventDefault();
    if (currentJob) {
      if (audio.isPlaying) {
        pauseAudio();
      } else {
        playJob(currentJob.id);
      }
    }
  }, [currentJob, audio.isPlaying]);

  useHotkeys('left', () => {
    seekTo(Math.max(0, audio.currentTime - 10));
  }, [audio.currentTime]);

  useHotkeys('right', () => {
    seekTo(Math.min(audio.duration, audio.currentTime + 10));
  }, [audio.currentTime, audio.duration]);

  useHotkeys('=', () => {
    setPlaybackRate(Math.min(2.0, audio.playbackRate + 0.25));
  }, [audio.playbackRate]);

  useHotkeys('-', () => {
    setPlaybackRate(Math.max(0.5, audio.playbackRate - 0.25));
  }, [audio.playbackRate]);

  // Mock audio time updates
  useEffect(() => {
    if (!audio.isPlaying || !currentJob) return;

    const interval = setInterval(() => {
      const newTime = audio.currentTime + 1;
      if (newTime >= audio.duration) {
        pauseAudio();
      } else {
        seekTo(newTime);
      }
    }, 1000 / audio.playbackRate);

    return () => clearInterval(interval);
  }, [audio.isPlaying, audio.currentTime, audio.duration, audio.playbackRate, currentJob]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentJob) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-6 right-6 z-50"
        >
          <Card className="glass-card p-4 glow-accent">
            <div className="flex items-center gap-4">
              {/* Album art / Icon */}
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileAudio className="w-6 h-6 text-primary" />
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {currentJob.file.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatTime(audio.currentTime)}</span>
                  <div className="flex-1 mx-2">
                    <Slider
                      value={[audio.currentTime]}
                      onValueChange={([value]) => seekTo(value)}
                      max={audio.duration || 1800}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <span>{formatTime(audio.duration || 1800)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => seekTo(Math.max(0, audio.currentTime - 10))}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    if (audio.isPlaying) {
                      pauseAudio();
                    } else {
                      playJob(currentJob.id);
                    }
                  }}
                  className="glow-primary"
                >
                  {audio.isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => seekTo(Math.min(audio.duration, audio.currentTime + 10))}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                {/* Playback speed */}
                <Badge 
                  variant="outline" 
                  className="cursor-pointer glass-button"
                  onClick={() => {
                    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
                    const currentIndex = speeds.indexOf(audio.playbackRate);
                    const nextIndex = (currentIndex + 1) % speeds.length;
                    setPlaybackRate(speeds[nextIndex]);
                  }}
                >
                  {audio.playbackRate}x
                </Badge>

                {/* Volume (mock) */}
                <Button variant="ghost" size="sm">
                  <Volume2 className="w-4 h-4" />
                </Button>

                {/* Download */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (currentJob.downloadUrl) {
                      const link = document.createElement('a');
                      link.href = currentJob.downloadUrl;
                      link.download = `${currentJob.file.name}.mp3`;
                      link.click();
                    }
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>

                {/* Share */}
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>

                {/* Close */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    pauseAudio();
                    // Clear current job
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Space: Play/Pause • ←/→: Seek • +/-: Speed
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}