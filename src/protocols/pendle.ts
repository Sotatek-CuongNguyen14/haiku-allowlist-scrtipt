import weightedPools from "../resources/current-allowlist/supportedWeightedLiquidityContracts.json";
import newWeightedPools from "../resources/new-allowlist/newWeightedLiquidityContracts.json";

import tokens from "../resources/current-allowlist/supportedTokenContracts.json";
import newTokens from "../resources/new-allowlist/newTokenContracts.json";

import { Protocol, TokenType, WeightedPoolTokenType } from "../utils/types";
import {
  getRandomColorFromSeed,
  getTokenDetails,
  mappingChainIdToChainName,
  pendleFormatDate,
} from "../utils/utils";
import * as fs from "fs";

export const newPendleWeightedPools = async (): Promise<
  WeightedPoolTokenType[]
> => {
  try {
    const currentPendleWeightedPools = weightedPools.filter(
      (vault) => vault.protocol === Protocol.Pendle
    ) as WeightedPoolTokenType[];

    const pendleTokens: TokenType[] = [];
    const allPendleWeightedPools: WeightedPoolTokenType[] = [];

    const supportedChains = [80094, 1, 8453, 42161, 999, 10, 146, 56];

    for (const chain of supportedChains) {
      const pendleMarkets = await fetch(
        `https://api-v2.pendle.finance/core/v1/${chain}/markets/active`
      );
      const pendleMetadata = await fetch(
        `https://api-v2.pendle.finance/core/v3/${chain}/assets/all`
      );
      const pendleMetadataData: any = await pendleMetadata.json();
      const mappingLogo = pendleMetadataData.assets.reduce((acc, asset) => {
        acc[asset.address] = asset.proIcon;
        return acc;
      }, {} as Record<string, string>);
      const data: any = await pendleMarkets.json();
      // Generate both PT tokens and pendle LP pool
      // PT tokens

      for (const market of data.markets) {
        const ptAddress = market.pt.split("-")[1].toLowerCase();
        const syAddress = market.sy.split("-")[1].toLowerCase();
        const ytAddress = market.yt.split("-")[1].toLowerCase();
        const underlyingTokenAddress = market.underlyingAsset
          .split("-")[1]
          .toLowerCase();

        const [ptToken, syToken, ytToken, lpToken] = await getTokenDetails(
          chain,
          [ptAddress, syAddress, ytAddress, market.address.toLowerCase()]
        );
        pendleTokens.push({
          iid: `${mappingChainIdToChainName[chain]}:${ptAddress}`,
          address: ptAddress,
          symbol: ptToken?.symbol,
          network: chain,
          decimals: ptToken?.decimals,
          tokenCategory: "token",
          primaryColor: getRandomColorFromSeed(ptAddress, "dark"),
          name: ptToken?.name,
          url: `https://app.pendle.finance/trade/markets/${market.address.toLowerCase()}/swap?view=pt`,
          logoURI: mappingLogo[ptAddress],
          marketId: market.address.toLowerCase(),
          underlying_iid: `${mappingChainIdToChainName[chain]}:${underlyingTokenAddress}`,
          colors: {
            light: getRandomColorFromSeed(ptAddress, "light"),
            dark: getRandomColorFromSeed(ptAddress, "dark"),
          },
        });

        pendleTokens.push({
          iid: `${mappingChainIdToChainName[chain]}:${syAddress}`,
          address: syAddress,
          symbol: syToken?.symbol,
          network: chain,
          decimals: syToken?.decimals,
          tokenCategory: "token",
          primaryColor: getRandomColorFromSeed(syAddress, "dark"),
          name: syToken?.name,
          url: ``,
          logoURI: mappingLogo[syAddress],
          marketId: market.address.toLowerCase(),
          underlying_iid: `${mappingChainIdToChainName[chain]}:${underlyingTokenAddress}`,
          colors: {
            light: getRandomColorFromSeed(syAddress, "light"),
            dark: getRandomColorFromSeed(syAddress, "dark"),
          },
        });

        pendleTokens.push({
          iid: `${mappingChainIdToChainName[chain]}:${ytAddress}`,
          address: ytAddress,
          symbol: ytToken?.symbol,
          network: chain,
          decimals: ytToken?.decimals,
          tokenCategory: "token",
          primaryColor: getRandomColorFromSeed(ytAddress, "dark"),
          name: ytToken?.name,
          url: `https://app.pendle.finance/trade/markets/${market.address.toLowerCase()}/swap?view=yt`,
          logoURI: mappingLogo[ytAddress],
          marketId: market.address.toLowerCase(),
          underlying_iid: `${mappingChainIdToChainName[chain]}:${underlyingTokenAddress}`,
          colors: {
            light: getRandomColorFromSeed(ytAddress, "light"),
            dark: getRandomColorFromSeed(ytAddress, "dark"),
          },
        });

        allPendleWeightedPools.push({
          iid: `${
            mappingChainIdToChainName[chain]
          }:${market.address.toLowerCase()}`,
          symbol: lpToken?.symbol,
          name:
            "Pendle " +
            market.name +
            " " +
            (market.expiry ? "(" + pendleFormatDate(market.expiry) + ")" : ""),
          address: market.address.toLowerCase(),
          protocol: Protocol.Pendle,
          underlying_iids: [
            `${mappingChainIdToChainName[chain]}:${syAddress}`,
            `${mappingChainIdToChainName[chain]}:${ptAddress}`,
          ],
          weights: [0.5, 0.5],
          network: chain,
          decimals: lpToken?.decimals,
          poolId: market.address.toLowerCase(),
          tokenCategory: "weightedLiquidity",
          primaryColor: getRandomColorFromSeed(ytAddress, "dark"),
          colors: {
            light: getRandomColorFromSeed(ytAddress, "light"),
            dark: getRandomColorFromSeed(ytAddress, "dark"),
          },
          url: `https://app.pendle.finance/trade/pools?search=${market.address.toLowerCase()}`,
        });
      }
    }

    console.log(
      `Found ${allPendleWeightedPools.length} Pendle weighted pools.`
    );

    const newPendleWeightedPools = allPendleWeightedPools.filter(
      (pool) =>
        !currentPendleWeightedPools.some(
          (existingPool: any) => existingPool.iid === pool.iid
        ) && !newWeightedPools.some((newPool: any) => newPool.iid === pool.iid)
    );

    const newPendleTokens = pendleTokens.filter(
      (token) =>
        !(tokens as any[]).some(
          (existingToken: any) => existingToken.iid === token.iid
        ) && !newTokens.some((newToken: any) => newToken.iid === token.iid)
    );

    console.log(
      `Found ${newPendleWeightedPools.length} new Pendle weighted pools.`
    );

    console.log(`Found ${newPendleTokens.length} new Pendle tokens.`);

    if (newPendleTokens.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newTokenContracts.json",
        JSON.stringify([...newTokens, ...newPendleTokens], null, 2)
      );
    }

    if (newPendleWeightedPools.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newWeightedLiquidityContracts.json",
        JSON.stringify(
          [...newWeightedPools, ...newPendleWeightedPools],
          null,
          2
        )
      );
    }

    return newPendleWeightedPools;
  } catch (error) {
    console.error("Error fetching Pendle weighted pools:", error);
    return [];
  }
};
