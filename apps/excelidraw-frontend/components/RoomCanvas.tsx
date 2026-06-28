"use client";

import { WS_URL } from "@/config";
import { getToken } from "@/lib/auth";
import { initDraw } from "@/draw";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.replace("/signin");
            return;
        }

        let cancelled = false;
        const ws = new WebSocket(`${WS_URL}?token=${token}`)

        ws.onopen = () => {
            if (cancelled || ws.readyState !== WebSocket.OPEN) {
                return;
            }

            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data)
        }

        ws.onclose = () => {
            if (!cancelled) {
                setSocket(null);
            }
        }

        return () => {
            cancelled = true;
            setSocket(currentSocket => currentSocket === ws ? null : currentSocket);
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        }
    }, [roomId, router])
   
    if (!socket) {
        return <div>
            Connecting to server....
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}
