import { Voucher } from "@prisma/client";
import voucherRepository from "../repositories/voucherRepository";
import { badRequestError, conflictError } from "../utils/errorUtils";

const MIN_VALUE_FOR_DISCOUNT = 100;

export type VoucherCreateData = Omit<Voucher, "id">;
export interface VoucherApplyData {
  code: string;
  amount: number;
}

async function createVoucher(code: string, discount: number) {
  const voucher = await voucherRepository.getVoucherByCode(code);
  if (voucher) {
    throw conflictError("Voucher already exist.");
  }
  if (discount > 100 || discount < 1) {
    throw badRequestError("Discount value not valid.");
  }
  await voucherRepository.createVoucher(code, discount);
}

async function applyVoucher(code: string, amount: number) {
  const voucher = await voucherRepository.getVoucherByCode(code);
  if (!voucher) {
    throw conflictError("Voucher does not exist.");
  }

  let finalAmount = amount;
  if (
    isAmountValidForDiscount(amount) &&
    !voucher.used &&
    isValidDiscount(voucher.discount)
  ) {
    await changeVoucherToUsed(code);
    finalAmount = applyDiscount(amount, voucher.discount);
  }

  return {
    amount,
    discount: voucher.discount,
    finalAmount,
    applied: finalAmount !== amount,
  };
}

async function changeVoucherToUsed(code: string) {
  return await voucherRepository.useVoucher(code);
}

function isAmountValidForDiscount(amount: number) {
  return amount >= MIN_VALUE_FOR_DISCOUNT;
}

function applyDiscount(value: number, discount: number) {
  return value - value * (discount / 100);
}

function isValidDiscount(discount: number) {
  return discount >= 1 && discount <= 100;
}

export default {
  createVoucher,
  applyVoucher,
};
