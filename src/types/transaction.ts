import { BigNumber } from '@ethersproject/bignumber';
import BN from 'bn.js';
import { Brand } from 'utility-types';

import { Address, Wei } from '@utils';

import { TAddress } from './address';
import { Asset } from './asset';
import { ITxStatus, ITxType } from './transactionFlow';
import { TUuid } from './uuid';

// By only dealing with Buffers / BN, dont have to mess around with cleaning strings
export interface ITransaction {
  to: Address;
  from?: Address;
  value?: Wei | undefined;
  data?: Buffer | undefined;
  gasLimit: Wei;
  gasPrice: Wei;
  nonce: BN;
  chainId: number;
  v: Buffer;
  r: Buffer;
  s: Buffer;
}

export type ITxHash = Brand<string, 'TxHash'>;

export type ITxSigned = Brand<Uint8Array, 'TxSigned'>;

export interface IBaseTxReceipt {
  readonly asset: Asset;
  readonly baseAsset: Asset;
  readonly txType: ITxType;
  readonly status: ITxStatus.PENDING | ITxStatus.SUCCESS | ITxStatus.FAILED | ITxStatus.UNKNOWN;

  readonly receiverAddress: TAddress;
  readonly amount: string;
  readonly data: string;

  readonly gasLimit: BigNumber;
  readonly to: TAddress;
  readonly from: TAddress;
  readonly value: BigNumber;
  readonly nonce: string;
  readonly hash: ITxHash;
  readonly blockNumber?: number;
  readonly timestamp?: number;

  readonly gasUsed?: BigNumber;
  readonly confirmations?: number;

  // Metadata
  readonly metadata?: ITxMetadata;
}

export interface ILegacyTxReceipt extends IBaseTxReceipt {
  readonly gasPrice: BigNumber;
}

// @todo Rename?
export interface ITxType2Receipt extends IBaseTxReceipt {
  readonly maxFeePerGas: BigNumber;
  readonly maxPriorityFeePerGas: BigNumber;
  readonly type: 2;
}

export type ITxReceipt = ILegacyTxReceipt | ITxType2Receipt;

export interface ITxMetadata {
  receivingAsset?: TUuid;
}

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type IPendingTxReceipt = DistributiveOmit<ITxReceipt, 'status'> & {
  status: ITxStatus.PENDING;
};

export type IUnknownTxReceipt = DistributiveOmit<ITxReceipt, 'status'> & {
  status: ITxStatus.UNKNOWN;
};

export type ISuccessfulTxReceipt = DistributiveOmit<
  ITxReceipt,
  'status' | 'timestamp' | 'blockNumber'
> & {
  status: ITxStatus.SUCCESS;
  timestamp: number;
  blockNumber: number;
};

export type IFailedTxReceipt = DistributiveOmit<
  ITxReceipt,
  'status' | 'timestamp' | 'blockNumber'
> & {
  status: ITxStatus.FAILED;
  timestamp: number;
  blockNumber: number;
};
