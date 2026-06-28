"use client";

import { HTTP_BACKEND } from "@/config";
import { getToken, removeToken } from "@/lib/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoomsPage() {
  const router = useRouter();
  const [createName, setCreateName] = useState("");
  const [joinSlug, setJoinSlug] = useState("");
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState<"create" | "join" | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/signin");
    }
  }, [router]);

  async function createRoom() {
    const token = getToken();
    if (!token) {
      router.replace("/signin");
      return;
    }

    setError("");
    setLoadingAction("create");

    try {
      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: createName },
        {
          headers: {
            authorization: token,
          },
        }
      );

      router.push(`/canvas/${response.data.roomId}`);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 403) {
        removeToken();
        router.replace("/signin");
        return;
      }

      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message || "Unable to create room");
      } else {
        setError("Unable to create room");
      }
    } finally {
      setLoadingAction(null);
    }
  }

  async function joinRoom() {
    const token = getToken();
    if (!token) {
      router.replace("/signin");
      return;
    }

    setError("");
    setLoadingAction("join");

    try {
      const response = await axios.get(`${HTTP_BACKEND}/room/${joinSlug}`);
      const room = response.data.room;

      if (!room?.id) {
        setError("Room not found");
        return;
      }

      router.push(`/canvas/${room.id}`);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message || "Unable to find room");
      } else {
        setError("Unable to find room");
      }
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">Room Dashboard</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Create a room or join an existing room to enter the shared canvas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-2xl font-semibold">Create Room</h2>
            <div className="mt-6">
              <input
                className="w-full rounded border border-input bg-background px-3 py-2"
                placeholder="Room name"
                value={createName}
                onChange={(e) => {
                  setCreateName(e.target.value);
                }}
              />
            </div>
            <button
              className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
              disabled={loadingAction !== null}
              onClick={createRoom}
              type="button"
            >
              {loadingAction === "create" ? "Creating..." : "Create Room"}
            </button>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-2xl font-semibold">Join Room</h2>
            <div className="mt-6">
              <input
                className="w-full rounded border border-input bg-background px-3 py-2"
                placeholder="Room slug"
                value={joinSlug}
                onChange={(e) => {
                  setJoinSlug(e.target.value);
                }}
              />
            </div>
            <button
              className="mt-4 rounded bg-secondary px-4 py-2 text-secondary-foreground"
              disabled={loadingAction !== null}
              onClick={joinRoom}
              type="button"
            >
              {loadingAction === "join" ? "Joining..." : "Join Room"}
            </button>
          </section>
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    </main>
  );
}
