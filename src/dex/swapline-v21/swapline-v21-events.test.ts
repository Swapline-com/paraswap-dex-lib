/* eslint-disable no-console */
import dotenv from 'dotenv';
dotenv.config();

import { SwaplineV21EventPool } from './swapline-v21-pool';
import { Network } from '../../constants';
import { Address } from '../../types';
import { DummyDexHelper } from '../../dex-helper/index';
import { testEventSubscriber } from '../../../tests/utils-events';
import { PoolState } from './types';

/*
  README
  ======

  This test script adds unit tests for SwaplineV21 event based
  system. This is done by fetching the state on-chain before the
  event block, manually pushing the block logs to the event-subscriber,
  comparing the local state with on-chain state.

  Most of the logic for testing is abstracted by `testEventSubscriber`.
  You need to do two things to make the tests work:

  1. Fetch the block numbers where certain events were released. You
  can modify the `./scripts/fetch-event-blocknumber.ts` to get the
  block numbers for different events. Make sure to get sufficient
  number of blockNumbers to cover all possible cases for the event
  mutations.

  2. Complete the implementation for fetchPoolState function. The
  function should fetch the on-chain state of the event subscriber
  using just the blocknumber.

  The template tests only include the test for a single event
  subscriber. There can be cases where multiple event subscribers
  exist for a single DEX. In such cases additional tests should be
  added.

  You can run this individual test script by running:
  `npx jest src/dex/<dex-name>/<dex-name>-events.test.ts`

  (This comment should be removed from the final implementation)
*/

jest.setTimeout(50 * 1000);

async function fetchPoolState(
  swaplineV21Pools: SwaplineV21EventPool,
  blockNumber: number,
  poolAddress: string,
): Promise<PoolState> {
  // TODO: complete me!
  return {};
}

// eventName -> blockNumbers
type EventMappings = Record<string, number[]>;

describe('SwaplineV21 EventPool Mainnet', function () {
  const dexKey = 'SwaplineV21';
  const network = Network.FANTOM;
  const dexHelper = new DummyDexHelper(network);
  const logger = dexHelper.getLogger(dexKey);
  let swaplineV21Pool: SwaplineV21EventPool;

  // poolAddress -> EventMappings
  const eventsToTest: Record<Address, EventMappings> = {
    // TODO: complete me!
  };

  beforeEach(async () => {
    swaplineV21Pool = new SwaplineV21EventPool(
      dexKey,
      network,
      dexHelper,
      logger,
      /* TODO: Put here additional constructor arguments if needed */
    );
  });

  Object.entries(eventsToTest).forEach(
    ([poolAddress, events]: [string, EventMappings]) => {
      describe(`Events for ${poolAddress}`, () => {
        Object.entries(events).forEach(
          ([eventName, blockNumbers]: [string, number[]]) => {
            describe(`${eventName}`, () => {
              blockNumbers.forEach((blockNumber: number) => {
                it(`State after ${blockNumber}`, async function () {
                  await testEventSubscriber(
                    swaplineV21Pool,
                    swaplineV21Pool.addressesSubscribed,
                    (_blockNumber: number) =>
                      fetchPoolState(
                        swaplineV21Pool,
                        _blockNumber,
                        poolAddress,
                      ),
                    blockNumber,
                    `${dexKey}_${poolAddress}`,
                    dexHelper.provider,
                  );
                });
              });
            });
          },
        );
      });
    },
  );
});
