"use client";

import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Pause, Play, AudioLines, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js';
import { PLAYBACK_RATES } from "@/constants/common";
interface RecordingVisualizerProps {
  recordingUrl?: string;
  duration?: string;
}

export function RecordingVisualizer({ recordingUrl }: RecordingVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [totalDuration, setTotalDuration] = useState("00:00");
  const [playbackRate, setPlaybackRate] = useState("1");
  const waveformRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  
  useEffect(() => {
    if (!recordingUrl || !waveformRef.current || !timelineRef.current) return;
    
    // Create WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4ade80',
      progressColor: '#16a34a',
      cursorColor: '#6b7280',
      barWidth: 2,
      barGap: 1,
      barRadius: 3,
      height: 80,
      interact: true,
      autoCenter: false,
      plugins: [
        TimelinePlugin.create({
          container: timelineRef.current,
        }),
        Hover.create({
          lineColor: '#6b7280',
          lineWidth: 1,
          labelBackground: '#1f2937',
          labelColor: '#ffffff',
          labelSize: '11px',
        })
      ]
    });
    
    // Load audio file
    wavesurfer.load(recordingUrl);
    
    // Set up event listeners
    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));
    wavesurfer.on('audioprocess', () => {
      const time = wavesurfer.getCurrentTime();
      setCurrentTime(formatTime(time)); 
    });
    wavesurfer.on('interaction', (newTime: number) => {
      wavesurfer.seekTo(newTime);
      const time = wavesurfer.getCurrentTime();
      setCurrentTime(formatTime(time));
      wavesurfer.play();
    })

    waveformRef.current.addEventListener('click', (e) => {
      const rect = waveformRef.current!.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      wavesurfer.seekTo(clickPosition);
      
      // Update the current time immediately
      const time = wavesurfer.getCurrentTime();
      setCurrentTime(formatTime(time));
      wavesurfer.play();
    });
    
    wavesurfer.on('ready', () => {
      const audioDuration = wavesurfer.getDuration();
      setTotalDuration(formatTime(audioDuration));
    });
    
    wavesurferRef.current = wavesurfer;
    
    // Cleanup on component unmount
    return () => {
      wavesurfer.destroy();
    };
  }, [recordingUrl]);
  
  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };
  
  const handleDownload = () => {
    if (recordingUrl) {
      // Create a temporary anchor element
      const anchor = document.createElement('a');
      anchor.href = recordingUrl;
      
      // Extract filename from URL or use default
      const filename = recordingUrl.split('/').pop() || 'audio-recording.mp3';
      
      // Set download attribute with filename
      anchor.download = filename;
      anchor.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };
  
  const handlePlaybackRateChange = (value: string) => {
    setPlaybackRate(value);
    
    if (wavesurferRef.current) {
      // Convert string to number and set playback rate
      wavesurferRef.current.setPlaybackRate(parseFloat(value));
    }
  };
  
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  if (!recordingUrl) {
    return (
      <div className="bg-background border-b p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <AudioLines className="h-5 w-5" />
          <span className="font-medium">No Recording Available.</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          This call was not recorded or the recording for this call is not available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background border-b p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Recording</h3>
        <div className="text-right text-muted-foreground">
          {currentTime} / {totalDuration}
        </div>
      </div>
      
      <div className="w-full">
        {/* WaveSurfer container */}
        <div ref={waveformRef} className="w-full"></div>
        {/* Timeline container */}
        <div ref={timelineRef} className="w-full mt-1"></div>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-primary text-primary-foreground"
          onClick={handlePlayPause}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="ml-4">
          <Select value={playbackRate} onValueChange={handlePlaybackRateChange}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Speed" />
            </SelectTrigger>
            <SelectContent>
              {PLAYBACK_RATES.map((rate) => (
                <SelectItem key={rate.value} value={rate.value}>
                  {rate.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          className="ml-auto"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Audio
        </Button>
      </div>
    </div>
  );
}