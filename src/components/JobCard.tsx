import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Download, 
  RotateCcw, 
  X, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAudiobookStore, type AudiobookJob, type JobStatus } from '@/store/audiobook-store';
// Helper functions defined below

interface JobCardProps {
  job: AudiobookJob;
}

const statusConfig: Record<JobStatus, { 
  color: string; 
  icon: React.ReactNode; 
  label: string 
}> = {
  queued: { color: 'bg-muted', icon: <Clock className="w-3 h-3" />, label: 'Queued' },
  uploading: { color: 'bg-blue-500', icon: <Loader2 className="w-3 h-3 animate-spin" />, label: 'Uploading' },
  chunking: { color: 'bg-yellow-500', icon: <Loader2 className="w-3 h-3 animate-spin" />, label: 'Processing' },
  synthesizing: { color: 'bg-purple-500', icon: <Loader2 className="w-3 h-3 animate-spin" />, label: 'Synthesizing' },
  merging: { color: 'bg-orange-500', icon: <Loader2 className="w-3 h-3 animate-spin" />, label: 'Merging' },
  packaging: { color: 'bg-indigo-500', icon: <Loader2 className="w-3 h-3 animate-spin" />, label: 'Packaging' },
  completed: { color: 'bg-green-500', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Completed' },
  failed: { color: 'bg-red-500', icon: <AlertCircle className="w-3 h-3" />, label: 'Failed' },
};

export function JobCard({ job }: JobCardProps) {
  const { 
    cancelJob, 
    retryJob, 
    removeJob, 
    playJob, 
    pauseAudio,
    audio 
  } = useAudiobookStore();

  const statusInfo = statusConfig[job.status];
  const isPlaying = audio.currentJobId === job.id && audio.isPlaying;
  const canPlay = job.status === 'completed' && job.audioUrl;

  const handlePlayPause = () => {
    if (canPlay) {
      if (isPlaying) {
        pauseAudio();
      } else {
        playJob(job.id);
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className="mb-4"
    >
      <Card className="glass-card p-6 hover:scale-[1.01] transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{job.file.name}</h3>
              <p className="text-sm text-muted-foreground">
                {job.file.pages ? `${job.file.pages} pages` : ''} • {formatFileSize(job.file.size)} • {formatDate(job.file.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge 
              variant="secondary" 
              className={`${statusInfo.color} text-white border-0`}
            >
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.label}</span>
            </Badge>
          </div>
        </div>

        {/* Progress bar for active jobs */}
        {job.status !== 'completed' && job.status !== 'failed' && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {job.substatus || 'Processing...'}
              </span>
              {job.eta && (
                <span className="text-sm text-muted-foreground">
                  ETA: {job.eta}
                </span>
              )}
            </div>
            <Progress 
              value={job.progress} 
              className="h-2 bg-muted/50"
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {job.progress}%
            </div>
          </div>
        )}

        {/* Error message */}
        {job.status === 'failed' && job.error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{job.error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {canPlay && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                className="glass-button"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 mr-1" />
                ) : (
                  <Play className="w-4 h-4 mr-1" />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
            )}
            
            {job.status === 'completed' && job.downloadUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Mock download
                  const link = document.createElement('a');
                  link.href = job.downloadUrl!;
                  link.download = `${job.file.name}.mp3`;
                  link.click();
                }}
                className="glass-button"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            )}
            
            {job.status === 'failed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => retryJob(job.id)}
                className="glass-button"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {(job.status === 'queued' || 
              job.status === 'uploading' || 
              job.status === 'chunking' || 
              job.status === 'synthesizing' || 
              job.status === 'merging' || 
              job.status === 'packaging') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cancelJob(job.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                Cancel
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeJob(job.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}