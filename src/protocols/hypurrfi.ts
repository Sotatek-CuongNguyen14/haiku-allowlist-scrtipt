import { ethers } from "ethers";
import collaterals from "../resources/current-allowlist/supportedCollateralContracts.json";
import varDebts from "../resources/current-allowlist/supportedVarDebtContracts.json";
import newCollateralList from "../resources/new-allowlist/newCollateralContracts.json";
import newVarDebtsList from "../resources/new-allowlist/newVarDebtContracts.json";
import {
  CollateralTokenType,
  Protocol,
  VariableDebtTokenType,
} from "../utils/types";
import {
  getRandomColorFromSeed,
  getTokenDetails,
  mappingChainIdToChainName,
  mappingChainIdToHypurrfiProviderAddress,
  mappingChainIdToHypurrfiUIProviderAddress,
  mappingChainIdToProvider,
} from "../utils/utils";
import * as fs from "fs";
import { hypurrfiUIProviderABI } from '../utils/abi';

export const newHypurrfiAllowlist = async (): Promise<{
  newCollaterals: CollateralTokenType[];
  newVariableDebts: VariableDebtTokenType[];
}> => {
  try {
    const currentCollaterals: CollateralTokenType[] = collaterals.filter(
      (vault) => vault.protocol === Protocol.Hypurrfi
    ) as CollateralTokenType[];

    const currentVarDebts: VariableDebtTokenType[] = varDebts.filter(
      (vault) => vault.protocol === Protocol.Hypurrfi
    ) as VariableDebtTokenType[];

    const chains = Object.keys(mappingChainIdToHypurrfiUIProviderAddress);
    const allCollaterals: CollateralTokenType[] = [];
    const allVariableDebts: VariableDebtTokenType[] = [];
    for (const chainId of chains) {
      const uiProviderContract = new ethers.Contract(
        mappingChainIdToHypurrfiUIProviderAddress[chainId],
        hypurrfiUIProviderABI,
        mappingChainIdToProvider[chainId]
      );

      const reservesDatas = await uiProviderContract.getReservesData(
        mappingChainIdToHypurrfiProviderAddress[chainId]
      );
      const collateralTokenAddresses = reservesDatas[0].map(
        (reserveData: any) => reserveData.aTokenAddress.toLowerCase()
      );
      const collateralTokens = await getTokenDetails(
        Number(chainId),
        collateralTokenAddresses
      );
      const variableDebtTokenAddresses = reservesDatas[0].map(
        (reserveData: any) => reserveData.variableDebtTokenAddress.toLowerCase()
      );
      const variableDebtTokens = await getTokenDetails(
        Number(chainId),
        variableDebtTokenAddresses
      );
      reservesDatas[0].forEach((reserveData: any) => {
        if (
          reserveData.isActive === false ||
          reserveData.isFrozen === true ||
          reserveData.isPaused === true
        ) {
          return;
        }

        const collateralTokenInfo = collateralTokens.find(
          (token) =>
            token.address.toLowerCase() ===
            reserveData.aTokenAddress.toLowerCase()
        );
        const variableDebtTokenInfo = variableDebtTokens.find(
          (token) =>
            token.address.toLowerCase() ===
            reserveData.variableDebtTokenAddress.toLowerCase()
        );

        allCollaterals.push({
          iid: `${
            mappingChainIdToChainName[chainId]
          }:${reserveData.aTokenAddress.toLowerCase()}`,
          symbol: collateralTokenInfo ? collateralTokenInfo.symbol : "",
          address: collateralTokenInfo
            ? collateralTokenInfo.address.toLowerCase()
            : "",
          protocol: Protocol.Hypurrfi,
          underlying_iid: reserveData.underlyingAsset.toLowerCase(),
          network: Number(chainId),
          max_ltv: Number(
            ethers.utils.formatUnits(reserveData.baseLTVasCollateral, 4)
          ),
          liquidation_threshold: Number(
            ethers.utils.formatUnits(reserveData.reserveLiquidationThreshold, 4)
          ),
          liquidation_penalty: Number(
            Number(
              Number(
                ethers.utils.formatUnits(reserveData.reserveLiquidationBonus, 4)
              ) - 1
            ).toFixed(4)
          ),
          decimals: collateralTokenInfo ? collateralTokenInfo.decimals : 18,
          name: collateralTokenInfo ? collateralTokenInfo.name : "",
          primaryColor: getRandomColorFromSeed(
            reserveData.aTokenAddress,
            "dark"
          ),
          tokenCategory: "collateral",
          url: "",
          logoURI: "",
          colors: {
            light: getRandomColorFromSeed(reserveData.aTokenAddress, "light"),
            dark: getRandomColorFromSeed(reserveData.aTokenAddress, "dark"),
          },
        });

        allVariableDebts.push({
          iid: `${
            mappingChainIdToChainName[chainId]
          }:${reserveData.variableDebtTokenAddress.toLowerCase()}`,
          address: reserveData.variableDebtTokenAddress.toLowerCase(),
          protocol: Protocol.Hypurrfi,
          underlying_iid: reserveData.underlyingAsset.toLowerCase(),
          network: Number(chainId),
          reserve_factor: Number(
            ethers.utils.formatUnits(reserveData.reserveFactor, 4)
          ),
          decimals: variableDebtTokenInfo ? variableDebtTokenInfo.decimals : 18,
          name: variableDebtTokenInfo ? variableDebtTokenInfo.name : "",
          symbol: variableDebtTokenInfo ? variableDebtTokenInfo.symbol : "",
          primaryColor: getRandomColorFromSeed(
            reserveData.variableDebtTokenAddress,
            "dark"
          ),
          tokenCategory: "varDebt",
          url: "",
          colors: {
            light: getRandomColorFromSeed(
              reserveData.variableDebtTokenAddress,
              "light"
            ),
            dark: getRandomColorFromSeed(
              reserveData.variableDebtTokenAddress,
              "dark"
            ),
          },
        });
      });
    }

    console.log(`Total collaterals fetched: ${allCollaterals.length}`);
    console.log(`Total variable debts fetched: ${allVariableDebts.length}`);

    const newCollaterals = allCollaterals.filter((collateral) => {
      return (
        !currentCollaterals.some(
          (currentCollateral) => currentCollateral.iid === collateral.iid
        ) &&
        !(newCollateralList as CollateralTokenType[]).some(
          (currentCollateral) => currentCollateral.iid === collateral.iid
        )
      );
    });

    const newVariableDebts = allVariableDebts.filter((varDebt) => {
      return (
        !currentVarDebts.some(
          (currentVarDebt) => currentVarDebt.iid === varDebt.iid
        ) &&
        !(newVarDebtsList as VariableDebtTokenType[]).some(
          (currentVarDebt) => currentVarDebt.iid === varDebt.iid
        )
      );
    });

    console.log(`New collaterals to add: ${newCollaterals.length}`);
    console.log(`New variable debts to add: ${newVariableDebts.length}`);

    if (newCollaterals.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newCollateralContracts.json",
        JSON.stringify([...newCollateralList, ...newCollaterals], null, 2)
      );
    }

    if (newVariableDebts.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newVarDebtContracts.json",
        JSON.stringify([...newVarDebtsList, ...newVariableDebts], null, 2)
      );
    }
    return {
      newCollaterals,
      newVariableDebts,
    };
  } catch (error) {
    console.error("Error fetching Hypurrfi allowlist:", error);
    return {
      newCollaterals: [],
      newVariableDebts: [],
    };
  }
};
