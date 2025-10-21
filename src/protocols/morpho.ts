import vaults from "../resources/current-allowlist/supportedVaultContracts.json";
import newVaults from "../resources/new-allowlist/newVaultContracts.json";
import { Protocol, VaultTokenType } from "../utils/types";
import {
  getRandomColorFromSeed,
  mappingChainIdToChainName,
  mappingChainIdToMorpho,
} from "../utils/utils";
import * as fs from "fs";

export const newMorphoVaults = async (): Promise<VaultTokenType[]> => {
  try {
    const currentMorphoVaults = vaults.filter(
      (vault) => vault.protocol === Protocol.Morpho
    ) as VaultTokenType[];

    // Hyperbeat Morpho
    const hyperbeatMorphoResponse = await fetch(
      "https://app.hyperbeat.org/api/whisk/vault-summaries",
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          baggage:
            "sentry-environment=vercel-production,sentry-release=1ea12d3b5c0e822761f9b52a864cdfdfc9eff2eb,sentry-public_key=eb1371e0a43297cad3ed717dff65fdc2,sentry-trace_id=bf3a9f874e72f8f5f09d36034b8edbea,sentry-org_id=4510069620342784,sentry-transaction=GET%20%2Fdapp%2Fmorphobeat,sentry-sampled=true,sentry-sample_rand=0.742245914910004,sentry-sample_rate=1",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Brave";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "sentry-trace": "bf3a9f874e72f8f5f09d36034b8edbea-8db834478632e522-1",
          cookie:
            "_dd_s=logs=1&id=d6cd7df0-acbf-4719-abab-4504227135e9&created=1761018145602&expire=1761019068688",
          Referer: "https://app.hyperbeat.org/morphobeat",
        },
        body: null,
        method: "GET",
      }
    );

    if (!hyperbeatMorphoResponse.ok) {
      throw new Error(
        `Failed to fetch Morpho data from Hyperbeat: ${hyperbeatMorphoResponse.statusText}`
      );
    }

    const hyperbeatMorphoDatas = await hyperbeatMorphoResponse.json();
    const hyperbeatVaults: VaultTokenType[] = hyperbeatMorphoDatas
      .filter((vault: any) => {
        return (
          vault.chain.id in
            Object.keys(mappingChainIdToChainName).map(Number) &&
          Number(vault.totalLiquidity.usd) >= 10000
        );
      })
      .map((vault: any) => {
        return {
          iid: `${
            mappingChainIdToChainName[vault.chain.id]
          }:${vault.vaultAddress.toLowerCase()}`,
          address: vault.vaultAddress.toLowerCase(),
          underlying_iid: `${
            mappingChainIdToChainName[vault.chain.id]
          }:${vault.asset.address.toLowerCase()}`,
          decimals: 18,
          protocol: Protocol.Morpho,
          network: vault.chain.id,
          symbol: `MORPHO-${vault.asset.symbol}`,
          tokenCategory: "vault",
          color: getRandomColorFromSeed(vault.vaultAddress, "dark"),
          url: `https://app.hyperbeat.org/dapp/morphobeat/vault/${vault.vaultAddress.toLowerCase()}`,
          name: vault.name,
          colors: {
            light: getRandomColorFromSeed(vault.vaultAddress, "light"),
            dark: getRandomColorFromSeed(vault.vaultAddress, "dark"),
          },
        };
      });
    // Morpho
    const morphoResponse = await fetch("https://api.morpho.org/graphql", {
      method: "POST",
      body: JSON.stringify({
        query:
          "query {\n  vaults(first: 1000, where: { chainId_in: [1, 42161, 8453, 747474, 137, 130], whitelisted: true }) {\n    items {\n      address\n      symbol\n      name\n      whitelisted\n      asset {\n        id\n        address\n        decimals\n      }\n      chain {\n        id\n        network\n      }\n      state {\n        totalAssetsUsd\n      }\n    }\n  }\n}",
        variables: {},
      }),
    });

    if (!morphoResponse.ok) {
      throw new Error(
        `Failed to fetch Morpho data: ${morphoResponse.statusText}`
      );
    }

    const morphoDatas = (await morphoResponse.json()).data.vaults.items;
    const morphoVaults: VaultTokenType[] = morphoDatas
      .filter((vault: any) => {
        return (
          vault.chain.id in
            Object.keys(mappingChainIdToChainName).map(Number) &&
          vault.whitelisted === true &&
          vault.state.totalAssetsUsd >= 10000
        );
      })
      .map((vault: any) => {
        return {
          iid: `${
            mappingChainIdToChainName[vault.chain.id]
          }:${vault.address.toLowerCase()}`,
          address: vault.address.toLowerCase(),
          underlying_iid: `${
            mappingChainIdToChainName[vault.chain.id]
          }:${vault.asset.address.toLowerCase()}`,
          decimals: vault.asset.decimals,
          protocol: Protocol.Morpho,
          network: vault.chain.id,
          symbol: vault.symbol,
          tokenCategory: "vault",
          color: getRandomColorFromSeed(vault.address, "dark"),
          url: `https://app.morpho.org/${
            mappingChainIdToMorpho[vault.chain.id]
          }/vault/${vault.address.toLowerCase()}`,
          name: vault.name,
          colors: {
            light: getRandomColorFromSeed(vault.address, "light"),
            dark: getRandomColorFromSeed(vault.address, "dark"),
          },
        };
      });
    // Blockanalitica Morpho
    const blockanaliticaBaseResponse = await fetch(
      "https://morpho-api.blockanalitica.com/vaults/?days_ago=30&network=base&order=-total_supply_usd&p=1&p_size=500",
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.6",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Brave";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "sec-gpc": "1",
          Referer: "https://morpho.blockanalitica.com/",
        },
        body: null,
        method: "GET",
      }
    );
    if (!blockanaliticaBaseResponse.ok) {
      throw new Error(
        `Failed to fetch Morpho vaults: ${blockanaliticaBaseResponse.statusText}`
      );
    }
    const blockanaliticaBaseDatas = (await blockanaliticaBaseResponse.json())
      .results;

    const blockanaliticaBaseVaults: VaultTokenType[] = blockanaliticaBaseDatas
      .filter((vault: any) => {
        return Number(vault.tvl) >= 10000;
      })
      .map((vault: any) => {
        return {
          iid: `${
            mappingChainIdToChainName[8453]
          }:${vault.address.toLowerCase()}`,
          address: vault.address.toLowerCase(),
          underlying_iid: `${
            mappingChainIdToChainName[8453]
          }:${vault.asset.toLowerCase()}`,
          decimals: 18,
          protocol: Protocol.Morpho,
          network: 8453,
          symbol: vault.symbol,
          tokenCategory: "vault",
          color: getRandomColorFromSeed(vault.address, "dark"),
          url: `https://morpho.blockanalitica.com/base/vaults/vaults/${vault.address}`,
          name: vault.name,
          colors: {
            light: getRandomColorFromSeed(vault.address, "light"),
            dark: getRandomColorFromSeed(vault.address, "dark"),
          },
        };
      });

    const blockanaliticaEthereumResponse = await fetch(
      "https://morpho-api.blockanalitica.com/vaults/?days_ago=30&network=ethereum&order=-total_supply_usd&p=1&p_size=500",
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.6",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Brave";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "sec-gpc": "1",
          Referer: "https://morpho.blockanalitica.com/",
        },
        body: null,
        method: "GET",
      }
    );
    if (!blockanaliticaEthereumResponse.ok) {
      throw new Error(
        `Failed to fetch Morpho vaults: ${blockanaliticaEthereumResponse.statusText}`
      );
    }
    const blockanaliticaEthereumDatas = (
      await blockanaliticaEthereumResponse.json()
    ).results;

    const blockanaliticaEthereumVaults: VaultTokenType[] =
      blockanaliticaEthereumDatas
        .filter((vault: any) => {
          return Number(vault.tvl) >= 10000;
        })
        .map((vault: any) => {
          return {
            iid: `${
              mappingChainIdToChainName[1]
            }:${vault.address.toLowerCase()}`,
            address: vault.address.toLowerCase(),
            underlying_iid: `${
              mappingChainIdToChainName[1]
            }:${vault.asset.toLowerCase()}`,
            decimals: 18,
            protocol: Protocol.Morpho,
            network: 1,
            symbol: vault.symbol,
            tokenCategory: "vault",
            color: getRandomColorFromSeed(vault.address, "dark"),
            url: `https://morpho.blockanalitica.com/ethereum/vaults/vaults/${vault.address}`,
            name: vault.name,
            colors: {
              light: getRandomColorFromSeed(vault.address, "light"),
              dark: getRandomColorFromSeed(vault.address, "dark"),
            },
          };
        });

    const allMorphoVaults: VaultTokenType[] = [
      ...hyperbeatVaults,
      ...morphoVaults,
      ...blockanaliticaBaseVaults,
      ...blockanaliticaEthereumVaults,
    ];

    console.log(`Found ${allMorphoVaults.length} Morpho vaults from APIs.`);

    const newMorphoVaults = allMorphoVaults.filter(
      (vault) =>
        !currentMorphoVaults.some(
          (currentVault) => currentVault.iid === vault.iid
        ) &&
        !(newVaults as VaultTokenType[]).some(
          (currentVault) => currentVault.iid === vault.iid
        )
    );

    console.log(
      `Found ${newMorphoVaults.length} new Morpho vaults to be added.`
    );

    if (newMorphoVaults.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newVaultContracts.json",
        JSON.stringify([...newVaults, ...newMorphoVaults], null, 2)
      );
    }
    return newMorphoVaults;
  } catch (error) {
    console.error("Error fetching Morpho vaults:", error);
    return [];
  }
};
