import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedCounter = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000;
      const steps = 50;
      const increment = end / steps;
      let currentStep = 0;

      const counter = setInterval(() => {
        currentStep++;
        const currentCount = Math.min(Math.round(increment * currentStep), end);
        setCount(currentCount);

        if (currentStep >= steps) {
          clearInterval(counter);
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, 800);

    return () => clearTimeout(timer);
  }, [end]);

  return <span>{count}</span>;
};
import { useNavigate } from 'react-router-dom';
import { 
  Headphones, 
  Upload, 
  Volume2, 
  Download, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  Play,
  FileText,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Index() {
  const navigate = useNavigate();

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Easy Upload",
      description: "Support for PDF, EPUB, TXT, and DOCX files"
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      title: "Premium Voices",
      description: "Choose from natural-sounding AI voices"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Processing",
      description: "Convert documents to audiobooks in minutes"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Multiple Formats",
      description: "Download as MP3 or M4B audiobook format"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated wave background */}
      <div className="wave-bg" />
      
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* Header */}
        <motion.header 
          variants={itemVariants}
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
          </div>
        </motion.header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="relative"
                >
                  <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-primary" />
                  </div>
                  <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-glow-pulse" />
                </motion.div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Transform Your{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Documents
                </span>
                <br />
                Into Audiobooks
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Upload your PDFs, EPUBs, or text files and convert them into professional audiobooks 
                with AI-powered natural voices. Perfect for learning on the go.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/studio')}
                  className="text-lg px-8 py-6 glow-primary group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Converting
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/studio')}
                  className="text-lg px-8 py-6 glass-button"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Try Sample File
                </Button>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div variants={itemVariants}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <Card className="glass-card p-6 text-center h-full">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <div className="text-primary">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="mt-16">
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <motion.div 
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      <AnimatedCounter end={5} />+
                    </motion.span>
                  </motion.div>
                  <div className="text-sm text-muted-foreground">AI Voices</div>
                </div>
                <div className="text-center">
                  <motion.div 
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                    >
                      <AnimatedCounter end={10} />+
                    </motion.span>
                  </motion.div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </div>
                <div className="text-center">
                  <motion.div 
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    >
                      <AnimatedCounter end={4} />
                    </motion.span>
                  </motion.div>
                  <div className="text-sm text-muted-foreground">File Formats</div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer 
          variants={itemVariants}
          className="p-6 border-t border-border/50 bg-card/20 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
            <p>Powered by advanced AI voice synthesis technology</p>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}