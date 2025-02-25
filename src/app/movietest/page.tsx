// import SelectMovieButton from "~/components/booking/SelectMovieButton";
// import { Movie } from "~/components/booking/SelectMovieButton";

import SelectMovieButton from "~/components/booking/SelectMovieButton";
import { Movie } from "~/components/booking/SelectMovieButton";

const m: Movie = {
  id: 1,
  title: "sonic",
  image: "",
};
export default function P() {
  return <SelectMovieButton selectedMovie={m}></SelectMovieButton>;
}
