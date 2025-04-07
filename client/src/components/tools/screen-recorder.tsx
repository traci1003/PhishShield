import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Pause, 
  Play, 
  Square, 
  Camera, 
  Share2, 
  Copy, 
  Download, 
  Clock, 
  Link as LinkIcon
} from 'lucide-react';
import { useAccessibility } from '@/contexts/accessibility-context';
import { useToast } from '@/hooks/use-toast';

interface Recording {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  date: string;
  duration: string;
  shareLink?: string;
}

export const ScreenRecorder: React.FC = () => {
  const { highContrast } = useAccessibility();
  const { toast } = useToast();
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [recordingName, setRecordingName] = useState('');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [captureScreen, setCaptureScreen] = useState(true);
  const [captureCamera, setCaptureCamera] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  
  // Refs for media handling
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Format recording time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle timer updates during recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);
  
  // Handle countdown for delayed recording start
  useEffect(() => {
    if (countdown > 0) {
      const countdownTimer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(countdownTimer);
    } else if (countdown === 0 && !isRecording && videoSrc === null) {
      startRecording();
    }
  }, [countdown]);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopMediaTracks();
    };
  }, []);
  
  // Stop all media tracks
  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  // Start screen recording with options
  const startRecording = async () => {
    try {
      // Reset state
      setVideoSrc(null);
      setRecordingTime(0);
      chunksRef.current = [];
      
      // Set up the streams to capture
      const streams: MediaStream[] = [];
      
      // Screen capture
      if (captureScreen) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always'
          },
          audio: true
        });
        streams.push(screenStream);
      }
      
      // Camera capture if enabled
      if (captureCamera) {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        streams.push(cameraStream);
      }
      
      // If no streams were created, exit
      if (streams.length === 0) {
        throw new Error('No media sources selected');
      }
      
      // Combine streams if multiple sources
      let combinedStream: MediaStream;
      if (streams.length === 1) {
        combinedStream = streams[0];
      } else {
        // In a real implementation, we would use a library to combine video streams
        // For this demo, we'll just use the first stream
        combinedStream = streams[0];
      }
      
      streamRef.current = combinedStream;
      
      // Set up video preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = combinedStream;
        videoPreviewRef.current.muted = true;
      }
      
      // Create and set up media recorder
      const mediaRecorder = new MediaRecorder(combinedStream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoSrc(url);
        
        // Clean up
        stopMediaTracks();
        
        // Generate a mockup thumbnail for the recording
        // In a real implementation, we would extract an actual frame from the video
        const mockThumbnailUrl = 'https://via.placeholder.com/320x180/6366f1/FFFFFF?text=Recording';
        
        // Create a new recording entry
        if (recordingName) {
          const newRecording: Recording = {
            id: Date.now().toString(),
            name: recordingName || `Recording ${recordings.length + 1}`,
            url: url,
            thumbnailUrl: mockThumbnailUrl,
            date: new Date().toLocaleString(),
            duration: formatTime(recordingTime)
          };
          
          setRecordings(prev => [newRecording, ...prev]);
          
          toast({
            title: "Recording saved",
            description: `"${newRecording.name}" has been saved to your library`,
          });
        }
      };
      
      // Start recording
      mediaRecorder.start(1000); // Capture in 1-second chunks
      setIsRecording(true);
      setIsPaused(false);
    } catch (error: any) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: error.message || "Could not start recording",
        variant: "destructive"
      });
      setIsRecording(false);
    }
  };
  
  // Stop the recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };
  
  // Pause/resume the recording
  const togglePause = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };
  
  // Start recording after countdown
  const startWithCountdown = (seconds: number) => {
    setCountdown(seconds);
  };
  
  // Generate shareable link (mock implementation)
  const generateShareLink = (recordingId: string) => {
    const updatedRecordings = recordings.map(rec => {
      if (rec.id === recordingId) {
        // In a real implementation, this would be an API call to generate a real link
        const shareLink = `https://phishshield.ai.com/share/${recordingId}`;
        return { ...rec, shareLink };
      }
      return rec;
    });
    
    setRecordings(updatedRecordings);
    const recording = updatedRecordings.find(r => r.id === recordingId);
    
    if (recording?.shareLink) {
      navigator.clipboard.writeText(recording.shareLink)
        .then(() => {
          toast({
            title: "Link copied!",
            description: "Shareable link has been copied to clipboard",
          });
        })
        .catch(() => {
          toast({
            title: "Could not copy link",
            description: "Please try again or copy the link manually",
            variant: "destructive"
          });
        });
    }
  };
  
  // Controller component for recording
  const RecordingController = () => (
    <div className={`p-4 rounded-lg ${highContrast ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1 ${highContrast ? 'text-white' : 'text-gray-700'}`}>
          Recording Name
        </label>
        <Input
          type="text"
          placeholder="Enter a name for your recording"
          value={recordingName}
          onChange={(e) => setRecordingName(e.target.value)}
          className={highContrast ? 'bg-gray-800 text-white border-gray-700' : ''}
          disabled={isRecording}
        />
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="capture-screen"
            checked={captureScreen}
            onChange={() => setCaptureScreen(!captureScreen)}
            className="mr-2"
            disabled={isRecording}
          />
          <label htmlFor="capture-screen" className={highContrast ? 'text-white' : ''}>
            Capture Screen
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="capture-camera"
            checked={captureCamera}
            onChange={() => setCaptureCamera(!captureCamera)}
            className="mr-2"
            disabled={isRecording}
          />
          <label htmlFor="capture-camera" className={highContrast ? 'text-white' : ''}>
            Include Camera
          </label>
        </div>
      </div>
      
      {countdown > 0 ? (
        <div className="text-center py-4">
          <div className={`text-4xl font-bold mb-2 ${highContrast ? 'text-white' : 'text-primary'}`}>
            {countdown}
          </div>
          <p className={highContrast ? 'text-gray-300' : 'text-gray-600'}>Recording will start soon...</p>
        </div>
      ) : isRecording ? (
        <div className="space-y-4">
          <div className="flex justify-center items-center">
            <div className={`text-xl font-mono ${highContrast ? 'text-white' : ''}`}>
              {formatTime(recordingTime)}
            </div>
            <div className={`ml-3 px-2 py-1 rounded ${isPaused ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} text-xs`}>
              {isPaused ? 'PAUSED' : 'RECORDING'}
            </div>
          </div>
          
          <div className="flex justify-center gap-2">
            <Button 
              variant="outline" 
              onClick={togglePause}
              className={highContrast ? 'border-gray-700 text-white' : ''}
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
            <Button 
              variant="destructive" 
              onClick={stopRecording}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => startWithCountdown(3)}>
              <Video className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
            <Button variant="outline" onClick={() => startWithCountdown(5)} className={highContrast ? 'border-gray-700 text-white' : ''}>
              <Clock className="h-4 w-4 mr-2" />
              5s Delay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <Card className={highContrast ? 'bg-black text-white border-white border-2' : ''}>
      <CardHeader>
        <CardTitle>Screen Recorder</CardTitle>
        <CardDescription className={highContrast ? 'text-gray-300' : ''}>
          Capture and share security incidents with PhishShield.AI.com
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="record">
          <TabsList className="mb-4">
            <TabsTrigger value="record">Record</TabsTrigger>
            <TabsTrigger value="recordings">My Recordings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="record">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {videoSrc ? (
                  <div>
                    <div className="relative rounded-md overflow-hidden aspect-video bg-gray-900">
                      <video 
                        ref={videoPreviewRef}
                        src={videoSrc}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-center gap-2">
                      <Button variant="outline" onClick={() => setVideoSrc(null)} className={highContrast ? 'border-gray-700 text-white' : ''}>
                        <Camera className="h-4 w-4 mr-2" />
                        New Recording
                      </Button>
                      <Button onClick={() => generateShareLink(recordings[0]?.id)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Create Shareable Link
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-md overflow-hidden aspect-video bg-gray-900">
                    <video 
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-contain ${isRecording ? '' : 'hidden'}`}
                    />
                    
                    {!isRecording && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <Video className="h-16 w-16 mb-4 opacity-20" />
                        <div className="text-sm">No active recording</div>
                        <div className="text-xs mt-2">Click "Start Recording" to begin</div>
                      </div>
                    )}
                    
                    {isRecording && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                          {formatTime(recordingTime)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <RecordingController />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recordings">
            {recordings.length === 0 ? (
              <div className={`p-8 text-center rounded-lg ${highContrast ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <Video className={`h-12 w-12 mx-auto mb-3 opacity-30 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`} />
                <h3 className={`text-lg font-medium mb-1 ${highContrast ? 'text-white' : 'text-gray-700'}`}>
                  No Recordings Yet
                </h3>
                <p className={`mb-4 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                  Your recorded videos will appear here
                </p>
                <Button onClick={() => startWithCountdown(3)}>
                  <Camera className="h-4 w-4 mr-2" />
                  Create Your First Recording
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div 
                    key={recording.id} 
                    className={`p-4 rounded-lg ${highContrast ? 'bg-gray-900' : 'bg-white border'}`}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/3">
                        <div className="rounded-md overflow-hidden aspect-video bg-gray-900">
                          <video 
                            src={recording.url}
                            poster={recording.thumbnailUrl}
                            className="w-full h-full object-cover"
                            controls
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className={`font-medium ${highContrast ? 'text-white' : ''}`}>
                              {recording.name}
                            </h3>
                            <div className="flex items-center text-xs mt-1 space-x-2">
                              <span className={highContrast ? 'text-gray-400' : 'text-gray-500'}>
                                {recording.date}
                              </span>
                              <span className={highContrast ? 'text-gray-400' : 'text-gray-500'}>•</span>
                              <Badge variant="outline" className={
                                highContrast ? 'border-gray-700 text-white' : ''
                              }>
                                {recording.duration}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {recording.shareLink ? (
                          <div className={`p-2 rounded-md mt-3 mb-4 text-sm flex items-center justify-between ${
                            highContrast ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            <div className="flex items-center overflow-hidden">
                              <LinkIcon className={`h-4 w-4 mr-2 flex-shrink-0 ${highContrast ? 'text-blue-400' : 'text-blue-500'}`} />
                              <span className={`truncate ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                                {recording.shareLink}
                              </span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="ml-2 flex-shrink-0"
                              onClick={() => {
                                navigator.clipboard.writeText(recording.shareLink || '');
                                toast({
                                  title: "Link copied!",
                                  description: "Shareable link has been copied to clipboard",
                                });
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : null}
                        
                        <div className="flex flex-wrap gap-2">
                          {!recording.shareLink && (
                            <Button 
                              size="sm" 
                              onClick={() => generateShareLink(recording.id)}
                            >
                              <Share2 className="h-3.5 w-3.5 mr-1.5" />
                              Share
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className={highContrast ? 'border-gray-700 text-white' : ''}
                            onClick={() => {
                              // Download logic would go here
                              toast({
                                title: "Download started",
                                description: `Downloading ${recording.name}`,
                              });
                            }}
                          >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className={`flex justify-between border-t ${highContrast ? 'border-gray-800' : ''} pt-4`}>
        <div className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
          Record and share suspicious activity instantly
        </div>
        <Badge variant="outline" className={highContrast ? 'border-gray-700 text-white' : ''}>
          Powered by PhishShield.AI.com
        </Badge>
      </CardFooter>
    </Card>
  );
};