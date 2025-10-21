import vaults from "../resources/current-allowlist/supportedVaultContracts.json";
import newVaults from "../resources/new-allowlist/newVaultContracts.json";

import { Protocol, VaultTokenType } from "../utils/types";
import {
  getRandomColorFromSeed,
  getTokenDetails,
  mappingChainIdToChainName,
} from "../utils/utils";
import * as fs from "fs";

export const newBeraborrowVaults = async (): Promise<VaultTokenType[]> => {
  try {
    const currentBeraborrowVaults = vaults.filter(
      (vault) => vault.protocol === Protocol.BeraBorrow
    ) as VaultTokenType[];

    const response = await fetch("https://api.beraborrow.com/v1/vaults", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Beraborrow data: ${response.statusText}`
      );
    }

    const beraborrowVaultDatas = await response.json();
    const allVaultAddresses = beraborrowVaultDatas.map((vault: any) =>
      vault.vaultAddress.toLowerCase()
    );

    const allVaultTokens = await getTokenDetails(80094, allVaultAddresses);

    const allBeraborrowVaults: VaultTokenType[] = beraborrowVaultDatas
      .filter((vault: any) => {
        return Number(vault.tvl) >= 10000;
      })
      .map((vault: any) => {
        const vaultTokenInfo = allVaultTokens.find(
          (token) =>
            token.address.toLowerCase() === vault.vaultAddress.toLowerCase()
        );
        return {
          iid: `${
            mappingChainIdToChainName[80094]
          }:${vault.vaultAddress.toLowerCase()}`,
          address: vault.vaultAddress.toLowerCase(),
          underlying_iid: `${
            mappingChainIdToChainName[80094]
          }:${vault.tokenAddress.toLowerCase()}`,
          decimals: vaultTokenInfo ? vaultTokenInfo.decimals : 18,
          protocol: Protocol.BeraBorrow,
          network: 80094,
          symbol: `BB-${vaultTokenInfo ? vaultTokenInfo.symbol : ""}`.replace(
            " ",
            "-"
          ),
          tokenCategory: "vault",
          color: getRandomColorFromSeed(vault.vaultAddress, "dark"),
          url: vault.mintUrl,
          name: vaultTokenInfo.name || "",
          colors: {
            light: getRandomColorFromSeed(vault.vaultAddress, "light"),
            dark: getRandomColorFromSeed(vault.vaultAddress, "dark"),
          },
        };
      });

    console.log(
      `Found ${allBeraborrowVaults.length} Beraborrow vaults from API.`
    );
    
    const newBeraborrowVaults = allBeraborrowVaults.filter(
      (vault) =>
        !currentBeraborrowVaults.some(
          (currentVault) => currentVault.iid === vault.iid
        ) &&
        !(newVaults as VaultTokenType[]).some(
          (currentVault) => currentVault.iid === vault.iid
        )
    );
    console.log(
      `Found ${newBeraborrowVaults.length} new Beraborrow vaults to be added.`
    );
    
    if (newBeraborrowVaults.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newVaultContracts.json",
        JSON.stringify([...newVaults, ...newBeraborrowVaults], null, 2)
      );
    }
    return newBeraborrowVaults;
  } catch (error) {
    console.error("Error fetching Beraborrow vaults:", error);
    return [];
  }
};
