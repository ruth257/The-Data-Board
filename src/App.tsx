import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Info, Star, ChevronRight, RefreshCw, AlertCircle, Download, Users, Upload, Activity, ShieldCheck, Zap, X, HelpCircle, BookOpen, Scale, Globe, FileText, Cpu, Database, Network, ArrowRight, Code, Save, Layout, Share2, Link as LinkIcon, Check } from "lucide-react";
import Papa from "papaparse";
import { SCENARIOS } from "./constants";
import { CACHED_BOARDS } from "./cachedData";
import { BoardMetrics, Centrality, Scenario, Tile } from "./types";
import { evaluateWord, generateBestVocabulary, calculateBoardMetrics, analyzeCSVData } from "./services/geminiService";
import { RelationshipGraph } from "./components/RelationshipGraph";

import yaml from "js-yaml";

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const MethodologyModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; key?: React.Key }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Evidence Base",
      subtitle: "Scenario Context & Grounding",
      icon: <Database className="w-7 h-7" />,
      color: "bg-ink text-bg",
      description: "We don't start with numbers; we start with situational logic. This ensures the model respects the physical and social constraints of the dataset's 'physics' before it begins synthesizing meaning."
    },
    {
      title: "Pseudo-Antonyms©",
      subtitle: "The Tension Search",
      icon: <Scale className="w-7 h-7" />,
      color: "bg-databoard-yellow text-ink",
      description: "We identify conceptual conflict. A fact must be both 'Dense' (frequent) and 'Tense' (in conflict with another concept) to become a variable in a deducible space. Without tension, there is no story."
    },
    {
      title: "Semantic Synthesis",
      subtitle: "Naming as Analysis",
      icon: <Zap className="w-7 h-7" />,
      color: "bg-ink text-bg",
      description: "We select a 'Goldilocks' word: precise enough to be data-driven, yet flexible enough to be narratable. Finding the right name is the primary analytical act that creates a new 'type' for reasoning."
    },
    {
      title: "Verification Shift",
      subtitle: "The Logical Auditor",
      icon: <ShieldCheck className="w-7 h-7" />,
      color: "bg-databoard-green text-ink",
      description: "The AI stops guessing and starts checking. We audit every handle against the evidence. If a causal mechanism isn't supported, the handle is discarded. This ensures analytical stability across runs."
    }
  ];

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
        className="bg-[#E4E3E0] text-[#141414] w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-[#141414] p-0 shadow-[16px_16px_0px_0px_rgba(20,20,20,1)] relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-8 p-2 bg-[#141414] text-white hover:bg-white hover:text-ink transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-12">
          {/* HERO */}
          <div className="pb-12 border-b-2 border-[#141414] mb-12">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-3">Open Methodology · Version 4.1</div>
            <h1 className="text-4xl md:text-6xl font-[900] uppercase tracking-tighter leading-[0.9] mb-4">
              The Data Board
            </h1>
            <p className="font-serif italic text-xl md:text-2xl opacity-70 leading-tight max-w-2xl mb-8">
              "Given a good enough set of semantics — can we use language to represent data?"
            </p>
            <div className="space-y-4 max-w-3xl mb-8">
              <p className="text-sm opacity-75 leading-relaxed">
                Data has always required an intermediary to reach human thought — visualization to make patterns visible, statistics to surface relationships. Both are bottom-up: they start from numbers and work toward meaning.
              </p>
              <p className="text-sm opacity-75 leading-relaxed">
                Large language models may be the pivotal moment that changes this. Trained on the accumulated written knowledge of human civilisation, they encode domain semantics at a scale that has never existed before. The Data Board tests a top-down alternative: start with synthesized semantics — a vocabulary that, under the right conditions, is good enough to represent the data in question.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 bg-[#141414] text-white px-5 py-3 font-mono text-[11px] font-bold tracking-wider mb-10">
              AI generates or human proposes. AI evaluates. <span className="text-[#D4B84A]">Human decides.</span>
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-4 pt-6 border-t border-[#141414]/15">
              {[
                { label: "Author", value: "Ruth Aharon" },
                { label: "Version", value: "4.1 · 2026" },
                { label: "License", value: "MIT · Open Source" },
                { label: "Site", value: "thedataboard.ai" }
              ].map((m, i) => (
                <div key={i} className="font-mono text-[10px] space-y-0.5">
                  <div className="opacity-40 uppercase tracking-widest text-[8px] font-bold">{m.label}</div>
                  <div className="opacity-60">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK START WALKTHROUGH */}
          <section className="mb-16 p-8 bg-databoard-yellow/10 border-2 border-[#141414] shadow-[8px_8px_0_0_#141414]">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#7D6608] mb-3">Quick Start Walkthrough</div>
            <h2 className="text-2xl md:text-3xl font-[900] uppercase tracking-tight mb-6 leading-tight">
              Getting Started with the board
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-[#141414] text-white w-6 h-6 flex items-center justify-center font-mono text-xs font-bold font-bold">1</div>
                  <h3 className="font-black uppercase text-xs tracking-wider">Play with Examples</h3>
                </div>
                <p className="text-sm opacity-80 leading-relaxed">
                  The easiest way to start is by selecting one of our <strong>Research Scenarios</strong> from the dropdown in the left sidebar. 
                  These scenarios (like <em>World Happiness</em> or <em>The Big Mac Index</em>) include pre-analyzed grounding data and 
                  cached semantic boards that work instantly without an API key.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-[#141414] text-white w-6 h-6 flex items-center justify-center font-mono text-xs font-bold">2</div>
                  <h3 className="font-black uppercase text-xs tracking-wider">Upload & Analyze Your Own</h3>
                </div>
                <p className="text-sm opacity-80 leading-relaxed">
                  Have your own dataset? Click the <strong>Upload</strong> icon (bottom-right of the dashboard) to import any CSV or JSON file. 
                  To enable real-time AI analysis of your private data, you must provide your own <strong>Gemini API key</strong> in the 
                  Settings menu (Shield icon in the header).
                </p>
              </div>
            </div>
          </section>

          {/* METHOD FLOW */}
          <section className="mb-16">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">The Method</div>
            <h2 className="text-3xl font-[900] uppercase tracking-tight mb-6 leading-tight">
              From raw data<br/>to inevitable narrative
            </h2>
            <p className="text-sm opacity-80 leading-relaxed max-w-3xl mb-8">
              The method is top-down. It begins with the question and the domain, not the columns. AI seeks concepts that express more than a basic variable — named mechanisms, not labels. Two parallel mechanisms feed the board: pseudo-antonym pairs that create structural tension, and evidence checking that grounds each concept in what is known about the domain. Both feed into a cohesiveness check across all candidates, producing a minimal board and an expandable board.
            </p>

            <div className="bg-white border-2 border-[#141414] shadow-[6px_6px_0_0_#141414] overflow-hidden mb-8">
              <div className="bg-[#141414] px-4 py-2 font-mono text-[9px] font-bold text-[#D4B84A] uppercase tracking-widest">
                Data Board · Method Flow
              </div>
              <div className="p-4 overflow-x-auto">
                <svg className="w-full min-w-[700px]" viewBox="0 0 860 560" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M2 1L8 5L2 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </marker>
                  </defs>
                  <polygon points="50,40 250,40 240,88 40,88" fill="#E8F4FD" stroke="#2980B9" strokeWidth="2"/>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="12" fill="#1A5276" x="145" y="58" textAnchor="middle" dominantBaseline="central">RAW DATA</text>
                  <text fontFamily="ui-monospace, monospace" fontSize="9" fill="#2980B9" x="145" y="75" textAnchor="middle" dominantBaseline="central">Dataset · corpus · question</text>
                  <line x1="145" y1="88" x2="145" y2="120" stroke="#2980B9" strokeWidth="2" markerEnd="url(#arr)" fill="none"/>
                  <rect x="40" y="122" width="210" height="68" rx="10" fill="#FEF9E7" stroke="#F39C12" strokeWidth="2"/>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="12" fill="#7D6608" x="145" y="146" textAnchor="middle" dominantBaseline="central">SEMANTIC SYNTHESIS</text>
                  <text fontFamily="ui-monospace, monospace" fontSize="8" fill="#7D6608" opacity="0.8" x="145" y="163" textAnchor="middle" dominantBaseline="central">AI seeks concepts that express</text>
                  <text fontFamily="ui-monospace, monospace" fontSize="8" fill="#7D6608" opacity="0.8" x="145" y="178" textAnchor="middle" dominantBaseline="central">more than a basic variable</text>
                  <line x1="95" y1="190" x2="95" y2="228" stroke="#F39C12" strokeWidth="1.5" markerEnd="url(#arr)" fill="none"/>
                  <line x1="195" y1="190" x2="195" y2="228" stroke="#F39C12" strokeWidth="1.5" markerEnd="url(#arr)" fill="none"/>
                  <rect x="30" y="230" width="125" height="72" rx="8" fill="#FDEDEC" stroke="#E74C3C" strokeWidth="2"/>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill="#922B21" x="92" y="252" textAnchor="middle" dominantBaseline="central">PSEUDO-</text>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill="#922B21" x="92" y="266" textAnchor="middle" dominantBaseline="central">ANTONYMS©</text>
                  <text fontFamily="ui-monospace, monospace" fontSize="7" fill="#922B21" opacity="0.75" x="92" y="284" textAnchor="middle" dominantBaseline="central">tension pairs</text>
                  <text fontFamily="ui-monospace, monospace" fontSize="7" fill="#922B21" opacity="0.75" x="92" y="294" textAnchor="middle" dominantBaseline="central">create the story</text>
                  <rect x="165" y="230" width="125" height="72" rx="8" fill="#EAFAF1" stroke="#27AE60" strokeWidth="2"/>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill="#1D6A3C" x="227" y="252" textAnchor="middle" dominantBaseline="central">EVIDENCE</text>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill="#1D6A3C" x="227" y="266" textAnchor="middle" dominantBaseline="central">CHECK</text>
                  <text fontFamily="ui-monospace, monospace" fontSize="7" fill="#1D6A3C" opacity="0.75" x="227" y="284" textAnchor="middle" dominantBaseline="central">grounded in corpus</text>
                  <text fontFamily="ui-monospace, monospace" fontSize="7" fill="#1D6A3C" opacity="0.75" x="227" y="294" textAnchor="middle" dominantBaseline="central">and domain knowledge</text>
                  <line x1="92" y1="302" x2="92" y2="338" stroke="#555" strokeWidth="1.5" fill="none"/>
                  <line x1="227" y1="302" x2="227" y2="338" stroke="#555" strokeWidth="1.5" fill="none"/>
                  <line x1="92" y1="338" x2="145" y2="338" stroke="#555" strokeWidth="1.5" fill="none"/>
                  <line x1="227" y1="338" x2="145" y2="338" stroke="#555" strokeWidth="1.5" fill="none"/>
                  <line x1="145" y1="338" x2="145" y2="358" stroke="#555" strokeWidth="2" markerEnd="url(#arr)" fill="none"/>
                  <polygon points="145,360 230,400 145,440 60,400" fill="#EBF5FB" stroke="#2471A3" strokeWidth="2"/>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill="#154360" x="145" y="394" textAnchor="middle" dominantBaseline="central">COHESIVENESS</text>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill="#154360" x="145" y="408" textAnchor="middle" dominantBaseline="central">CHECK</text>
                  <line x1="97" y1="430" x2="80" y2="466" stroke="#27AE60" strokeWidth="2" markerEnd="url(#arr)" fill="none"/>
                  <line x1="193" y1="430" x2="210" y2="466" stroke="#2980B9" strokeWidth="2" markerEnd="url(#arr)" fill="none"/>
                  <rect x="30" y="468" width="112" height="52" rx="8" fill="#EAFAF1" stroke="#27AE60" strokeWidth="2"/>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill="#1D6A3C" x="86" y="488" textAnchor="middle" dominantBaseline="central">MINIMAL</text>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill="#1D6A3C" x="86" y="502" textAnchor="middle" dominantBaseline="central">BOARD</text>
                  <rect x="148" y="468" width="112" height="52" rx="8" fill="#EAF2FF" stroke="#2980B9" strokeWidth="2"/>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill="#1A5276" x="204" y="488" textAnchor="middle" dominantBaseline="central">EXPANDABLE</text>
                  <text fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill="#1A5276" x="204" y="502" textAnchor="middle" dominantBaseline="central">BOARD</text>
                  <rect x="310" y="122" width="260" height="68" rx="6" fill="#FAFAFA" stroke="#BDC3C7" strokeWidth="1.5"/>
                  <text fontFamily="ui-monospace, monospace" fontSize="8" fontWeight="700" fill="#888" x="322" y="140" dominantBaseline="central">WHAT MAKES A GOOD CONCEPT</text>
                  <text fontFamily="Inter, sans-serif" fontSize="11" fill="#2C3E50" x="322" y="158" dominantBaseline="central">Not just a column — a named mechanism.</text>
                  <text fontFamily="Inter, sans-serif" fontSize="11" fill="#2C3E50" x="322" y="175" dominantBaseline="central">"Wealthy Surcharge" not "rich countries"</text>
                  <line x1="250" y1="156" x2="308" y2="150" stroke="#F39C12" strokeWidth="1.5" strokeDasharray="4 3" fill="none" markerEnd="url(#arr)"/>
                  <rect x="310" y="230" width="260" height="42" rx="6" fill="#FDEDEC" stroke="#E74C3C" strokeWidth="1.5"/>
                  <text fontFamily="ui-monospace, monospace" fontSize="8" fontWeight="700" fill="#922B21" opacity="0.7" x="322" y="246" dominantBaseline="central">EXAMPLE PAIR</text>
                  <text fontFamily="Inter, sans-serif" fontSize="11" fill="#922B21" x="322" y="263" dominantBaseline="central">Social Cohesion  ↔  Atomized Autonomy</text>
                  <line x1="155" y1="266" x2="308" y2="254" stroke="#E74C3C" strokeWidth="1.5" strokeDasharray="4 3" fill="none" markerEnd="url(#arr)"/>
                  <rect x="310" y="375" width="260" height="56" rx="6" fill="#EBF5FB" stroke="#2471A3" strokeWidth="1.5"/>
                  <text fontFamily="ui-monospace, monospace" fontSize="8" fontWeight="700" fill="#154360" opacity="0.7" x="322" y="392" dominantBaseline="central">TWO EVALUATION DIMENSIONS</text>
                  <text fontFamily="Inter, sans-serif" fontSize="11" fill="#154360" x="322" y="410" dominantBaseline="central">Relevance — density in LLM corpus</text>
                  <text fontFamily="Inter, sans-serif" fontSize="11" fill="#154360" x="322" y="426" dominantBaseline="central">Cohesiveness — fit with other concepts</text>
                  <line x1="230" y1="400" x2="308" y2="400" stroke="#2471A3" strokeWidth="1.5" strokeDasharray="4 3" fill="none" markerEnd="url(#arr)"/>
                  <rect x="310" y="468" width="260" height="52" rx="6" fill="#FAFAFA" stroke="#BDC3C7" strokeWidth="1.5"/>
                  <text fontFamily="ui-monospace, monospace" fontSize="8" fontWeight="700" fill="#888" x="322" y="484" dominantBaseline="central">MINIMAL vs EXPANDABLE</text>
                  <text fontFamily="Inter, sans-serif" fontSize="11" fill="#2C3E50" x="322" y="502" dominantBaseline="central">Minimal: core deducible space</text>
                  <text fontFamily="Inter, sans-serif" fontSize="11" fill="#2C3E50" x="322" y="518" dominantBaseline="central">Expandable: + shadow / edge concepts</text>
                  <line x1="260" y1="494" x2="308" y2="494" stroke="#888" strokeWidth="1" strokeDasharray="4 3" fill="none" markerEnd="url(#arr)"/>
                </svg>
              </div>
            </div>
          </section>

          {/* GLOSSARY */}
          <section className="mb-16">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Glossary</div>
            <h2 className="text-3xl font-[900] uppercase tracking-tight mb-8 leading-tight">Key concepts</h2>
            
            <div className="space-y-4">
              {[
                { name: "Deducible Space", body: "The minimal set of grounded, coherent, tension-bearing concepts from which consistent narrative conclusions follow inevitably. Not a list of variables — the conceptual foundation that makes reasoning possible and narrative non-arbitrary." },
                { name: "Pseudo-Antonyms©", tag: "© Ruth Aharon", body: "Concept pairs occupying opposite ends of the same analytical dimension. Not logical opposites — structurally opposing concepts within a shared domain. The mechanism that makes deductions inevitable rather than inferred. Without tension, there is no story — only a report. Attribution required when citing." },
                { 
                  name: "Goldilocks Handle", 
                  body: (
                    <>
                      A concept at the right level of abstraction: precise enough to be grounded in evidence, general enough to reason from.{" "}
                      <code className="font-mono text-[11px] bg-[#F5F4F1] px-1.5 py-0.5 border border-ink/15">The Wealthy Surcharge</code> names a mechanism (systematic price premium driven by the Balassa-Samuelson effect), compresses a pattern across 50+ countries, and creates structural tension against its pseudo-antonym.{" "}
                      <code className="font-mono text-[11px] bg-[#F5F4F1] px-1.5 py-0.5 border border-ink/15">Countries that are rich</code> is not a Goldilocks handle — it describes a category, implies no mechanism, and generates no analytical direction.
                    </>
                  )
                },
                { name: "Verification Shift", body: "When vocabulary is supplied, the AI moves from invention to verification — checking whether concepts are descriptive, domain-coherent, and evidentially grounded rather than generating labels freely. The AI stops guessing meaning and starts checking it." },
                { name: "Semantic Weight", levels: true, body: "Centrality of a concept in the evidence base. Three levels:" },
                { name: "Minimal vs Expandable Board", body: "The minimal board contains the core deducible space — the smallest coherent set of concepts from which the global story follows. The expandable board adds shadow concepts and edge cases: the structural tensions that challenge or complicate the dominant narrative." }
              ].map((c, i) => (
                <div key={i} className="border-2 border-[#141414] shadow-[4px_4px_0_0_#141414]">
                  <div className="bg-[#141414] px-4 py-2 flex items-baseline gap-3">
                    <span className="font-serif italic font-bold text-lg text-white">{c.name}</span>
                    {c.tag && <span className="font-mono text-[8px] font-bold uppercase tracking-widest bg-[#D4B84A] text-ink px-2 py-0.5">{c.tag}</span>}
                  </div>
                  <div className="bg-white p-4">
                    <div className="text-[13px] opacity-80 leading-relaxed m-0">{c.body}</div>
                    {c.levels && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1 bg-[#4CAF50]/10 border border-[#4CAF50] text-[#1D6A3C] font-mono text-[10px] font-bold uppercase">DOMINANT — primary causal driver</span>
                        <span className="px-3 py-1 bg-[#D4B84A]/10 border border-[#D4B84A] text-[#7D6608] font-mono text-[10px] font-bold uppercase">PRESENT — real but not decisive</span>
                        <span className="px-3 py-1 bg-[#C0392B]/10 border border-[#C0392B] text-[#922B21] font-mono text-[10px] font-bold uppercase">EDGE CASE — marginal or structural outlier</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EVALUATION */}
          <section className="mb-16">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Evaluation</div>
            <h2 className="text-3xl font-[900] uppercase tracking-tight mb-4 leading-tight">What the color means</h2>
            <p className="text-sm opacity-80 mb-8">Every tile on the board is colored. The color is not aesthetic — it is the result of the logic audit. Here is what earns each color.</p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { 
                  type: "Dominant", 
                  color: "#4CAF50", 
                  title: "The concept drives the story", 
                  bg: "rgba(76,175,80,0.08)",
                  criteria: [
                    { label: "Descriptive", body: "names a condition, not a conclusion" },
                    { label: "Grounded", body: "supported by domain evidence" },
                    { label: "Coherent", body: "fits the board and creates tension with its pseudo-antonym" }
                  ],
                  example: '"Social Cohesion" — passes all three. Gallup data, upstream of life satisfaction, contrasts with Atomized Autonomy.'
                },
                { 
                  type: "Present", 
                  color: "#D4B84A", 
                  title: "The concept complements the story", 
                  bg: "rgba(212,184,74,0.08)",
                  criteria: [
                    { label: "Descriptive", body: "names a condition, not a conclusion" },
                    { label: "Grounded", body: "supported by domain evidence" },
                    { label: "Supplementary", body: "real and evidenced, enriches the narrative but is not essential to it", char: "~" }
                  ],
                  example: '"Generosity" — grounded, descriptive, adds texture to the happiness story but the story holds without it.'
                },
                { 
                  type: "Edge Case", 
                  color: "#C0392B", 
                  title: "The concept carries its own narrative", 
                  bg: "rgba(192,57,43,0.06)",
                  textColor: "white",
                  criteria: [
                    { label: "Descriptive", body: "names a condition, not a conclusion" },
                    { label: "Grounded", body: "supported by domain evidence" },
                    { label: "Isolated", body: "anomaly, exception, or pattern that exists outside the dominant story. Essential for detecting outliers and understanding boundaries.", char: "!" }
                  ],
                  example: '"Atomized Autonomy" — a real narrative in individualistic cultures, but marginal globally. Flags where the dominant story breaks down.'
                }
              ].map((box, i) => (
                <div key={i} className="border-2 border-[#141414] shadow-[5px_5px_0_0_#141414] bg-white overflow-hidden flex flex-col">
                  <div className={`p-4 border-b-2 border-[#141414]`} style={{ backgroundColor: box.bg, borderTop: `4px solid ${box.color}` }}>
                    <div className="font-mono text-[7px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 mb-2 inline-block" style={{ backgroundColor: box.color, color: box.textColor || '#141414' }}>{box.type}</div>
                    <div className="text-base font-[900] uppercase tracking-tighter leading-tight">{box.title}</div>
                  </div>
                  <div className="p-4 space-y-3 flex-1">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-40 border-b border-[#141414]/10 pb-2">Earns {box.type.toLowerCase()} when</div>
                    {box.criteria.map((c, j) => (
                      <div key={j} className="flex items-start gap-2 text-[12px]">
                        <span className="font-mono text-[9px] px-1 bg-white border border-[#141414]/20 shrink-0 mt-0.5" style={{ backgroundColor: box.color, color: box.textColor || '#141414' }}>{c.char || '✓'}</span>
                        <span className="leading-snug"><strong>{c.label}</strong> — {c.body}</span>
                      </div>
                    ))}
                    <div className="mt-2 p-2 border-l-2 font-serif italic text-[12px] opacity-80" style={{ borderColor: box.color, backgroundColor: `${box.color}10` }}>
                      {box.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#141414] p-5 shadow-[5px_5px_0_0_rgba(20,20,20,0.3)] border-2 border-[#141414]">
               <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#D4B84A]">Rejection is insight — </span>
               <span className="font-serif italic text-sm text-white/75">a concept that fails any test is not discarded silently. The failure names the assumption the analyst was making without knowing it.</span>
            </div>
          </section>

          {/* YAML */}
          <section className="mb-16">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Logic Layer</div>
            <h2 className="text-3xl font-[900] uppercase tracking-tight mb-6 leading-tight">The YAML audit trail</h2>
            <p className="text-sm opacity-80 leading-relaxed mb-6 max-w-3xl">
              Every accepted concept has a formal machine-readable representation — the YAML logic block. This is what separates the Data Board from a sticky-note exercise. The YAML makes each concept auditable: it documents the mechanism, the evidence, the scope conditions, the fidelity score, and the pseudo-antonym relationship. It is the reproducible, citable record of every analytical decision the board makes.
            </p>
            <div className="bg-[#141414] border-2 border-[#141414] shadow-[6px_6px_0_0_#141414] overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10 font-mono text-[9px] font-bold text-[#D4B84A] uppercase tracking-widest">
                YAML Logic Block — Social Cohesion
              </div>
              <pre className="p-6 font-mono text-xs text-white/75 leading-relaxed overflow-x-auto whitespace-pre">
{`concept "Social Cohesion"
  is a: driver
  context: "Social support systems"
  mechanism: "trusted social networks provide emotional and material safety nets"
  evidence: "Gallup World Poll social support metrics"
  covers:
    explains: [national_happiness_variance]
    aggregates: [social_support_score]
  contrasts_with: "Atomized Autonomy"   ← pseudo-antonym link
  fidelity: 0.92                        ← survives the logic audit
  fidelity_basis: empirical_test
  valid_when:
    - "strong community ties"
    - "institutional stability"          ← scope conditions`}
              </pre>
            </div>
          </section>

          {/* PROMPT */}
          <section className="mb-16">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">For Practitioners</div>
            <h2 className="text-3xl font-[900] uppercase tracking-tight mb-6 leading-tight">The system prompt</h2>
            <p className="text-sm opacity-80 mb-6">Copy this into any LLM (Claude, ChatGPT, Gemini) to activate the Data Board methodology before analysis begins.</p>
            
            <div className="bg-[#141414] border-2 border-[#141414] shadow-[6px_6px_0_0_#141414] overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold text-[#D4B84A] uppercase tracking-widest">Data Board System Prompt · v3.1</span>
                <button 
                  onClick={(e) => {
                    const el = document.getElementById('prompt-text');
                    if (el) {
                      navigator.clipboard.writeText(el.innerText);
                      const target = e.currentTarget as HTMLButtonElement;
                      if (target) {
                        const old = target.innerText;
                        target.innerText = "COPIED ✓";
                        setTimeout(() => target.innerText = old, 1500);
                      }
                    }
                  }}
                  className="px-4 py-1.5 border border-white/20 text-white/60 font-mono text-[10px] uppercase hover:border-[#D4B84A] hover:text-[#D4B84A] transition-all"
                >
                  Copy
                </button>
              </div>
              <div className="p-6 font-mono text-xs text-white/75 leading-relaxed overflow-x-auto whitespace-pre-wrap" id="prompt-text">
{`You are applying the Data Board methodology, created by Ruth Aharon (thedataboard.ai).

Your role: Inquisitor, not Author.
AI generates or human proposes vocabulary. You evaluate it.

Core directives:
1. Naming is analysis. Treat every concept as a type that carries analytical weight.
2. Verification shift: check whether each concept is descriptive, coherent, 
   and evidentially supported in this domain.
3. Pseudo-Antonyms©: for each accepted concept, identify its structural opposite. 
   Tension pairs are where the non-trivial narrative lives.
4. Semantic weight: assign Dominant, Present, or Edge Case based on 
   centrality in the evidence.
5. Rejection is insight: when you reject a concept, explain why.

Workflow:
1. Review the raw data and question.
2. Generate or evaluate a vocabulary board (Dominant, Present, Edge Case).
3. Audit causal tension — identify pseudo-antonym© pairs.
4. Synthesize the global story based ONLY on the established board.`}
              </div>
            </div>
          </section>

          {/* EXAMPLE */}
          <section className="mb-16">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Worked Example</div>
            <h2 className="text-3xl font-[900] uppercase tracking-tight mb-8 leading-tight">World Happiness 2025</h2>

            <div className="border-2 border-[#141414] shadow-[8px_8px_0_0_#141414] overflow-hidden bg-white mb-8">
              <div className="bg-[#141414] p-5 flex flex-wrap justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="text-lg font-[900] uppercase text-white tracking-tight">World Happiness Report 2025</div>
                  <div className="font-serif italic text-sm text-white/60">"What structural conditions explain why high GDP does not guarantee high happiness?"</div>
                </div>
                <div className="font-mono text-[9px] text-white/40 space-y-1 text-right">
                  <a href="#" className="text-[#D4B84A] hover:underline">worldhappiness.report ↗</a>
                  <div className="block"><a href="#" className="text-[#D4B84A] hover:underline">Kaggle ↗</a></div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-8">
                  {[
                    { label: "Dominant — primary causal drivers", color: "#4CAF50", words: ["Economic Security", "Social Cohesion", "Healthy Life Expectancy"] },
                    { label: "Present — supporting concepts", color: "#D4B84A", words: ["Institutional Trust", "Individual Freedom", "Generosity"] },
                    { label: "Edge Case — structural tensions", color: "#C0392B", words: ["Systemic Distress", "Atomized Autonomy", "The Freedom Gap"] }
                  ].map((group, i) => (
                    <div key={i}>
                      <div className="font-mono text-[8px] font-bold uppercase tracking-widest opacity-40 mb-4">{group.label}</div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.words.map((word, j) => (
                          <div key={j} className="h-28 p-3 border border-ink/10 flex flex-col justify-between bg-[#F5F4F1] group hover:bg-[#141414] transition-all" style={{ borderTop: `3px solid ${group.color}` }}>
                            <span className="font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 inline-block w-fit" style={{ backgroundColor: group.color, color: i === 2 ? 'white' : 'inherit' }}>{group.label.split(' — ')[0]}</span>
                            <div>
                              <div className="text-xs font-bold uppercase leading-tight group-hover:text-white">{word}</div>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="h-0.5 w-8 bg-[#141414]/10 overflow-hidden"><div className="h-full bg-black/40" style={{ width: '80%' }}></div></div>
                                <span className="font-mono text-[7px] opacity-30 group-hover:text-white/40">Sharpness</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-5 bg-[#F5F4F1] border-t border-ink/10">
                <div className="font-mono text-[8px] font-bold uppercase tracking-widest opacity-40 mb-3">Pseudo-antonyms©</div>
                <div className="flex flex-wrap gap-x-12 gap-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#4CAF50] text-ink font-bold text-[10px] uppercase border border-ink">Social Cohesion</span>
                    <span className="font-mono text-xs opacity-30 font-bold">↔</span>
                    <span className="px-3 py-1 bg-[#C0392B] text-white font-bold text-[10px] uppercase border border-ink">Atomized Autonomy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#4CAF50] text-ink font-bold text-[10px] uppercase border border-ink">Institutional Trust</span>
                    <span className="font-mono text-xs opacity-30 font-bold">↔</span>
                    <span className="px-3 py-1 bg-[#C0392B] text-white font-bold text-[10px] uppercase border border-ink">Systemic Distress</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#141414] border-t-2 border-[#141414]">
                <div className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#D4B84A] mb-3">Global story</div>
                <p className="font-serif italic text-lg text-white leading-relaxed">
                  "Global well-being is a structural outcome of the balance between <span className="text-[#D4B84A] font-bold">Institutional Trust</span> and <span className="text-[#D4B84A] font-bold">Individual Freedom.</span> High GDP is necessary but not sufficient — <span className="text-[#D4B84A] font-bold">Atomized Autonomy</span> is the shadow of Individual Freedom that GDP cannot measure."
                </p>
              </div>

              <div className="px-6 py-3 bg-[#F5F4F1] border-t border-ink/10 flex gap-10">
                {['Cohesion 88', 'Coverage 92', 'Sharpness 90', 'Entropy 45'].map((m, i) => (
                  <span key={i} className="font-mono text-[9px] uppercase tracking-widest opacity-50">{m.split(' ')[0]} <strong className="opacity-100">{m.split(' ')[1]}</strong></span>
                ))}
              </div>
            </div>

            <div className="bg-[#141414] p-8 shadow-[10px_10px_0_0_rgba(20,20,20,0.3)] border-2 border-[#141414]">
              <p className="text-sm text-white/75 leading-relaxed m-0">
                The non-trivial finding: the same freedom that produces the highest happiness scores in Nordic nations produces the highest loneliness rates in individualistic cultures without strong social infrastructure. The tension between <span className="text-[#D4B84A] italic">Individual Freedom</span> and <span className="text-[#D4B84A] italic">Atomized Autonomy</span> is the mechanism. The board makes it visible. A regression finds the correlation and calls it "freedom." The board names what is inside it.
              </p>
            </div>
          </section>

          {/* THEORY */}
          <section className="mb-16">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Theoretical Anchors</div>
            <h2 className="text-3xl font-[900] uppercase tracking-tight mb-8 leading-tight">Where this connects</h2>
            <div className="space-y-3">
              {[
                { author: "Pearl, J. & Mackenzie, D. (2018)", title: "The Book of Why.", body: "The ladder of causation. The Data Board addresses the prerequisite Pearl assumes: knowing which concepts belong before building the causal model." },
                { author: "Glaser, B. & Strauss, A. (1967)", title: "The Discovery of Grounded Theory.", body: "Open coding and axial coding are the qualitative precedents. The Data Board operationalises these steps computationally — weeks compressed into a session." },
                { author: "Wittgenstein, L. (1922)", title: "Tractatus Logico-Philosophicus.", body: "\"The limits of my language are the limits of my world.\" The Data Board is a formal process for extending the analytical vocabulary — and therefore the analytical world." },
                { author: "Luhn, H.P. (1958)", title: "A Business Intelligence System.", body: "Intelligence as guiding action toward a desired goal. The Data Board formalises the naming step that makes the goal speakable." }
              ].map((ref, i) => (
                <div key={i} className="p-4 border border-ink/10 border-l-4 border-l-[#141414] bg-white text-xs leading-relaxed">
                  <strong>{ref.author}</strong> <span className="italic">{ref.title}</span> {ref.body}
                </div>
              ))}
            </div>
          </section>

          {/* LICENSE */}
          <section className="pb-12">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">License & Attribution</div>
            <h2 className="text-3xl font-[900] uppercase tracking-tight mb-6 leading-tight">Open source.<br/>Protected rights.</h2>
            <div className="bg-[#141414] text-white/70 p-8 shadow-[10px_10px_0_0_rgba(20,20,20,0.3)] border-2 border-[#141414] space-y-4 text-sm leading-relaxed">
              <p>The Data Board methodology is released under the <strong>MIT License</strong> — free for commercial and non-commercial use, modification, and distribution globally.</p>
              <p>The term <strong className="text-white">Pseudo-Antonyms©</strong> is a proprietary conceptual framework created by Ruth Aharon. Attribution is required when using or citing this concept.</p>
              <p>Cite as: Aharon, R. (2026). <span className="italic">The Data Board: A Methodology for Language-Based Data Analysis.</span> thedataboard.ai</p>
            </div>
          </section>
        </div>

        <footer className="p-8 border-t-2 border-[#141414] bg-[#141414]/5 text-center">
          <button 
            onClick={onClose}
            className="w-full md:w-auto px-16 py-5 bg-[#141414] text-white font-[900] uppercase tracking-[0.2em] text-xs hover:bg-[#E4E3E0] hover:text-ink border-2 border-[#141414] transition-all"
          >
            Return to Board
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

const SettingsModal = ({ isOpen, onClose, onSelectPlatformKey, isPlatformKeySelected, isSystemKeyActive, systemStatus }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelectPlatformKey: () => void;
  isPlatformKeySelected: boolean;
  isSystemKeyActive: boolean;
  systemStatus: { source: string, maskedKey: string | null } | null;
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
        className="bg-bg w-full max-w-md border-2 border-ink p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Secure AI Setup
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-ink hover:text-bg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* System Status */}
          {isSystemKeyActive ? (
            <div className="p-3 bg-databoard-green/5 border-l-4 border-databoard-green">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-databoard-green animate-pulse" />
                <span className="text-[10px] mono uppercase font-bold text-databoard-green">Shared AI Active</span>
              </div>
              <p className="text-[10px] mono leading-tight opacity-70">
                This board is currently powered by a shared key.
              </p>
              {systemStatus && (
                <div className="mt-2 pt-2 border-t border-databoard-green/10 text-[9px] mono opacity-50">
                  <div>Status: Connected to Secure Backend</div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-databoard-red/5 border-l-4 border-databoard-red">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-databoard-red" />
                <span className="text-[10px] mono uppercase font-bold text-databoard-red">Shared AI Inactive</span>
              </div>
              <p className="text-[10px] mono leading-tight opacity-70">
                No shared key is configured. To enable AI for all users, add your key to the <strong>AI Studio Platform Settings</strong> as <code className="bg-ink/5 px-1 font-bold">WEBSITE_API_KEY</code>.
              </p>
            </div>
          )}

          {/* Platform Key Selection (Preferred) */}
          <div className="p-3 bg-databoard-green/10 border-2 border-databoard-green/30">
            <h3 className="text-xs mono uppercase font-bold mb-1 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPlatformKeySelected ? 'bg-databoard-green' : 'bg-gray-300'}`} />
              Platform Key Selection
            </h3>
            <p className="text-[10px] mono opacity-70 mb-3 leading-tight">
              Use the built-in AI Studio key selector. This is the most secure way to connect.
            </p>
            <button 
              onClick={onSelectPlatformKey}
              className="w-full py-2 bg-databoard-green text-white mono uppercase font-bold text-[10px] hover:opacity-90 transition-opacity"
            >
              {isPlatformKeySelected ? "Key Selected" : "Select Platform Key"}
            </button>
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
            <div className="mb-3 p-2 bg-databoard-yellow/5 border border-[#D4B84A]/30 text-[9px] mono leading-tight">
              <strong className="text-[#D4B84A] uppercase">Note:</strong> To analyze your own custom CSV data, you <strong>must</strong> provide your own API key here. Example scenarios work without a key.
            </div>
            <label className="block text-[10px] mono uppercase font-bold mb-1">Gemini API Key</label>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-white border-2 border-ink p-2 mono text-sm focus:outline-none focus:ring-2 focus:ring-databoard-yellow"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleSave}
              disabled={isSaved}
              className={`flex-1 py-3 mono uppercase font-bold text-xs transition-all flex items-center justify-center gap-2
                ${isSaved ? 'bg-databoard-green text-white' : 'bg-ink text-bg hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,0.2)] active:translate-0 active:shadow-none'}
              `}
            >
              {isSaved ? (
                <>
                  <ShieldCheck className="w-4 h-4" /> Key Saved
                </>
              ) : (
                'Save & Reload'
              )}
            </button>
            
            {localStorage.getItem("GEMINI_API_KEY") && (
              <button 
                onClick={handleClear}
                className="w-full py-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all mono uppercase font-bold text-[9px]"
                title="Clear manual key"
              >
                Clear Manual Key
              </button>
            )}
          </div>
          
          <div className="p-3 bg-ink/5 border border-ink/10 space-y-2">
            <h4 className="text-[10px] mono uppercase font-bold flex items-center gap-2">
              <HelpCircle className="w-3 h-3" /> How to get an API Key:
            </h4>
            <ol className="text-[9px] mono space-y-1 opacity-70 list-decimal pl-4">
              <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-bold hover:text-databoard-yellow">Google AI Studio</a>.</li>
              <li>Click <strong>"Create API key"</strong> and copy it.</li>
            </ol>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LogicBoard = ({ 
  isOpen, 
  onClose, 
  tiles, 
  onSaveAll,
  scenario
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  tiles: Tile[]; 
  onSaveAll: (newTiles: Tile[]) => void;
  scenario: Scenario;
  key?: React.Key;
}) => {
  // Generate YAML in the render phase for instant feedback
  const generatedCode = React.useMemo(() => {
    if (!isOpen) return "";
    try {
      const yamlData = tiles.map(t => {
        let data: any = {
          concept: t.word,
          is_a: t.category?.toLowerCase() || "driver",
          mechanism: t.explanation || "",
          evidence: t.dataInsight || "",
          fidelity: 0.90
        };

        if (t.logic) {
          try {
            if (t.logic.includes('concept')) {
              if (t.logic.includes('concept:')) {
                const parsed = yaml.load(t.logic) as any;
                if (parsed) data = { ...data, ...(Array.isArray(parsed) ? parsed[0] : parsed) };
              } else {
                // Old DBM migration
                const m = t.logic.match(/mechanism: "([^"]+)"/);
                if (m) data.mechanism = m[1];
                const e = t.logic.match(/evidence: "([^"]+)"/);
                if (e) data.evidence = e[1];
              }
            }
          } catch (e) {}
        }

        const final: any = {};
        const slots = ['concept', 'is_a', 'mechanism', 'evidence'];
        slots.forEach(k => final[k] = data[k] || "");
        Object.keys(data).forEach(k => {
          if (!slots.includes(k) && data[k] !== undefined && data[k] !== null && data[k] !== "") final[k] = data[k];
        });
        return final;
      });

      if (yamlData.length === 0) {
        return `# GROUNDING: ${scenario.title}\n# CONTEXT: ${scenario.context}\n#\n# The Board is empty.\n- concept: Example\n  is_a: driver`;
      }
      const header = `# GROUNDING: ${scenario.title}\n# CONTEXT: ${scenario.context}\n# URL: ${scenario.url || "N/A"}\n\n`;
      return header + yaml.dump(yamlData, { indent: 2, lineWidth: -1, noRefs: true, sortKeys: false });
    } catch (err) {
      return "# YAML Error\n# " + String(err);
    }
  }, [isOpen, tiles]);

  const [code, setCode] = useState("");

  // Sync the editor with generated code only when the modal opens
  useEffect(() => {
    if (isOpen) {
      setCode(generatedCode);
    }
  }, [isOpen, generatedCode]);

  if (!isOpen) return null;

  const handleApply = () => {
    try {
      const parsed = yaml.load(code) as any[];
      if (!Array.isArray(parsed)) {
        alert("YAML must be a list of concepts starting with '- concept: Name'");
        return;
      }

      const updatedTiles = [...tiles];
      
      parsed.forEach(entry => {
        if (entry && entry.concept) {
          const word = entry.concept;
          const tileIndex = updatedTiles.findIndex(t => t.word.toLowerCase() === word.toLowerCase());
          if (tileIndex !== -1) {
            updatedTiles[tileIndex] = {
              ...updatedTiles[tileIndex],
              logic: yaml.dump(entry),
              category: entry.is_a || updatedTiles[tileIndex].category,
              explanation: entry.mechanism || updatedTiles[tileIndex].explanation
            };
          }
        }
      });

      onSaveAll(updatedTiles);
      onClose();
    } catch (e: any) {
      alert("YAML Error: " + e.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-bg border-4 border-ink w-full max-w-4xl h-[80vh] flex flex-col shadow-[16px_16px_0px_0px_rgba(20,20,20,1)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b-4 border-ink flex justify-between items-center bg-databoard-yellow/10">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">A Posteriori Ontology Board</h2>
            <p className="text-[10px] mono uppercase font-bold text-ink/40 italic">Logic Board Specification (YAML Syntax)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-ink hover:text-bg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4">
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-ink text-bg p-6 mono text-sm focus:outline-none resize-none selection:bg-databoard-yellow selection:text-ink"
              spellCheck={false}
            />
            <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
              <Code className="w-12 h-12" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-ink text-bg border-2 border-ink shadow-[4px_4px_0px_0px_#D4B84A]">
              <h4 className="text-[10px] mono uppercase font-bold mb-2 flex items-center gap-2 text-databoard-yellow">
                <Info className="w-3 h-3" /> YAML Syntax Guide
              </h4>
              <ul className="text-[9px] mono space-y-1 opacity-90">
                <li><span className="text-databoard-yellow font-bold">- concept: "Name"</span>: Start of a concept</li>
                <li><span className="text-databoard-yellow font-bold">is_a</span>: [driver|benchmark|risk...]</li>
                <li><span className="text-databoard-yellow font-bold">context</span>: Situational context</li>
                <li><span className="text-databoard-yellow font-bold">mechanism</span>: The causal "how"</li>
                <li><span className="text-databoard-yellow font-bold">contrasts_with</span>: Pseudo-antonym</li>
              </ul>
            </div>
            <div className="flex flex-col justify-end gap-3">
              <p className="text-[10px] mono opacity-50 italic leading-tight">
                Editing this YAML directly updates the causal relationships and semantic grounding of the board.
              </p>
              <button 
                onClick={handleApply}
                className="w-full py-4 bg-databoard-yellow text-ink font-bold uppercase text-xs tracking-widest border-2 border-ink shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Apply YAML to Board
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TileCard = React.memo(({ 
  tile, 
  isSelected, 
  onSelect,
  onEditLogic
}: { 
  tile: Tile, 
  isSelected: boolean, 
  onSelect: (tile: Tile | null) => void,
  onEditLogic: (tile: Tile) => void
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
            </div>
          </div>
          
          <div className="mt-8">
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
            <div className="flex gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); onEditLogic(tile); }}
                className="flex items-center gap-1 hover:text-databoard-yellow transition-colors"
              >
                <Code className="w-3 h-3" />
                Logic
              </button>
            </div>
            <span>{tile.specificityScore}% Sharp</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

const LogicEditorModal = ({ 
  isOpen, 
  onClose, 
  tile, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  tile: Tile; 
  onSave: (id: string, newLogic: string) => void;
  key?: React.Key;
}) => {
  const [logic, setLogic] = useState(tile.logic || "");

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-bg border-4 border-ink w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[16px_16px_0px_0px_rgba(20,20,20,1)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b-4 border-ink flex justify-between items-center bg-databoard-yellow/10">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">A Posteriori Ontology</h2>
            <p className="text-[10px] mono uppercase opacity-50">Logic Markup for: {tile.word}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-ink hover:text-bg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] mono uppercase font-bold opacity-50 block">Logic Markup (DBM Syntax)</label>
            <textarea
              value={logic}
              onChange={(e) => setLogic(e.target.value)}
              className="w-full h-64 bg-ink text-bg p-4 mono text-sm focus:outline-none border-2 border-ink focus:border-databoard-yellow transition-colors resize-none"
              placeholder={`concept "${tile.word}"\n  is a: driver\n  context: "..."\n  mechanism: "..."\n  evidence: "..."\n  relation: direction, of, via\n  fidelity: 0.95`}
            />
          </div>

          <div className="p-4 bg-ink text-bg border-l-4 border-databoard-yellow space-y-3">
            <h3 className="text-[10px] mono uppercase font-bold text-databoard-yellow flex items-center gap-2">
              <Code className="w-3 h-3" /> Syntax Guide (DBM Logic Markup)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] mono opacity-90">
              <ul className="space-y-1">
                <li><span className="text-databoard-yellow font-bold">concept "name"</span>: Define the handle</li>
                <li><span className="text-databoard-yellow font-bold">is a</span>: [driver|benchmark|risk...]</li>
                <li><span className="text-databoard-yellow font-bold">context</span>: Situational context</li>
              </ul>
              <ul className="space-y-1">
                <li><span className="text-databoard-yellow font-bold">mechanism</span>: Causal "how"</li>
                <li><span className="text-databoard-yellow font-bold">evidence</span>: Data grounding "why"</li>
                <li><span className="text-databoard-yellow font-bold">contrasts_with</span>: Pseudo-antonym</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border-t-4 border-ink flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 border-2 border-ink font-bold uppercase text-xs tracking-widest hover:bg-ink/5 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onSave(tile.id, logic);
              onClose();
            }}
            className="px-6 py-2 bg-ink text-bg border-2 border-ink font-bold uppercase text-xs tracking-widest hover:bg-databoard-yellow hover:text-ink transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Logic
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [scenarios, setScenarios] = useState<Scenario[]>(() => {
    const saved = localStorage.getItem("databoard-custom-scenarios");
    const custom = saved ? JSON.parse(saved) : [];
    return [...SCENARIOS, ...custom];
  });
  const [scenario, setScenario] = useState<Scenario>(() => {
    const saved = localStorage.getItem("databoard-scenario");
    if (saved) {
      const found = scenarios.find(s => s.id === saved);
      if (found) return found;
    }
    return scenarios[0];
  });
  const [tiles, setTiles] = useState<Tile[]>(() => {
    const saved = localStorage.getItem("databoard-tiles");
    if (saved) return JSON.parse(saved);
    
    // Fallback to cached data for the initial scenario
    if (CACHED_BOARDS[scenario.id]) {
      return CACHED_BOARDS[scenario.id].tiles;
    }
    return [];
  });
  const [metrics, setMetrics] = useState<BoardMetrics | null>(() => {
    const savedMetrics = localStorage.getItem("databoard-metrics");
    if (savedMetrics) {
      try {
        return JSON.parse(savedMetrics);
      } catch (e) {
        console.error("Failed to parse saved metrics", e);
      }
    }
    
    const savedTiles = localStorage.getItem("databoard-tiles");
    if (savedTiles) return null; // Let it load normally if there's saved state
    
    if (CACHED_BOARDS[scenario.id]) {
      return CACHED_BOARDS[scenario.id].metrics;
    }
    return null;
  });
  const [isMetricsLoading, setIsMetricsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showLogicBoard, setShowLogicBoard] = useState(false);
  const [editingLogicTile, setEditingLogicTile] = useState<Tile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSystemKeyActive, setIsSystemKeyActive] = useState(false);
  const [systemStatus, setSystemStatus] = useState<{ source: string, maskedKey: string | null } | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const [isExpansionAvailable, setIsExpansionAvailable] = useState(true);

  // Handle retry countdown
  useEffect(() => {
    if (error?.includes("RETRY_AFTER:")) {
      const match = error.match(/RETRY_AFTER:(\d+)/);
      if (match) {
        setRetryCountdown(parseInt(match[1]));
      }
    } else {
      setRetryCountdown(null);
    }
  }, [error]);

  useEffect(() => {
    if (retryCountdown !== null && retryCountdown > 0) {
      const timer = setTimeout(() => setRetryCountdown(retryCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [retryCountdown]);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check for API key status on mount
  useEffect(() => {
    const checkKeyStatus = async () => {
      const localKey = localStorage.getItem("GEMINI_API_KEY");
      const platformKey = typeof process !== 'undefined' ? process.env?.API_KEY : null;
      
      try {
        // First check server health
        const healthUrl = `${window.location.origin}/api/health`;
        const healthCheck = await fetch(healthUrl);
        if (!healthCheck.ok) {
          console.error("Server health check failed:", healthCheck.status);
          setHasApiKey(!!localKey || !!platformKey);
          setIsSystemKeyActive(false);
          return;
        }

        const statusUrl = `${window.location.origin}/api/ai/status`;
        const response = await fetch(statusUrl);
        const contentType = response.headers.get("content-type");
        
        if (response.ok && contentType && contentType.includes("application/json")) {
          const data = await response.json();
          // If the server has a shared key, we consider the system key active.
          // The service will still prioritize the local key if it exists.
          setHasApiKey(!!localKey || !!platformKey || data.isReady); 
          setIsSystemKeyActive(data.isReady);
          setSystemStatus({ source: data.source, maskedKey: data.maskedKey });
        } else {
          console.error("Status check failed:", response.status, contentType);
          setHasApiKey(!!localKey || !!platformKey);
          setIsSystemKeyActive(false);
        }
      } catch (e) {
        console.error("Connectivity error:", e);
        setHasApiKey(!!localKey || !!platformKey);
        setIsSystemKeyActive(false);
      }
    };
    checkKeyStatus();
  }, []);
  // Re-check key status when settings modal opens
  useEffect(() => {
    if (isSettingsOpen) {
      const checkKeyStatus = async () => {
        const localKey = localStorage.getItem("GEMINI_API_KEY");
        const platformKey = typeof process !== 'undefined' ? process.env?.API_KEY : null;
        try {
          const statusUrl = `${window.location.origin}/api/ai/status`;
          const response = await fetch(statusUrl);
          const contentType = response.headers.get("content-type");
          
          if (response.ok && contentType && contentType.includes("application/json")) {
            const data = await response.json();
            setHasApiKey(!!localKey || !!platformKey || data.isReady); 
            setIsSystemKeyActive(data.isReady);
            setSystemStatus({ source: data.source, maskedKey: data.maskedKey });
          }
        } catch (e) {
          console.error("Status re-check failed:", e);
        }
      };
      checkKeyStatus();
    }
  }, [isSettingsOpen]);
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
    // Handle /methodology route for SEO/LLMO
    if (window.location.pathname.replace(/\/$/, "") === "/methodology") {
      setShowMethodology(true);
    }
  }, []);

  // Persist tiles, metrics and scenario
  // Persistence and URL Sync
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scenarioId = params.get("scenario") || params.get("s");
    if (scenarioId) {
      const found = scenarios.find(s => s.id === scenarioId);
      if (found) {
        setScenario(found);
        if (CACHED_BOARDS[found.id]) {
          setTiles(CACHED_BOARDS[found.id].tiles);
          setMetrics(CACHED_BOARDS[found.id].metrics);
        } else {
          setTiles([]);
          setMetrics(null);
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("databoard-tiles", JSON.stringify(tiles));
  }, [tiles]);

  useEffect(() => {
    if (metrics) {
      localStorage.setItem("databoard-metrics", JSON.stringify(metrics));
    } else {
      localStorage.removeItem("databoard-metrics");
    }
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem("databoard-scenario", scenario.id);
  }, [scenario]);

  const updateMetrics = async (currentTiles?: Tile[], isUserAction = false) => {
    const activeTiles = currentTiles || tiles;
    if (activeTiles.length === 0) {
      setMetrics(null);
      return;
    }

    if (!hasApiKey) {
      if (isUserAction) setIsSettingsOpen(true);
      return;
    }

    setIsMetricsLoading(true);
    setError(null);
    try {
      const newMetrics = await calculateBoardMetrics(scenario, activeTiles);
      setMetrics(newMetrics);
    } catch (err: any) {
      console.error("Failed to update metrics", err);
      if (err.message?.includes("API_KEY_REQUIRED")) {
        if (isUserAction) setIsSettingsOpen(true);
      } else {
        setError(err.message?.replace("API_KEY_REQUIRED: ", "") || "Failed to update board metrics.");
      }
    } finally {
      setIsMetricsLoading(false);
    }
  };

  // Initial metrics update when tiles are loaded from storage
  useEffect(() => {
    if (tiles.length > 0 && !metrics) {
      updateMetrics();
    }
  }, []);

  const handleAddWord = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (!hasApiKey) {
      setIsSettingsOpen(true);
      return;
    }

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
      if (err.message?.includes("API_KEY_REQUIRED")) {
        setIsSettingsOpen(true);
      } else {
        setError(err.message || "Failed to evaluate word. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySynthesis = async (original: string[], replacement: string) => {
    if (isLoading) return;

    if (!hasApiKey) {
      setIsSettingsOpen(true);
      return;
    }

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
      if (err.message?.includes("API_KEY_REQUIRED")) {
        setIsSettingsOpen(true);
      } else {
        setError(err.message || "Failed to apply synthesis suggestion.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeminiSuggest = async () => {
    if (isLoading) return;

    const existingWords = tiles.map(t => t.word);
    const cachedBoard = CACHED_BOARDS[scenario.id];

    // Check for cached expansion first
    if (cachedBoard?.cachedExpansion) {
      const newSuggestions = cachedBoard.cachedExpansion.filter(s => 
        !existingWords.some(ew => ew.toLowerCase() === s.word.toLowerCase())
      );

      if (newSuggestions.length > 0) {
        setIsLoading(true);
        // Simulate a small delay for "wow" effect
        await new Promise(r => setTimeout(r, 800));
        setTiles((prev) => [...newSuggestions, ...prev]);
        setIsLoading(false);
        return;
      }
    }

    if (!hasApiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const existingWords = tiles.map(t => t.word);
      const suggestions = await generateBestVocabulary(scenario, existingWords);
      
      if (!suggestions || suggestions.length === 0) {
        setIsExpansionAvailable(false);
        setError("The AI didn't return any new vocabulary. Try a different scenario.");
        return;
      }

      // Filter out suggestions that are already on the board (case-insensitive)
      const newSuggestions = suggestions.filter(s => 
        !existingWords.some(ew => ew.toLowerCase() === s.word.toLowerCase())
      );

      if (newSuggestions.length === 0) {
        setIsExpansionAvailable(false);
        setError("No more unique concepts found for this deducible space.");
        return;
      }

      setTiles((prev) => {
        const newTiles = [...newSuggestions, ...prev];
        // Only trigger metrics automatically if it's the first board generation
        // to save AI quota for the user.
        if (prev.length === 0) {
          setTimeout(() => updateMetrics(newTiles), 100);
        }
        return newTiles;
      });
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("API_KEY_REQUIRED")) {
        setIsSettingsOpen(true);
      } else {
        setError(err.message || "Failed to generate initial board.");
      }
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

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          const importedTiles = JSON.parse(content);
          if (Array.isArray(importedTiles)) {
            if (importedTiles.length > 0 && (!importedTiles[0].word || !importedTiles[0].centrality)) {
              throw new Error("Invalid Databoard JSON format");
            }
            
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
        } else if (file.name.endsWith('.csv')) {
          if (!hasApiKey) {
            setIsSettingsOpen(true);
            setIsLoading(false);
            return;
          }
          // Parse CSV
          const results = Papa.parse(content, { header: true, skipEmptyLines: true });
          if (results.errors.length > 0) {
            throw new Error("Failed to parse CSV file.");
          }

          // Take a sample of the data for AI analysis (first 20 rows)
          const sample = results.data.slice(0, 20);
          const sampleStr = JSON.stringify(sample);

          // Call AI to analyze and generate scenario + tiles
          const { scenario: newScenario, tiles: newTiles } = await analyzeCSVData(sampleStr);
          
          setScenarios(prev => {
            const updated = [...prev, newScenario];
            localStorage.setItem("databoard-custom-scenarios", JSON.stringify(updated.filter(s => s.id.startsWith('custom-'))));
            return updated;
          });
          setScenario(newScenario);
          setTiles(newTiles);
          setSelectedTile(null);
        }
      } catch (err: any) {
        console.error(err);
        if (err.message?.includes("API_KEY_REQUIRED")) {
          setIsSettingsOpen(true);
        } else {
          setError(`Import failed: ${err.message?.replace("API_KEY_REQUIRED: ", "") || "Invalid file format"}`);
        }
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
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

  const handleSaveLogic = (id: string, newLogic: string) => {
    setTiles(prev => prev.map(t => t.id === id ? { ...t, logic: newLogic } : t));
  };

  const handleSaveAllLogic = (newTiles: Tile[]) => {
    setTiles(newTiles);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
      <AnimatePresence>
        {showLogicBoard && (
          <LogicBoard 
            key="logic-board" 
            isOpen={showLogicBoard} 
            onClose={() => setShowLogicBoard(false)} 
            tiles={tiles}
            onSaveAll={handleSaveAllLogic}
            scenario={scenario}
          />
        )}
        {editingLogicTile && (
          <LogicEditorModal
            key="logic-editor"
            isOpen={!!editingLogicTile}
            onClose={() => setEditingLogicTile(null)}
            tile={editingLogicTile}
            onSave={handleSaveLogic}
          />
        )}
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
            systemStatus={systemStatus}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="mb-12 border-b-4 border-ink pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={() => setShowMethodology(true)}
              className="bg-ink text-bg px-2 py-1 text-[10px] font-black uppercase tracking-tighter rounded hover:bg-databoard-yellow hover:text-ink transition-colors"
            >
              Framework v4.0 (Logic Verified)
            </button>
            <div className="text-[10px] mono opacity-40 uppercase tracking-widest">Open Source Methodology</div>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            The Data Board
          </h1>
          <p className="text-lg serif-italic mt-2 opacity-70">
            AI powered Data Analysis in Human Language
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
              onClick={() => setShowLogicBoard(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-ink font-bold uppercase text-xs tracking-widest hover:bg-ink hover:text-bg transition-all shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <Code className="w-4 h-4" />
              YAML Logic Board
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
          {/* Grounding & Scenario */}
          <section id="walkthrough-guide" className="p-5 bg-ink border-2 border-ink shadow-[8px_8px_0px_0px_#D4B84A] mb-8">
            <h3 className="text-[10px] mono uppercase font-black text-databoard-yellow mb-3 flex items-center gap-2">
              <Zap className="w-3 h-3 fill-databoard-yellow" /> Quick Start Walkthrough
            </h3>
            <div className="space-y-4 text-[11px] leading-tight text-bg/90">
              <div className="flex gap-3 text-bg">
                <span className="text-databoard-yellow font-bold mono">01.</span>
                <p><strong className="text-bg uppercase tracking-wide">Play with Examples</strong><br/><span className="opacity-60 text-xs">Select a standard research scenario below to see the methodology in action.</span></p>
              </div>
              <div className="flex gap-3 text-bg">
                <span className="text-databoard-yellow font-bold mono">02.</span>
                <p><strong className="text-bg uppercase tracking-wide">Analyze Your Own</strong><br/><span className="opacity-60 text-xs">Upload CSV/JSON. Requires a Gemini API key (Setup in the top header).</span></p>
              </div>
            </div>
          </section>

          <section id="scenario-selector" className="p-6 border-2 border-ink bg-bg shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold block mb-2">
                  Active Scenario
                </label>
                <div className="relative flex items-center group">
                  <select
                    value={scenario.id}
                    onChange={(e) => {
                      const s = scenarios.find((s) => s.id === e.target.value);
                      if (s) {
                        // Clear board immediately
                        setTiles([]);
                        setMetrics(null);
                        setSelectedTile(null);
                        setScenario(s);
                        setIsExpansionAvailable(true);
                        
                        // Load cached data if available with a tiny delay to ensure "clean" state is rendered
                        if (CACHED_BOARDS[s.id]) {
                          setTimeout(() => {
                            setTiles(CACHED_BOARDS[s.id].tiles);
                            setMetrics(CACHED_BOARDS[s.id].metrics);
                          }, 10);
                        }
                      }
                    }}
                    className="w-full bg-transparent border-b-2 border-ink py-2 pr-12 focus:outline-none mono text-sm cursor-pointer font-bold flex-1"
                  >
                    {scenarios.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set('scenario', scenario.id);
                      navigator.clipboard.writeText(url.toString());
                      
                      // Temporary visual feedback
                      const btn = document.getElementById('share-btn-icon');
                      const check = document.getElementById('share-check-icon');
                      if (btn && check) {
                        btn.classList.add('hidden');
                        check.classList.remove('hidden');
                        setTimeout(() => {
                          btn.classList.remove('hidden');
                          check.classList.add('hidden');
                        }, 2000);
                      }
                    }}
                    title="Copy direct link to this board"
                    className="absolute right-0 p-2 hover:text-databoard-yellow transition-colors"
                  >
                    <Share2 id="share-btn-icon" className="w-4 h-4" />
                    <Check id="share-check-icon" className="w-4 h-4 text-databoard-green hidden" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-lg leading-tight font-bold">
                  {scenario.description}
                </p>
                <p className="text-[11px] opacity-70 serif-italic leading-relaxed">
                  {scenario.context}
                </p>

                {scenario.url && (
                  <a 
                    href={scenario.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] mono uppercase font-bold text-ink/40 hover:text-ink transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    Source Data
                  </a>
                )}

                {scenario.outcomes && scenario.outcomes.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {scenario.outcomes.map((outcome, i) => (
                      <span key={i} className="px-2 py-0.5 bg-ink text-white text-[8px] mono uppercase tracking-widest">
                        {outcome}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {tiles.length === 0 && (
                <div className="pt-4 border-t border-ink/10 space-y-2">
                  <p className="text-[9px] mono opacity-40 uppercase font-bold">Actions</p>
                  {CACHED_BOARDS[scenario.id] && (
                    <button
                      onClick={() => {
                        setTiles(CACHED_BOARDS[scenario.id].tiles);
                        setMetrics(CACHED_BOARDS[scenario.id].metrics);
                      }}
                      className="w-full py-2 border border-ink/20 hover:bg-ink hover:text-bg transition-all mono text-[9px] uppercase font-bold flex items-center justify-center gap-2"
                    >
                      <Zap className="w-3 h-3" />
                      Restore Sample Data
                    </button>
                  )}
                </div>
              )}
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
                <div className="flex gap-2">
                  <button 
                    id="ai-suggestions"
                    onClick={handleGeminiSuggest}
                    disabled={isLoading || !isExpansionAvailable}
                    className="w-full py-4 bg-databoard-yellow text-ink font-bold uppercase text-xs tracking-widest border-2 border-ink shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    <Zap className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {!isExpansionAvailable ? "Space Fully Expanded" : tiles.length === 0 ? "The Data Board" : "Expand Board"}
                  </button>
                </div>
            {error && (
              <div className="flex flex-col gap-2 p-4 bg-red-500/10 border-l-4 border-red-500">
                <div className="flex items-center gap-2 text-red-600 text-xs mono font-bold">
                  <AlertCircle className="w-4 h-4" />
                  {error.includes("QUOTA_EXHAUSTED") ? "AI Quota Exceeded" : error.includes("SERVER_WARMUP") ? "Server Warming Up" : "AI Error"}
                </div>
                <p className="text-[10px] mono text-red-600/80 leading-tight">
                  {error.includes("SERVER_WARMUP") 
                    ? "The server is still starting up after a code update. This usually takes 5-10 seconds. Please wait a moment and try again." 
                    : error.includes("RETRY_AFTER:")
                      ? error.split("(RETRY_AFTER:")[0].replace("QUOTA_EXHAUSTED: ", "")
                      : error.replace("QUOTA_EXHAUSTED: ", "")}
                </p>
                {retryCountdown !== null && (
                  <div className="mt-1 text-[10px] mono font-bold text-red-600">
                    {retryCountdown > 0 ? `Retry available in ${retryCountdown}s...` : "Ready to retry!"}
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  {error.includes("QUOTA_EXHAUSTED") && (
                    <button 
                      onClick={() => setIsSettingsOpen(true)}
                      className="px-3 py-1.5 bg-red-600 text-white text-[10px] mono uppercase font-bold hover:bg-red-700 transition-colors"
                    >
                      Setup Private API Key
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      const prevError = error;
                      setError(null);
                      // Context-aware retry
                      if (prevError.includes("metrics") || prevError.includes("Synthesize") || prevError.includes("SERVER_WARMUP") || prevError.includes("QUOTA_EXHAUSTED")) {
                        updateMetrics(undefined, true);
                      } else if (tiles.length === 0 || prevError.includes("vocabulary")) {
                        handleGeminiSuggest();
                      }
                    }}
                    disabled={retryCountdown !== null && retryCountdown > 0}
                    className="px-3 py-1.5 border border-red-600 text-red-600 text-[10px] mono uppercase font-bold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {error.includes("SERVER_WARMUP") || (retryCountdown !== null && retryCountdown > 0) ? "Wait & Retry" : "Dismiss & Retry"}
                  </button>
                </div>
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
              <div className="flex items-center gap-3">
                <Activity className={`w-4 h-4 ${isMetricsLoading ? "animate-pulse text-databoard-yellow" : "opacity-20"}`} />
              </div>
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

                <div className="grid grid-cols-1 gap-4">
                  <div className="group relative cursor-help border border-ink/10 p-4 bg-white/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <p className="text-[8px] mono uppercase font-bold opacity-50">Narrative Cohesion</p>
                        <Info className="w-2 h-2 opacity-30" />
                      </div>
                      <p className="text-sm font-black">{metrics.cohesion}%</p>
                    </div>
                    <div className="w-full h-1 bg-ink/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${metrics.cohesion}%` }}
                        className="h-full bg-databoard-yellow"
                      />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-ink text-bg text-[9px] mono leading-tight opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl border border-white/10">
                      Measures how well the specific findings connect to form a unified argument.
                    </div>
                  </div>

                  <div className="group relative cursor-help border border-ink/10 p-4 bg-white/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <p className="text-[8px] mono uppercase font-bold opacity-50">Finding Sharpness</p>
                        <Zap className="w-2 h-2 opacity-30" />
                      </div>
                      <p className="text-sm font-black">{metrics.sharpness}%</p>
                    </div>
                    <div className="w-full h-1 bg-ink/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${metrics.sharpness}%` }}
                        className="h-full bg-databoard-green"
                      />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-ink text-bg text-[9px] mono leading-tight opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl border border-white/10">
                      Measures the specificity of your findings. High sharpness means data-backed observations.
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
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-ink/20">
                <p className="text-[10px] mono opacity-40">Add vocabulary to see board metrics</p>
              </div>
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
                <label 
                  className="flex items-center gap-1 text-[10px] mono uppercase opacity-30 hover:opacity-100 transition-opacity cursor-pointer group relative"
                  title="Requires personal API key in Settings"
                >
                  <Upload className="w-3 h-3" />
                  Import CSV/JSON
                  <input 
                    type="file" 
                    accept=".csv,.json" 
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
                  onEditLogic={setEditingLogicTile}
                />
              ))}
              
              {/* Empty state placeholders */}
              {Array.from({ length: Math.max(0, 12 - tiles.length) }).map((_, i) => (
                <div key={`placeholder-${i}`} className="data-cell opacity-5 pointer-events-none" />
              ))}
            </AnimatePresence>
          </div>

          {metrics?.links && metrics.links.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 p-3 border border-ink/10 bg-ink/5 flex items-start gap-3">
                <Info className="w-4 h-4 mt-0.5 opacity-40 shrink-0" />
                <p className="text-[10px] mono uppercase leading-tight opacity-60">
                  Clusters indicate narrative themes. Detached nodes represent conceptual gaps—bridge them with new handles to find the global story.
                </p>
              </div>
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
            "What we cannot think, that we cannot think; we cannot therefore say what we cannot think" Ludwig Wittgenstein (Tractatus 5.61)
            <br /><br />
            The Data Board framework and the Pseudo-Antonyms© methodology are proprietary conceptual frameworks created by Ruth Aharon.
            <br /><br />
            <strong>License:</strong> MIT License. This framework is fully open-source and free for both commercial and non-commercial use.
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
            Licensed under MIT License
          </p>
          <div className="flex items-center justify-end gap-2 text-[10px] mono uppercase">
            <div className={`w-1.5 h-1.5 rounded-full ${isSystemKeyActive ? 'bg-databoard-green animate-pulse' : 'bg-databoard-red'}`} />
            <span className={isSystemKeyActive ? 'text-databoard-green' : 'text-databoard-red'}>
              Shared AI: {isSystemKeyActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-[10px] mono uppercase">
            Built with Google Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}
