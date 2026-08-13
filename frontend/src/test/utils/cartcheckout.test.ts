import { describe, it, expect, beforeEach } from "vitest";
import { totalPrice } from "../../pages/CartPage/CartPage";
import { mockProduct } from "./cart.test";
import { useCheckout } from "../../zustand/states/checkOutStore";

const mockCustomer = {
  name: "Jan",
  last_name: "Kowalski",
  email: "jan@example.com",
  phone: "123456789",
};


const mockLocker = {
  id: "LOCKER-001",
  name: "Paczkomat RZE01A",
  address: "ul. Rejtana 1, Rzeszów",
  position: [50.0412, 21.9991] as [number, number],
};

describe("Checkout tests", () => {
  beforeEach(() => {
    useCheckout.setState({
      checkoutData: {
        customer: null,
        address: null,
        delivery: {
          method: "courier",
          price: 15,
          locker: null,
        },
        payment: {
          method: "blik",
        },
      },
      isComplete: false,
    });
  });

  it("should returns full price of items", () => {
    expect(totalPrice([{ ...mockProduct, quantity: 3 }])).toBe("4499.97");
  });

  it("should have correct initial checkout data", () => {
    const { checkoutData } = useCheckout.getState();
    expect(checkoutData.customer).toBe(null);
    expect(checkoutData.address).toBe(null);

    expect(checkoutData.delivery).toEqual({
      method: "courier",
      price: 15,
      locker: null,
    });
    expect(checkoutData.payment.method).toBe("blik");
  });

  it("should set customer data", () => {
    useCheckout.getState().setCheckoutData({
      customer: mockCustomer,
    });

    expect(useCheckout.getState().checkoutData.customer).toEqual(mockCustomer);
  });

  it("should set locker delivery", () => {
    useCheckout.getState().setCheckoutData({
      delivery: {
        method: "locker",
        price: 12,
        locker: mockLocker,
      },
    });

    expect(useCheckout.getState().checkoutData.delivery).toEqual({
      method: "locker",
      price: 12,
      locker: mockLocker,
    });
  });
});
