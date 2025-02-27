"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SelectMovieButton from "~/components/booking/selectMovieButton";
import { Movie } from "~/components/booking/selectMovieButton";

function MovieComponent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const url = searchParams.get("url");

  // Ensure the parameters exist before using them
  const m: Movie = {
    id: 1,
    title: name ? String(name) : "Default Title",
    image: url ? String(url) : "",
  };

  return (
    <div>
      <SelectMovieButton selectedMovie={m} />
    </div>
  );
}

export default function P() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MovieComponent />
    </Suspense>
  );
}
