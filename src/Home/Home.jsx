import Herobanner from "../Components/Herobanner";
import Productcard from "../Components/Productcard";
import "./Home.css"
export default function Home() {
  return (
    <>
      <div className="home">
        <Herobanner />
        <Productcard />
        <br></br>
      </div>

    </>
  );
}
