import { useEffect, useState } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Filter from "../components/Filter";

function HomeScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fromdate, setFromdate] = useState(null);
  const [todate, setTodate] = useState(null);
  const [searchkey, setSearchkey] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data } = await axios.get("/api/rooms/getallrooms");
        setRooms(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load rooms");
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  function filteredRooms() {
    let temp = rooms;

    if (searchkey) {
      temp = temp.filter((room) =>
        room.name.toLowerCase().includes(searchkey.toLowerCase())
      );
    }

    if (type !== "all") {
      temp = temp.filter(
        (room) => room.type.toLowerCase() === type.toLowerCase()
      );
    }

    return temp;
  }

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div>
      <Filter
        setFromdate={setFromdate}
        setTodate={setTodate}
        searchkey={searchkey}
        setSearchkey={setSearchkey}
        type={type}
        setType={setType}
      />

      <div className="container mt-5">
        <div className="row">
          {filteredRooms().map((room) => (
            <div className="col-md-4 mb-4" key={room._id}>
              <Room room={room} fromdate={fromdate} todate={todate} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
