import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminSidebar } from "~/components/admin/admin-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { MovieCard } from "~/components/admin/movies/movie-card";
import { getMyMovies } from "~/server/queries";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const movies = await getMyMovies();

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/movies">Movies</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>All Movies</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Movies</h1>
            <Link href="/admin/movies/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Movie
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={{ ...movie, id: movie.id.toString() }}
              />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
