// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import "../../Constants.sol";
import "../../helpers/Types.sol";

/**
 * @title PremiumLogic
 * @notice Utility functions for computing dynamic coverage rates and minimum premiums.
 */
library PremiumLogic {
    uint256 internal constant MIN_COVER_DURATION = 7 days;

    /**
     * @notice Computes the current rate for a pool based on utilization and the configured rate model.
     * @dev Applies override values first, then falls back to a two-segment (kinked) slope model with clamps.
     */
    function getCurrentRateBps(
        Types.RateModel memory rateModel,
        uint256 sold,
        uint256 availableCapital
    ) internal pure returns (uint256) {
        uint256 rate;

        if (rateModel.overrideEnabled) {
            rate = rateModel.overrideRateBps;
        } else {
            uint256 utilBps = _utilizationBps(sold, availableCapital);
            rate = rateModel.base;
            rate += _applySlopeOne(rateModel, utilBps);
            rate += _applySlopeTwo(rateModel, utilBps);
        }

        return _clampRate(rate, rateModel.minRateBps, rateModel.maxRateBps);
    }

    /**
     * @notice Minimum premium (7-day minimum coverage window) denominator-adjusted to BPS.
     */
    function getMinPremium(uint256 coverage, uint256 rateBps) internal pure returns (uint256) {
        if (coverage == 0 || rateBps == 0) {
            return 0;
        }
        return (coverage * rateBps * MIN_COVER_DURATION) / (Constants.SECS_YEAR * Constants.BPS);
    }

    /* ───────────────────────── Internal Helpers ───────────────────────── */

    function _utilizationBps(uint256 sold, uint256 availableCapital) private pure returns (uint256) {
        if (availableCapital == 0) {
            return Constants.BPS;
        }

        uint256 util = (sold * Constants.BPS) / availableCapital;
        if (util > Constants.BPS) {
            util = Constants.BPS;
        }
        return util;
    }

    function _applySlopeOne(Types.RateModel memory model, uint256 utilBps) private pure returns (uint256) {
        if (model.slope1 == 0) {
            return 0;
        }

        uint256 kink = model.kink > Constants.BPS ? Constants.BPS : model.kink;
        if (kink == 0) {
            return model.slope1;
        }

        uint256 utilized = utilBps < kink ? utilBps : kink;
        return (utilized * model.slope1) / kink;
    }

    function _applySlopeTwo(Types.RateModel memory model, uint256 utilBps) private pure returns (uint256) {
        if (model.slope2 == 0) {
            return 0;
        }

        uint256 kink = model.kink > Constants.BPS ? Constants.BPS : model.kink;
        if (utilBps <= kink) {
            return 0;
        }

        uint256 postRange = Constants.BPS > kink ? Constants.BPS - kink : 0;
        if (postRange == 0) {
            // Avoid division-by-zero when kink == BPS
            return model.slope2;
        }

        uint256 cappedUtil = utilBps > Constants.BPS ? Constants.BPS : utilBps;
        uint256 postUtil = cappedUtil - kink;
        return (postUtil * model.slope2) / postRange;
    }

    function _clampRate(uint256 rate, uint256 minRateBps, uint256 maxRateBps) private pure returns (uint256) {
        if (maxRateBps != 0 && rate > maxRateBps) {
            rate = maxRateBps;
        }
        if (minRateBps != 0 && rate < minRateBps) {
            rate = minRateBps;
        }
        return rate;
    }
}
