import weightedPools from "../resources/current-allowlist/supportedWeightedLiquidityContracts.json";
import newWeightedPools from "../resources/new-allowlist/newWeightedLiquidityContracts.json";

import { Protocol, WeightedPoolTokenType } from "../utils/types";
import { getRandomColorFromSeed } from "../utils/utils";
import * as fs from "fs";

const UNISWAP_KEY = "da8ac089c158b48838d1f2b5027d7fe5";

const UNI_SUPGRAPH_MAINNET_URL = `https://gateway.thegraph.com/api/${UNISWAP_KEY}/subgraphs/id/A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum`;
const UNI_SUPGRAPH_ARBITRUM_URL = `https://gateway.thegraph.com/api/${UNISWAP_KEY}/subgraphs/id/CStW6CSQbHoXsgKuVCrk3uShGA4JX3CAzzv2x9zaGf8w`;
const UNI_SUPGRAPH_BASE_URL = `https://gateway.thegraph.com/api/${UNISWAP_KEY}/subgraphs/id/4jGhpKjW4prWoyt5Bwk1ZHUwdEmNWveJcjEyjoTZWCY9`;
const UNI_SUPGRAPH_BSC_URL = `https://gateway.thegraph.com/api/${UNISWAP_KEY}/subgraphs/id/8EjCaWZumyAfN3wyB4QnibeeXaYS8i4sp1PiWT91AGrt`;
const GRAPQL_QUERY = JSON.stringify({
  query:
    'query GetTopPools($first: Int!, $skip: Int!) {\n    pairs(\n      first: $first\n      skip: $skip\n      orderBy: reserveUSD\n      orderDirection: desc\n      where: {\n        reserveUSD_gt: "1000",\n        volumeUSD_not: "0"\n      }\n    ) {\n      id\n      token0 {\n        id\n        symbol\n        name\n        decimals\n      }\n      token1 {\n        id\n        symbol\n        name\n        decimals\n      }\n      reserve0\n      reserve1\n      token0Price\n      token1Price\n      reserveUSD\n      volumeUSD\n      untrackedVolumeUSD\n      txCount\n      createdAtTimestamp\n      createdAtBlockNumber\n      liquidityProviderCount\n    }\n  }',
  variables: { first: 100, skip: 0 },
});
export const newUniswapV2WeightedPools = async (): Promise<
  WeightedPoolTokenType[]
> => {
  try {
    const currentUniswapV2WeightedPools = weightedPools.filter(
      (vault) => vault.protocol === Protocol.UniswapV2
    ) as WeightedPoolTokenType[];

    const mainnetResponse = await fetch(UNI_SUPGRAPH_MAINNET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: GRAPQL_QUERY,
    });

    if (!mainnetResponse.ok) {
      throw new Error(
        `Network response was not ok: ${mainnetResponse.statusText}`
      );
    }

    const mainnetDatas = (await mainnetResponse.json()).data.pairs;

    const arbitrumResponse = await fetch(UNI_SUPGRAPH_ARBITRUM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: GRAPQL_QUERY,
    });
    if (!arbitrumResponse.ok) {
      throw new Error(
        `Network response was not ok: ${arbitrumResponse.statusText}`
      );
    }
    const arbitrumDatas = (await arbitrumResponse.json()).data.pairs;

    const baseResponse = await fetch(UNI_SUPGRAPH_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: GRAPQL_QUERY,
    });
    if (!baseResponse.ok) {
      throw new Error(
        `Network response was not ok: ${baseResponse.statusText}`
      );
    }
    const baseDatas = (await baseResponse.json()).data.pairs;

    const bscResponse = await fetch(UNI_SUPGRAPH_BSC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: GRAPQL_QUERY,
    });
    if (!bscResponse.ok) {
      throw new Error(`Network response was not ok: ${bscResponse.statusText}`);
    }
    const bscDatas = (await bscResponse.json()).data.pairs;

    const allUniswapV2WeightedPools: WeightedPoolTokenType[] = [];

    mainnetDatas.forEach(
      (pair: {
        id: string;
        token0: { symbol: any; id: string };
        token1: { symbol: any; id: string };
      }) => {
        allUniswapV2WeightedPools.push({
          iid: `eth:${pair.id.toLowerCase()}`,
          address: pair.id.toLowerCase(),
          symbol: `${pair.token0.symbol}-${pair.token1.symbol}`,
          protocol: Protocol.UniswapV2,
          underlying_iids: [
            `eth:${pair.token0.id.toLowerCase()}`,
            `eth:${pair.token1.id.toLowerCase()}`,
          ],
          weights: [0, 0],
          network: 1,
          decimals: 18,
          poolId: pair.id.toLowerCase(),
          tokenCategory: "weightedLiquidity",
          url: `https://app.uniswap.org/explore/pools/ethereum/${pair.id.toLowerCase()}`,
          name: `${pair.token0.symbol}-${pair.token1.symbol}`,
          primaryColor: getRandomColorFromSeed(pair.id.toLowerCase(), "dark"),
          colors: {
            light: getRandomColorFromSeed(pair.id.toLowerCase(), "light"),
            dark: getRandomColorFromSeed(pair.id.toLowerCase(), "dark"),
          },
        });
      }
    );

    arbitrumDatas.forEach(
      (pair: {
        id: string;
        token0: { symbol: any; id: string };
        token1: { symbol: any; id: string };
      }) => {
        allUniswapV2WeightedPools.push({
          iid: `arb:${pair.id.toLowerCase()}`,
          symbol: `${pair.token0.symbol}-${pair.token1.symbol}`,
          address: pair.id.toLowerCase(),
          protocol: Protocol.UniswapV2,
          underlying_iids: [
            `arb:${pair.token0.id.toLowerCase()}`,
            `arb:${pair.token1.id.toLowerCase()}`,
          ],
          weights: [0, 0],
          network: 42161,
          decimals: 18,
          poolId: pair.id.toLowerCase(),
          tokenCategory: "weightedLiquidity",
          url: `https://app.uniswap.org/explore/pools/arbitrum/${pair.id.toLowerCase()}`,
          name: `${pair.token0.symbol}-${pair.token1.symbol}`,
          primaryColor: getRandomColorFromSeed(pair.id.toLowerCase(), "dark"),
          colors: {
            light: getRandomColorFromSeed(pair.id.toLowerCase(), "light"),
            dark: getRandomColorFromSeed(pair.id.toLowerCase(), "dark"),
          },
        });
      }
    );

    baseDatas.forEach(
      (pair: {
        id: string;
        token0: { symbol: any; id: string };
        token1: { symbol: any; id: string };
      }) => {
        allUniswapV2WeightedPools.push({
          iid: `base:${pair.id.toLowerCase()}`,
          symbol: `${pair.token0.symbol}-${pair.token1.symbol}`,
          address: pair.id.toLowerCase(),
          protocol: Protocol.UniswapV2,
          underlying_iids: [
            `base:${pair.token0.id.toLowerCase()}`,
            `base:${pair.token1.id.toLowerCase()}`,
          ],
          weights: [0, 0],
          network: 8453,
          decimals: 18,
          poolId: pair.id.toLowerCase(),
          tokenCategory: "weightedLiquidity",
          url: `https://app.uniswap.org/explore/pools/base/${pair.id.toLowerCase()}`,
          name: `${pair.token0.symbol}-${pair.token1.symbol}`,
          primaryColor: getRandomColorFromSeed(pair.id.toLowerCase(), "dark"),
          colors: {
            light: getRandomColorFromSeed(pair.id.toLowerCase(), "light"),
            dark: getRandomColorFromSeed(pair.id.toLowerCase(), "dark"),
          },
        });
      }
    );

    bscDatas.forEach(
      (pair: {
        id: string;
        token0: { symbol: any; id: string };
        token1: { symbol: any; id: string };
      }) => {
        allUniswapV2WeightedPools.push({
          iid: `bsc:${pair.id.toLowerCase()}`,
          symbol: `${pair.token0.symbol}-${pair.token1.symbol}`,
          address: pair.id.toLowerCase(),
          protocol: Protocol.UniswapV2,
          underlying_iids: [
            `bsc:${pair.token0.id.toLowerCase()}`,
            `bsc:${pair.token1.id.toLowerCase()}`,
          ],
          weights: [0, 0],
          network: 56,
          decimals: 18,
          poolId: pair.id.toLowerCase(),
          tokenCategory: "weightedLiquidity",
          url: `https://app.uniswap.org/explore/pools/bnb/${pair.id.toLowerCase()}`,
          name: `${pair.token0.symbol}-${pair.token1.symbol}`,
          primaryColor: getRandomColorFromSeed(pair.id.toLowerCase(), "dark"),
          colors: {
            light: getRandomColorFromSeed(pair.id.toLowerCase(), "light"),
            dark: getRandomColorFromSeed(pair.id.toLowerCase(), "dark"),
          },
        });
      }
    );

    console.log(
      `Found ${allUniswapV2WeightedPools.length} Uniswap V2 weighted pools.`
    );

    const newUniswapV2WeightedPools = allUniswapV2WeightedPools.filter(
      (pool) =>
        !currentUniswapV2WeightedPools.some(
          (existingPool: any) => existingPool.iid === pool.iid
        ) && !newWeightedPools.some((newPool: any) => newPool.iid === pool.iid)
    );

    console.log(
      `Found ${newUniswapV2WeightedPools.length} new Uniswap V2 weighted pools.`
    );

    if (newUniswapV2WeightedPools.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newWeightedLiquidityContracts.json",
        JSON.stringify(
          [...newWeightedPools, ...newUniswapV2WeightedPools],
          null,
          2
        )
      );
    }
    return newUniswapV2WeightedPools;
  } catch (error) {
    console.error("Error fetching Uniswap V2 weighted pools:", error);
    return [];
  }
};
