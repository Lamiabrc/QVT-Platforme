import React, { useEffect, useState } from "react";

export default function MouseDebugOverlay() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [topEl, setTopEl] = useState<string>("");
  const [topElInfo, setTopElInfo] = useState<{ pointerEvents?: string; zIndex?: string; rect?: string } | null>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const id = el.id ? `#${el.id}` : "";
        const classes = el.className ? `.${String(el.className).split(" ").join(".")}` : "";
        setTopEl(`${el.tagName.toLowerCase()}${id}${classes}`);

        try {
          const cs = window.getComputedStyle(el as Element);
          const pe = cs.getPropertyValue("pointer-events");
          const zi = cs.getPropertyValue("z-index");
          const r = (el as Element).getBoundingClientRect();
          setTopElInfo({ pointerEvents: pe, zIndex: zi, rect: `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}` });
        } catch (err) {
          setTopElInfo(null);
        }
      } else {
        setTopEl("none");
        setTopElInfo(null);
      }
    }

    window.addEventListener("mousemove", onMove, { capture: true });
    return () => window.removeEventListener("mousemove", onMove, { capture: true });
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        zIndex: 99999,
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        padding: "8px 10px",
        borderRadius: 8,
        fontSize: 12,
        pointerEvents: "none",
        backdropFilter: "blur(6px)",
        lineHeight: 1.2,
        maxWidth: 320,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Mouse Debug</div>
      <div style={{ opacity: 0.95 }}>Coords: {pos ? `${pos.x}, ${pos.y}` : "N/A"}</div>
      <div style={{ opacity: 0.9, marginTop: 4 }}>Top: {topEl || "N/A"}</div>
      {topElInfo && (
        <div style={{ opacity: 0.85, marginTop: 6, fontSize: 11 }}>
          <div>pointer-events: {topElInfo.pointerEvents}</div>
          <div>z-index: {topElInfo.zIndex}</div>
          <div>rect: {topElInfo.rect}</div>
        </div>
      )}
      <div style={{ opacity: 0.7, marginTop: 6, fontSize: 11 }}>Non-interactive overlay</div>
    </div>
  );
}
