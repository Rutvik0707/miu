import { Fade } from "react-awesome-reveal";

export default function About() {
  return (
    <section
      id="about"
      className="border-b-[1px] border-gray-800 border-dashed bg-[#141a31] bg-opacity-70 backdrop-blur-sm"
    >
      <div className="2xl:px-[300px] xl:px-[200px] lg:px-[100px] md:px-[100px] px-5 min-h-[80vh] pb-10 pt-10">
        <Fade direction="down">
          <h1 className="text-[50px] md:text-[75px] text-white text-center font-extrabold mt-10 uppercase">
            {" "}
            ABout us
          </h1>
          <p className="text-2xl text-center text-green-500 -mt-[70px] font-bold uppercase">
            About us
          </p>
        </Fade>
        <Fade>
          <div className="grid w-full grid-cols-1 gap-10 mt-20 md:grid-cols-2">
            <div className="rounded-lg">
              <h1 className="text-2xl font-bold text-center text-white uppercase md:text-3xl">
                WHAT IS MIU?
              </h1>
              <p className="text-xl font-normal text-gray-400">
                MIU is a collection of 10,000 autonomous agent NFTs built on the ERC-8004 Identity Registry Standard. Each MIU acts as a unique on-chain identity with verifiable traits, capabilities, and purpose within the decentralized ecosystem.
              </p>
              <br></br>
              <p className="text-xl font-normal text-gray-400">
                Designed for interoperability and trust, ERC-8004 allows every MIU to function as a distinct digital agent across networks - connecting users, protocols, and systems through verified identity.
              </p>
              <br></br>
              <p className="text-xl font-normal text-gray-400">
                MIU represents the next evolution in blockchain infrastructure, creating a foundation for a verifiable, agent-driven future where digital entities interact, build, and evolve autonomously.
              </p>
              <br></br>
            </div>
            <div className="flex flex-col rounded-md gap-7">
              <div className="flex flex-col gap-4 border-[1px] border-[#14c2a3] shadow-2xl shadow-[#22B78F80] p-3 rounded-md">
                <p className="text-3xl font-bold text-white">
                  What are the benefits?
                </p>
                <p className="text-lg font-normal text-gray-400">
                  By minting and holding one of our 10,000 unique agent identities, you'll receive the following benefits:<br></br>
                </p>
                <p className="text-lg font-normal text-red-400 md:text-2xl">
                  ERC-8004 compliant identity registry - Standard for autonomous agents<br></br>
                </p>
                <p className="text-lg font-normal text-red-400 md:text-2xl">
                  Verifiable agent identities with unique traits and capabilities<br></br>
                </p>
                <p className="text-lg font-normal text-red-400 md:text-2xl">
                  Interoperable with other ERC-8004 platforms and marketplaces<br></br>
                </p>
                <p className="text-lg font-normal text-red-400 md:text-2xl">
                  Full ownership and transferability of your agent NFTs<br></br>
                </p>
              </div>
            </div>
          </div>
        </Fade>
      </div>
      <div className="absolute top-0 bottom-0 md:min-h-screen lg:min-h-[120vh] xl:min-h-[60vh] min-h-[120vh] area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </section>
  );
}
