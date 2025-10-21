import { newAaveV3Allowlist } from './protocols/aave-v3';
import { newBalancerWeightedPools } from './protocols/balancer-v2';
import { newBendVaults } from './protocols/bend';
import { newBeraborrowVaults } from './protocols/beraborrow';
import { newBerahubVaults } from './protocols/berahub';
import { newBeraPawVaults } from './protocols/berapaw';
import { newBexWeightedPools } from './protocols/bex';
import { newCurveWeightedPools } from './protocols/curve';
import { newDragonSwapV2WeightedPools } from './protocols/dragonswap-v2';
import { newFluidVaults } from './protocols/fluid';
import { newHyperlendAllowlist } from './protocols/hyperlend';
import { newHyperstableAllowlist } from './protocols/hyperstable';
import { newHyperswapV2WeightedPools } from './protocols/hyperswap-v2';
import { newHypurrfiAllowlist } from './protocols/hypurrfi';
import { newInfraredVaults } from './protocols/infrared';
import { newKodiakBaults } from './protocols/kodiak-baults';
import { newKodiakIslandWeightedPools } from './protocols/kodiak-island';
import { newMorphoVaults } from './protocols/morpho';
import { newPendleWeightedPools } from './protocols/pendle';
import { newUniswapV2WeightedPools } from './protocols/uniswap-v2';
import { newUniswapV3ConcentratedPools } from './protocols/uniswap-v3';
import { newYearnFinanceVaults } from './protocols/yearn-finance';
import { newYeiAllowlist } from './protocols/yei';
import { protocolAllowlistCategories } from './utils/allowlist-categories';

(async () => {
  console.log("===============> Start Refreshing... <===============");
  try {
    // protocolAllowlistCategories();
    // Vaults
    // await newBerahubVaults();
    // await newBeraborrowVaults();
    // await newBeraPawVaults();
    // await newInfraredVaults();
    // await newKodiakBaults();
    // await newMorphoVaults();
    // await newFluidVaults();
    // await newYearnFinanceVaults();
    // await newBendVaults();
    // Collaterals && VariableDebts
    // await newAaveV3Allowlist();
    // await newHypurrfiAllowlist();
    // await newHyperlendAllowlist();
    // await newYeiAllowlist();
    // await newHyperstableAllowlist();
    // WeightedPools
    // await newBalancerWeightedPools();
    // await newBexWeightedPools();
    // await newKodiakIslandWeightedPools();
    // await newCurveWeightedPools();
    // await newUniswapV2WeightedPools();
    // await newPendleWeightedPools();
    // await newDragonSwapV2WeightedPools();
    // await newHyperswapV2WeightedPools();
    // ConcentratedLiquidities
    // await newUniswapV3ConcentratedPools();
  } catch (error) {
    console.error("Error during refreshing:", error);
    process.exit(1);
  }
  console.log("===============> Refreshing completed. <===============");
})().catch((error) => {
  console.error("Unhandled error in main execution:", error);
  process.exit(1);
});
