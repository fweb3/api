export const formatError = (err: any) => {
  const message = err?.message;
  const notOnAlchemyWhitelist = message.includes(
    "Unspecified origin not on whitelist"
  );
  const cantLoadWallet = message.includes("cannot load wallet");
  const hasLimitOfFweb3 = message.includes("limit"); // requirement matches system error
  const exceedsGasLimit = message.includes("exceeds block gas limit");
  const missingGas = message.includes("gas required exceeds allowance");
  const underPriced = message.includes("transaction underpriced");
  const notEnoughGas = message.includes(
    "max fee per gas less than block base fee"
  );
  const gasTooLowForNextBlock = message.includes(
    "is too low for the next block"
  );

  const alreadyUsed = message.includes("used");
  const tooSoon = message.includes("timeout");
  const missingFweb3 = message.includes("missing erc20");
  const alreadyHaveMatic = message.includes("no need");
  const faucetDisabled = message.includes("disabled");
  const faucetDry = message.includes("dry");
  const didNotSend = message.includes("send failed");
  const cannotEstimateGas = message.includes("may require manual gas limit");

  // console.log({
  //   hasLimitOfFweb3,
  //   exceedsGasLimit,
  //   missingGas,
  //   underPriced,
  //   notEnoughGas,
  //   gasTooLowForNextBlock,
  //   alreadyUsed,
  //   tooSoon,
  //   missingFweb3,
  //   alreadyHaveMatic,
  //   faucetDisabled,
  //   faucetDry,
  //   didNotSend,
  //   cannotEstimateGas,
  // })
  const callException =
    err?.code === "CALL_EXCEPTION" && err?.method
      ? `error calling contract. check funds`
      : null;
  let error =
    callException ?? "An unknown error occured. Please reach out to #support";

  if (hasLimitOfFweb3 && !exceedsGasLimit && !cannotEstimateGas) {
    error = "you already enough token to play";
  }

  if (cannotEstimateGas && !alreadyHaveMatic) {
    error = "cant estimate gas. usually congested network. try again later";
  }

  if (exceedsGasLimit) {
    error = "transaction gas exceeds limit";
  }

  if (alreadyUsed) {
    error = "Faucet is single use only.";
  }
  if (tooSoon) {
    error = "You must wait to use faucet again";
  }

  if (missingFweb3) {
    error = "Matic faucet requires you have the required amount of fweb tokens";
  }

  if (faucetDisabled) {
    error = "The faucet is disabled";
  }

  if (faucetDry) {
    error = "Faucet is out of funds";
  }

  if (didNotSend) {
    error = "The TX did not send. Please try again later";
  }

  if (notEnoughGas) {
    error = "not enough gas";
  }

  if (gasTooLowForNextBlock) {
    error = "gas is too low for next block";
  }

  if (alreadyHaveMatic) {
    error = "you have more than enough already";
  }

  if (underPriced) {
    error = "gas is under priced / unpredictable. wait a few min and try again";
  }
  if (missingGas) {
    error = "Faucet contract needs gas money";
  }

  if (cantLoadWallet) {
    error = "cannot load faucet wallet";
  }

  if (notOnAlchemyWhitelist) {
    error = "domain not whitelisted";
  }

  return error;
};
