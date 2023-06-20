import { jest } from "@jest/globals";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";
import { badRequestError, conflictError } from "utils/errorUtils";

describe("Voucher tests", () => {
  it("Should create a voucher", async () => {
    const voucher = {
      id: 1,
      code: "code1",
      discount: 20,
      used: false,
    };
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {});
    jest
      .spyOn(voucherRepository, "createVoucher")
      .mockImplementationOnce((): any => {});
    await voucherService.createVoucher(voucher.code, voucher.discount);

    expect(voucherRepository.createVoucher).toBeCalled();
  });

  it("Should return conflictError for existing voucher", () => {
    const voucher = {
      id: 1,
      code: "code1",
      discount: 20,
      used: false,
    };
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return voucher;
      });
    const promise = voucherService.createVoucher(
      voucher.code,
      voucher.discount
    );

    expect(promise).rejects.toEqual(conflictError("Voucher already exist."));
  });

  it("Should return badRequestError for invalid discount value", () => {
    const voucher = {
      id: 1,
      code: "code1",
      discount: 200,
      used: false,
    };
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return undefined;
      });
    const promise = voucherService.createVoucher(
      voucher.code,
      voucher.discount
    );

    expect(promise).rejects.toEqual(
      badRequestError("Discount value not valid.")
    );
  });

  it("Should return conflictError for non-existent voucher", () => {
    const voucher = {
      id: 1,
      code: "code1",
      discount: 20,
      used: false,
    };
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return undefined;
      });
    const promise = voucherService.applyVoucher(voucher.code, voucher.discount);

    expect(promise).rejects.toEqual(conflictError("Voucher does not exist."));
  });

  it("Should not apply voucher for invalid amount", async () => {
    const voucher = {
      id: 1,
      code: "code1",
      discount: 20,
      used: false,
    };
    const amount = 99;
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return voucher;
      });
    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {});

    const response = await voucherService.applyVoucher(voucher.code, amount);

    expect(response.amount).toBe(amount);
    expect(response.discount).toBe(voucher.discount);
    expect(response.finalAmount).toBe(amount);
    expect(response.applied).toBe(false);
  });
  it("Should not apply voucher for invalid discount", async () => {
    const voucher = {
      id: 1,
      code: "code1",
      discount: 150,
      used: false,
    };
    const amount = 200;
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return voucher;
      });
    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {});

    const response = await voucherService.applyVoucher(voucher.code, amount);

    expect(response.amount).toBe(amount);
    expect(response.discount).toBe(voucher.discount);
    expect(response.finalAmount).toBe(amount);
    expect(response.applied).toBe(false);
  });

  it("Should not apply voucher that has already been used", async () => {
    const voucher = {
      id: 1,
      code: "code1",
      discount: 20,
      used: true,
    };
    const amount = 200;
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return voucher;
      });
    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {});

    const response = await voucherService.applyVoucher(voucher.code, amount);

    expect(response.amount).toBe(amount);
    expect(response.discount).toBe(voucher.discount);
    expect(response.finalAmount).toBe(amount);
    expect(response.applied).toBe(false);
  });

  it("Should apply voucher for valid chouncher and amount", async () => {
    const voucher = {
      id: 1,
      code: "code1",
      discount: 20,
      used: false,
    };
    const amount = 200;
    const finalAmount = amount - amount * (voucher.discount / 100);
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return voucher;
      });
    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {});

    const response = await voucherService.applyVoucher(voucher.code, amount);

    expect(response.amount).toBe(amount);
    expect(response.discount).toBe(voucher.discount);
    expect(response.finalAmount).toBe(finalAmount);
    expect(response.applied).toBe(true);
  });
});
