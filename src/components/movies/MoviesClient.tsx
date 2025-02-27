"use client";


import { useState } from 'react';
import Image from "next/image";


function MoviesClient({ movies }: { movies: any[] }) {
 const [searchQuery, setSearchQuery] = useState("");


 // Filter movies based on the search query
 const filteredMovies = movies.filter((movie) =>
   movie.name.toLowerCase().includes(searchQuery.toLowerCase())
 );


 // Filter movies by category
 const currentlyRunningMovies = filteredMovies.filter((movie) => movie.category == "Currently Running");
 const comingSoonMovies = filteredMovies.filter((movie) => movie.category == "Coming Soon");


 return (
   <div>
     {/* Search Bar */}
     <div className="p-4 flex justify-center bg-gray-900">
       <input
         type="text"
         placeholder="Search for a movie..."
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)} // Update the search query on change
         className="border p-2 w-64 rounded-md"
       />
     </div>


     <div className="flex justify-between gap-4 p-4">
       {/* Currently Running Movies */}
       <div className="flex-1">
         <h2 className="text-2xl font-semibold text-center mb-4">Currently Running</h2>
         <div className="flex flex-wrap justify-center gap-4">
           {currentlyRunningMovies.map((movie) => (
             <div key={movie.id} className="flex h-auto w-48 flex-col">
               <Image
                 src={movie.url}
                 style={{ objectFit: "contain" }}
                 width={192}
                 height={192}
                 alt={movie.name}
               />
              
               <div className="mt-2">
                 <iframe
                   width="192"
                   height="108"
                   src={movie.trailervideo}
                   title={`Trailer for ${movie.name}`}
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                   className="w-full"
                 ></iframe>
               </div>
               <div className="text-center">{movie.rating}</div>
               <div className="h-16 text-center">{movie.name} <button className="rounded bg-gray-800 text-yellow-400" type="button"> Book Ticket </button></div>
             </div>
           ))}
         </div>
       </div>


       {/* Coming Soon Movies */}
       <div className="flex-1">
         <h2 className="text-2xl font-semibold text-center mb-4">Coming Soon</h2>
         <div className="flex flex-wrap justify-center gap-4">
           {comingSoonMovies.map((movie) => (
             <div key={movie.id} className="flex h-auto w-48 flex-col">
               <Image
                 src={movie.url}
                 style={{ objectFit: "contain" }}
                 width={192}
                 height={192}
                 alt={movie.name}
               />
              
               <div className="mt-2">
                 <iframe
                   width="192"
                   height="108"
                   src={movie.trailervideo}
                   title={`Trailer for ${movie.name}`}
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                   className="w-full"
                 ></iframe>
               </div>
               <div className="text-center">{movie.rating}</div>
               <div className="h-16 text-center">{movie.name} <button className="rounded bg-gray-800 text-yellow-400" type="button"> Book Ticket </button></div>
             </div>
           ))}
         </div>
       </div>
     </div>
   </div>
 );
}


export default MoviesClient;