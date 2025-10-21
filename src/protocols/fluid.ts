import vaults from "../resources/current-allowlist/supportedVaultContracts.json";
import newVaults from "../resources/new-allowlist/newVaultContracts.json";

import { Protocol, VaultTokenType } from "../utils/types";
import {
  getRandomColorFromSeed,
  mappingChainIdToChainName,
} from "../utils/utils";
import * as fs from "fs";

export const newFluidVaults = async (): Promise<VaultTokenType[]> => {
  try {
    const currentFluidVaults = vaults.filter(
      (vault) => vault.protocol === Protocol.Fluid
    ) as VaultTokenType[];

    const ethereumFluidVaultResponse = await fetch(
      "https://api.fluid.instadapp.io/v2/lending/1/tokens"
    );
    const arbitrumFluidVaultResponse = await fetch(
      "https://api.fluid.instadapp.io/v2/lending/42161/tokens"
    );
    const baseFluidVaultResponse = await fetch(
      "https://api.fluid.instadapp.io/v2/lending/8453/tokens"
    );
    const polygonFluidVaultResponse = await fetch(
      "https://api.fluid.instadapp.io/v2/lending/137/tokens"
    );

    if (
      !ethereumFluidVaultResponse.ok ||
      !arbitrumFluidVaultResponse.ok ||
      !baseFluidVaultResponse.ok ||
      !polygonFluidVaultResponse.ok
    ) {
      throw new Error("Failed to fetch fluid vault data");
    }

    const ethereumFluidVaultDatas = (await ethereumFluidVaultResponse.json())
      .data;
    const arbitrumFluidVaultDatas = (await arbitrumFluidVaultResponse.json())
      .data;
    const baseFluidVaultDatas = (await baseFluidVaultResponse.json()).data;
    const polygonFluidVaultDatas = (await polygonFluidVaultResponse.json())
      .data;

    const allFluidVaults: VaultTokenType[] = [
      ...ethereumFluidVaultDatas.map((vault: any) => {
        return {
          iid: `${mappingChainIdToChainName[1]}:${vault.address.toLowerCase()}`,
          address: vault.address.toLowerCase(),
          underlying_iid: `${
            mappingChainIdToChainName[1]
          }:${vault.asset.address.toLowerCase()}`,
          decimals: vault.decimals,
          protocol: Protocol.Fluid,
          network: 1,
          symbol: vault.symbol,
          tokenCategory: "vault",
          color: getRandomColorFromSeed(vault.name || vault.symbol, "dark"),
          url: "https://fluid.io/lending/1",
          name: vault.name,
          colors: {
            light: getRandomColorFromSeed(vault.name || vault.symbol, "light"),
            dark: getRandomColorFromSeed(vault.name || vault.symbol, "dark"),
          },
        };
      }),
      ...arbitrumFluidVaultDatas.map((vault: any) => {
        return {
          iid: `${
            mappingChainIdToChainName[42161]
          }:${vault.address.toLowerCase()}`,
          address: vault.address.toLowerCase(),
          underlying_iid: `${
            mappingChainIdToChainName[42161]
          }:${vault.asset.address.toLowerCase()}`,
          decimals: vault.decimals,
          protocol: Protocol.Fluid,
          network: 42161,
          symbol: vault.symbol,
          tokenCategory: "vault",
          color: getRandomColorFromSeed(vault.name || vault.symbol, "dark"),
          url: "https://fluid.io/lending/42161",
          name: vault.name,
          colors: {
            light: getRandomColorFromSeed(vault.name || vault.symbol, "light"),
            dark: getRandomColorFromSeed(vault.name || vault.symbol, "dark"),
          },
        };
      }),
      ...baseFluidVaultDatas.map((vault: any) => {
        return {
          iid: `${
            mappingChainIdToChainName[8453]
          }:${vault.address.toLowerCase()}`,
          address: vault.address.toLowerCase(),
          underlying_iid: `${
            mappingChainIdToChainName[8453]
          }:${vault.asset.address.toLowerCase()}`,
          decimals: vault.decimals,
          protocol: Protocol.Fluid,
          network: 8453,
          symbol: vault.symbol,
          tokenCategory: "vault",
          color: getRandomColorFromSeed(vault.name || vault.symbol, "dark"),
          url: "https://fluid.io/lending/8453",
          name: vault.name,
          colors: {
            light: getRandomColorFromSeed(vault.name || vault.symbol, "light"),
            dark: getRandomColorFromSeed(vault.name || vault.symbol, "dark"),
          },
        };
      }),
      ...polygonFluidVaultDatas.map((vault: any) => {
        return {
          iid: `${
            mappingChainIdToChainName[137]
          }:${vault.address.toLowerCase()}`,
          address: vault.address.toLowerCase(),
          underlying_iid: `${
            mappingChainIdToChainName[137]
          }:${vault.asset.address.toLowerCase()}`,
          decimals: vault.decimals,
          protocol: Protocol.Fluid,
          network: 137,
          symbol: vault.symbol,
          tokenCategory: "vault",
          color: getRandomColorFromSeed(vault.name || vault.symbol, "dark"),
          url: "https://fluid.io/lending/137",
          name: vault.name,
          colors: {
            light: getRandomColorFromSeed(vault.name || vault.symbol, "light"),
            dark: getRandomColorFromSeed(vault.name || vault.symbol, "dark"),
          },
        };
      }),
    ];

    console.log(`Found ${allFluidVaults.length} Fluid vaults from API.`);

    const newFluidVaults = allFluidVaults.filter(
      (vault) =>
        !currentFluidVaults.some(
          (currentVault) => currentVault.iid === vault.iid
        ) &&
        !(newVaults as VaultTokenType[]).some(
          (currentVault) => currentVault.iid === vault.iid
        )
    );

    console.log(`Found ${newFluidVaults.length} new Fluid vaults to be added.`);
    if (newFluidVaults.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newVaultContracts.json",
        JSON.stringify([...currentFluidVaults, ...newFluidVaults], null, 2)
      );
    }
    return newFluidVaults;
  } catch (error) {
    console.log("Error refreshing Fluid vaults:", error);
    return [];
  }
};
