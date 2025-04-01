import { Suspense } from "react";
import EditMovieForm from "~/components/edit-movie-form/editMovieForm";

export default function EditMoviePageWrapper() {
  return (
    <Suspense fallback={<div>Loading movie editor...</div>}>
      <EditMovieForm />
    </Suspense>
  );
}
