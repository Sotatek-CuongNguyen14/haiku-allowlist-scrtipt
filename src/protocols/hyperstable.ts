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
  mapChainIdMulticall3,
  mappingChainIdToProvider,
} from "../utils/utils";
import * as fs from "fs";
import {
  HYPERSTABLE_POOL_MANAGER_CONTRACT,
  hyperstableCreateSyntheticAddress,
} from "../utils/hyperstable";
import { hyperstablePoolManagerABI, multical3AggregateABI } from "../utils/abi";
import { formatUnits } from "ethers/lib/utils";

export const newHyperstableAllowlist = async (): Promise<{
  newCollaterals: CollateralTokenType[];
  newVariableDebts: VariableDebtTokenType[];
}> => {
  try {
    const currentCollaterals: CollateralTokenType[] = collaterals.filter(
      (vault) => vault.protocol === Protocol.Hyperstable
    ) as CollateralTokenType[];

    const currentVarDebts: VariableDebtTokenType[] = varDebts.filter(
      (vault) => vault.protocol === Protocol.Hyperstable
    ) as VariableDebtTokenType[];

    const poolManagerContract = new ethers.Contract(
      HYPERSTABLE_POOL_MANAGER_CONTRACT,
      hyperstablePoolManagerABI,
      mappingChainIdToProvider[999]
    );

    const multical3Contract = new ethers.Contract(
      mapChainIdMulticall3[999],
      multical3AggregateABI,
      mappingChainIdToProvider[999]
    );

    const lastVaultIndex = await poolManagerContract.lastVaultIndex();
    const debtToken = "0x8fF0dd9f9C40a0d76eF1BcFAF5f98c1610c74Bd8";

    const calls = [];

    for (let vaultIndex = 0; vaultIndex < lastVaultIndex; vaultIndex++) {
      calls.push({
        target: HYPERSTABLE_POOL_MANAGER_CONTRACT,
        callData: poolManagerContract.interface.encodeFunctionData("getVault", [
          vaultIndex,
        ]),
      });
    }

    const [, returnData] = await multical3Contract.callStatic.aggregate(calls);
    const allCollaterals: CollateralTokenType[] = [];
    const allVariableDebts: VariableDebtTokenType[] = [];

    for (let i = 0; i < returnData.length; i++) {
      // eslint-disable-next-line prefer-const
      let [, asset, , , MCR] = ethers.utils.defaultAbiCoder.decode(
        [
          "address",
          "address",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
        ],
        returnData[i]
      );
      let assetInfo = undefined;
      if (asset === ethers.constants.AddressZero) {
        asset = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
        assetInfo = {
          symbol: "HYPE",
          network: 999,
          decimals: 18,
          name: "HYPE",
        };
      } else {
        assetInfo = (await getTokenDetails(999, [asset]))[0];
      }
      // Collateral token
      const collateralSyntheticAddress = hyperstableCreateSyntheticAddress(
        asset.toString(),
        i
      );

      allCollaterals.push({
        iid: `hype:${collateralSyntheticAddress.toLowerCase()}`,
        symbol: `hyperstable${assetInfo.symbol}`,
        address: collateralSyntheticAddress.toLowerCase(),
        protocol: Protocol.Hyperstable,
        underlying_iid: `hype:${asset.toLowerCase()}`,
        network: 999,
        max_ltv: Number((1 / Number(formatUnits(MCR, 18))).toFixed(2)),
        liquidation_threshold: 0,
        liquidation_penalty: 0,
        decimals: 18,
        name: `Hyperstable Collateral ${assetInfo.name}`,
        primaryColor: getRandomColorFromSeed(
          collateralSyntheticAddress,
          "dark"
        ),
        tokenCategory: "collateral",
        url: "",
        logoURI: "",
        colors: {
          light: getRandomColorFromSeed(collateralSyntheticAddress, "light"),
          dark: getRandomColorFromSeed(collateralSyntheticAddress, "dark"),
        },
      });
      // Debt token
      const debtSyntheticAddress = hyperstableCreateSyntheticAddress(
        debtToken,
        i
      );

      allVariableDebts.push({
        iid: `hype:${debtSyntheticAddress.toLowerCase()}`,
        address: debtSyntheticAddress.toLowerCase(),
        protocol: Protocol.Hyperstable,
        underlying_iid: `hype:${debtToken.toLowerCase()}`,
        network: 999,
        reserve_factor: 0,
        decimals: 18,
        name: `Variable Debt USH ${assetInfo.symbol}`,
        symbol: `varDebtUSH-${assetInfo.symbol}`,
        primaryColor: getRandomColorFromSeed(debtSyntheticAddress, "dark"),
        tokenCategory: "varDebt",
        url: "",
        colors: {
          light: getRandomColorFromSeed(debtSyntheticAddress, "light"),
          dark: getRandomColorFromSeed(debtSyntheticAddress, "dark"),
        },
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
    console.error("Error fetching Hyperstable allowlist:", error);
    return {
      newCollaterals: [],
      newVariableDebts: [],
    };
  }
};
