import "./DoctorItem.css";

function DoctorItem({ doctor }) {
  const { doctorImage, doctorUsername, doctorSurname } = doctor;
  const defaultImage =
    "https://img.freepik.com/free-vector/hand-drawn-iranian-women-illustration_23-2149825684.jpg";

  return (
    <div className="doctor-item">
      <div className="doctor-image">
        <img src={doctorImage || defaultImage} />
      </div>
      <div className="doctor-info">
        <h3>
          {doctorUsername} {doctorSurname}
        </h3>
        <br></br>
      </div>
    </div>
  );
}

export default DoctorItem;
