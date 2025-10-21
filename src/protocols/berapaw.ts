import vaults from "../resources/current-allowlist/supportedVaultContracts.json";
import newVaults from "../resources/new-allowlist/newVaultContracts.json";

import { Protocol, VaultTokenType } from "../utils/types";
import {
  berapawEncodeSyntheticAddress,
  getRandomColorFromSeed,
  getTokenDetails,
  mappingChainIdToChainName,
} from "../utils/utils";
import * as fs from "fs";

export const newBeraPawVaults = async (): Promise<VaultTokenType[]> => {
  try {
    const currentBeraPawVaults = vaults.filter(
      (vault) => vault.protocol === Protocol.BeraPaw
    ) as VaultTokenType[];

    const response = await fetch("https://api.berachain.com/", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.6",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "sec-gpc": "1",
      },
      referrer: "https://www.berapaw.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: '{"operationName":"GetVaults","variables":{"orderBy":"apr","orderDirection":"desc","pageSize":300,"where":{"includeNonWhitelisted":false}},"query":"\\n              query GetVaults($where: GqlRewardVaultFilter, $pageSize: Int, $skip: Int, $orderBy: GqlRewardVaultOrderBy = bgtCapturePercentage, $orderDirection: GqlRewardVaultOrderDirection = desc, $search: String) {\\n                polGetRewardVaults(\\n                  where: $where\\n                  first: $pageSize\\n                  skip: $skip\\n                  orderBy: $orderBy\\n                  orderDirection: $orderDirection\\n                  search: $search\\n                ) {\\n                  pagination {\\n                    currentPage\\n                    totalCount\\n                    __typename\\n                  }\\n                  vaults {\\n                    ...ApiVault\\n                    __typename\\n                  }\\n                  __typename\\n                }\\n              }\\n\\n              fragment ApiVault on GqlRewardVault {\\n                id: vaultAddress\\n                vaultAddress\\n                address: vaultAddress\\n                isVaultWhitelisted\\n                dynamicData {\\n                  allTimeReceivedBGTAmount\\n                  apr\\n                  tvl\\n                  bgtCapturePercentage\\n                  activeIncentivesValueUsd\\n                  activeIncentivesRateUsd\\n                  __typename\\n                }\\n                stakingToken {\\n                  address\\n                  name\\n                  symbol\\n                  decimals\\n                  __typename\\n                }\\n                metadata {\\n                  name\\n                  logoURI\\n                  url\\n                  protocolName\\n                  description\\n                  __typename\\n                }\\n                activeIncentives {\\n                  ...ApiVaultIncentive\\n                  __typename\\n                }\\n                __typename\\n              }\\n\\n              fragment ApiVaultIncentive on GqlRewardVaultIncentive {\\n                active\\n                remainingAmount\\n                remainingAmountUsd\\n                incentiveRate\\n                tokenAddress\\n                token {\\n                  address\\n                  name\\n                  symbol\\n                  decimals\\n                  __typename\\n                }\\n                __typename\\n              }\\n            "}',
      method: "POST",
      mode: "cors",
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch BeraPaw data: ${response.statusText}`);
    }

    const berapawVaultDatas = (await response.json()).data.polGetRewardVaults
      .vaults;
    const berapawVaults = berapawVaultDatas
      .filter(
        (vault: any) =>
          ((vault.metadata?.protocolName ?? "") == "Kodiak" ||
            (vault.metadata?.protocolName ?? "") == "Bex") &&
          vault.dynamicData?.tvl >= 100000
      )
      .map((vault: any) => {
        const newIidAddress = berapawEncodeSyntheticAddress(vault.vaultAddress);
        return {
          iid: `bera:${newIidAddress.toLowerCase()}`,
          address: newIidAddress.toLowerCase(),
          underlying_iid: `bera:${vault.stakingToken.address.toLowerCase()}`,
          decimals: vault.stakingToken.decimals,
          protocol: Protocol.BeraPaw,
          network: 80094,
          symbol: `BP-${vault.stakingToken.symbol}`.replace(" ", "-"),
          tokenCategory: "vault",
          color: getRandomColorFromSeed(vault.vaultAddress, "dark"),
          url: `https://www.berapaw.com/vaults`,
          name: vault.metadata?.name ?? "",
          colors: {
            light: getRandomColorFromSeed(vault.vaultAddress, "light"),
            dark: getRandomColorFromSeed(vault.vaultAddress, "dark"),
          },
        };
      });

    console.log(`Found ${berapawVaults.length} BeraPaw vaults.`);

    const newBeraPawVaults = berapawVaults.filter(
      (vault) =>
        !currentBeraPawVaults.some(
          (currentVault) => currentVault.iid === vault.iid
        ) &&
        !(newVaults as VaultTokenType[]).some(
          (currentVault) => currentVault.iid === vault.iid
        )
    );

    if (newBeraPawVaults.length > 0) {
      fs.writeFileSync(
        "./src/resources/new-allowlist/newVaultContracts.json",
        JSON.stringify([...newVaults, ...newBeraPawVaults], null, 2)
      );
    }

    console.log(
      `Found ${newBeraPawVaults.length} new BeraPaw vaults to be added.`
    );

    return newBeraPawVaults;
  } catch (error) {
    console.error("Error fetching BeraPaw vaults:", error);
    return [];
  }
};
