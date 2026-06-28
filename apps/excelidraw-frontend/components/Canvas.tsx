"use client";

import { useEffect, useRef, useState } from "react";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";

import { Game } from "@/draw/Game";
import { IconButton } from "./IconButton";

export type Tool = "circle" | "rect" | "pencil";

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const g = new Game(canvasRef.current, roomId, socket);
    setGame(g);

    return () => {
      g.destroy();
    };
  }, [roomId, socket]);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />

      <Topbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />
    </div>
  );
}

function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
      }}
    >
      <div className="flex gap-2">
        <IconButton
          icon={<Pencil />}
          activated={selectedTool === "pencil"}
          onClick={() => setSelectedTool("pencil")}
        />

        <IconButton
          icon={<RectangleHorizontalIcon />}
          activated={selectedTool === "rect"}
          onClick={() => setSelectedTool("rect")}
        />

        <IconButton
          icon={<Circle />}
          activated={selectedTool === "circle"}
          onClick={() => setSelectedTool("circle")}
        />
      </div>
    </div>
  );
}