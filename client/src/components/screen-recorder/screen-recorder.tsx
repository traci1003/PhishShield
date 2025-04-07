import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAccessibility } from '@/contexts/accessibility-context';
import { Video, VideoOff, Camera, Share2, Copy, CheckCircle, RefreshCw, Clock } from 'lucide-react';

interface ScreenRecorderProps {
  className?: string;
}

export const ScreenRecorder: React.FC<ScreenRecorderProps> = ({ className = '' }) => {
  const { highContrast, reducedMotion } = useAccessibility();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedURL, setRecordedURL] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingType, setRecordingType] = useState<'screen' | 'camera' | 'both'>('screen');
  const [includeAudio, setIncludeAudio] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  
  const startRecording = async () => {
    chunksRef.current = [];
    
    try {
      // Request screen capture
      let displayStream: MediaStream | null = null;
      let audioStream: MediaStream | null = null;
      let cameraStream: MediaStream | null = null;
      
      // Request screen capture
      if (recordingType === 'screen' || recordingType === 'both') {
        displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: includeAudio
        });
      }
      
      // Request camera if needed
      if (recordingType === 'camera' || recordingType === 'both') {
        cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }
      
      // Request audio if needed and not already captured
      if (includeAudio && !displayStream?.getAudioTracks().length) {
        try {
          audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
          });
        } catch (err) {
          console.error('Audio permission denied:', err);
          toast({
            title: "Audio permission denied",
            description: "Recording will continue without audio",
          });
        }
      }
      
      // Combine streams as needed
      let combinedStream: MediaStream;
      
      if (recordingType === 'both' && displayStream && cameraStream) {
        combinedStream = new MediaStream();
        
        // Add all tracks from display stream
        displayStream.getTracks().forEach(track => {
          combinedStream.addTrack(track);
        });
        
        // Add video track from camera
        cameraStream.getVideoTracks().forEach(track => {
          combinedStream.addTrack(track);
        });
        
      } else if (recordingType === 'screen' && displayStream) {
        combinedStream = displayStream;
      } else if (recordingType === 'camera' && cameraStream) {
        combinedStream = cameraStream;
      } else {
        throw new Error('Failed to get media streams');
      }
      
      // Add audio tracks if available and requested
      if (includeAudio && audioStream) {
        audioStream.getAudioTracks().forEach(track => {
          combinedStream.addTrack(track);
        });
      }
      
      // Store the stream for later cleanup
      streamRef.current = combinedStream;
      
      // Create media recorder
      const recorder = new MediaRecorder(combinedStream);
      mediaRecorderRef.current = recorder;
      
      // Handle data available event
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      // Handle recording stop
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedURL(url);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        // Simulate generating a shareable link (in a real app, this would upload to a server)
        setIsProcessing(true);
        setTimeout(() => {
          const fakeShareableLink = `https://phishshield.ai.com/shared-recording/${Date.now()}`;
          setShareableLink(fakeShareableLink);
          setIsProcessing(false);
          
          toast({
            title: "Recording Complete",
            description: "Your recording is ready to share",
          });
        }, 2000);
      };
      
      // Start recording
      recorder.start(1000); // Capture in 1-second chunks
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
      
      // Preview the recording if possible
      if (videoPreviewRef.current && streamRef.current) {
        videoPreviewRef.current.srcObject = streamRef.current;
        videoPreviewRef.current.play();
      }
      
    } catch (err) {
      console.error('Error starting recording:', err);
      toast({
        title: "Recording Failed",
        description: "Could not start recording. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };
  
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Resume timer
      let seconds = recordingTime;
      timerRef.current = window.setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
    }
  };
  
  const resetRecording = () => {
    if (recordedURL) {
      URL.revokeObjectURL(recordedURL);
    }
    
    setRecordedURL(null);
    setShareableLink(null);
    setRecordingTime(0);
  };
  
  const copyLinkToClipboard = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          toast({
            title: "Link Copied",
            description: "Shareable link copied to clipboard",
          });
        })
        .catch(err => {
          console.error('Failed to copy link:', err);
          toast({
            title: "Copy Failed",
            description: "Could not copy link to clipboard",
            variant: "destructive",
          });
        });
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card className={`${className} ${highContrast ? 'bg-black text-white border-white border-2' : ''}`}>
      <CardHeader>
        <CardTitle className={highContrast ? 'text-white' : ''}>
          One-Click Screen Recording
        </CardTitle>
        <CardDescription className={highContrast ? 'text-gray-400' : ''}>
          Capture and share a screen recording to demonstrate phishing attempts
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isRecording && !recordedURL && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className={highContrast ? 'text-white' : ''}>What to record</Label>
              <RadioGroup 
                value={recordingType} 
                onValueChange={(value) => setRecordingType(value as 'screen' | 'camera' | 'both')}
                className="grid grid-cols-3 gap-2"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className={`p-3 rounded-full ${
                    highContrast ? 'bg-gray-800' : 'bg-primary-100'
                  }`}>
                    <Video className={
                      highContrast ? 'h-5 w-5 text-primary-300' : 'h-5 w-5 text-primary-600'
                    } />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="screen" id="screen" />
                    <Label htmlFor="screen" className={highContrast ? 'text-white' : ''}>Screen</Label>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <div className={`p-3 rounded-full ${
                    highContrast ? 'bg-gray-800' : 'bg-primary-100'
                  }`}>
                    <Camera className={
                      highContrast ? 'h-5 w-5 text-primary-300' : 'h-5 w-5 text-primary-600'
                    } />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="camera" id="camera" />
                    <Label htmlFor="camera" className={highContrast ? 'text-white' : ''}>Camera</Label>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <div className={`p-3 rounded-full ${
                    highContrast ? 'bg-gray-800' : 'bg-primary-100'
                  }`}>
                    <div className="relative">
                      <Video className={
                        highContrast ? 'h-5 w-5 text-primary-300' : 'h-5 w-5 text-primary-600'
                      } />
                      <Camera className={
                        highContrast ? 'h-3 w-3 text-primary-300 absolute -bottom-1 -right-1' : 'h-3 w-3 text-primary-600 absolute -bottom-1 -right-1'
                      } />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className={highContrast ? 'text-white' : ''}>Both</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="include-audio" className={highContrast ? 'text-white' : ''}>
                  Include Audio
                </Label>
                <Switch 
                  id="include-audio" 
                  checked={includeAudio}
                  onCheckedChange={setIncludeAudio}
                />
              </div>
              
              <Button onClick={startRecording} className={`${
                reducedMotion ? '' : 'animate-pulse'
              }`}>
                Start Recording
              </Button>
            </div>
          </div>
        )}
        
        {isRecording && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 border-dashed ${
              highContrast 
                ? 'bg-red-900 bg-opacity-30 border-red-500 text-white' 
                : 'bg-red-50 border-red-200'
            } ${isPaused ? 'opacity-60' : ''} ${
              !reducedMotion && !isPaused ? 'animate-pulse-slow' : ''
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {!isPaused ? (
                    <div className="relative">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      {!reducedMotion && (
                        <div className="absolute -inset-1 rounded-full bg-red-500 animate-ping opacity-75"></div>
                      )}
                    </div>
                  ) : (
                    <div className="flex space-x-1">
                      <div className="h-3 w-1 rounded-sm bg-yellow-500"></div>
                      <div className="h-3 w-1 rounded-sm bg-yellow-500"></div>
                    </div>
                  )}
                  <span className="font-medium">
                    {isPaused ? 'Recording Paused' : 'Recording'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{formatTime(recordingTime)}</span>
                </div>
              </div>
              
              {/* Video preview */}
              <div className="mt-3 rounded overflow-hidden bg-black aspect-video">
                <video 
                  ref={videoPreviewRef} 
                  className="w-full h-full object-contain"
                  muted
                ></video>
              </div>
            </div>
            
            <div className="flex justify-between">
              {isPaused ? (
                <Button 
                  variant="outline" 
                  onClick={resumeRecording}
                  className={highContrast ? 'text-white border-white' : ''}
                >
                  Resume
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={pauseRecording}
                  className={highContrast ? 'text-white border-white' : ''}
                >
                  Pause
                </Button>
              )}
              
              <Button 
                variant="destructive" 
                onClick={stopRecording}
              >
                Stop Recording
              </Button>
            </div>
          </div>
        )}
        
        {recordedURL && !isRecording && (
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden border bg-black aspect-video">
              <video 
                src={recordedURL} 
                controls
                className="w-full h-full"
              ></video>
            </div>
            
            {isProcessing ? (
              <div className={`py-4 flex flex-col items-center justify-center ${
                highContrast ? 'text-white' : ''
              }`}>
                <RefreshCw className={`h-8 w-8 mb-2 ${!reducedMotion ? 'animate-spin' : ''}`} />
                <p>Processing your recording...</p>
              </div>
            ) : shareableLink ? (
              <div className="space-y-3">
                <Label className={highContrast ? 'text-white' : ''}>
                  Shareable Link
                </Label>
                <div className="flex space-x-2">
                  <Input 
                    value={shareableLink} 
                    readOnly
                    className={highContrast ? 'bg-gray-900 text-white border-gray-700' : ''}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" onClick={copyLinkToClipboard}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy link to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex justify-center pt-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      // This would open a sharing dialog in a real app
                      toast({
                        title: "Share Dialog",
                        description: "Sharing options would open here",
                      });
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    Share Recording
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
      
      {recordedURL && !isRecording && !isProcessing && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={resetRecording}
            className={highContrast ? 'text-white border-white' : ''}
          >
            Record New
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              // This would download the recording in a real app
              const a = document.createElement('a');
              a.href = recordedURL;
              a.download = `PhishShield_Recording_${new Date().toISOString().replace(/:/g, '-')}.webm`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className={highContrast ? 'text-white border-white' : ''}
          >
            Download Recording
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};