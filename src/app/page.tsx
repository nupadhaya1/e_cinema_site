import MoviesServer from '~/components/movies/MoviesServer';


export default function HomePage() {
 return (
   <main>
     <h1 className="p-4 text-center text-4xl font-bold bg-gray-900 text-yellow-400">Movies</h1>
     <MoviesServer />
   </main>
 );
}
