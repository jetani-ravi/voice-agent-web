import React from "react";
import { Voice } from "@/app/modules/voice-library/interface";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VoiceCardProps {
  voice: Voice;
  playingAudio: string | null;
  handlePlayAudio: (previewUrl: string | undefined, voiceId: string) => void;
  onAdd?: (voice: Voice) => void;
  onRemove?: (voice: Voice) => void;
}

const VoiceCard = ({
  voice,
  playingAudio,
  handlePlayAudio,
  onAdd,
  onRemove,
}: VoiceCardProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{voice.name}</h3>
          <p className="text-sm text-muted-foreground">{voice.provider}</p>
        </div>
        <div className="flex gap-2">
          {voice.preview_url && (
            <Button
              variant="outline"
              className="text-success hover:text-success/80"
              title="Play/Pause Audio"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayAudio(voice.preview_url, voice.voice_id);
              }}
            >
              {playingAudio === voice.voice_id ? (
                <>
                  <PauseCircle className="h-6 w-6 text-success" />
                  Pause
                </>
              ) : (
                <>
                  <PlayCircle className="h-6 w-6 text-success" />
                  Play
                </>
              )}
            </Button>
          )}
          {voice.is_added ? (
            <Button
              variant="outline"
              size="icon"
              title="Remove voice"
              onClick={(e) => {
                e.stopPropagation();
                if (onRemove) {
                  onRemove(voice);
                }
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              title="Add voice"
              onClick={(e) => {
                e.stopPropagation();
                if (onAdd) {
                  onAdd(voice);
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{voice.language_code}</Badge>
        {voice.accent && <Badge variant="secondary">{voice.accent}</Badge>}
        {voice.gender && <Badge variant="outline">{voice.gender}</Badge>}
        {voice.custom && <Badge variant="default">Custom</Badge>}
      </div>

      {voice.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {voice.description}
        </p>
      )}

      <div className="text-sm space-y-1">
        {voice.model && (
          <p className="text-muted-foreground">Model: {voice.model}</p>
        )}
        {voice.use_case && (
          <p className="text-muted-foreground">Use Case: {voice.use_case}</p>
        )}
      </div>
    </div>
  );
};

export default VoiceCard;
