import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, BookOpen, FilePlus2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAudiobookStore } from '@/store/audiobook-store';

const ACCEPTED_TYPES = {
  'text/plain': ['.txt'],
  'application/pdf': ['.pdf'],
  'application/epub+zip': ['.epub'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

interface FileDropzoneProps {
  onPasteText: () => void;
}

export function FileDropzone({ onPasteText }: FileDropzoneProps) {
  const { toast } = useToast();
  const addFiles = useAudiobookStore(state => state.addFiles);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const reasons = rejectedFiles.map(r => r.errors[0].message).join(', ');
      toast({
        title: "Some files were rejected",
        description: reasons,
        variant: "destructive",
      });
    }

    if (acceptedFiles.length > 0) {
      addFiles(acceptedFiles);
      toast({
        title: `${acceptedFiles.length} file(s) added!`,
        description: "Ready to convert to audiobook",
      });
    }
  }, [addFiles, toast]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 10,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const getDropzoneState = () => {
    if (isDragReject) return 'reject';
    if (isDragAccept) return 'accept';
    if (isDragActive) return 'active';
    return 'idle';
  };

  const dropzoneVariants = {
    idle: { 
      scale: 1, 
      borderColor: 'hsl(var(--border))',
      boxShadow: '0 0 0 0px hsl(var(--accent-glow) / 0)'
    },
    active: { 
      scale: 1.02, 
      borderColor: 'hsl(var(--accent))',
      boxShadow: '0 0 30px 0px hsl(var(--accent-glow) / 0.3)'
    },
    accept: { 
      scale: 1.02, 
      borderColor: 'hsl(var(--accent))',
      boxShadow: '0 0 40px 0px hsl(var(--accent-glow) / 0.5)'
    },
    reject: { 
      scale: 0.98, 
      borderColor: 'hsl(var(--destructive))',
      boxShadow: '0 0 20px 0px hsl(var(--destructive) / 0.3)'
    },
  };

  return (
    <motion.div
      variants={dropzoneVariants}
      animate={getDropzoneState()}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="mb-8"
    >
      <Card 
        {...getRootProps()} 
        className="glass-card border-2 border-dashed cursor-pointer p-12 text-center hover:scale-[1.01] transition-all duration-300"
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={isDragActive ? { y: -5 } : { y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {isDragActive ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <Sparkles className="w-16 h-16 text-accent mb-4 animate-glow-pulse" />
              <p className="text-xl font-semibold text-foreground mb-2">
                {isDragAccept ? 'Drop your files here!' : 'File type not supported'}
              </p>
              <p className="text-muted-foreground">
                {isDragAccept ? 'Convert to audiobook instantly' : 'Please use .txt, .pdf, .epub, or .docx files'}
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Upload className="w-16 h-16 text-primary mb-2" />
                </motion.div>
                <BookOpen className="w-8 h-8 text-accent absolute -bottom-1 -right-1" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Drag & Drop Your Documents
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Support for PDF, EPUB, TXT, and DOCX files. Maximum 20MB per file.
              </p>
              
              <div className="flex gap-4">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="glass-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FilePlus2 className="w-5 h-5 mr-2" />
                  Choose Files
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="glass-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPasteText();
                  }}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Paste Text
                </Button>
              </div>
              
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>TXT</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>EPUB</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>DOCX</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
}