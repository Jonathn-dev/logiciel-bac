import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { Network, ZoomIn, ZoomOut, RotateCcw, Info, Sparkles } from 'lucide-react';
import { MindmapTreeNode } from '../../types';

interface GrowingTreeProps {
  data: MindmapTreeNode;
  onSelectNode?: (node: MindmapTreeNode) => void;
}

export const GrowingTree: React.FC<GrowingTreeProps> = ({ data, onSelectNode }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<MindmapTreeNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !data) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Root group for Zoom and Pan
    const g = svg.append('g').attr('class', 'tree-viewport');

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // D3 Hierarchy and Tree layout
    const root = d3.hierarchy<MindmapTreeNode>(data);
    const treeLayout = d3.tree<MindmapTreeNode>().size([height - 80, width - 260]);
    treeLayout(root);

    // Initial center transform
    const initialTransform = d3.zoomIdentity.translate(140, 40).scale(0.9);
    svg.call(zoom.transform, initialTransform);

    // Links / Branches generator
    const linkGenerator = d3
      .linkHorizontal<d3.HierarchyPointLink<MindmapTreeNode>, d3.HierarchyPointNode<MindmapTreeNode>>()
      .x((d) => d.y)
      .y((d) => d.x);

    // Draw Links
    g.selectAll('.tree-link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'tree-link')
      .attr('d', linkGenerator as any)
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        const target = d.target.data;
        if (target.status === 'missing') return '#f43f5e';
        if (target.status === 'weak') return '#ffe16d';
        return '#59dad1';
      })
      .attr('stroke-width', (d) => Math.max(1.5, 4 - d.source.depth * 0.8))
      .attr('stroke-opacity', 0.45)
      .attr('stroke-dasharray', (d) => (d.target.data.status === 'missing' ? '4 4' : 'none'));

    // Draw Nodes
    const nodes = g
      .selectAll('.tree-node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'tree-node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        setSelectedNode(d.data);
        onSelectNode?.(d.data);
      });

    // Node Outer Glow Circles
    nodes
      .append('circle')
      .attr('r', (d) => (d.depth === 0 ? 16 : d.depth === 1 ? 12 : 8))
      .attr('fill', (d) => {
        if (d.data.status === 'missing') return 'rgba(244, 63, 94, 0.2)';
        if (d.data.status === 'weak') return 'rgba(255, 225, 109, 0.2)';
        return 'rgba(89, 218, 209, 0.2)';
      })
      .attr('stroke', (d) => {
        if (d.data.status === 'missing') return '#f43f5e';
        if (d.data.status === 'weak') return '#ffe16d';
        return '#59dad1';
      })
      .attr('stroke-width', 2);

    // Node Inner Center Dot
    nodes
      .append('circle')
      .attr('r', (d) => (d.depth === 0 ? 7 : d.depth === 1 ? 5 : 3.5))
      .attr('fill', (d) => {
        if (d.data.status === 'missing') return '#f43f5e';
        if (d.data.status === 'weak') return '#ffe16d';
        return '#59dad1';
      });

    // Node Labels
    nodes
      .append('text')
      .attr('dy', '0.32em')
      .attr('x', (d) => (d.children ? -18 : 16))
      .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .text((d) => d.data.name)
      .attr('fill', '#ffffff')
      .attr('font-size', (d) => (d.depth === 0 ? '13px' : d.depth === 1 ? '11px' : '10px'))
      .attr('font-weight', (d) => (d.depth <= 1 ? 'bold' : 'normal'))
      .style('text-shadow', '0 2px 6px rgba(0,0,0,0.9)')
      .style('pointer-events', 'none');
  }, [data]);

  const handleZoom = (factor: number) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const initialTransform = d3.zoomIdentity.translate(140, 40).scale(0.9);
    svg.transition().duration(400).call(d3.zoom<SVGSVGElement, unknown>().transform as any, initialTransform);
  };

  return (
    <div
      ref={containerRef}
      className="atlas-glass rounded-2xl p-5 border border-[#59dad1]/25 relative overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-white/10 pb-3 z-10">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-[#59dad1]" />
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              الشجرة الذهنية التفاعلية (Interactive Mindmap Tree)
            </h4>
            <p className="text-xs text-[#a2a6d0]">
              تمثيل بصري هرمي لشبكة المفاهيم ومحاور الامتحان
            </p>
          </div>
        </div>

        {/* Zoom Controls & Legend */}
        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-[#a2a6d0] ml-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#59dad1]" /> مطابق
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ffe16d]" /> بحاجة تثبيت
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> ثغرة ناقصة
            </span>
          </div>

          <button
            onClick={() => handleZoom(1.25)}
            className="p-1.5 rounded-lg bg-[#090f38] border border-white/10 text-white hover:border-[#59dad1] transition-all cursor-pointer"
            title="تكبير"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(0.8)}
            className="p-1.5 rounded-lg bg-[#090f38] border border-white/10 text-white hover:border-[#59dad1] transition-all cursor-pointer"
            title="تصغير"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg bg-[#090f38] border border-white/10 text-white hover:border-[#59dad1] transition-all cursor-pointer"
            title="إعادة ضبط الموضع"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="w-full h-96 bg-[#040726]/80 rounded-xl border border-white/5 relative overflow-hidden">
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Node Detail Floating Card on Click */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs p-3 rounded-xl bg-[#090f38]/95 border border-[#ffe16d]/40 backdrop-blur-md shadow-xl z-20"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#ffe16d]/20 text-[#ffe16d] font-bold">
                عقدة معرفية
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[10px] text-[#a2a6d0] hover:text-white"
              >
                ✕
              </button>
            </div>
            <h5 className="text-xs font-bold text-white mb-1">{selectedNode.name}</h5>
            <p className="text-[11px] text-[#a2a6d0]">
              الحالة في المنهاج:{' '}
              <strong
                className={
                  selectedNode.status === 'missing'
                    ? 'text-rose-400'
                    : selectedNode.status === 'weak'
                    ? 'text-[#ffe16d]'
                    : 'text-[#4ade80]'
                }
              >
                {selectedNode.status === 'missing'
                  ? 'ثغرة غير واردة في الملخص'
                  : selectedNode.status === 'weak'
                  ? 'متضمن جزئياً'
                  : 'مكتمل ومطابق'}
              </strong>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
