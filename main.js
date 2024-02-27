
function App() {
  const [data, setData] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    async function getData() {
      const response = await fetch("./movies.json");
      const json = await response.json();

      async function getRatings(movie) {
        const resp = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${movie.title}`);
        const j = await resp.json();

        movie.rating = j.Ratings.filter(x => x.Source === "Rotten Tomatoes")[0].Value
        
        return movie
      }

      let newData = Promise.all(json.movies.map(movie => getRatings(movie)));
      json.movies = await newData;

      setData(json)
      setLoaded(true);
    }
    getData();
  }, []);
  console.log("loaded:", loaded, "data:", data);

  return (
    <>
      <div className="container">
        <div className="col-sm">
          {loaded &&
            data.movies.map((movie, i) => <Movie data={movie} key={i} />)}
        </div>
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
