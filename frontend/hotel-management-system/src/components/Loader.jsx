  import RingLoader from "react-spinners/RingLoader";

  function Loader() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <RingLoader color="#000" size={120} />
      </div>
    );
  }

  export default Loader;
