import { min } from "moment";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { ScaleLoader } from "react-spinners";
import { ethers } from "ethers";

import AGENT_IDENTITY_ABI from "../../public/abis/AGENT_IDENTITY_ABI.json";
import ERC20_ABI from "../../public/abis/ERC20_ABI.json";
import {
  AGENT_IDENTITY_CONTRACT_ADDR,
  PUBLICMINTPRICE,
  WHITELISTMINTPRICE,
  USDC_ADDRESS,
  USDC_DECIMALS,
} from "../config";
import { useWeb3React } from "@web3-react/core";
import { errorAlert, successAlert } from "../components/toastGroup";
import { WindowWithEthereum } from "../types";

export default function Mint() {
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

  const { account } = useWeb3React();
  const [mintCount, setMintCount] = useState<number>(1);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [prevTotalSupply, setPrevTotalSupply] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [whiteListCounts, setWhiteListCounts] = useState<number>(0);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [whtieListMintState, setWhiteListMintState] = useState<boolean>(false);
  const [endWhiteListState, setEndWhiteListState] = useState<boolean>(false);
  const [maxMintCount, setMaxMintCount] = useState(10);
  const [walletMintedCount, setWalletMintedCount] = useState<number>(0);

  // Get provider for read-only calls
  const getReadProvider = () => {
    if (typeof window !== "undefined" && (window as WindowWithEthereum).ethereum) {
      return new ethers.providers.Web3Provider((window as WindowWithEthereum).ethereum);
    }
    // Fallback to default provider for BASE network
    return new ethers.providers.JsonRpcProvider("https://mainnet.base.org");
  };

  // Calculate remaining mints allowed for this wallet
  const remainingMints = Math.max(0, maxMintCount - walletMintedCount);
  const canMint = remainingMints > 0;

  // Adjust mint count if it exceeds remaining mints
  useEffect(() => {
    if (mintCount > remainingMints && remainingMints > 0) {
      setMintCount(remainingMints);
    } else if (remainingMints === 0) {
      setMintCount(0);
    }
  }, [remainingMints, mintCount]);

  const provider =
    typeof window !== "undefined" && (window as WindowWithEthereum).ethereum
      ? new ethers.providers.Web3Provider(
          (window as WindowWithEthereum).ethereum
        )
      : null;
  const Signer = provider?.getSigner();

  // Create contract instance for read-only calls (works without wallet)
  const AGENT_CONTRACT = useMemo(() => {
    return new ethers.Contract(
      AGENT_IDENTITY_CONTRACT_ADDR,
      AGENT_IDENTITY_ABI,
      getReadProvider()
    );
  }, []);

  // Create contract instance for write calls (needs signer)
  const AGENT_CONTRACT_SIGNER = useMemo(() => {
    return new ethers.Contract(
      AGENT_IDENTITY_CONTRACT_ADDR,
      AGENT_IDENTITY_ABI,
      Signer
    );
  }, [Signer]);

  const USDC_CONTRACT = useMemo(() => {
    return new ethers.Contract(
      USDC_ADDRESS,
      ERC20_ABI,
      Signer
    );
  }, [Signer]);

  const handleMintFunc = async () => {
    if (!account) {
      errorAlert("Please connect wallet!");
      return;
    }

    try {
      setLoadingState(true);

      // Check if wallet can mint the requested amount
      if (mintCount > remainingMints) {
        errorAlert(`You can only mint ${remainingMints} more NFT(s). You have already minted ${walletMintedCount}/${maxMintCount}.`);
        setLoadingState(false);
        return;
      }

      if (!canMint) {
        errorAlert(`You have reached the maximum limit of ${maxMintCount} NFTs per wallet.`);
        setLoadingState(false);
        return;
      }

      // Calculate total price in USDC (6 decimals) - Fixed at $4 per NFT
      const totalPrice = ethers.utils.parseUnits(
        (PUBLICMINTPRICE * mintCount).toString(),
        USDC_DECIMALS
      );

      console.log(`Minting ${mintCount} NFT(s) for ${PUBLICMINTPRICE * mintCount} USDC`);

      // Check USDC balance
      const balance = await USDC_CONTRACT.balanceOf(account);
      console.log(`USDC Balance: ${ethers.utils.formatUnits(balance, USDC_DECIMALS)}`);
      
      if (balance.lt(totalPrice)) {
        errorAlert(`Insufficient USDC balance! You need ${PUBLICMINTPRICE * mintCount} USDC`);
        setLoadingState(false);
        return;
      }

      // Check and approve USDC if needed
      const allowance = await USDC_CONTRACT.allowance(
        account,
        AGENT_IDENTITY_CONTRACT_ADDR
      );
      console.log(`Current allowance: ${ethers.utils.formatUnits(allowance, USDC_DECIMALS)}`);

      if (allowance.lt(totalPrice)) {
        // Need to approve
        successAlert("Step 1/2: Approving USDC spending...");
        const approveTx = await USDC_CONTRACT.approve(
          AGENT_IDENTITY_CONTRACT_ADDR,
          ethers.constants.MaxUint256 // Approve max for future transactions
        );
        console.log("Waiting for approval transaction...");
        await approveTx.wait();
        successAlert("USDC approved! Proceeding with mint...");
      }

      // Execute mint using publicMint function
      successAlert("Step 2/2: Minting your NFT(s)...");
      console.log("Calling publicMint with quantity:", mintCount);
      
      const mintTx = await AGENT_CONTRACT_SIGNER.publicMint(mintCount, {
        gasLimit: 500000 * mintCount, // Increased gas limit for safety
      });

      console.log("Waiting for mint transaction...");
      const receipt = await mintTx.wait();
      console.log("Mint successful! Transaction hash:", receipt.transactionHash);
      
      successAlert(`🎉 Successfully minted ${mintCount} NFT(s)!`);
      getMintData();
      setLoadingState(false);
    } catch (error: any) {
      console.error("Mint error:", error);
      
      let errorMessage = "Mint failed. Please try again.";
      
      if (error?.message?.includes("user rejected")) {
        errorMessage = "Transaction rejected by user";
      } else if (error?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas";
      } else if (error?.message?.includes("Sale not active")) {
        errorMessage = "Sale is not active yet";
      } else if (error?.message?.includes("Exceeds max supply")) {
        errorMessage = "Sold out! No more NFTs available";
      } else if (error?.message?.includes("Exceeds per-wallet limit")) {
        errorMessage = "You've reached the maximum mint limit per wallet";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      errorAlert(errorMessage);
      setLoadingState(false);
      getMintData();
    }
  };

  const getMintData = useCallback(async () => {
    try {
      if (!AGENT_IDENTITY_CONTRACT_ADDR) {
        return;
      }
      
      // Get total supply (doesn't require account)
      const counts = await AGENT_CONTRACT.totalSupply();
      const newCount = Number(counts);
      
      // If count changed, trigger animation
      if (newCount !== totalSupply) {
        setIsUpdating(true);
        setPrevTotalSupply(totalSupply);
        setTotalSupply(newCount);
        console.log("Total Supply:", newCount);
        
        // Remove animation after 600ms
        setTimeout(() => {
          setIsUpdating(false);
        }, 600);
      }
      
      // Check if sale is active
      const saleActive = await AGENT_CONTRACT.saleActive();
      console.log("Sale Active:", saleActive);
      
      // Get minted count for current wallet (only if account exists)
      if (account) {
        const mintedCount = await AGENT_CONTRACT_SIGNER.mintedByWallet(account);
        setWalletMintedCount(Number(mintedCount));
        console.log("Minted by wallet:", Number(mintedCount));
        
        // Get max per wallet
        const maxPerWallet = await AGENT_CONTRACT_SIGNER.maxPerWallet();
        setMaxMintCount(Number(maxPerWallet));
        console.log("Max per wallet:", Number(maxPerWallet));
      }
      
    } catch (error) {
      console.error("Error fetching mint data:", error);
    }
  }, [AGENT_CONTRACT, AGENT_CONTRACT_SIGNER, account, totalSupply]);

  useEffect(() => {
    // Fetch data on component mount (for total supply)
    getMintData();
    const interval = setInterval(() => {
      getMintData();
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, [getMintData]);

  useEffect(() => {
    // Update wallet-specific data when account changes
    if (account) {
      getMintData();
    }
  }, [account, getMintData]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
    >
      <section className="relative flex flex-col w-full">
        <img
          src="/img/home.jpg"
          className="fixed top-0 bottom-0 object-cover w-full h-full -z-10"
        />
        <div className="2xl:px-[300px] xl:px-[200px] lg:px-[100px] md:px-[100px] px-5 mt-[100px] lg:mt-[100px] w-full gap-5 pb-10">
          <Link href={"/"} passHref>
            <div className="w-full my-5 text-right transition-all duration-300 hover:translate-x-2">
              <h1 className="font-bold text-right text-white cursor-pointer">{`<- Back to Home`}</h1>
            </div>
          </Link>
          <div className="flex flex-col items-center justify-center w-full">
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
                      className="object-cover w-full rounded-lg"
                    />
                  ))}
                </Slider>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center w-full mt-10">
                <h1 className="text-xl font-normal text-center text-white">
                  MIU Agent NFTs
                  <br />
                  Minting Cost = ${PUBLICMINTPRICE} USDC per NFT
                  <br />
                  <span className="text-sm text-gray-300">
                    Built on ERC8004 • BASE Network
                  </span>
                </h1>
              </div>
              <div className="flex items-center justify-between w-full mt-5">
                <div
                  className={`px-6 py-4 text-xl font-bold text-center text-black transition-all duration-300 rounded-md ${
                    mintCount <= 1
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-400 cursor-pointer "
                  }`}
                  onClick={() =>
                    mintCount <= 1
                      ? setMintCount(1)
                      : setMintCount(mintCount - 1)
                  }
                >
                  {`-`}
                </div>{" "}
                <h1 className="text-xl font-bold text-white">{mintCount}</h1>
                <div
                  className={`px-6 py-4 text-xl font-bold text-center text-black transition-all duration-300 rounded-md ${
                    mintCount >= remainingMints || !canMint
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-400 cursor-pointer "
                  }`}
                  onClick={() =>
                    mintCount >= remainingMints
                      ? setMintCount(remainingMints)
                      : setMintCount(mintCount + 1)
                  }
                >
                  {`+`}
                </div>
              </div>
              <div className="flex items-center justify-center w-full mt-5">
                <h1 className={`text-2xl font-bold text-center text-white transition-all duration-500 ${
                  isUpdating ? 'scale-110 text-green-400' : 'scale-100 text-white'
                }`}>
                  {totalSupply} / 10000
                </h1>
              </div>
              {totalSupply !== 10000 ? (
                <>
                  <div className="relative">
                    <div
                      className={`z-[49] relative w-full px-10 py-4 mt-10 font-bold text-center transition-all duration-300 rounded-md lg:w-auto ${
                        !canMint || remainingMints === 0
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-white text-black cursor-pointer hover:bg-gray-400"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={() => !loadingState && canMint && remainingMints > 0 && handleMintFunc()}
                    >
                      {!canMint || remainingMints === 0
                        ? "Mint Limit Reached"
                        : loadingState
                        ? "Minting..."
                        : `Mint ${mintCount} NFT${mintCount > 1 ? 's' : ''} for $${PUBLICMINTPRICE * mintCount} USDC`}
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-full mt-2">
                    <h1 className="text-sm font-bold text-center text-white">
                      {remainingMints} Mint remaining for your wallet
                    </h1>
                  </div>
                  <div className="flex items-center justify-center w-full mt-1">
                    <h1 className="text-xs text-center text-gray-400">
                      ({walletMintedCount} / {maxMintCount} minted)
                    </h1>
                  </div>
                  <div className="flex items-center justify-center w-full mt-2">
                    <h1 className="text-sm font-bold text-center text-white">
                      10,000 Agent Identities Available
                    </h1>
                  </div>
                </>
              ) : (
                <h1 className="text-3xl font-bold text-center text-red-500">
                  Sold Out!
                </h1>
              )}
            </div>
          </div>
        </div>
        <div className="light x1"></div>
        <div className="light x2"></div>
        <div className="light x3"></div>
        <div className="light x4"></div>
        <div className="light x5"></div>
        <div className="light x6"></div>
        <div className="light x7"></div>
        <div className="light x8"></div>
        <div className="light x9"></div>
        {loadingState && (
          <div className="fixed top-0 bottom-0 left-0 right-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80 flex-col text-white">
            <ScaleLoader color="white" />
          </div>
        )}
      </section>
    </motion.section>
  );
}

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
];
