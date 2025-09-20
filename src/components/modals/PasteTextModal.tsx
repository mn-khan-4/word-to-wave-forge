import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAudiobookStore } from '@/store/audiobook-store';
import { useToast } from '@/hooks/use-toast';

interface PasteTextModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasteTextModal({ open, onOpenChange }: PasteTextModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { addPastedText } = useAudiobookStore();
  const { toast } = useToast();

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addPastedText(content, title);
    toast({
      title: "Text added successfully!",
      description: `"${title}" is ready to convert`,
    });

    setTitle('');
    setContent('');
    onOpenChange(false);
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const estimatedPages = Math.ceil(wordCount / 250); // ~250 words per page

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-2xl">
        <DialogHeader>
          <DialogTitle>Paste Text Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your audiobook..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-button"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Paste your text content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="glass-button min-h-[300px]"
            />
            {content && (
              <div className="text-sm text-muted-foreground">
                {wordCount.toLocaleString()} words • ~{estimatedPages} pages
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="glass-button"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="glow-primary">
            Add to Queue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}