import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  Settings, 
  Brain, 
  Play, 
  Edit3, 
  BookOpen,
  Music,
  Gauge
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAudiobookStore, VOICES, LANGUAGES } from '@/store/audiobook-store';

export function SettingsCard() {
  const { settings, updateVoiceSettings, updateOutputSettings, updateAdvancedSettings, getEstimate, startJob, files } = useAudiobookStore();
  const [showSSMLEditor, setShowSSMLEditor] = useState(false);
  const estimate = getEstimate();

  const selectedVoice = VOICES.find(v => v.id === settings.voice.voiceId);
  const selectedLanguage = LANGUAGES.find(l => l.code === settings.voice.language);

  const handleGenerateAll = () => {
    files.forEach(file => {
      startJob(file.id);
    });
  };

  return (
    <Card className="glass-card h-fit">
      <div className="p-6 border-b border-border/50">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Generation Settings
        </h2>
      </div>

      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="output" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Output
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <div className="p-6">
          <TabsContent value="voice" className="space-y-6 mt-0">
            {/* Language Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Language</Label>
              <Select 
                value={settings.voice.language} 
                onValueChange={(value) => updateVoiceSettings({ language: value })}
              >
                <SelectTrigger className="glass-button">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Voice Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Voice</Label>
              <div className="grid gap-2">
                {VOICES.map(voice => (
                  <motion.div
                    key={voice.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={settings.voice.voiceId === voice.id ? "default" : "outline"}
                      className={`w-full justify-between p-4 h-auto ${
                        settings.voice.voiceId === voice.id ? 'glow-primary' : 'glass-button'
                      }`}
                      onClick={() => updateVoiceSettings({ voiceId: voice.id })}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{voice.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {voice.gender} • {voice.accent}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Mock voice preview
                        }}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Voice Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Style</Label>
                  <Badge variant="outline">
                    {settings.voice.emotion < 30 ? 'Calm' : settings.voice.emotion > 70 ? 'Energetic' : 'Balanced'}
                  </Badge>
                </div>
                <Slider
                  value={[settings.voice.emotion]}
                  onValueChange={([value]) => updateVoiceSettings({ emotion: value })}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Speaking Rate</Label>
                  <Badge variant="outline">{settings.voice.rate}x</Badge>
                </div>
                <Slider
                  value={[settings.voice.rate]}
                  onValueChange={([value]) => updateVoiceSettings({ rate: value })}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Pitch</Label>
                  <Badge variant="outline">{settings.voice.pitch > 0 ? '+' : ''}{settings.voice.pitch}</Badge>
                </div>
                <Slider
                  value={[settings.voice.pitch]}
                  onValueChange={([value]) => updateVoiceSettings({ pitch: value })}
                  min={-20}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="output" className="space-y-6 mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Format</Label>
                <Select 
                  value={settings.output.format} 
                  onValueChange={(value: 'mp3' | 'm4b') => updateOutputSettings({ format: value })}
                >
                  <SelectTrigger className="glass-button">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp3">MP3</SelectItem>
                    <SelectItem value="m4b">M4B (Audiobook)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Sample Rate</Label>
                <Select 
                  value={settings.output.sampleRate.toString()} 
                  onValueChange={(value) => updateOutputSettings({ sampleRate: parseInt(value) as any })}
                >
                  <SelectTrigger className="glass-button">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="22050">22.05 kHz</SelectItem>
                    <SelectItem value="44100">44.1 kHz</SelectItem>
                    <SelectItem value="48000">48 kHz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Bitrate</Label>
              <Select 
                value={settings.output.bitrate.toString()} 
                onValueChange={(value) => updateOutputSettings({ bitrate: parseInt(value) as any })}
              >
                <SelectTrigger className="glass-button">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="64">64 kbps</SelectItem>
                  <SelectItem value="128">128 kbps</SelectItem>
                  <SelectItem value="192">192 kbps</SelectItem>
                  <SelectItem value="320">320 kbps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <Label htmlFor="chapter-detection">Chapter Detection</Label>
                </div>
                <Switch
                  id="chapter-detection"
                  checked={settings.output.chapterDetection}
                  onCheckedChange={(checked) => updateOutputSettings({ chapterDetection: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  <Label htmlFor="normalize">Normalize Audio</Label>
                </div>
                <Switch
                  id="normalize"
                  checked={settings.output.normalizeAudio}
                  onCheckedChange={(checked) => updateOutputSettings({ normalizeAudio: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  <Label htmlFor="bg-music">Background Music</Label>
                </div>
                <Switch
                  id="bg-music"
                  checked={settings.output.backgroundMusic}
                  onCheckedChange={(checked) => updateOutputSettings({ backgroundMusic: checked })}
                />
              </div>

              {settings.output.backgroundMusic && (
                <div className="space-y-2 ml-6">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Music Volume</Label>
                    <Badge variant="outline">{settings.output.bgMusicVolume}%</Badge>
                  </div>
                  <Slider
                    value={[settings.output.bgMusicVolume]}
                    onValueChange={([value]) => updateOutputSettings({ bgMusicVolume: value })}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-0">
            <div className="space-y-2">
              <Label className="text-sm font-medium">AI Model</Label>
              <Select 
                value={settings.advanced.model} 
                onValueChange={(value: any) => updateAdvancedSettings({ model: value })}
              >
                <SelectTrigger className="glass-button">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="neural">Neural (Recommended)</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">SSML Editor</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSSMLEditor(!showSSMLEditor)}
                  className="glass-button"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  {showSSMLEditor ? 'Hide' : 'Show'}
                </Button>
              </div>
              
              {showSSMLEditor && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter SSML markup for advanced speech control..."
                    value={settings.advanced.ssml}
                    onChange={(e) => updateAdvancedSettings({ ssml: e.target.value })}
                    className="glass-button min-h-[100px]"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {['<break time="1s"/>', '<emphasis level="strong">', '<prosody rate="slow">'].map(tag => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSSML = settings.advanced.ssml + tag;
                          updateAdvancedSettings({ ssml: newSSML });
                        }}
                        className="text-xs glass-button"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Pronunciation Dictionary</Label>
              <Button
                variant="outline"
                className="w-full glass-button"
                onClick={() => {
                  // Open pronunciation dictionary modal
                }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Pronunciations
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer with estimate and generate button */}
      <div className="p-6 border-t border-border/50 bg-card/50">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Estimate:</span> {estimate.time} • {estimate.cost}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            className="flex-1 glow-primary" 
            size="lg"
            onClick={handleGenerateAll}
            disabled={files.length === 0}
          >
            Generate All
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="glass-button"
            disabled={files.length === 0}
          >
            Schedule
          </Button>
        </div>
      </div>
    </Card>
  );
}