import backArrow from "../images/BackArrow.svg";
import { useNavigate } from "react-router-dom";

function BackArrow() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="flex flex-col justify-center items-center fixed top-0 left-0 w-12 h-10 z-50"
      onClick={goBack}
    >
      <img src={backArrow} alt="Back Arrow" />
    </div>
  );
}
export default BackArrow;
