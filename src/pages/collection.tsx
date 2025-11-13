import { Fade } from "react-awesome-reveal";
import CollectionSlider from "../components/CollectionSlider";

export default function Collection() {
  return (
    <section id="collection" className="mt-20">
      <div className="w-full min-h-[90vh]">
        <Fade direction="down">
          <h1 className="text-[50px] md:text-[75px] text-white text-center font-extrabold uppercase">
            {" "}
            Collection
          </h1>
          <p className="text-2xl text-center text-green-500 md:-mt-[70px] -mt-[50px] font-bold uppercase">
            Collection
          </p>
        </Fade>
        <div className="w-full mt-20">
          <CollectionSlider />
        </div>
        <div className="2xl:px-[300px] xl:px-[200px] lg:px-[100px] md:px-[100px] px-5  flex lg:flex-row flex-col-reverse w-full">
          <Fade>
            <div className="flex flex-col gap-5">
              <h1 className="md:text-[100px] text-[50px] font-extrabold text-center text-white">
                10000
              </h1>
              <h1 className="text-xl text-center text-gray-400 uppercase">
                Total Items in collection
              </h1>
              <h1 className="text-xl text-center text-gray-400 uppercase">
                10,000 MIUs, tiny aura beings glowing with digital life.
                Own one, feel its energy, and carry your vibe across the chain
              </h1>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}
