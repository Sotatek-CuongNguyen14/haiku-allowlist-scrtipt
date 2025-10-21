import { ethers, providers } from "ethers";
import * as core from "@mozaic-fi/intent-swapper-sdk-core";
import * as common from "@mozaic-fi/intent-swapper-sdk-common";
import * as crypto from "crypto";

const erc20Abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

// Replace with the token contract address you want to read

export const getTokenDetails = async (
  chainId: number,
  tokenAddresses: string[]
): Promise<common.Token[]> => {
  const provider = mappingChainIdToProvider[chainId];
  const routerKit = new core.RouterKit(chainId, provider);
  return routerKit.getTokens(tokenAddresses);
};

export const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

export const ARBITRUM_RPC_URL =
  "https://morning-flashy-wildflower.arbitrum-mainnet.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const BASE_RPC_URL =
  "https://morning-flashy-wildflower.base-mainnet.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const BERA_RPC_URL =
  "https://morning-flashy-wildflower.bera-mainnet.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const BSC_RPC_URL =
  "https://morning-flashy-wildflower.bsc.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const SONIC_RPC_URL =
  "https://morning-flashy-wildflower.sonic-mainnet.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const ETH_RPC_URL =
  "https://morning-flashy-wildflower.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const POLYGON_RPC_URL =
  "https://morning-flashy-wildflower.matic.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const UNICHAIN_RPC_URL =
  "https://morning-flashy-wildflower.unichain-mainnet.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const SEI_RPC_URL =
  "https://morning-flashy-wildflower.sei-pacific.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const AVAX_RPC_URL =
  "https://morning-flashy-wildflower.avalanche-mainnet.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760/ext/bc/C/rpc/";
export const GNOSIS_RPC_URL =
  "https://morning-flashy-wildflower.xdai.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const SCROLL_RPC_URL =
  "https://morning-flashy-wildflower.scroll-mainnet.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const KATANA_RPC_URL = "https://rpc.katana.network";
export const APECHAIN_RPC_URL =
  "https://apechain-mainnet.g.alchemy.com/v2/Rzx-hef307JZbBMLQo7uq_syZh82sosq";
export const WORLDCHAIN_RPC_URL =
  "https://morning-flashy-wildflower.worldchain-mainnet.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const OPTIMISM_RPC_URL =
  "https://morning-flashy-wildflower.optimism.quiknode.pro/d0bfc7476b5e6a2f355b51bb4f07efb83af7c760";
export const HYPEREVM_RPC_URL = "https://rpc.hyperliquid.xyz/evm";

export const mappingChainNameToRpcUrl: Record<string, string> = {
  arb: ARBITRUM_RPC_URL,
  base: BASE_RPC_URL,
  bera: BERA_RPC_URL,
  bsc: BSC_RPC_URL,
  sonic: SONIC_RPC_URL,
  eth: ETH_RPC_URL,
  hype: HYPEREVM_RPC_URL,
  poly: POLYGON_RPC_URL,
  uni: UNICHAIN_RPC_URL,
  sei: SEI_RPC_URL,
  avax: AVAX_RPC_URL,
  gnosis: GNOSIS_RPC_URL,
  scroll: SCROLL_RPC_URL,
  katana: KATANA_RPC_URL,
  ape: APECHAIN_RPC_URL,
  worldchain: WORLDCHAIN_RPC_URL,
  opt: OPTIMISM_RPC_URL,
};

export const mappingChainNameToChainId: Record<string, number> = {
  arb: 42161,
  base: 8453,
  bera: 80094,
  bsc: 56,
  sonic: 146,
  eth: 1,
  hype: 999,
  poly: 137,
  opt: 10,
  uni: 130,
  sei: 1329,
  avax: 43114,
  gnosis: 100,
  scroll: 534352,
  katana: 747474,
  ape: 33139,
  worldchain: 480,
};

export const mappingChainIdToChainName = Object.fromEntries(
  Object.entries(mappingChainNameToChainId).map(([key, value]) => [value, key])
);

export const PERMIT2_METADATA =
  "0x7065726d6974323a70756c6c2d746f6b656e0000000000000000000000000000";
export const NATIVE_TOKEN_METADATA =
  "0x6e61746976652d746f6b656e0000000000000000000000000000000000000000";
export const BPS = 10_000;
export const PERMIT_SIG_DEADLINE = 86400; // 1d

export const HAIKU_FEE_COLLECTOR_ADDRESS =
  "0x75914e09fE89B5b38141886Ab1860dcdEbC2f954";

export const mappingChainIdAcrossMultiCallAddress: Record<number, string> = {
  42161: "0x924a9f036260DdD5808007E1AA95f08eD08aA569",
  8453: "0x924a9f036260DdD5808007E1AA95f08eD08aA569",
};

export const mappingChainIdSquidMultiCallAddress: Record<number, string> = {
  42161: "0xaD6Cea45f98444a922a2b4fE96b8C90F0862D2F4",
  8453: "0xaD6Cea45f98444a922a2b4fE96b8C90F0862D2F4",
  56: "0xaD6Cea45f98444a922a2b4fE96b8C90F0862D2F4",
};

export const mappingChainIdRelayMultiCallAddress: Record<number, string> = {
  42161: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  8453: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  80094: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  56: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  146: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  1: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  137: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  10: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  130: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  43114: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  100: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  534352: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  33139: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
  480: "0xeeeeee9ec4769a09a76a83c7bc42b185872860ee",
};

export const mapChainIdMulticall3: Record<number, string> = {
  80094: "0xcA11bde05977b3631167028862bE2a173976CA11",
  146: "0xcA11bde05977b3631167028862bE2a173976CA11",
  999: "0xcA11bde05977b3631167028862bE2a173976CA11",
  42161: "0xcA11bde05977b3631167028862bE2a173976CA11",
  8453: "0xcA11bde05977b3631167028862bE2a173976CA11",
  56: "0xcA11bde05977b3631167028862bE2a173976CA11",
  1: "0xcA11bde05977b3631167028862bE2a173976CA11",
  137: "0xcA11bde05977b3631167028862bE2a173976CA11",
  10: "0xcA11bde05977b3631167028862bE2a173976CA11",
  130: "0xcA11bde05977b3631167028862bE2a173976CA11",
  1329: "0xcA11bde05977b3631167028862bE2a173976CA11",
  43114: "0xcA11bde05977b3631167028862bE2a173976CA11",
  100: "0xcA11bde05977b3631167028862bE2a173976CA11",
  534352: "0xcA11bde05977b3631167028862bE2a173976CA11",
  747474: "0xcA11bde05977b3631167028862bE2a173976CA11",
  33139: "0xcA11bde05977b3631167028862bE2a173976CA11",
  480: "0xcA11bde05977b3631167028862bE2a173976CA11",
};

export const MIN_AMOUNT_ACROSS_CAN_BRIDGE = 0.55; // USDC

export const EPSILON_BRIDGE = 0.02;
export const EPSILON_RETURN = 0.02;

export const BEX_GRAPH_API_URL = "https://api.berachain.com";
export const BALANCER_GRAPH_API_URL = "https://api-v3.balancer.fi/graphql";

export const mappingChainIdToBalancerGraphChainName: Record<number, string> = {
  80094: "BERACHAIN",
  42161: "ARBITRUM",
  8453: "BASE",
  56: "BSC",
  146: "SONIC",
  1: "MAINNET",
  137: "POLYGON",
  10: "OPTIMISM",
  43114: "AVALANCHE",
  100: "GNOSIS",
};

export const DUST_BALANCE_THRESHOLD = 0.01; // 0.01 USD

export const DEADLINE_EXPIRATION_BRIDGE = 60; // 1 minute

export const CACHE_QUOTE_EXPIRATION = 60 * 1000; // 1 minute

export const CACHE_TOKEN_PRICE_EXPIRATION = 300 * 1000; // 5 minutes

export const MAX_TIME_LIFIPROTOCOL = 60; // 60 seconds

export const INTERVAL_TIME_REFRESH_PRICE = 60000; // 1 minute
export const INTERVAL_TIME_REFRESH_METADATA = 12 * 60 * 60 * 1000; // 12 hours
export const INTERVAL_TIME_REFRESH_APR = 2 * 60 * 60 * 1000; // 2 hours
export const INTERVAL_TIME_REFRESH_TVL = 2 * 60 * 60 * 1000; // 2 hours

export const MIN_INPUT_VALUE_USD = 0.001; // 0.001 USD

export const mappingChainIdToAaveV3UIProviderAddress: Record<number, string> = {
  42161: "0x5c5228ac8bc1528482514af3e27e692495148717",
  8453: "0x68100bD5345eA474D93577127C11F39FF8463e93",
  56: "0xc0179321f0825c3e0F59Fe7Ca4E40557b97797a3",
  146: "0x9005A69fE088680827f292e8aE885Be4BE1beb2f",
  1: "0x3F78BBD206e4D3c504Eb854232EdA7e47E9Fd8FC",
  137: "0x68100bD5345eA474D93577127C11F39FF8463e93",
  10: "0xE92cd6164CE7DC68e740765BC1f2a091B6CBc3e4",
  43114: "0x50B4a66bF4D41e6252540eA7427D7A933Bc3c088",
  100: "0x5598BbFA2f4fE8151f45bBA0a3edE1b54B51a0a9",
  534352: "0x5598BbFA2f4fE8151f45bBA0a3edE1b54B51a0a9",
};

export const mappingChainIdToHypurrfiUIProviderAddress: Record<number, string> =
  {
    999: "0x7b883191011AEAe40581d3Fa1B112413808C9c00",
  };
export const mappingChainIdToHypurrfiProviderAddress: Record<number, string> = {
  999: "0xA73ff12D177D8F1Ec938c3ba0e87D33524dD5594",
};

export const mappingChainIdToHyperLendUIProviderAddress: Record<
  number,
  string
> = {
  999: "0x3Bb92CF81E38484183cc96a4Fb8fBd2d73535807",
};
export const mappingChainIdToHyperLendProviderAddress: Record<number, string> =
  {
    999: "0x72c98246a98bFe64022a3190e7710E157497170C",
  };

export const mappingChainIdToYeiUIProviderAddress: Record<number, string> = {
  1329: "0xeB0CC27b656775bF27Dc7A3c1cf570e002f727Da",
};
export const mappingChainIdToYeiProviderAddress: Record<number, string> = {
  1329: "0x5C57266688A4aD1d3aB61209ebcb967B84227642",
};

export const mappingChainIdToAaveV3ProviderAddress: Record<number, string> = {
  42161: "0xa97684ead0e402dc232d5a977953df7ecbab3cdb",
  8453: "0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D",
  56: "0xff75B6da14FfbbfD355Daf7a2731456b3562Ba6D",
  146: "0x5C2e738F6E27bCE0F7558051Bf90605dD6176900",
  1: "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e",
  137: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
  10: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
  43114: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
  100: "0x36616cf17557639614c1cdDb356b1B83fc0B2132",
  534352: "0x69850D0B276776781C063771b161bd8894BCdD04",
};

export const TOKEN_BASE_ADDRESS_BERA_PRICE_QUOTE =
  "0x549943e04f40284185054145c6e4e9568c1d3241"; // USDC.e

export const chainIdSupportedEIP7702 = [8453, 56, 1, 80094];

export const mappingChainIdToDexscreenerChainId: Record<number, string> = {
  80094: "berachain",
  42161: "arbitrum",
  8453: "base",
  56: "bsc",
  146: "sonic",
  1: "ethereum",
  999: "hyperevm",
  137: "polygon",
  10: "optimism",
  130: "unichain",
  1329: "seiv2",
  43114: "avalanche",
  100: "gnosischain",
  534352: "scroll",
  747474: "katana",
  33139: "apechain",
  480: "worldchain",
};

export const mappingChainIdToUsdcAddress: Record<number, string> = {
  80094: "0x549943e04f40284185054145c6e4e9568c1d3241",
  42161: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
  8453: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  56: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  146: "0x29219dd400f2bf60e5a23d13be72b486d4038894",
  1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  999: "0xb88339cb7199b77e23db6e890353e22632ba630f",
  137: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  10: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
  130: "0x078d782b760474a361dda0af3839290b0ef57ad6",
  1329: "0xe15fc38f6d8c56af07bbcbe3baf5708a2bf42392",
  43114: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
  100: "0x2a22f9c3b484c3629090feed35f17ff8f88f76f0",
  534352: "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
  747474: "0x203a662b0bd271a6ed5a60edfbd04bfce608fd36",
  33139: "0xf1815bd50389c46847f0bda824ec8da914045d14",
  480: "0x79a02482a880bce3f13e09da970dc34db4cd24d1",
};

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const mappingChainIdToCurveChainId: Record<number, string> = {
  42161: "arbitrum",
  8453: "base",
  56: "bsc",
  1: "ethereum",
  146: "sonic",
  999: "hyperliquid",
  137: "polygon",
  10: "optimism",
  43114: "avalanche",
  100: "xdai",
};

export const mappingCurveChainIdToChainId: Record<string, string> =
  Object.fromEntries(
    Object.entries(mappingChainIdToCurveChainId).map(([key, value]) => [
      value,
      key,
    ])
  );

export const mappingChainIdToCoingeckoId: Record<string, string> = {
  42161: "arbitrum-one",
  8453: "base",
  80094: "berachain",
  56: "binance-smart-chain",
  146: "sonic",
  1: "ethereum",
  999: "hyperevm",
  137: "polygon-pos",
  10: "optimistic-ethereum",
  130: "unichain",
  1329: "sei-v2",
  43114: "avalanche",
  100: "xdai",
  534352: "scroll",
  747474: "katana",
  33139: "apechain",
  480: "world-chain",
};

export const mappingChainIdToCoingeckoNativeCoinId: Record<string, string> = {
  42161: "ethereum",
  8453: "ethereum",
  80094: "berachain-bera",
  56: "binancecoin",
  146: "sonic-3",
  1: "ethereum",
  999: "hyperliquid",
  137: "matic-network",
  10: "ethereum",
  130: "ethereum",
  1329: "sei-network",
  43114: "avalanche-2",
  100: "xdai",
  534352: "ethereum",
  747474: "ethereum",
  33139: "apecoin",
  480: "ethereum",
};

export const mappingCoingeckoIdToChainId = Object.fromEntries(
  Object.entries(mappingChainIdToCoingeckoId).map(([key, value]) => [
    value,
    key,
  ])
);

export const mappingChainIdToScanTxUrl: Record<string, string> = {
  42161: "https://arbiscan.io/tx",
  8453: "https://basescan.org/tx",
  80094: "https://berascan.com/tx",
  56: "https://bscscan.com/tx",
  146: "https://sonicscan.org/tx",
  1: "https://etherscan.io/tx",
  999: "https://hyperevmscan.io/tx",
  137: "https://polygonscan.com/tx",
  10: "https://optimistic.etherscan.io/tx",
  130: "https://uniscan.xyz/tx",
  1329: "https://seistream.app/transactions",
  43114: "https://snowtrace.io/tx",
  100: "https://gnosisscan.io/tx",
  534352: "https://scrollscan.com/tx",
  747474: "https://katanascan.com/tx",
  33139: "https://apescan.io/tx",
  480: "https://worldscan.org/tx",
};

export const mappingLZChainIdToChainId: Record<number, number> = {
  30110: 42161,
  30184: 8453,
  30362: 80094,
  30102: 56,
  30332: 146,
  30101: 1,
  30367: 999,
  30109: 137,
  30111: 10,
  30320: 130,
  30280: 1329,
  30106: 43114,
  30145: 100,
  30214: 534352,
  30375: 747474,
  30312: 33139,
  30319: 480,
};

export const mappingChainIdToUniswapV3NFTPositionManager: Record<
  number,
  string
> = {
  1: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  130: "0x943e6e07a7e8e791dafc44083e54041d743c46e9",
  42161: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  10: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  137: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  8453: "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1",
  56: "0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613",
  43114: "0x655C406EBFa14EE2006250925e54ec43AD184f8B",
  480: "0xec12a9F9a09f50550686363766Cc153D03c27b5e",
};

export function getRandomColorFromSeed(
  seed: string,
  mode: "light" | "dark"
): string {
  // Create a hash from the seed
  const hash = crypto.createHash("sha256").update(seed).digest("hex");

  // Extract RGB values from hash
  const r = parseInt(hash.slice(0, 2), 16);
  const g = parseInt(hash.slice(2, 4), 16);
  const b = parseInt(hash.slice(4, 6), 16);

  if (mode === "light") {
    // For light mode, ensure colors are darker (good contrast on light background)
    return `#${Math.floor(r * 0.6)
      .toString(16)
      .padStart(2, "0")}${Math.floor(g * 0.6)
      .toString(16)
      .padStart(2, "0")}${Math.floor(b * 0.6)
      .toString(16)
      .padStart(2, "0")}`;
  } else {
    // For dark mode, ensure colors are lighter (good contrast on dark background)
    const lightR = Math.min(255, Math.floor(r * 0.8) + 80);
    const lightG = Math.min(255, Math.floor(g * 0.8) + 80);
    const lightB = Math.min(255, Math.floor(b * 0.8) + 80);
    return `#${lightR.toString(16).padStart(2, "0")}${lightG
      .toString(16)
      .padStart(2, "0")}${lightB.toString(16).padStart(2, "0")}`;
  }
}
export const mappingChainIdToRpcUrl: Record<string, string> = {
  42161: ARBITRUM_RPC_URL,
  8453: BASE_RPC_URL,
  80094: BERA_RPC_URL,
  56: BSC_RPC_URL,
  146: SONIC_RPC_URL,
  1: ETH_RPC_URL,
  137: POLYGON_RPC_URL,
  130: UNICHAIN_RPC_URL,
  1329: SEI_RPC_URL,
  43114: AVAX_RPC_URL,
  100: GNOSIS_RPC_URL,
  534352: SCROLL_RPC_URL,
  747474: KATANA_RPC_URL,
  33139: APECHAIN_RPC_URL,
  480: WORLDCHAIN_RPC_URL,
  10: OPTIMISM_RPC_URL,
  999: HYPEREVM_RPC_URL,
};

export const mappingChainIdToProvider: Record<
  number,
  ethers.providers.JsonRpcProvider
> = {
  42161: new ethers.providers.JsonRpcProvider(ARBITRUM_RPC_URL),
  8453: new ethers.providers.JsonRpcProvider(BASE_RPC_URL),
  80094: new ethers.providers.JsonRpcProvider(BERA_RPC_URL),
  56: new ethers.providers.JsonRpcProvider(BSC_RPC_URL),
  146: new ethers.providers.JsonRpcProvider(SONIC_RPC_URL),
  1: new ethers.providers.JsonRpcProvider(ETH_RPC_URL),
  137: new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL),
  130: new ethers.providers.JsonRpcProvider(UNICHAIN_RPC_URL),
  1329: new ethers.providers.JsonRpcProvider(SEI_RPC_URL),
  43114: new ethers.providers.JsonRpcProvider(AVAX_RPC_URL),
  100: new ethers.providers.JsonRpcProvider(GNOSIS_RPC_URL),
  534352: new ethers.providers.JsonRpcProvider(SCROLL_RPC_URL),
  747474: new ethers.providers.JsonRpcProvider(KATANA_RPC_URL),
  33139: new ethers.providers.JsonRpcProvider(APECHAIN_RPC_URL),
  480: new ethers.providers.JsonRpcProvider(WORLDCHAIN_RPC_URL),
  10: new ethers.providers.JsonRpcProvider(OPTIMISM_RPC_URL),
  999: new ethers.providers.JsonRpcProvider(HYPEREVM_RPC_URL),
};

export const mappingChainIdToMorpho: Record<number, string> = {
  1: "ethereum",
  42161: "arbitrum",
  8453: "base",
  747474: "katana",
  137: "polygon",
  130: "unichain",
};

export const mappingChainIdToBalancer: Record<number, string> = {
  1: "MAINNET",
  42161: "ARBITRUM",
  43114: "AVALANCHE",
  8453: "BASE",
  100: "GNOSIS",
  137: "POLYGON",
  10: "OPTIMISM",
  999: "HYPEREVM",
};

export const mappingBalancerChainToChainId: Record<string, number> =
  Object.fromEntries(
    Object.entries(mappingChainIdToBalancer).map(([key, value]) => [
      value,
      parseInt(key),
    ])
  );

export const BERAPAW_FORGE_CONTRACT =
  "0xfeedb9750d6ac77d2e52e0c9eb8fb79f9de5cafe"; // This is BeraPawForge contract of BeraPaw protocol

function xorBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  if (a.length !== b.length) throw new Error("Lengths must match");
  const result = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

// Encode address -> synthetic address
export function berapawEncodeSyntheticAddress(address: string): string {
  const addressBytes = ethers.utils.arrayify(address);
  const keyBytes = ethers.utils.arrayify(BERAPAW_FORGE_CONTRACT);
  const encodedBytes = xorBytes(addressBytes, keyBytes);
  return ethers.utils.getAddress(ethers.utils.hexlify(encodedBytes)); // normalize to valid address
}

// Decode synthetic address -> original address
export function berapawDecodeSyntheticAddress(
  syntheticAddress: string
): string {
  const encodedBytes = ethers.utils.arrayify(syntheticAddress);
  const keyBytes = ethers.utils.arrayify(BERAPAW_FORGE_CONTRACT);
  const decodedBytes = xorBytes(encodedBytes, keyBytes);
  return ethers.utils.getAddress(ethers.utils.hexlify(decodedBytes)); // normalize
}

export function pendleFormatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  // This will format according to the 'en-GB' locale for DD MMM YYYY
  return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
}

export const mappingChainIdToUniswapV3: Record<string, string> = {
  1: "ethereum",
  130: "unichain",
  8453: "base",
  42161: "arbitrum",
  137: "polygon",
  10: "optimism",
  56: "bnb",
  43114: "avalanche",
  480: "worldchain",
};

export const mappingChainIdToCoingeckoDex: Record<string, string> = {
  1: "uniswap_v3",
  130: "uniswap-v3-unichain",
  8453: "uniswap-v3-base",
  42161: "uniswap_v3_arbitrum",
  137: "uniswap_v3_polygon_pos",
  10: "uniswap_v3_optimism",
  56: "uniswap-bsc",
  43114: "uniswap-v3-avalanche",
  480: "uniswap-v3-world-chain",
};

export const mappingChainIdToCoingeckoNetworkId: Record<string, string> = {
  1: "eth",
  130: "unichain",
  8453: "base",
  42161: "arbitrum",
  137: "polygon_pos",
  10: "optimism",
  56: "bsc",
  43114: "avax",
  480: "world-chain",
};
