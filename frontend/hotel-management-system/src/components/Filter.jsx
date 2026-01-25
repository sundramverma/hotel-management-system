import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

function Filter({
  fromdate,
  todate,
  setFromdate,
  setTodate,
  searchkey,
  setSearchkey,
  type,
  setType,
}) {
  function onDateChange(dates) {
    if (dates) {
      setFromdate(dates[0].format("DD-MM-YYYY"));
      setTodate(dates[1].format("DD-MM-YYYY"));
    }
  }

  return (
    <div className="container mt-4">
      <div className="row bs">
        <div className="col-md-4">
          <RangePicker format="DD-MM-YYYY" onChange={onDateChange} />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search Rooms"
            value={searchkey}
            onChange={(e) => setSearchkey(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="deluxe">Deluxe</option>
            <option value="premium">Premium</option>
            <option value="standard">Standard</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filter;
