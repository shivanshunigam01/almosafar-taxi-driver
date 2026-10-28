"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { notifyUser } from "@almosafar/ui";
import { useBooking } from "@/context/BookingContext";

const TAGS = ["Clean car", "Safe driving", "Friendly", "On time", "Smooth ride"];

export default function RatingPage() {
  const { id } = useParams<{ id: string }>();
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();
  const { reset } = useBooking();

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <div className="space-y-5 bg-slate-50 px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold text-slate-900">How was your trip?</h1>
      <p className="text-sm text-slate-600">Your feedback helps drivers on Almosafar Taxi (demo).</p>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} stars`}
            onClick={() => setStars(n)}
            className="text-4xl transition hover:scale-110"
          >
            {n <= stars ? "★" : "☆"}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tags.includes(tag)
                ? "bg-brand text-white"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <textarea
        className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm"
        placeholder="Optional comments"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <button
        type="button"
        className="btn-brand w-full"
        onClick={() => {
          localStorage.setItem(
            `almosafar.passenger.rating.${id}`,
            JSON.stringify({ stars, comment, tags, at: new Date().toISOString() })
          );
          reset();
          notifyUser("Thanks! Rating saved locally (demo).");
          router.push("/home");
        }}
      >
        Submit feedback
      </button>
    </div>
  );
}
