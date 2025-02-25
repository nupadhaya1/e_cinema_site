import SelectMovieButton from "~/components/booking/selectMovieButton";
import { Movie } from "~/components/booking/selectMovieButton";

const m: Movie = {
  id: 1,
  title: "sonic",
  image: "",
};
export default function P() {
  return <SelectMovieButton selectedMovie={m}></SelectMovieButton>;
}
