import vaults from "../resources/current-allowlist/supportedVaultContracts.json";
import newVaults from "../resources/new-allowlist/newVaultContracts.json";

import { Protocol, VaultTokenType } from "../utils/types";
import { getRandomColorFromSeed } from "../utils/utils";
import * as fs from "fs";

export const newBerahubVaults = async (): Promise<VaultTokenType[]> => {
  try {
    const currentBerahubVaults = vaults.filter(
      (vault) => vault.protocol === Protocol.Berahub
    ) as VaultTokenType[];

    const response = await fetch("https://api.berachain.com/", {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-VN,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,en-GB;q=0.6,en-US;q=0.5",
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        Referer: "https://hub.berachain.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: '{"operationName":"GetVaults","variables":{"skip":0,"pageSize":500,"where":{"includeNonWhitelisted":false}},"query":"query GetVaults($where: GqlRewardVaultFilter, $pageSize: Int, $skip: Int, $orderBy: GqlRewardVaultOrderBy = bgtCapturePercentage, $orderDirection: GqlRewardVaultOrderDirection = desc, $search: String) {\\n  polGetRewardVaults(\\n    where: $where\\n    first: $pageSize\\n    skip: $skip\\n    orderBy: $orderBy\\n    orderDirection: $orderDirection\\n    search: $search\\n  ) {\\n    pagination {\\n      currentPage\\n      totalCount\\n      __typename\\n    }\\n    vaults {\\n      ...ApiVault\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment ApiVault on GqlRewardVault {\\n  id: vaultAddress\\n  vaultAddress\\n  address: vaultAddress\\n  isVaultWhitelisted\\n  dynamicData {\\n    allTimeReceivedBGTAmount\\n    apr\\n    bgtCapturePercentage\\n    activeIncentivesValueUsd\\n    activeIncentivesRateUsd\\n    __typename\\n  }\\n  stakingToken {\\n    address\\n    name\\n    symbol\\n    decimals\\n    __typename\\n  }\\n  metadata {\\n    name\\n    logoURI\\n    url\\n    protocolName\\n    description\\n    __typename\\n  }\\n  activeIncentives {\\n    ...ApiVaultIncentive\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ApiVaultIncentive on GqlRewardVaultIncentive {\\n  active\\n  remainingAmount\\n  remainingAmountUsd\\n  incentiveRate\\n  tokenAddress\\n  token {\\n    address\\n    name\\n    symbol\\n    decimals\\n    __typename\\n  }\\n  __typename\\n}"}',
      method: "POST",
    });
    const berahubVaultDatas = (await response.json()).data.polGetRewardVaults
      .vaults;
    const berahubVaults: VaultTokenType[] = berahubVaultDatas
      .filter((vault: any) => {
        return (
          ((vault.metadata?.protocolName ?? "") == "Kodiak" ||
            (vault.metadata?.protocolName ?? "") == "HUB" ||
            (vault.metadata?.protocolName ?? "") == "Bex") &&
          vault.isVaultWhitelisted
        );
      })
      .map((vault: any) => {
        return {
          iid: `bera:${vault.vaultAddress.toLowerCase()}`,
          address: vault.vaultAddress.toLowerCase(),
          underlying_iid: `bera:${vault.stakingToken.address.toLowerCase()}`,
          decimals: vault.stakingToken.decimals,
          protocol: Protocol.Berahub,
          network: 80094,
          symbol: `HUB-${vault.stakingToken.symbol}`.replace(" ", "-"),
          tokenCategory: "vault",
          color: getRandomColorFromSeed(vault.vaultAddress, "dark"),
          url: `https://hub.berachain.com/vaults/${vault.vaultAddress}`,
          name: vault.metadata?.name ?? "",
          colors: {
            light: getRandomColorFromSeed(vault.vaultAddress, "light"),
            dark: getRandomColorFromSeed(vault.vaultAddress, "dark"),
          },
        };
      });

    console.log(`Found ${berahubVaults.length} Berahub vaults.`);

    const newBerahubVaults = berahubVaults.filter(
      (vault) =>
        !currentBerahubVaults.some(
          (currentVault) => currentVault.iid === vault.iid
        ) &&
        !(newVaults as VaultTokenType[]).some(
          (currentVault) => currentVault.iid === vault.iid
        )
    );

    console.log(
      `Found ${newBerahubVaults.length} new Berahub vaults to be added.`
    );

    if (newBerahubVaults.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newVaultContracts.json",
        JSON.stringify([...newVaults, ...newBerahubVaults], null, 2)
      );
    }

    return newBerahubVaults;
  } catch (error) {
    console.error("Error fetching Berahub vaults:", error);
    return [];
  }
};
