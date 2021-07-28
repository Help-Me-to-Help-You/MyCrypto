import React, { useState } from 'react';

import BigNumber from 'bignumber.js';

import { GasLimitField, GasPriceField } from '@features/SendAssets/components';
import { translateRaw } from '@translations';
import { Asset, Fiat } from '@types';
import { bigify, bigNumGasPriceToViewableGwei, gasStringsToMaxGasNumber } from '@utils';

import Box from './Box';
import { default as Currency } from './Currency';
import { default as Icon } from './Icon';
import { default as LinkApp } from './LinkApp';
import { Body } from './NewTypography';
import Tooltip from './Tooltip';

interface Props {
  baseAsset: Asset;
  fiat: Fiat;
  // Current Base Fee of the network
  baseFee?: BigNumber | null;
  baseAssetRate: string;
  gasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  gasLimitError?: string;
  maxFeePerGasError?: string;
  maxPriorityFeePerGasError?: string;
  setGasLimit(value: string): void;
  setMaxFeePerGas(value: string): void;
  setMaxPriorityFeePerGas(value: string): void;
}

export const TransactionFeeEIP1559 = ({
  baseAsset,
  fiat,
  baseFee,
  baseAssetRate,
  gasLimit,
  maxFeePerGas,
  maxPriorityFeePerGas,
  setGasLimit,
  setMaxFeePerGas,
  setMaxPriorityFeePerGas,
  gasLimitError,
  maxFeePerGasError,
  maxPriorityFeePerGasError
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  const handleToggleEditMode = () => setEditMode(!editMode);

  const viewableBaseFee = baseFee && bigify(bigNumGasPriceToViewableGwei(baseFee));

  const totalFee = gasStringsToMaxGasNumber(maxFeePerGas, gasLimit);
  const totalFiat = totalFee.multipliedBy(baseAssetRate);
  const hasFiatValue = totalFiat.gt(0);

  const cappedPriorityFee =
    viewableBaseFee &&
    BigNumber.min(maxPriorityFeePerGas, bigify(maxPriorityFeePerGas).minus(viewableBaseFee));

  // @todo Figure out if this is good enough
  const minFee = viewableBaseFee
    ? gasStringsToMaxGasNumber(viewableBaseFee.plus(cappedPriorityFee!).toString(), gasLimit)
    : totalFee;
  const minFeeFiat = minFee.multipliedBy(baseAssetRate);

  return (
    <Box bg="BG_GRAY" p="3">
      {editMode && (
        <Box>
          <Box variant="rowAlign" justifyContent="space-between">
            <Body mb="0" fontWeight="bold">
              {translateRaw('EDIT_TRANSACTION_FEE')}
            </Body>
            <Body mb="0" fontWeight="bold">
              {translateRaw('CURRENT_BASE_FEE', {
                $fee: viewableBaseFee ? viewableBaseFee.toString(10) : '?'
              })}
            </Body>
          </Box>
          <hr />
          <Box display="flex" alignItems="flex-start">
            <Box flex="50%">
              <Box variant="rowAlign" pl="1" pb="1">
                <Body mb="0">{translateRaw('GAS_LIMIT')}</Body>
                <Tooltip ml="1" type="informational" tooltip="Tooltip" />
              </Box>
              <GasLimitField
                name="gasLimitField"
                onChange={setGasLimit}
                value={gasLimit}
                error={gasLimitError}
              />
            </Box>
            <Box px="3">
              <Body mt="32px" mb="0" fontWeight="bold">
                X
              </Body>
            </Box>
            <Box flex="50%">
              <Box variant="rowAlign" pl="1" pb="1">
                <Body mb="0">{translateRaw('MAX_FEE_PER_GAS')}</Body>
                <Tooltip ml="1" type="informational" tooltip="Tooltip" />
              </Box>
              <GasPriceField
                name="maxFeePerGasField"
                onChange={setMaxFeePerGas}
                value={maxFeePerGas}
                error={maxFeePerGasError}
              />
            </Box>
          </Box>
          <Box width="45%">
            <Box variant="rowAlign" pl="1" pb="1">
              <Body mb="0">{translateRaw('MAX_PRIORITY_FEE')}</Body>
              <Tooltip ml="1" type="informational" tooltip="Tooltip" />
            </Box>
            <GasPriceField
              name="maxPriorityFeePerGasField"
              onChange={setMaxPriorityFeePerGas}
              value={maxPriorityFeePerGas}
              error={maxPriorityFeePerGasError}
              placeholder="1"
            />
          </Box>

          <hr />
        </Box>
      )}
      <Box variant="rowAlign" justifyContent="space-between">
        <Box>
          <Body mb="0" fontWeight="bold" color="GREYISH_BROWN" fontSize="3">
            {hasFiatValue ? (
              <Currency
                bold={true}
                amount={totalFiat.toString(10)}
                symbol={fiat.symbol}
                ticker={fiat.ticker}
                decimals={2}
              />
            ) : (
              <Currency bold={true} amount={totalFee.toString(10)} ticker={baseAsset.ticker} />
            )}{' '}
            <LinkApp href="#" isExternal={false} onClick={handleToggleEditMode}>
              {editMode ? (
                <Body data-testid="save" as="span">
                  {translateRaw('SAVE')}
                </Body>
              ) : (
                <Icon data-testid="edit" ml="1" size="16px" type="edit" color="BLUE_SKY" />
              )}
            </LinkApp>
          </Body>
          <Body mt="1" mb="0" color="BLUE_GREY">
            {translateRaw('RECOMMENDED_TOTAL_FEE')}
          </Body>
        </Box>
        <Box>
          {/* @todo Figure out what values to use for range */}
          <Body mb="0" fontWeight="bold" color="GREYISH_BROWN" textAlign="right" fontSize="2">
            {hasFiatValue ? (
              <Currency bold={true} amount={minFeeFiat.toString(10)} decimals={2} />
            ) : (
              <Currency bold={true} amount={minFee.toString(10)} />
            )}
            {' - '}
            {hasFiatValue ? (
              <Currency
                bold={true}
                amount={totalFiat.toString(10)}
                symbol={fiat.symbol}
                ticker={fiat.ticker}
                decimals={2}
              />
            ) : (
              <Currency bold={true} amount={totalFee.toString(10)} ticker={baseAsset.ticker} />
            )}
          </Body>
          <Body mt="1" mb="0" color="BLUE_GREY" textAlign="right">
            {translateRaw('FEE_RANGE_ESTIMATE')}
          </Body>
        </Box>
      </Box>
    </Box>
  );
};
