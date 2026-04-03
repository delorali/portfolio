"use client";

import { useState } from "react";

const PASSWORD = "opensesame";
const SESSION_KEY = "portfolio-unlocked";

/** Check if a project has been unlocked this session */
export function isProjectUnlocked(projectId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const unlocked: string[] = JSON.parse(
      sessionStorage.getItem(SESSION_KEY) || "[]"
    );
    return unlocked.includes(projectId);
  } catch {
    return false;
  }
}

function markUnlocked(projectId: string) {
  try {
    const unlocked: string[] = JSON.parse(
      sessionStorage.getItem(SESSION_KEY) || "[]"
    );
    if (!unlocked.includes(projectId)) {
      unlocked.push(projectId);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(unlocked));
    }
  } catch {
    // ignore
  }
}

interface PasswordGateProps {
  projectId: string;
  isDark: boolean;
  onUnlock: () => void;
}

export default function PasswordGate({ projectId, isDark, onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasInput = password.length > 0;

  const t = {
    cardBg: isDark ? "#27272a" : "white",
    cardBorder: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
    title: isDark ? "#fafafa" : "#09090b",
    subtitle: isDark ? "#a1a1aa" : "#71717a",
    inputBg: isDark ? "#09090b" : "white",
    inputBorder: isDark ? "#27272a" : "#e4e4e7",
    inputText: isDark ? "#fafafa" : "#09090b",
    btnBg: isDark ? "#18181b" : "#f4f4f5",
    btnText: isDark ? "#fafafa" : "#18181b",
    starFill: isDark ? "#fafafa" : "#18181B",
    errorText: "#ef4444",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasInput || loading) return;

    setLoading(true);
    setError(false);

    // Small delay for feel, then check
    setTimeout(() => {
      if (password === PASSWORD) {
        markUnlocked(projectId);
        onUnlock();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="flex flex-col items-center px-5 md:px-[120px] pt-[48px]">
      <div
        className="flex flex-col gap-4 items-start w-full max-w-[556px] rounded-[12px] p-10"
        style={{
          backgroundColor: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          boxShadow:
            "0px 0.5px 1px rgba(0,0,0,0.04), 0px 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col gap-2 items-center w-full pb-3">
          <div className="size-[44px]">
            <svg
              width="44"
              height="44"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.4457 5.22581C20.4457 13.6323 27.2601 20.4471 35.6661 20.4471L35.5677 20.4475C27.207 20.5004 20.4457 27.2948 20.4457 35.6685V40.8939L20.4389 40.8872V35.6685C20.4389 27.2948 13.6776 20.5004 5.31686 20.4475L5.21842 20.4471C13.6245 20.4471 20.4389 13.6323 20.4389 5.22581V0.00706882L20.4457 0.000369267V5.22581Z"
                fill={t.starFill}
              />
            </svg>
          </div>
          <p
            className="text-[20px] font-normal text-center w-full"
            style={{ color: t.title }}
          >
            Hi! This page is password protected.
          </p>
          <p
            className="text-[15px] font-normal text-center w-full"
            style={{ color: t.subtitle }}
          >
            Please enter the password to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1.5 w-full">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder=""
              className="w-full rounded-[10px] p-3 text-[16px] font-normal outline-none transition-colors"
              style={{
                backgroundColor: t.inputBg,
                border: `1px solid ${error ? t.errorText : t.inputBorder}`,
                color: t.inputText,
              }}
              autoFocus
            />
            {error && (
              <p className="text-[13px]" style={{ color: t.errorText }}>
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!hasInput || loading}
            className="w-full rounded-[10px] px-6 py-3 text-[17px] font-normal transition-opacity"
            style={{
              backgroundColor: t.btnBg,
              color: t.btnText,
              opacity: hasInput && !loading ? 1 : 0.5,
              cursor: hasInput && !loading ? "pointer" : "default",
            }}
          >
            {loading ? "Checking..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
