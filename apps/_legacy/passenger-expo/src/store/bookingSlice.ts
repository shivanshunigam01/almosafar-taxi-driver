import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Address, VehicleCategory } from "@almosafar/shared";
import type { RootState } from "./index";

export interface BookingState {
  pickup: Address | null;
  dropoff: Address | null;
  category: VehicleCategory;
  paymentMethodId: string | null;
  activeRideId: string | null;
}

const initialState: BookingState = {
  pickup: null,
  dropoff: null,
  category: "comfort",
  paymentMethodId: null,
  activeRideId: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setPickup: (state, action: PayloadAction<Address | null>) => {
      state.pickup = action.payload;
    },
    setDropoff: (state, action: PayloadAction<Address | null>) => {
      state.dropoff = action.payload;
    },
    setCategory: (state, action: PayloadAction<VehicleCategory>) => {
      state.category = action.payload;
    },
    setPaymentMethodId: (state, action: PayloadAction<string | null>) => {
      state.paymentMethodId = action.payload;
    },
    setActiveRideId: (state, action: PayloadAction<string | null>) => {
      state.activeRideId = action.payload;
    },
    resetBookingDraft: (state) => {
      state.pickup = null;
      state.dropoff = null;
      state.category = "comfort";
      state.paymentMethodId = null;
    },
  },
});

export const {
  setPickup,
  setDropoff,
  setCategory,
  setPaymentMethodId,
  setActiveRideId,
  resetBookingDraft,
} = bookingSlice.actions;

export const selectBooking = (state: RootState) => state.booking;

export default bookingSlice.reducer;
