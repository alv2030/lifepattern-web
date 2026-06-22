"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function BackgroundOrbs() {
  const layerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Mouse parallax + scroll parallax — combined in one RAF loop
  useEffect(() => {
    let rafId: number;
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let scrollParallax = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 28;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 28;
    };

    const onScroll = () => {
      // Hero parallax: orbs drift up at ~0.5x scroll speed, capped so they don't vanish
      scrollParallax = -Math.min(window.scrollY * 0.18, 90);
    };

    const tick = () => {
      currentX += (mouseX - currentX) * 0.04;
      currentY += (mouseY - currentY) * 0.04;
      if (layerRef.current) {
        layerRef.current.style.transform =
          `translate3d(${currentX}px, ${currentY + scrollParallax}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll",    onScroll,    { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll",    onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Re-observe .reveal elements on every route change (SPA navigation)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Extra margin absorbs the mouse-parallax translation so edges stay clean */}
      <div ref={layerRef} className="absolute -inset-20 will-change-transform">

        {/* Top-left — primary warm blush anchor */}
        <div
          className="absolute -left-24 -top-24 h-[640px] w-[640px] rounded-full"
          style={{
            background: "#DCCBC7",
            opacity: 0.18,
            filter: "blur(100px)",
            animation: "orbDrift1 28s ease-in-out infinite",
          }}
        />

        {/* Top-center — wide cream aurora sweep */}
        <div
          className="absolute -top-16 left-[calc(50%-380px)] h-[420px] w-[760px] rounded-full"
          style={{
            background: "#F5EDE9",
            opacity: 0.22,
            filter: "blur(120px)",
            animation: "orbDrift3 22s ease-in-out infinite",
          }}
        />

        {/* Right edge — soft rose accent */}
        <div
          className="absolute -right-24 top-[28%] h-[420px] w-[420px] rounded-full"
          style={{
            background: "#E8D5D0",
            opacity: 0.13,
            filter: "blur(90px)",
            animation: "orbDrift2 32s ease-in-out infinite",
          }}
        />

        {/* Bottom-left — warm blush grounding */}
        <div
          className="absolute -left-16 bottom-[18%] h-[380px] w-[380px] rounded-full"
          style={{
            background: "#DCCBC7",
            opacity: 0.11,
            filter: "blur(80px)",
            animation: "orbDrift1 26s ease-in-out infinite reverse",
          }}
        />

        {/* Bottom-right — rose close */}
        <div
          className="absolute -bottom-20 -right-16 h-[520px] w-[520px] rounded-full"
          style={{
            background: "#E8D5D0",
            opacity: 0.14,
            filter: "blur(100px)",
            animation: "orbDrift2 20s ease-in-out infinite reverse",
          }}
        />

      </div>
    </div>
  );
}
