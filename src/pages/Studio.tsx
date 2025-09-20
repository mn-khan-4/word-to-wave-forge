import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { Headphones, HelpCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FileDropzone } from '@/components/FileDropzone';
import { JobCard } from '@/components/JobCard';
import { SettingsCard } from '@/components/SettingsCard';
import { MiniPlayer } from '@/components/MiniPlayer';
import { PasteTextModal } from '@/components/modals/PasteTextModal';
import { useAudiobookStore } from '@/store/audiobook-store';

export default function Studio() {
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  
  const { files, jobs, clearAll } = useAudiobookStore();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.1 
      }
    },
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated wave background */}
      <div className="wave-bg" />
      
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="relative z-10"
      >
        {/* Header */}
        <motion.header 
          variants={sectionVariants}
          className="p-6 border-b border-border/50 bg-card/20 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Headphones className="w-8 h-8 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Audiobook Studio</h1>
                <p className="text-sm text-muted-foreground">Convert your documents to high-quality audiobooks</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelpDialog(true)}
                className="glass-button"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearDialog(true)}
                disabled={files.length === 0 && jobs.length === 0}
                className="glass-button hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column - Upload & Queue */}
            <motion.div 
              variants={sectionVariants}
              className="lg:col-span-2 space-y-6"
            >
              <FileDropzone onPasteText={() => setShowPasteModal(true)} />
              
              {/* Job Queue */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  Processing Queue
                  {jobs.length > 0 && (
                    <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                      {jobs.length}
                    </span>
                  )}
                </h2>
                
                <AnimatePresence mode="popLayout">
                  {jobs.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Headphones className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium mb-2">No jobs in queue</p>
                      <p className="text-sm">Upload files above to start converting</p>
                    </motion.div>
                  ) : (
                    jobs.map(job => (
                      <JobCard key={job.id} job={job} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Right column - Settings */}
            <motion.div variants={sectionVariants}>
              <SettingsCard />
            </motion.div>
          </div>
        </main>

        {/* Mini Player */}
        <MiniPlayer />

        {/* Modals */}
        <PasteTextModal 
          open={showPasteModal} 
          onOpenChange={setShowPasteModal} 
        />

        {/* Clear All Confirmation */}
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent className="glass-card">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Files and Jobs?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all files from your queue and cancel any running jobs. 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="glass-button">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={clearAll}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Help Dialog */}
        <AlertDialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
          <AlertDialogContent className="glass-card max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>How to Use AI Audiobook Studio</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">1. Upload Your Content</h4>
                    <p>Drag and drop PDF, EPUB, TXT, or DOCX files, or paste text directly. Maximum 20MB per file.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">2. Configure Settings</h4>
                    <p>Choose your preferred voice, language, and output format. Adjust speaking rate, pitch, and other audio settings.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">3. Generate Audiobook</h4>
                    <p>Click "Generate All" to start converting all files, or process them individually.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">4. Listen & Download</h4>
                    <p>Use the mini player to preview your audiobook, then download the final MP3 or M4B file.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Keyboard Shortcuts</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs bg-muted/20 p-3 rounded-lg">
                      <div><kbd className="bg-muted px-1 rounded">Space</kbd> Play/Pause</div>
                      <div><kbd className="bg-muted px-1 rounded">←/→</kbd> Seek 10s</div>
                      <div><kbd className="bg-muted px-1 rounded">+/-</kbd> Speed</div>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="glass-button">Got it!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}