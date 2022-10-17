import React, { useState, Fragment } from "react";
import { ethers } from "ethers";
import { Button, Typography } from "@material-tailwind/react";

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [chainName, setChainName] = useState(null);

  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
          getAccountBalance(result[0]);
          getChainName();
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getChainName = () => {
    window.ethereum
      .request({ method: "eth_chainId" })
      .then((chainId) => {
        switch (chainId) {
          case "0x1":
            setChainName("Ethereum Mainnet");
            break;
          case "0x5":
            setChainName("Goerli Test Network");
            break;
          case "0xaa36a7":
            setChainName("Sepolia Test Network");
            break;

          default:
            break;
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <Fragment>
      <Typography variant="h2" color="blue-gray">
        {"Connect Your Metamask Wallet"}
      </Typography>
      <Button
        className="rounded-none primary m-5"
        onClick={connectWalletHandler}
      >
        {connButtonText}
      </Button>

      <div class="flex flex-col">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <table class="min-w-full">
                <thead class="border-b">
                  <tr>
                    <th
                      scope="col"
                      class="text-sm font-bold text-gray-900 px-6 py-4 text-center"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-bold text-gray-900 px-6 py-4 text-center"
                    >
                      Balance
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-bold text-gray-900 px-6 py-4 text-center"
                    >
                      Network
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b">
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {defaultAccount}
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {userBalance}
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {chainName}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {errorMessage}
    </Fragment>
  );
};

export default WalletCard;
