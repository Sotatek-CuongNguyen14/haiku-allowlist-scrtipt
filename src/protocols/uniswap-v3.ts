import concentratedPools from "../resources/current-allowlist/supportedConcentratedLiquidityContracts.json";
import newConcentratedPools from "../resources/new-allowlist/newConcentratedLiquidityContracts.json";

import { ConcentratedPoolTokenType, Protocol } from "../utils/types";
import {
  getRandomColorFromSeed,
  mappingChainIdToChainName,
  mappingChainIdToCoingeckoDex,
  mappingChainIdToCoingeckoNetworkId,
  mappingChainIdToUniswapV3,
} from "../utils/utils";
import * as fs from "fs";

const COINGECKO_API_KEY = "CG-rYNyhB9AGULPmervFtUd9vYJ";

function getLastWord(str: string): string {
  const lastSpace = str.lastIndexOf(" ");
  return lastSpace === -1 ? str : str.slice(lastSpace + 1);
}

const pools = async (chainId: number): Promise<ConcentratedPoolTokenType[]> => {
  try {
    const datas: any[] = [];
    const included: any[] = [];

    const options = {
      method: "GET",
      headers: { "x-cg-demo-api-key": COINGECKO_API_KEY },
    };

    const baseUrl = `https://api.coingecko.com/api/v3/onchain/networks/${mappingChainIdToCoingeckoNetworkId[chainId]}/dexes/${mappingChainIdToCoingeckoDex[chainId]}/pools?include=base_token%2C%20quote_token&page=`;

    const responses = await Promise.all(
      Array.from({ length: 5 }, (_, i) => {
        return fetch(baseUrl + (i + 1), options).then((r) => r.json());
      })
    );

    for (const res of responses) {
      if (res?.data) datas.push(...res.data);
      if (res?.included) included.push(...res.included);
    }

    return datas.map((pool) => {
      const feeTierStr = getLastWord(pool.attributes.name);
      const feeTier = parseFloat(feeTierStr.replace("%", ""));

      const seed = pool.attributes.address || pool.attributes.name;
      const lightColor = getRandomColorFromSeed(seed, "light");
      const darkColor = getRandomColorFromSeed(seed, "dark");

      return {
        iid: `${
          mappingChainIdToChainName[chainId]
        }:${pool.attributes.address.toLowerCase()}`,
        symbol: `${pool.attributes.name.replace(" / ", "-").replace(" ", "-")}`,
        address: pool.attributes.address.toLowerCase(),
        protocol: Protocol.UniswapV3,
        underlying_iids: [
          `${
            mappingChainIdToChainName[chainId]
          }:${pool.relationships.base_token.data.id
            .split("_")[1]
            .toLowerCase()}`,
          `${
            mappingChainIdToChainName[chainId]
          }:${pool.relationships.quote_token.data.id
            .split("_")[1]
            .toLowerCase()}`,
        ],
        feeTier: feeTier,
        network: chainId,
        decimals: 18,
        poolId: pool.attributes.address.toLowerCase(),
        tokenCategory: "concentratedLiquidity",
        primaryColor: darkColor,
        url: `https://app.uniswap.org/explore/pools/${
          mappingChainIdToUniswapV3[chainId]
        }/${pool.attributes.address.toLowerCase()}`,
        name: pool.attributes.name,
        colors: {
          light: lightColor,
          dark: darkColor,
        },
      };
    });
  } catch (error) {
    console.error(`Error fetching pools for chainId ${chainId}:`, error);
    return [];
  }
};

export const newUniswapV3ConcentratedPools = async (): Promise<
  ConcentratedPoolTokenType[]
> => {
  try {
    const currentUniswapV3ConcentratedPools = concentratedPools.filter(
      (vault) => vault.protocol === Protocol.UniswapV3
    ) as ConcentratedPoolTokenType[];

    const etherscan = await pools(1);
    console.log(`Etherscan pools: ${etherscan.length}`);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const arbitrum = await pools(42161);
    console.log(`Arbitrum pools: ${arbitrum.length}`);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const polygon = await pools(137);
    console.log(`Polygon pools: ${polygon.length}`);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const optimism = await pools(10);
    console.log(`Optimism pools: ${optimism.length}`);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const bsc = await pools(56);
    console.log(`BSC pools: ${bsc.length}`);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const avax = await pools(43114);
    console.log(`Avax pools: ${avax.length}`);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const base = await pools(8453);
    console.log(`Base pools: ${base.length}`);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const unichain = await pools(130);
    console.log(`Unichain pools: ${unichain.length}`);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const worldchain = await pools(480);
    console.log(`Worldchain pools: ${worldchain.length}`);

    const allUniswapV3Pools = Array.from(
      new Map(
        [
          ...etherscan,
          ...arbitrum,
          ...polygon,
          ...optimism,
          ...bsc,
          ...avax,
          ...base,
          ...unichain,
          ...worldchain,
        ].map((item) => [item.iid, item])
      ).values()
    );

    console.log("Total unique Uniswap v3 pools:", allUniswapV3Pools.length);

    const newUniswapV3Pools = allUniswapV3Pools.filter(
      (pool) =>
        !currentUniswapV3ConcentratedPools.some(
          (existingPool) => existingPool.iid === pool.iid
        ) &&
        !newConcentratedPools.some(
          (existingPool) => existingPool.iid === pool.iid
        )
    );

    console.log("New Uniswap v3 pools found:", newUniswapV3Pools.length);

    if (newUniswapV3Pools.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newConcentratedLiquidityContracts.json",
        JSON.stringify([...newConcentratedPools, ...newUniswapV3Pools], null, 2)
      );
    }

    return newUniswapV3Pools;
  } catch (error) {
    console.error("Error fetching Uniswap v3 pools:", error);
    return [];
  }
};
