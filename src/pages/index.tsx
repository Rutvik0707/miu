/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useMemo, useCallback } from "react";
import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import About from "./about";
import Collection from "./collection";
import { Bounce } from "react-awesome-reveal";
import Link from "next/link";
import { motion } from "framer-motion";
import AGENT_IDENTITY_ABI from "../../public/abis/AGENT_IDENTITY_ABI.json";
import { AGENT_IDENTITY_CONTRACT_ADDR } from "../config";
import { WindowWithEthereum } from "../types";

const settings = {
  dots: false,
  arrows: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  speed: 300,
  autoplaySpeed: 300,
  fade: true,
};

const Home: NextPage = () => {
  const { account } = useWeb3React();
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [prevTotalSupply, setPrevTotalSupply] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [whitelistMintActive, setWhitelistMintActive] = useState<boolean>(false);

  // Get provider for read-only calls
  const getReadProvider = () => {
    if (typeof window !== "undefined" && (window as WindowWithEthereum).ethereum) {
      return new ethers.providers.Web3Provider((window as WindowWithEthereum).ethereum);
    }
    // Fallback to default provider for BASE network
    return new ethers.providers.JsonRpcProvider("https://mainnet.base.org");
  };

  // Create contract instance for read-only calls (works without wallet)
  const AGENT_CONTRACT = useMemo(() => {
    return new ethers.Contract(
      AGENT_IDENTITY_CONTRACT_ADDR,
      AGENT_IDENTITY_ABI,
      getReadProvider()
    );
  }, []);

  const getMintData = useCallback(async () => {
    try {
      if (AGENT_IDENTITY_CONTRACT_ADDR) {
        const counts = await AGENT_CONTRACT.totalSupply();
        const newCount = Number(counts);
        
        // If count changed, trigger animation
        if (newCount !== totalSupply) {
          setIsUpdating(true);
          setPrevTotalSupply(totalSupply);
          setTotalSupply(newCount);
          
          // Remove animation after 600ms
          setTimeout(() => {
            setIsUpdating(false);
          }, 600);
        }
        
        const state = await AGENT_CONTRACT.whitelistMintActive();
        setWhitelistMintActive(state);
      }
    } catch (error) {
      console.log("Error fetching mint data:", error);
    }
  }, [AGENT_CONTRACT, totalSupply]);

  useEffect(() => {
    getMintData();
    const interval = setInterval(() => {
      getMintData();
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [getMintData]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
    >
      <section className="relative flex flex-col w-full" id="#home">
        <img
          src="/img/home.jpg"
          className="fixed top-0 bottom-0 object-cover w-full h-full rounded-lg -z-10"
        />
        <div className="2xl:px-[300px] xl:px-[200px] lg:px-[100px] md:px-[100px] px-5 mt-[100px] lg:mt-[200px] flex lg:flex-row flex-col-reverse w-full gap-5 pb-10">
          <Bounce>
            <div>
              <h1 className="2xl:text-[65px] xl:text-[55px] lg:text-[50px] md:text-[40px] text-[30px] font-extrabold text-white text-center lg:text-left">
                MIU on ERC8004
              </h1>
              <p className="text-center text-gray-400 lg:text-left">
                Built on ERC8004. Designed for the next era of digital ownership.
                MIUs are cute aura-coded companions ready to vibe with you.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 md:justify-start">
                {/* Mint Button */}
                <Link href="/mint" passHref>
                  <button className="w-full px-10 py-4 mt-5 font-bold text-black transition-all duration-300 bg-white rounded-md lg:w-auto hover:bg-gray-400 animate-pulse">
                    🚀 Mint Now
                  </button>
                </Link>

                {/* Live Mint Counter */}
                <div className="flex items-center justify-center md:justify-start">
                  <div className="px-6 py-3 bg-white bg-opacity-10 backdrop-blur-sm border-[1px] border-gray-400 rounded-lg">
                    <h1 className={`text-xl font-bold text-center text-white md:text-2xl transition-all duration-500 ${
                      isUpdating ? 'scale-110 text-green-400' : 'scale-100 text-white'
                    }`}>
                      {totalSupply.toLocaleString()} / 10,000 Minted
                    </h1>
                  </div>
                </div>
              </div>
              
              


            </div>
          </Bounce>
          <div className="flex items-center justify-center w-full lg:justify-end">
            <div className="xl:w-[500px] lg:w-[400px] w-[350px] md:w-[500px] p-2">
              <div className="p-2 border-[1px] border-gray-400 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm">
                <Slider
                  {...settings}
                  className="mx-3 my-2"
                  cssEase="ease-in-out"
                >
                  {nftArray.map((data, index) => (
                    <img
                      src={data.imgurl}
                      key={index}
                      className="object-cover w-full"
                    />
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
      <About />
      <Collection />
    </motion.section>
  );
};

export default Home;

type NFTIMG = {
  id: number;
  imgurl: string;
};

const nftArray: NFTIMG[] = [
  {
    id: 1,
    imgurl: "/img/nft/modal_1.png",
  },
  {
    id: 2,
    imgurl: "/img/nft/modal_2.png",
  },
  {
    id: 3,
    imgurl: "/img/nft/modal_3.png",
  },
  {
    id: 4,
    imgurl: "/img/nft/modal_4.png",
  },
  {
    id: 5,
    imgurl: "/img/nft/modal_5.png",
  },
  {
    id: 6,
    imgurl: "/img/nft/modal_6.png",
  },
  {
    id: 7,
    imgurl: "/img/nft/modal_7.jpg",
  },
  {
    id: 8,
    imgurl: "/img/nft/modal_8.jpg",
  },
  {
    id: 9,
    imgurl: "/img/nft/modal_9.jpg",
  },
];
