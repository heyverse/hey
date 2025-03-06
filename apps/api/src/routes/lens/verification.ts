import { APP_NAME, HEY_APP } from "@hey/data/constants";
import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import type { Request, Response } from "express";
import sendVerificationBuzz from "src/helpers/buzz/sendVerificationBuzz";
import catchedError from "src/helpers/catchedError";
import { heyWalletClient } from "src/helpers/heyWalletClient";
import { noBody } from "src/helpers/responses";
import trackEvent from "src/helpers/trackEvent";
import { checksumAddress } from "viem";

const TYPES = {
  SourceStamp: [
    { name: "source", type: "address" },
    { name: "originalMsgSender", type: "address" },
    { name: "validator", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" }
  ]
};

const DOMAIN = {
  name: "Lens Source",
  version: "1",
  chainId: 37111,
  verifyingContract: checksumAddress(HEY_APP)
};

export const post = async (req: Request, res: Response) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const { nonce, deadline, account, operation, validator } = body;

  const missingFields = [
    "deadline",
    "nonce",
    "operation",
    "account",
    "validator"
  ].filter((field) => !body[field]);
  if (missingFields.length > 0) {
    return res.json({
      allowed: false,
      reason: `Missing ${missingFields.join(", ")} field(s)`
    });
  }

  try {
    const [signature, accountPermission] = await Promise.all([
      heyWalletClient.signTypedData({
        primaryType: "SourceStamp",
        types: TYPES,
        domain: DOMAIN,
        message: {
          source: checksumAddress(HEY_APP),
          originalMsgSender: checksumAddress(account),
          validator: checksumAddress(validator),
          nonce,
          deadline
        }
      }),
      prisma.accountPermission.findFirst({
        where: {
          permissionId: PermissionId.Suspended,
          accountAddress: account as string
        }
      })
    ]);

    if (accountPermission?.enabled) {
      return res.status(200).json({
        allowed: false,
        reason: `Account is suspended on ${APP_NAME}`
      });
    }

    sendVerificationBuzz({ account, operation });
    trackEvent("verification", { operation });

    return res.status(200).json({ allowed: true, signature });
  } catch (error) {
    return catchedError(res, error);
  }
};
