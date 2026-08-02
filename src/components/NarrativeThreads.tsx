import React, { useState } from "react";
import { RefreshCw, Network, Check, AlertTriangle, X, GripVertical } from "lucide-react";
import { NarrativeThread, Tile, Centrality } from "../types";

const getCentralityDot = (centrality: Centrality) => {
  switch (centrality) {
    case Centrality.DOMINANT: return "bg-databoard-green";
    case Centrality.PRESENT: return "bg-databoard-yellow";
    case Centrality.EDGE_CASE: return "bg-databoard-red";
    default: return "bg-ink/20";
  }
};

const coheresBadge = (coheres: NarrativeThread["coheres"]) => {
  switch (coheres) {
    case "yes": return { label: "Coheres", color: "bg-databoard-green text-white", icon: <Check className="w-3 h-3" /> };
    case "partial": return { label: "Partial", color: "bg-databoard-yellow text-ink", icon: <AlertTriangle className="w-3 h-3" /> };
    case "no": return { label: "Doesn't Cohere", color: "bg-databoard-red text-white", icon: <X className="w-3 h-3" /> };
  }
};

interface NarrativeThreadsProps {
  tiles: Tile[];
  threads: NarrativeThread[];
  onCluster: () => void;
  onThreadsChange: (threads: NarrativeThread[]) => void;
  onRecheckThread: (threadId: string) => void;
  isClustering: boolean;
  recheckingThreadId: string | null;
}

export const NarrativeThreads: React.FC<NarrativeThreadsProps> = ({
  tiles,
  threads,
  onCluster,
  onThreadsChange,
  onRecheckThread,
  isClustering,
  recheckingThreadId,
}) => {
  const [dragWord, setDragWord] = useState<string | null>(null);

  const assignedWords = new Set(threads.flatMap(t => t.conceptWords));
  const unassignedTiles = tiles.filter(t => !assignedWords.has(t.word));

  const moveWordToThread = (word: string, targetThreadId: string | null) => {
    const updated = threads.map(t => ({
      ...t,
      conceptWords: t.id === targetThreadId
        ? (t.conceptWords.includes(word) ? t.conceptWords : [...t.conceptWords, word])
        : t.conceptWords.filter(w => w !== word),
    }));
    onThreadsChange(updated);
  };

  if (tiles.length < 2) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xs uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
            <Network className="w-3 h-3" />
            Narrative Threads
          </h2>
          <p className="text-[10px] mono opacity-40 mt-1 max-w-xl">
            Which concepts work together to carry one story — independent of how tiles are weighted on the board. Drag a concept between threads and hit Re-check.
          </p>
        </div>
        <button
          onClick={onCluster}
          disabled={isClustering}
          className="flex items-center gap-2 px-4 py-2 border-2 border-ink font-bold uppercase text-[10px] tracking-widest hover:bg-ink hover:text-bg transition-all shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isClustering ? "animate-spin" : ""}`} />
          {threads.length === 0 ? "Find Narrative Threads" : "Re-cluster All"}
        </button>
      </div>

      {threads.length === 0 && !isClustering && (
        <div className="py-8 text-center border border-dashed border-ink/20">
          <p className="text-[10px] mono opacity-40">No threads yet — click "Find Narrative Threads" to see which concepts combine into a story.</p>
        </div>
      )}

      {threads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {threads.map(thread => {
            const badge = coheresBadge(thread.coheres);
            const isRechecking = recheckingThreadId === thread.id;
            return (
              <div
                key={thread.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const word = e.dataTransfer.getData("text/plain");
                  if (word) moveWordToThread(word, thread.id);
                  setDragWord(null);
                }}
                className="border-2 border-ink bg-bg shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] flex flex-col"
              >
                <div className="p-4 border-b border-ink/10 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight leading-tight">{thread.title}</h3>
                  </div>
                  <span className={`shrink-0 flex items-center gap-1 px-1.5 py-0.5 text-[8px] mono uppercase font-bold ${badge.color}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>

                <div className="p-4 flex flex-wrap gap-2 min-h-[52px]">
                  {thread.conceptWords.length === 0 && (
                    <span className="text-[9px] mono opacity-30 italic">Drop a concept here</span>
                  )}
                  {thread.conceptWords.map(word => {
                    const tile = tiles.find(t => t.word === word);
                    return (
                      <span
                        key={word}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", word);
                          setDragWord(word);
                        }}
                        onDragEnd={() => setDragWord(null)}
                        className={`flex items-center gap-1 px-2 py-1 border border-ink/20 text-[10px] mono uppercase font-bold cursor-grab active:cursor-grabbing hover:border-ink transition-colors ${dragWord === word ? "opacity-40" : ""}`}
                      >
                        <GripVertical className="w-2.5 h-2.5 opacity-30" />
                        <span className={`w-1.5 h-1.5 rounded-full ${getCentralityDot(tile?.centrality || Centrality.PRESENT)}`} />
                        {word}
                      </span>
                    );
                  })}
                </div>

                {thread.synthesis && (
                  <div className="px-4 pb-3">
                    <p className="text-[11px] serif-italic opacity-80 leading-snug">"{thread.synthesis}"</p>
                  </div>
                )}
                {thread.missingLink && (
                  <div className="px-4 pb-3">
                    <p className="text-[9px] mono opacity-50 leading-snug">Missing: {thread.missingLink}</p>
                  </div>
                )}

                <div className="mt-auto p-3 border-t border-ink/10 flex justify-end">
                  <button
                    onClick={() => onRecheckThread(thread.id)}
                    disabled={isRechecking || thread.conceptWords.length < 2}
                    className="flex items-center gap-1 px-3 py-1.5 border border-ink/30 text-[9px] mono uppercase font-bold hover:bg-ink hover:text-bg transition-all disabled:opacity-30"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRechecking ? "animate-spin" : ""}`} />
                    Re-check
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {threads.length > 0 && unassignedTiles.length > 0 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const word = e.dataTransfer.getData("text/plain");
            if (word) moveWordToThread(word, null);
            setDragWord(null);
          }}
          className="p-4 border border-dashed border-ink/20 flex flex-wrap items-center gap-2"
        >
          <span className="text-[9px] mono uppercase font-bold opacity-40 mr-2">Not in a thread:</span>
          {unassignedTiles.map(tile => (
            <span
              key={tile.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", tile.word);
                setDragWord(tile.word);
              }}
              onDragEnd={() => setDragWord(null)}
              className={`flex items-center gap-1 px-2 py-1 border border-ink/20 text-[10px] mono uppercase font-bold cursor-grab active:cursor-grabbing hover:border-ink transition-colors opacity-60 ${dragWord === tile.word ? "opacity-20" : ""}`}
            >
              <GripVertical className="w-2.5 h-2.5 opacity-30" />
              {tile.word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
