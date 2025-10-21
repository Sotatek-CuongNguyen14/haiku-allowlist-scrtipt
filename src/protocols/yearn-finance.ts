import vaults from "../resources/current-allowlist/supportedVaultContracts.json";
import newVaults from "../resources/new-allowlist/newVaultContracts.json";

import { Protocol, VaultTokenType } from "../utils/types";
import {
  getRandomColorFromSeed,
  mappingChainIdToChainName,
} from "../utils/utils";
import * as fs from "fs";

export const newYearnFinanceVaults = async (): Promise<VaultTokenType[]> => {
  try {
    const currentYearnFinanceVaults = vaults.filter(
      (vault) => vault.protocol === Protocol.YearnFinance
    ) as VaultTokenType[];

    const response = await fetch(
      "https://ydaemon.yearn.fi/vaults?hideAlways=true&orderBy=featuringScore&orderDirection=desc&strategiesDetails=withDetails&strategiesCondition=inQueue&chainIDs=1%2C10%2C137%2C146%2C250%2C8453%2C42161%2C747474&limit=2500"
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch yearn finance data: ${response.statusText}`
      );
    }

    const data = await response.json();

    const allYearnFinanceVaults: VaultTokenType[] = data
      .filter(
        (vault: any) =>
          vault.chainID in mappingChainIdToChainName && vault.tvl.tvl >= 100000
      )
      .map((vault: any) => {
        return {
          iid: `${
            mappingChainIdToChainName[vault.chainID]
          }:${vault.address.toLowerCase()}`,
          address: vault.address.toLowerCase(),
          underlying_iid: `${
            mappingChainIdToChainName[vault.chainID]
          }:${vault.token.address.toLowerCase()}`,
          decimals: vault.decimals,
          protocol: Protocol.YearnFinance,
          network: vault.chainID,
          symbol: vault.symbol,
          tokenCategory: "vault",
          color: getRandomColorFromSeed(vault.address, "dark"),
          url: `https://yearn.fi/v3/${
            vault.chainID
          }/${vault.address.toLowerCase()}`,
          name: vault.name,
          colors: {
            light: getRandomColorFromSeed(vault.address, "light"),
            dark: getRandomColorFromSeed(vault.address, "dark"),
          },
        };
      });

    console.log(
      `Found ${allYearnFinanceVaults.length} Yearn Finance vaults from API.`
    );

    const newYearnFinanceVaults = allYearnFinanceVaults.filter(
      (vault) =>
        !currentYearnFinanceVaults.some(
          (currentVault) => currentVault.iid === vault.iid
        ) &&
        !(newVaults as VaultTokenType[]).some(
          (currentVault) => currentVault.iid === vault.iid
        )
    );

    console.log(
      `Found ${newYearnFinanceVaults.length} new Yearn Finance vaults to be added.`
    );

    if (newYearnFinanceVaults.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newVaultContracts.json",
        JSON.stringify([...newVaults, ...newYearnFinanceVaults], null, 2)
      );
    }
    return newYearnFinanceVaults;
  } catch (error) {
    console.log("Error refreshing Yearn Finance vaults:", error);
    return [];
  }
};
