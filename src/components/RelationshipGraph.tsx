import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Tile } from "../types";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  word: string;
  centrality: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  label: string;
}

interface RelationshipGraphProps {
  tiles: Tile[];
  links: { source: string; target: string; label: string }[];
}

export const RelationshipGraph: React.FC<RelationshipGraphProps> = React.memo(({ tiles, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || tiles.length === 0 || dimensions.width === 0) return;

    const { width, height } = dimensions;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Prepare data
    const nodes: Node[] = tiles.map(t => ({
      id: t.word,
      word: t.word,
      centrality: t.centrality
    }));

    const tileWords = new Set(tiles.map(t => t.word));
    const validLinks: Link[] = links
      .filter(l => tileWords.has(l.source) && tileWords.has(l.target))
      .map(l => ({
        source: l.source,
        target: l.target,
        label: l.label
      }));

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(validLinks).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Draw links
    const link = svg.append("g")
      .selectAll("line")
      .data(validLinks)
      .join("line")
      .attr("stroke", "#141414")
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 1);

    // Draw link labels
    const linkLabel = svg.append("g")
      .selectAll("text")
      .data(validLinks)
      .join("text")
      .attr("font-size", "8px")
      .attr("font-family", "monospace")
      .attr("text-anchor", "middle")
      .attr("fill", "#141414")
      .attr("opacity", 0.5)
      .text(d => d.label);

    // Draw nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("rect")
      .attr("width", d => d.word.length * 8 + 20)
      .attr("height", 24)
      .attr("x", d => -(d.word.length * 8 + 20) / 2)
      .attr("y", -12)
      .attr("fill", d => {
        if (d.centrality === "GREEN") return "#00FF00";
        if (d.centrality === "YELLOW") return "#FFFF00";
        return "#FF0000";
      })
      .attr("stroke", "#141414")
      .attr("stroke-width", 2);

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("font-family", "monospace")
      .attr("text-transform", "uppercase")
      .text(d => d.word);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      linkLabel
        .attr("x", d => ((d.source as any).x + (d.target as any).x) / 2)
        .attr("y", d => ((d.source as any).y + (d.target as any).y) / 2);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [tiles, links, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] border-2 border-ink bg-white relative overflow-hidden">
      <div className="absolute top-2 left-2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-ink animate-pulse" />
        <span className="text-[8px] mono uppercase tracking-widest font-bold">Semantic Relationship Map</span>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
});
