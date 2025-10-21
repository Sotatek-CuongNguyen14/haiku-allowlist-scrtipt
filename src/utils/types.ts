export type TokenType = {
  iid: string;
  address: string;
  name: string;
  symbol: string;
  primaryColor: string;
  tokenCategory: "token";
  network: number;
  decimals: number;
  url: string;
  logoURI: string;
  marketId?: string;
  underlying_iid?: string;
  colors: {
    light: string;
    dark: string;
  };
};

export type CollateralTokenType = {
  iid: string;
  symbol: string;
  address: string;
  protocol: string;
  underlying_iid: string;
  network: number;
  max_ltv: number;
  liquidation_threshold: number;
  liquidation_penalty: number;
  decimals: number;
  name: string;
  primaryColor: string;
  tokenCategory: "collateral";
  url: string;
  logoURI: string;
  colors: {
    light: string;
    dark: string;
  };
};

export type VariableDebtTokenType = {
  iid: string;
  address: string;
  protocol: string;
  underlying_iid: string;
  network: number;
  reserve_factor: number;
  decimals: number;
  name: string;
  symbol: string;
  primaryColor: string;
  tokenCategory: "varDebt";
  url: string;
  colors: {
    light: string;
    dark: string;
  };
};

export type VaultTokenType = {
  iid: string;
  address: string;
  underlying_iid: string;
  decimals: number;
  protocol: string;
  network: number;
  symbol: string;
  tokenCategory: "vault";
  color: string;
  url: string;
  name: string;
  colors: {
    light: string;
    dark: string;
  };
};

export type WeightedPoolTokenType = {
  iid: string;
  name: string;
  symbol: string;
  address: string;
  protocol: string;
  underlying_iids: string[];
  weights: number[] | string[];
  network: number;
  decimals: number;
  poolId: string;
  tokenCategory: "weightedLiquidity";
  primaryColor: string;
  url: string;
  colors: {
    light: string;
    dark: string;
  };
};

export type ConcentratedPoolTokenType = {
  iid: string;
  symbol: string;
  address: string;
  protocol: string;
  underlying_iids: string[];
  feeTier: number;
  network: number;
  decimals: number;
  poolId: string;
  tokenCategory: "concentratedLiquidity";
  primaryColor: string;
  url: string;
  name: string;
  colors: {
    light: string;
    dark: string;
  };
};

export enum Protocol {
  UniswapV2 = "UNISWAP_V2",
  UniswapV3 = "UNISWAP_V3",
  ZeroX = "ZERO_X",
  AaveV3 = "AAVE_V3",
  BalancerV2 = "BALANCER_V2",
  Squid = "SQUID",
  Across = "ACROSS",
  Relay = "RELAY",
  Unknown = "UNKNOWN",
  Berahub = "BERAHUB",
  Infrared = "INFRARED",
  Lifi = "LIFI",
  KodiakIsland = "KODIAK_ISLAND",
  Bex = "BEX",
  BeraPaw = "BERAPAW",
  BeraBorrow = "BERABORROW",
  KodiakBaults = "KODIAK_BAULTS",
  Symbiosis = "SYMBIOSIS",
  DeBridge = "DEBRIDGE",
  Curve = "CURVE",
  Morpho = "MORPHO",
  LayerZero = "LAYERZERO",
  Hypurrfi = "HYPURRFI",
  HyperLend = "HYPERLEND",
  Pendle = "PENDLE",
  Yei = "YEI",
  DragonswapV2 = "DRAGONSWAP_V2",
  HyperswapV2 = "HYPERSWAP_V2",
  Hyperstable = "HYPERSTABLE",
  YearnFinance = "YEARN_FINANCE",
  Fluid = "FLUID",
  Bend = "BEND",
}
