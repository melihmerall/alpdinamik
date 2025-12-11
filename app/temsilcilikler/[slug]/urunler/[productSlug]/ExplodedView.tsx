"use client";

import React, { useState } from "react";

interface ExplodedComponent {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  image: string;
  link?: string;
}

interface ExplodedViewProps {
  baseImage: string;
  components: ExplodedComponent[];
  svgWidth?: number;
  svgHeight?: number;
}

export function ExplodedView({ baseImage, components, svgWidth = 405, svgHeight = 650 }: ExplodedViewProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!components || !Array.isArray(components) || components.length === 0) {
    return (
      <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
        <img
          src={baseImage}
          alt="Exploded View"
          decoding="async"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
      {/* Alt görsel */}
      <img
        src={baseImage}
        alt="Exploded View"
        decoding="async"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
      
      {/* Üst saydam SVG layer */}
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {components.map((comp) => (
          <a
            key={comp.id}
            href={comp.link || "#"}
            target={comp.link ? "_blank" : undefined}
            rel={comp.link ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              if (!comp.link || comp.link === "#") {
                e.preventDefault();
              }
            }}
            style={{ cursor: comp.link && comp.link !== "#" ? "pointer" : "default" }}
          >
            <image
              id={comp.id}
              x={comp.x}
              y={comp.y}
              width={comp.width}
              height={comp.height}
              href={comp.image}
              onMouseEnter={() => setHoveredId(comp.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                opacity: hoveredId === comp.id ? 0.8 : 1,
                transition: "opacity 0.2s ease",
                cursor: comp.link && comp.link !== "#" ? "pointer" : "default",
              }}
            />
          </a>
        ))}
      </svg>
    </div>
  );
}

