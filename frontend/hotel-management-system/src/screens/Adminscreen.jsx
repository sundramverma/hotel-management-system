import { useEffect, useState } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

function AdminScreen() {
 const user = JSON.parse(sessionStorage.getItem("currentUser"));


  if (!user || !user.isAdmin) {
    return <Error message="Access denied. Admin only." />;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4"><b>ADMIN PANEL</b></h2>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Bookings",
            key: "1",
            children: <Bookings />,
          },
          {
            label: "Rooms",
            key: "2",
            children: <Rooms />,
          },
          {
            label: "Add Room",
            key: "3",
            children: <AddRoom />,
          },
          {
            label: "Users",
            key: "4",
            children: <Users />,
          },
        ]}
      />
    </div>
  );
}

export default AdminScreen;

/* ================= BOOKINGS ================= */

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data } = await axios.get("/api/bookings/getallbookings");
        setBookings(data);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message="Failed to load bookings" />;

  return (
    <div className="table-responsive">
      <h4>Total Bookings: {bookings.length}</h4>
      <table className="table table-bordered table-dark">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User</th>
            <th>Room</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking._id}</td>
              <td>{booking.userid}</td>
              <td>{booking.room}</td>
              <td>{booking.fromdate}</td>
              <td>{booking.todate}</td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= ROOMS ================= */

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data } = await axios.get("/api/rooms/getallrooms");
        const roomsData = Array.isArray(data) ? data : data.rooms;
        setRooms(roomsData);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message="Failed to load rooms" />;

  return (
    <div className="table-responsive">
      <h4>Total Rooms: {rooms.length}</h4>
      <table className="table table-bordered table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Rent / Day</th>
            <th>Max Count</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room._id}</td>
              <td>{room.name}</td>
              <td>{room.type}</td>
              <td>₹{room.rentperday}</td>
              <td>{room.maxcount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= USERS ================= */

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await axios.get("/api/users/getallusers");
        setUsers(data);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message="Failed to load users" />;

  return (
    <div className="table-responsive">
      <h4>Total Users: {users.length}</h4>
      <table className="table table-bordered table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "YES" : "NO"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= ADD ROOM ================= */

function AddRoom() {
  return (
    <div className="bs">
      <h4>Add Room (Coming Soon)</h4>
      <p>Room creation form will be added here.</p>
    </div>
  );
}
