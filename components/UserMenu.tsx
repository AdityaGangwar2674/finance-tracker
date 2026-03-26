"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User as UserIcon, Settings, ChevronDown, Landmark, Receipt, Sparkles, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "./Toast";

interface User {
  userId: string;
  email: string;
  name: string;
}

export function UserMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addToast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        addToast("Logged out successfully", "info");
        router.push("/login");
      }
    } catch (error) {
      addToast("Failed to logout", "error");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all border border-transparent hover:border-gray-200 dark:hover:border-zinc-600"
      >
        <span className="text-sm font-bold text-gray-700 dark:text-zinc-200 uppercase tracking-wider">
          {user.name}
        </span>
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/20">
          {getInitials(user.name)}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-gray-100 dark:border-zinc-800 py-2 z-50 animate-in fade-in zoom-in duration-200">
          <button
            onClick={() => {
              setShowProfile(true);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
            Profile Details
          </button>
          <div className="h-px bg-gray-100 dark:bg-zinc-800 mx-4 my-1" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            Sign Out
          </button>
        </div>
      )}

      {showProfile && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

function ProfileModal({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 flex flex-col items-center text-white relative">
          <button 
             onClick={onClose}
             className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            < ChevronDown className="rotate-90 w-4 h-4" />
          </button>
          
          <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold mb-4 border border-white/30 shadow-2xl">
            {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-blue-100 opacity-80">{user.email}</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Landmark className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Account Holder</p>
                <p className="text-gray-900 dark:text-zinc-100 font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Email Address</p>
                <p className="text-gray-900 dark:text-zinc-100 font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200">Financial Insights</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                  You have been using Finesse Finance to track your wealth. Keep consistent with your entries to get more accurate daily spend metrics and budget predictions!
              </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-2xl transition-all active:scale-[0.98] hover:opacity-90 mt-4"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
