"use client";

import React, { useState } from "react";

interface SVGComponent {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  image: string;
  hoverImage?: string;
  link?: string;
}

interface InteractiveSVGProductProps {
  baseImage: string;
  components: SVGComponent[];
}

export function InteractiveSVGProduct({ baseImage, components }: InteractiveSVGProductProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!components || !Array.isArray(components)) {
    return (
      <div style={{ position: "relative", display: "block", width: "100%", height: "100%" }}>
        <img
          src={baseImage}
          alt="Product"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
        />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", display: "block", width: "100%", height: "100%" }}>
      <img
        src={baseImage}
        alt="Product"
        style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
      />
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        viewBox="0 0 405 650"
        preserveAspectRatio="xMidYMid meet"
      >
        {components.map((comp) => (
          <a
            key={comp.id}
            href={comp.link || "#"}
            target={comp.link ? "_blank" : undefined}
            rel={comp.link ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              if (!comp.link) {
                e.preventDefault();
              }
            }}
          >
            <image
              id={comp.id}
              x={comp.x}
              y={comp.y}
              width={comp.width}
              height={comp.height}
              href={hoveredId === comp.id && comp.hoverImage ? comp.hoverImage : comp.image}
              onMouseEnter={() => setHoveredId(comp.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: comp.link ? "pointer" : "default" }}
            />
          </a>
        ))}
      </svg>
    </div>
  );
}

