"use client";

import { HTTP_BACKEND } from "@/config";
import { removeToken, setToken } from "@/lib/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthPage({isSignin}: {
    isSignin: boolean
}) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit() {
        setError("");
        setIsSubmitting(true);

        try {
            const endpoint = isSignin ? "/signin" : "/signup";
            const payload = isSignin ? {
                username: email,
                password
            } : {
                username: email,
                password,
                name
            };

            const response = await axios.post(`${HTTP_BACKEND}${endpoint}`, payload);

            if (isSignin) {
                setToken(response.data.token);
                router.push("/");
            } else {
                removeToken();
                router.push("/signin");
            }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.message || "Authentication failed");
            } else {
                setError("Authentication failed");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-6 m-2 bg-white rounded">
            {!isSignin ? <div className="p-2">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                ></input>
            </div> : null}
            <div className="p-2">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                ></input>
            </div>
            <div className="p-2">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                ></input>
            </div>
            {error ? <div className="p-2 text-red-500">{error}</div> : null}

            <div className="pt-2">
                <button className="bg-red-200 rounded p-2" disabled={isSubmitting} onClick={handleSubmit}>
                    {isSubmitting ? "Submitting..." : isSignin ? "Sign in" : "Sign up"}
                </button>
            </div>
        </div>
    </div>

}
