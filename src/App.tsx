import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Info, Star, ChevronRight, RefreshCw, AlertCircle, Download, Users, Upload, Activity, ShieldCheck, Zap, X, HelpCircle, BookOpen, Scale, Globe } from "lucide-react";
import { SCENARIOS } from "./constants";
import { BoardMetrics, Centrality, Scenario, Tile } from "./types";
import { evaluateWord, generateBestVocabulary, calculateBoardMetrics } from "./services/geminiService";
import { RelationshipGraph } from "./components/RelationshipGraph";

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const MethodologyModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; key?: React.Key }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-bg w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-ink p-8 shadow-[16px_16px_0px_0px_rgba(20,20,20,1)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-8 border-b-2 border-ink pb-4">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">The Data Analysis Board</h2>
            <div className="flex items-center gap-3 mt-2">
              <p className="mono text-xs uppercase tracking-widest opacity-50">Analytical Framework v2.0</p>
              <div className="w-1 h-1 bg-ink/20 rounded-full" />
              <p className="mono text-xs uppercase tracking-widest font-bold">Created by Ruth Aharon</p>
              <div className="w-1 h-1 bg-ink/20 rounded-full" />
              <a href="https://thedataboard.ai" className="mono text-xs uppercase tracking-widest hover:underline font-bold">thedataboard.ai</a>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-ink hover:text-bg transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <section>
            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" /> 1. The Open Source Method
            </h3>
            <p className="serif-italic text-lg leading-relaxed mb-4">
              "Data is not just numbers; it is a narrative that requires precise analytical vocabulary."
            </p>
            <p className="text-sm opacity-80 leading-relaxed">
              The Data Board Method is a collaborative protocol for analyzing complex subjects. Instead of abstract theories, we use a <strong>Semantic Vocabulary Grid</strong> to map the dominant segments, secondary factors, and edge cases revealed by data. It allows teams to negotiate meaning, bridge facts with deduction, and validate insights through a shared analytical language.
            </p>
            <div className="mt-6 p-4 bg-ink/5 border-l-4 border-ink">
              <p className="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                <Scale className="w-4 h-4" /> Open License
              </p>
              <p className="text-[10px] mono leading-tight opacity-60">
                This methodology is licensed under <strong>Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</strong>. You are free to share, adapt, and build upon this method for any purpose, even commercially, as long as you attribute <strong>Ruth Aharon (thedataboard.ai)</strong> and share your improvements under the same license.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" /> 2. The Interactive Tool
            </h3>
            <p className="text-sm opacity-80 leading-relaxed mb-4">
              This application serves as a reference implementation of the method. It uses Large Language Models (LLMs) not as "answers," but as <strong>Semantic Auditors</strong>.
            </p>
            <ul className="space-y-3 text-xs mono">
              <li className="flex gap-2">
                <span className="font-bold text-ink">●</span>
                <span><strong>Input:</strong> Users propose concepts (tiles) they believe are central to the subject.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-ink">●</span>
                <span><strong>Audit:</strong> The AI evaluates each tile based on its relevance, evidence, and uniqueness.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-ink">●</span>
                <span><strong>Synthesis:</strong> The system identifies emergent patterns and semantic links between concepts.</span>
              </li>
            </ul>
          </section>

          <section className="md:col-span-2 border-t-2 border-ink pt-8">
            <h3 className="text-xl font-bold uppercase mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5" /> 3. The Methodology (The Science)
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-4 border border-ink/10 bg-white/50">
                <h4 className="font-bold text-xs uppercase mb-2">Semantic Cohesion</h4>
                <p className="text-[10px] opacity-70 leading-relaxed">
                  Calculated using cosine similarity between the vector embeddings of all active tiles. High cohesion indicates a focused narrative; low cohesion suggests a fragmented or overly broad subject.
                </p>
              </div>
              <div className="p-4 border border-ink/10 bg-white/50">
                <h4 className="font-bold text-xs uppercase mb-2">Narrative Entropy</h4>
                <p className="text-[10px] opacity-70 leading-relaxed">
                  A measure of conceptual diversity. We use a modified Shannon Entropy formula to ensure the board isn't just repeating the same idea. High entropy is essential for "Edge Case" discovery.
                </p>
              </div>
              <div className="p-4 border border-ink/10 bg-white/50">
                <h4 className="font-bold text-xs uppercase mb-2">Bayesian Relevance</h4>
                <p className="text-[10px] opacity-70 leading-relaxed">
                  Each tile's score is a probability estimate. We update the "Relevance" of a concept based on its alignment with the Scenario Corpus and its semantic distance from existing tiles.
                </p>
              </div>
            </div>
          </section>

          <section className="md:col-span-2 border-t-2 border-ink pt-8">
            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> 4. Case Study: Sustainability in AI
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              A practical application of the Data Board was used to track how "accessible" complex data stories are. By mapping the vocabulary of research papers onto a Data Board, we can mathematically identify where the narrative "breaks" or becomes too dense for public consumption. This helps in refining the narrative for better impact and clarity.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-ink flex justify-center">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-ink text-bg font-bold uppercase tracking-widest hover:bg-bg hover:text-ink border-2 border-ink transition-all"
          >
            Return to Board
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SettingsModal = ({ isOpen, onClose, onSelectPlatformKey, isPlatformKeySelected, isSystemKeyActive }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelectPlatformKey: () => void;
  isPlatformKeySelected: boolean;
  isSystemKeyActive: boolean;
  key?: React.Key 
}) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem("GEMINI_API_KEY") || "");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKey.trim()) {
      localStorage.removeItem("GEMINI_API_KEY");
    } else {
      localStorage.setItem("GEMINI_API_KEY", apiKey.trim());
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
      // Use a slightly longer delay before reload to ensure user sees the success state
      window.location.reload();
    }, 1000);
  };

  const handleClear = () => {
    if (confirm("Clear manual API key?")) {
      localStorage.removeItem("GEMINI_API_KEY");
      setApiKey("");
      window.location.reload();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-bg w-full max-w-md border-2 border-ink p-8 shadow-[16px_16px_0px_0px_rgba(20,20,20,1)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" /> Secure AI Setup
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-ink hover:text-bg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* System Status */}
          {isSystemKeyActive ? (
            <div className="p-4 bg-databoard-green/5 border-l-4 border-databoard-green">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-databoard-green animate-pulse" />
                <span className="text-[10px] mono uppercase font-bold text-databoard-green">Shared AI Active</span>
              </div>
              <p className="text-[10px] mono leading-tight opacity-70">
                This board is currently powered by a shared key. All users can explore freely without entering their own key.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-databoard-red/5 border-l-4 border-databoard-red">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-databoard-red" />
                <span className="text-[10px] mono uppercase font-bold text-databoard-red">Shared AI Inactive</span>
              </div>
              <p className="text-[10px] mono leading-tight opacity-70">
                No shared key is configured. To enable AI for all users, add your key to the <strong>AI Studio Platform Settings</strong> as <code className="bg-ink/5 px-1">DATA_BOARD_KEY</code>.
              </p>
            </div>
          )}

          {/* Platform Key Selection (Preferred) */}
          <div className="p-4 bg-databoard-green/10 border-2 border-databoard-green/30">
            <h3 className="text-xs mono uppercase font-bold mb-2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPlatformKeySelected ? 'bg-databoard-green' : 'bg-gray-300'}`} />
              Platform Key Selection (Recommended)
            </h3>
            <p className="text-[10px] mono opacity-70 mb-4 leading-tight">
              Use the built-in AI Studio key selector. This is the most secure way to connect your account.
            </p>
            <button 
              onClick={onSelectPlatformKey}
              className="w-full py-2 bg-databoard-green text-white mono uppercase font-bold text-[10px] hover:opacity-90 transition-opacity"
            >
              {isPlatformKeySelected ? "Key Selected" : "Select Platform Key"}
            </button>
            <p className="text-[9px] mono mt-2 opacity-50 italic">
              * Required for Gemini 3 series models. See <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline">billing docs</a>.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-ink/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] mono uppercase">
              <span className="bg-bg px-2 text-ink/40">Or manual entry</span>
            </div>
          </div>

          {/* Manual Key Entry */}
          <div>
            <p className="text-[10px] mono uppercase opacity-60 mb-4 leading-relaxed">
              To protect your privacy, we don't store API keys on our servers. Your key is saved locally in your browser.
            </p>
            <label className="block text-[10px] mono uppercase font-bold mb-1">Gemini API Key</label>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-white border-2 border-ink p-3 mono text-sm focus:outline-none focus:ring-2 focus:ring-databoard-yellow"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              disabled={isSaved}
              className={`flex-1 py-4 mono uppercase font-bold text-sm transition-all flex items-center justify-center gap-2
                ${isSaved ? 'bg-databoard-green text-white' : 'bg-ink text-bg hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,0.2)] active:translate-0 active:shadow-none'}
              `}
            >
              {isSaved ? (
                <>
                  <ShieldCheck className="w-4 h-4" /> Key Saved & Applied
                </>
              ) : (
                'Save & Reload'
              )}
            </button>
            
            {localStorage.getItem("GEMINI_API_KEY") && (
              <button 
                onClick={handleClear}
                className="px-4 py-4 bg-red-500/10 text-red-500 border-2 border-red-500/20 hover:bg-red-500 hover:text-white transition-all mono uppercase font-bold text-[10px]"
                title="Clear manual key"
              >
                Clear
              </button>
            )}
          </div>
          
          <p className="text-[10px] mono text-center opacity-40">
            Don't have a key? Get one for free at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-ink">Google AI Studio</a>.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Walkthrough = ({ onComplete }: { onComplete: () => void; key?: React.Key }) => {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to Data Board",
      description: "A collaborative framework for analyzing complex data sets through structured analytical vocabulary.",
      target: null
    },
    {
      title: "1. Select a Scenario",
      description: "Choose a data set or audit scenario. Each scenario provides a specific context for the AI to evaluate your analytical concepts.",
      target: "#scenario-selector"
    },
    {
      title: "2. Propose Analytical Handles",
      description: "Type metrics or patterns you believe are central to the data. The AI will audit them based on statistical grounding.",
      target: "#vocab-input"
    },
    {
      title: "3. AI Suggestions",
      description: "Stuck? Let Gemini suggest high-impact analytical vocabulary that offers precise lenses for data analysis.",
      target: "#ai-suggestions"
    },
    {
      title: "4. Board Strength",
      description: "Monitor the health of your analysis. Cohesion measures focus, Coverage measures depth, and Sharpness measures data-grounding.",
      target: "#board-metrics"
    },
    {
      title: "5. The Semantic Board",
      description: "Explore your tiles. Green is Dominant, Yellow is Present, and Red is an Edge Case or Assumption.",
      target: "#vocab-board"
    },
    {
      title: "6. Synthesis & Patterns",
      description: "Discover non-obvious links and emergent patterns that connect your concepts into a unified narrative.",
      target: "#board-metrics"
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = steps[step];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-[2px]"
    >
      <motion.div 
        key={step}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-bg border-2 border-ink p-6 max-w-sm shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] relative"
      >
        <div className="mb-4">
          <p className="mono text-[10px] uppercase opacity-50 mb-1">Step {step + 1} of {steps.length}</p>
          <h3 className="text-xl font-black uppercase tracking-tighter">{currentStep.title}</h3>
        </div>
        <p className="text-sm opacity-80 leading-relaxed mb-6">
          {currentStep.description}
        </p>
        <div className="flex justify-between items-center">
          <button 
            onClick={onComplete}
            className="text-[10px] mono uppercase opacity-40 hover:opacity-100"
          >
            Skip Walkthrough
          </button>
          <button 
            onClick={nextStep}
            className="px-6 py-2 bg-ink text-bg font-bold uppercase text-xs tracking-widest hover:bg-bg hover:text-ink border border-ink transition-all"
          >
            {step === steps.length - 1 ? "Start Exploring" : "Next Step"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TileCard = React.memo(({ 
  tile, 
  isSelected, 
  onSelect 
}: { 
  tile: Tile, 
  isSelected: boolean, 
  onSelect: (tile: Tile | null) => void 
}) => {
  const getCentralityColor = (centrality: Centrality) => {
    switch (centrality) {
      case Centrality.DOMINANT: return "bg-databoard-green text-white";
      case Centrality.PRESENT: return "bg-databoard-yellow text-ink";
      case Centrality.EDGE_CASE: return "bg-databoard-red text-white";
      default: return "bg-ink/10 text-ink";
    }
  };

  const getCentralityLabel = (centrality: Centrality) => {
    switch (centrality) {
      case Centrality.DOMINANT: return "Dominant";
      case Centrality.PRESENT: return "Present";
      case Centrality.EDGE_CASE: return "Edge Case";
      default: return "Finding";
    }
  };

  return (
    <div className="relative perspective-1000">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotateY: isSelected ? 180 : 0
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => onSelect(isSelected ? null : tile)}
        className="w-full h-full min-h-[180px] cursor-pointer preserve-3d relative"
      >
        {/* Front of Card */}
        <div className={`absolute inset-0 backface-hidden p-4 flex flex-col justify-between transition-all group border-t-4 ${
          tile.centrality === Centrality.DOMINANT 
            ? "bg-databoard-green/5 border-t-databoard-green" 
            : tile.centrality === Centrality.PRESENT 
              ? "bg-databoard-yellow/5 border-t-databoard-yellow" 
              : "bg-databoard-red/5 border-t-databoard-red"
        } hover:bg-ink hover:text-bg`}>
          <div className="flex justify-between items-start">
            <div className={`px-1.5 py-0.5 text-[8px] mono uppercase font-bold tracking-tighter ${getCentralityColor(tile.centrality)}`}>
              {getCentralityLabel(tile.centrality)}
            </div>
            <div className="flex items-center gap-1">
              {tile.specificityScore > 70 && (
                <Zap className="w-3 h-3 text-databoard-green fill-databoard-green" />
              )}
              {tile.isAIConfirmed && (
                <Star className="w-3 h-3 fill-ink group-hover:fill-databoard-yellow" />
              )}
            </div>
          </div>
          
          <div className="mt-8">
            <span className="text-[9px] mono uppercase opacity-40 group-hover:opacity-60 mb-1 block">
              {tile.category}
            </span>
            <h4 className="text-base font-bold uppercase leading-tight tracking-tight break-words group-hover:underline decoration-1 underline-offset-4">
              {tile.word}
            </h4>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1">
              <div className="w-8 h-1 bg-ink/10 rounded-full overflow-hidden">
                <div className="h-full bg-ink/40" style={{ width: `${tile.specificityScore}%` }} />
              </div>
              <span className="text-[7px] mono opacity-30 uppercase">Sharpness</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Back of Card (Explanation) */}
        <div 
          className="absolute inset-0 backface-hidden p-4 flex flex-col bg-ink text-bg border-t-4 border-t-ink overflow-y-auto"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full mono text-ink ${
              tile.centrality === Centrality.DOMINANT ? "bg-databoard-green" :
              tile.centrality === Centrality.PRESENT ? "bg-databoard-yellow" :
              "bg-databoard-red"
            }`}>
              {getCentralityLabel(tile.centrality)}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[8px] mono opacity-50">REL: {tile.relevanceScore}%</span>
              <button onClick={(e) => { e.stopPropagation(); onSelect(null); }}>
                <X className="w-3 h-3 opacity-50 hover:opacity-100" />
              </button>
            </div>
          </div>
          
          <div className="flex-grow">
            <p className="text-[10px] serif-italic leading-tight mb-3">
              {tile.explanation}
            </p>
            
            {tile.dataInsight && (
              <div className="mb-3 p-2 bg-white/10 border-l border-white/30">
                <p className="text-[8px] uppercase tracking-widest font-bold opacity-50 mb-1">Insight</p>
                <p className="text-[9px] mono leading-tight">{tile.dataInsight}</p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-2 border-t border-white/10 flex justify-between items-center text-[8px] mono uppercase opacity-50">
            <span>{tile.category}</span>
            <span>Score: {tile.relevanceScore}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default function App() {
  const [scenario, setScenario] = useState<Scenario>(() => {
    const saved = localStorage.getItem("databoard-scenario");
    if (saved) {
      const found = SCENARIOS.find(s => s.id === saved);
      if (found) return found;
    }
    return SCENARIOS[0];
  });
  const [tiles, setTiles] = useState<Tile[]>(() => {
    const saved = localStorage.getItem("databoard-tiles");
    return saved ? JSON.parse(saved) : [];
  });
  const [metrics, setMetrics] = useState<BoardMetrics | null>(null);
  const [isMetricsLoading, setIsMetricsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSystemKeyActive, setIsSystemKeyActive] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check for API key status on mount
  useEffect(() => {
    const checkKeyStatus = async () => {
      const localKey = localStorage.getItem("GEMINI_API_KEY");
      
      try {
        // First check server health
        const healthUrl = `${window.location.origin}/api/health`;
        console.log("Checking health at:", healthUrl);
        const healthCheck = await fetch(healthUrl);
        if (!healthCheck.ok) {
          console.error("Server health check failed:", healthCheck.status);
          setHasApiKey(!!localKey);
          setIsSystemKeyActive(false);
          return;
        }

        const statusUrl = `${window.location.origin}/api/ai/status`;
        console.log("Checking status at:", statusUrl);
        const response = await fetch(statusUrl);
        const contentType = response.headers.get("content-type");
        
        if (response.ok && contentType && contentType.includes("application/json")) {
          const data = await response.json();
          // If the server has a shared key, we consider the system key active.
          // The service will still prioritize the local key if it exists.
          setHasApiKey(!!localKey || data.isReady); 
          setIsSystemKeyActive(data.isReady);
        } else {
          console.error("Status check failed:", response.status, contentType);
          setHasApiKey(!!localKey);
          setIsSystemKeyActive(false);
        }
      } catch (e) {
        console.error("Connectivity error:", e);
        setHasApiKey(!!localKey);
        setIsSystemKeyActive(false);
      }
    };
    checkKeyStatus();
  }, []);
  const [isPlatformKeySelected, setIsPlatformKeySelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkPlatformKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setIsPlatformKeySelected(selected);
        if (selected) setHasApiKey(true);
      }
    };
    checkPlatformKey();
  }, []);

  const handleOpenSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setIsPlatformKeySelected(true);
      setHasApiKey(true);
    }
  };

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenDataBoardWalkthrough");
    if (!hasSeen) {
      setShowWalkthrough(true);
    }
  }, []);

  const completeWalkthrough = () => {
    localStorage.setItem("hasSeenDataBoardWalkthrough", "true");
    setShowWalkthrough(false);
  };

  // Persist tiles and scenario
  useEffect(() => {
    localStorage.setItem("databoard-tiles", JSON.stringify(tiles));
  }, [tiles]);

  useEffect(() => {
    localStorage.setItem("databoard-scenario", scenario.id);
  }, [scenario]);

  // Update metrics when tiles change
  useEffect(() => {
    const updateMetrics = async () => {
      if (tiles.length === 0) {
        setMetrics(null);
        return;
      }
      setIsMetricsLoading(true);
      try {
        const newMetrics = await calculateBoardMetrics(scenario, tiles);
        setMetrics(newMetrics);
      } catch (err: any) {
        console.error("Failed to update metrics", err);
        setError(err.message || "Failed to update board metrics.");
      } finally {
        setIsMetricsLoading(false);
      }
    };

    const timer = setTimeout(updateMetrics, 1000); // Debounce
    return () => clearTimeout(timer);
  }, [tiles, scenario]);

  const handleAddWord = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const existingWords = tiles.map(t => t.word);
      const newTile = await evaluateWord(scenario, inputValue.trim(), existingWords);
      setTiles((prev) => {
        // Prevent duplicates by word
        if (prev.some(t => t.word.toLowerCase() === newTile.word.toLowerCase())) {
          return prev;
        }
        return [newTile, ...prev];
      });
      setInputValue("");
      inputRef.current?.focus();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to evaluate word. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySynthesis = async (original: string[], replacement: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      // Remove original words
      const filteredTiles = tiles.filter(t => !original.includes(t.word));
      // Add replacement word
      const existingWords = filteredTiles.map(t => t.word);
      const newTile = await evaluateWord(scenario, replacement, existingWords);
      setTiles([newTile, ...filteredTiles]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to apply synthesis suggestion.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeminiSuggest = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    console.log("Suggesting vocabulary for scenario:", scenario.title);
    try {
      const existingWords = tiles.map(t => t.word);
      const suggestions = await generateBestVocabulary(scenario, existingWords);
      console.log("Received suggestions:", suggestions);
      
      if (!suggestions || suggestions.length === 0) {
        setError("No new vocabulary suggestions found for this context.");
        return;
      }

      setTiles((prev) => {
        const currentWords = new Set(prev.map(t => t.word.toLowerCase()));
        const currentIds = new Set(prev.map(t => t.id));
        
        const newSuggestions = suggestions.filter(s => {
          const isNewWord = !currentWords.has(s.word.toLowerCase());
          if (isNewWord && currentIds.has(s.id)) {
            s.id = s.id + "-alt-" + Math.random().toString(36).substr(2, 5);
          }
          return isNewWord;
        });

        // Also filter out duplicates within suggestions itself
        const uniqueNewSuggestions: Tile[] = [];
        const seenWords = new Set();
        for (const s of newSuggestions) {
          if (!seenWords.has(s.word.toLowerCase())) {
            seenWords.add(s.word.toLowerCase());
            uniqueNewSuggestions.push(s);
          }
        }

        return [...uniqueNewSuggestions, ...prev];
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate suggestions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(tiles, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `databoard-${scenario.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTiles = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedTiles)) {
          // Basic validation
          if (importedTiles.length > 0 && (!importedTiles[0].word || !importedTiles[0].centrality)) {
            throw new Error("Invalid file format");
          }
          
          // Ensure unique IDs for imported tiles
          const seenIds = new Set();
          const uniqueImportedTiles = importedTiles.map(t => {
            if (!t.id || seenIds.has(t.id)) {
              t.id = (t.id || "imported") + "-" + Math.random().toString(36).substr(2, 9);
            }
            seenIds.add(t.id);
            return t;
          });

          setTiles(uniqueImportedTiles);
          setSelectedTile(null);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to import file. Please ensure it's a valid Databoard JSON.");
      }
    };
    reader.readAsText(file);
    // Reset input value so same file can be imported again if needed
    e.target.value = "";
  };

  const resetBoard = () => {
    if (confirm("Clear the board?")) {
      setTiles([]);
      setSelectedTile(null);
      setMetrics(null);
      localStorage.removeItem("databoard-tiles");
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
      <AnimatePresence>
        {showWalkthrough && <Walkthrough key="walkthrough" onComplete={completeWalkthrough} />}
        {showMethodology && (
          <MethodologyModal 
            key="methodology-modal" 
            isOpen={showMethodology} 
            onClose={() => setShowMethodology(false)} 
          />
        )}
        {isSettingsOpen && (
          <SettingsModal 
            key="settings-modal" 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            onSelectPlatformKey={handleOpenSelectKey}
            isPlatformKeySelected={isPlatformKeySelected}
            isSystemKeyActive={isSystemKeyActive}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="mb-12 border-b-4 border-ink pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-ink text-bg px-2 py-1 text-[10px] font-black uppercase tracking-tighter rounded">Open Source Method</div>
            <div className="text-[10px] mono opacity-40 uppercase tracking-widest">Version 1.0</div>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            The Data Board
          </h1>
          <p className="text-lg serif-italic mt-2 opacity-70">
            Analyzing Data Sets & Complex Subjects through structured analytical vocabulary.
          </p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-2">
            {!isSystemKeyActive && (
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 border-2 border-ink font-bold uppercase text-xs tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                  ${!hasApiKey ? 'bg-databoard-yellow animate-pulse' : 'bg-bg hover:bg-ink hover:text-bg'}
                `}
              >
                <ShieldCheck className="w-4 h-4" />
                {!hasApiKey ? 'Setup AI Key' : 'AI Secure'}
              </button>
            )}
            {isSystemKeyActive && (
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-ink bg-databoard-green/10 font-bold uppercase text-xs tracking-widest hover:bg-ink hover:text-bg transition-all shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                <ShieldCheck className="w-4 h-4 text-databoard-green" />
                AI Powered
              </button>
            )}
            <button 
              onClick={() => setShowWalkthrough(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-ink font-bold uppercase text-xs tracking-widest hover:bg-ink hover:text-bg transition-all shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <HelpCircle className="w-4 h-4" />
              Walkthrough
            </button>
            <button 
              id="methodology-btn"
              onClick={() => setShowMethodology(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-ink font-bold uppercase text-xs tracking-widest hover:bg-ink hover:text-bg transition-all shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <BookOpen className="w-4 h-4" />
              Methodology & License
            </button>
          </div>
          <div className="flex items-center gap-4 text-[10px] mono uppercase opacity-40">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Collaborative Mode</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>Real-time Audit</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Input & Info */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Scenario Selection */}
          <section id="scenario-selector" className="p-6 border-2 border-ink bg-bg shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex flex-col gap-4">
              <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold">
                Active Scenario
              </label>
              <select
                value={scenario.id}
                onChange={(e) => {
                  const s = SCENARIOS.find((s) => s.id === e.target.value);
                  if (s) {
                    setScenario(s);
                    setTiles([]);
                    setSelectedTile(null);
                  }
                }}
                className="bg-transparent border-b-2 border-ink py-2 pr-8 focus:outline-none mono text-sm cursor-pointer"
              >
                {SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <p className="text-[9px] mono opacity-40 leading-tight">
                Scenarios provide the semantic corpus for the Bayesian audit.
              </p>
            </div>
          </section>

          {/* Propose Vocabulary */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xs uppercase tracking-widest font-bold opacity-50">
              Propose a Handle
            </h2>
            <form id="vocab-input" onSubmit={handleAddWord} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a segment, driver, or adjective..."
                disabled={isLoading}
                className="w-full bg-transparent border-b-2 border-ink py-4 px-2 text-2xl focus:outline-none placeholder:opacity-20 mono"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-ink hover:text-bg transition-colors disabled:opacity-20"
              >
                {isLoading ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
              </button>
            </form>
            <button
              id="ai-suggestions"
              onClick={handleGeminiSuggest}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full py-3 border border-ink/20 hover:border-ink hover:bg-ink hover:text-bg transition-all mono text-xs uppercase tracking-widest disabled:opacity-50"
            >
              <Star className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
              {isLoading ? "Analyzing Subject..." : "Gemini: Suggest Vocabulary"}
            </button>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs mono">
                <AlertCircle className="w-3 h-3" />
                {error}
              </div>
            )}
          </section>

          {/* Board Strength Panel */}
          <section id="board-metrics" className="p-6 border-2 border-ink bg-bg shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xs uppercase tracking-widest font-bold">Board Strength</h2>
                <button onClick={() => setShowMethodology(true)}>
                  <HelpCircle className="w-3 h-3 opacity-30 hover:opacity-100 transition-opacity" />
                </button>
              </div>
              <Activity className={`w-4 h-4 ${isMetricsLoading ? "animate-pulse text-databoard-yellow" : "opacity-20"}`} />
            </div>

            {metrics ? (
              <div className="space-y-6">
                {metrics.synthesis && (
                  <div className="p-5 border-2 border-ink bg-databoard-yellow/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 bg-ink text-white text-[8px] mono uppercase font-bold">
                      Headline Insight
                    </div>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center gap-2 opacity-50">
                      <Zap className="w-3 h-3" />
                      The Eureka Moment
                    </p>
                    <p className="serif-italic text-xl leading-tight font-medium">
                      "{metrics.synthesis}"
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center group relative cursor-help border border-ink/10 p-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <p className="text-[8px] mono uppercase opacity-50">Cohesion</p>
                      <Info className="w-2 h-2 opacity-30" />
                    </div>
                    <p className="text-2xl font-black">{metrics.cohesion}%</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-ink text-bg text-[9px] mono leading-tight opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl border border-white/10">
                      <p className="font-bold mb-1 uppercase text-databoard-yellow">Narrative Cohesion</p>
                      Measures how well the specific findings connect to form a unified argument.
                    </div>
                  </div>
                  <div className="text-center group relative cursor-help border border-ink/10 p-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <p className="text-[8px] mono uppercase opacity-50">Sharpness</p>
                      <Zap className="w-2 h-2 opacity-30" />
                    </div>
                    <p className="text-2xl font-black">{metrics.sharpness}%</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-ink text-bg text-[9px] mono leading-tight opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl border border-white/10">
                      <p className="font-bold mb-1 uppercase text-databoard-green">Finding Sharpness</p>
                      Measures the specificity of your findings. High sharpness means data-backed observations.
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-ink text-bg text-[10px] leading-relaxed mono uppercase">
                  {metrics.explanation}
                </div>

                <div className="space-y-3 py-4 border-y border-ink/10">
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">Centrality Mix</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] mono uppercase">
                      <span>Dominant (Major)</span>
                      <span>{metrics.coverageBreakdown?.dominant || 0}%</span>
                    </div>
                    <div className="w-full h-1 bg-ink/5 rounded-full overflow-hidden">
                      <div className="h-full bg-databoard-green transition-all duration-1000" style={{ width: `${metrics.coverageBreakdown?.dominant || 0}%` }} />
                    </div>
                    
                    <div className="flex justify-between items-center text-[9px] mono uppercase">
                      <span>Present (Secondary)</span>
                      <span>{metrics.coverageBreakdown?.present || 0}%</span>
                    </div>
                    <div className="w-full h-1 bg-ink/5 rounded-full overflow-hidden">
                      <div className="h-full bg-databoard-yellow transition-all duration-1000" style={{ width: `${metrics.coverageBreakdown?.present || 0}%` }} />
                    </div>
 
                    <div className="flex justify-between items-center text-[9px] mono uppercase">
                      <span>Edge Case (Assumption)</span>
                      <span>{metrics.coverageBreakdown?.edgeCase || 0}%</span>
                    </div>
                    <div className="w-full h-1 bg-ink/5 rounded-full overflow-hidden">
                      <div className="h-full bg-databoard-red transition-all duration-1000" style={{ width: `${metrics.coverageBreakdown?.edgeCase || 0}%` }} />
                    </div>
                  </div>
                </div>

                {metrics.emergentPatterns && metrics.emergentPatterns.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">Emergent Patterns</p>
                    <div className="flex flex-wrap gap-2">
                      {metrics.emergentPatterns.map((pattern, i) => (
                        <span key={i} className="px-2 py-1 bg-ink/5 border border-ink/10 text-[9px] mono uppercase">
                          {pattern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {metrics.synthesisSuggestions && metrics.synthesisSuggestions.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-ink/10">
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                      <Scale className="w-3 h-3" />
                      Synthesis Opportunities
                    </p>
                    <div className="space-y-3">
                      {metrics.synthesisSuggestions.map((suggestion, i) => (
                        <div key={i} className="p-3 bg-databoard-yellow/5 border border-ink/10 flex flex-col gap-2">
                          <div className="flex flex-wrap gap-1">
                            {suggestion.original.map((word, j) => (
                              <span key={j} className="px-1.5 py-0.5 bg-ink/5 text-[8px] mono line-through opacity-50">
                                {word}
                              </span>
                            ))}
                            <ChevronRight className="w-3 h-3 opacity-30" />
                            <span className="px-1.5 py-0.5 bg-databoard-yellow text-ink text-[8px] mono font-bold">
                              {suggestion.replacement}
                            </span>
                          </div>
                          <p className="text-[9px] mono leading-tight opacity-70 italic">
                            {suggestion.reasoning}
                          </p>
                          <button
                            onClick={() => handleApplySynthesis(suggestion.original, suggestion.replacement)}
                            disabled={isLoading}
                            className="text-[8px] mono uppercase font-bold text-ink hover:underline text-left flex items-center gap-1 disabled:opacity-30"
                          >
                            <Zap className="w-2 h-2" />
                            Apply Synthesis
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-ink/20">
                <p className="text-[10px] mono opacity-40">Add vocabulary to see board metrics</p>
              </div>
            )}
          </section>

          <section className="p-6 border border-ink bg-white/50 backdrop-blur-sm">
            <h2 className="text-xs uppercase tracking-widest font-bold mb-4 opacity-50">
              Scenario Context
            </h2>
            <p className="text-lg mb-4 leading-tight">
              {scenario.description}
            </p>
            <p className="text-sm opacity-70 serif-italic">
              {scenario.context}
            </p>

            {scenario.id === 'ai-sustainability' && tiles.length === 0 && (
              <button
                onClick={async () => {
                  setIsLoading(true);
                  const sampleTerms = [
                    "Reasoning Models (GPT-5)",
                    "Statistical Models (Llama-4)",
                    "Email Writing",
                    "Sweden Data Center",
                    "The Green Shift"
                  ];
                  try {
                    const existingWords = tiles.map(t => t.word);
                    const newTiles = await Promise.all(
                      sampleTerms.map(term => evaluateWord(scenario, term, existingWords))
                    );
                    setTiles(prev => [...newTiles, ...prev]);
                  } catch (err) {
                    setError("Failed to load sample data.");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="mt-6 w-full py-2 border-2 border-dashed border-ink/30 hover:border-ink hover:bg-ink/5 transition-all mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Zap className="w-3 h-3" />
                Load Research Sample Data
              </button>
            )}

            {scenario.id === 'google-search-console' && tiles.length === 0 && (
              <button
                onClick={async () => {
                  setIsLoading(true);
                  const sampleTerms = [
                    "CRM CTR Spike",
                    "Core Update Drop",
                    "Mobile CTR Gap",
                    "Zero-Click Search",
                    "Branded Loyalty",
                    "Page Depth Friction"
                  ];
                  try {
                    const existingWords = tiles.map(t => t.word);
                    const newTiles = await Promise.all(
                      sampleTerms.map(term => evaluateWord(scenario, term, existingWords))
                    );
                    setTiles(prev => [...newTiles, ...prev]);
                  } catch (err: any) {
                    setError(err.message || "Failed to load sample data.");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="mt-6 w-full py-2 border-2 border-dashed border-ink/30 hover:border-ink hover:bg-ink/5 transition-all mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Zap className="w-3 h-3" />
                Load GSC Audit Findings
              </button>
            )}

            {scenario.id === 'spotify-trends' && tiles.length === 0 && (
              <button
                onClick={async () => {
                  setIsLoading(true);
                  const sampleTerms = [
                    "Intro Friction",
                    "Discover Retention",
                    "TikTok Virality",
                    "Morning Commute Skip",
                    "Editorial Retention",
                    "Global Threshold"
                  ];
                  try {
                    const existingWords = tiles.map(t => t.word);
                    const newTiles = await Promise.all(
                      sampleTerms.map(term => evaluateWord(scenario, term, existingWords))
                    );
                    setTiles(prev => [...newTiles, ...prev]);
                  } catch (err: any) {
                    setError(err.message || "Failed to load sample data.");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="mt-6 w-full py-2 border-2 border-dashed border-ink/30 hover:border-ink hover:bg-ink/5 transition-all mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Zap className="w-3 h-3" />
                Load Spotify Trends Findings
              </button>
            )}
          </section>
        </div>

        {/* Right Column: The Board */}
        <div id="vocab-board" className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <h2 className="text-xs uppercase tracking-widest font-bold opacity-50">
                The Vocabulary Board
              </h2>
              <div className="flex gap-4">
                <label className="flex items-center gap-1 text-[10px] mono uppercase opacity-30 hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="w-3 h-3" />
                  Import JSON
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImport} 
                    className="hidden" 
                  />
                </label>
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-1 text-[10px] mono uppercase opacity-30 hover:opacity-100 transition-opacity"
                >
                  <Download className="w-3 h-3" />
                  Export JSON
                </button>
                <button 
                  onClick={resetBoard}
                  className="text-[10px] mono uppercase opacity-30 hover:opacity-100 transition-opacity"
                >
                  Reset Board
                </button>
              </div>
            </div>

          <div className="data-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 min-h-[400px] bg-white/30">
            <AnimatePresence mode="popLayout">
              {tiles.map((tile) => (
                <TileCard 
                  key={tile.id} 
                  tile={tile} 
                  isSelected={selectedTile?.id === tile.id} 
                  onSelect={setSelectedTile} 
                />
              ))}
              
              {/* Empty state placeholders */}
              {Array.from({ length: Math.max(0, 12 - tiles.length) }).map((_, i) => (
                <div key={`placeholder-${i}`} className="data-cell opacity-5 pointer-events-none" />
              ))}
            </AnimatePresence>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mt-4 p-4 border border-ink/10 bg-white/20 rounded">
            <div className="flex items-center gap-2 text-[10px] mono uppercase">
              <div className="w-2 h-2 rounded-full bg-databoard-green" />
              <span>Dominant (Major Segment)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] mono uppercase">
              <div className="w-2 h-2 rounded-full bg-databoard-yellow" />
              <span>Present (Secondary Factor)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] mono uppercase">
              <div className="w-2 h-2 rounded-full bg-databoard-red" />
              <span>Edge Case (Outlier / Assumption)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] mono uppercase">
              <Star className="w-2 h-2 fill-databoard-yellow" />
              <span>AI Confirmed Weight</span>
            </div>
          </div>
          {metrics?.links && metrics.links.length > 0 && (
            <div className="mt-8">
              <RelationshipGraph tiles={tiles} links={metrics.links} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-ink/20 flex flex-col md:flex-row justify-between gap-8 opacity-50">
        <div className="max-w-md">
          <p className="text-xs mono uppercase mb-2 font-bold">The Open Source Method — Created by Ruth Aharon</p>
          <p className="text-sm serif-italic leading-tight">
            "A rejected word is not a failure. It reveals an assumption the group was making without knowing it."
            The Data Board framework is licensed under CC BY-SA 4.0.
          </p>
          <div className="flex gap-4 mt-4">
            <p className="text-[10px] mono uppercase">
              Domain: <a href="https://thedataboard.ai" className="hover:underline font-bold">thedataboard.ai</a>
            </p>
            <p className="text-[10px] mono uppercase">
              Contact: <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "mailto:" + "ruth" + "@" + "thedatacoach.net";
              }}
              className="hover:underline"
            >
              ruth [at] thedatacoach.net
            </a>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] mono uppercase">
            The Data Board: Open Source Method v1.0
          </p>
          <p className="text-[10px] mono uppercase">
            Created by Ruth Aharon
          </p>
          <p className="text-[10px] mono uppercase font-bold">
            thedataboard.ai
          </p>
          <p className="text-[10px] mono uppercase">
            Licensed under CC BY-SA 4.0
          </p>
          <p className="text-[10px] mono uppercase">
            Built with Google Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}
