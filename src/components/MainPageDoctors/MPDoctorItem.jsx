import "./MPDoctorItem.css";

function MPDoctorItem({ doctor }) {
  const { doctorImage, doctorUsername, doctorSurname } = doctor;
  const defaultImage =
    "https://img.freepik.com/free-vector/hand-drawn-iranian-women-illustration_23-2149825684.jpg";

  return (
    <div className="mpdoctor-item">
      <div className="mpdoctor-image">
        <img src={doctorImage || defaultImage} alt={doctorUsername} />
      </div>
      <div className="mpdoctor-info">
        <h3>
          {doctorUsername} {doctorSurname}
        </h3>
        <br></br>
      </div>
    </div>
  );
}

export default MPDoctorItem;
