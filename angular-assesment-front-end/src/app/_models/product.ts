import {BaseModel, Image} from './index';


export enum FulfillmentTypeEnum {
  Standard = 0,
  NoShipment = 1
}

export interface SalesPhrase extends BaseModel {
  text: string;
  slug: string;
}

export enum ProcessTypeEnum {
  Sale = 1,
  Fee = 2,
  Warranty = 3,
  Installment = 4
}

export interface RelatedProduct extends BaseModel {
  name: string;
  product_id: string;
  sku: string;
  description: string;
  msrp: number;
  default_image: Image;
  fulfillment_type: FulfillmentTypeEnum;
  quantity: number;
  process_type: ProcessTypeEnum;
}

export interface Product extends RelatedProduct {
  crm: string | number;
  price: number;
  shipping_price: number;
  min_price: number;
  crm_quantity: number;
  override_quantity: number;
}

export enum ProductTypeEnum {
  Offer = 0,
  Upsell = 1,
  LinkedUpsell = 2
}

export enum BillingCycleTypeEnum {
  OneTime = 0,
  Recurring = 1,
  MultiPay = 2
}

export const BillingCycleTypeMap = {
  [BillingCycleTypeEnum.OneTime]: 'One Time',
  [BillingCycleTypeEnum.Recurring]: 'Recurring',
  [BillingCycleTypeEnum.MultiPay]: 'Multi-Pay',
};

export interface Discount extends BaseModel {
  price: number;
}

export enum ProductStatusEnum {
  Normal = 0,
  ReadOnly = 1,
  Hidden = 2,
  Cancellable = 3
}

export enum TrialTypeEnum {
  None = 0,
  Standard = 1,
  Delayed = 2,
  Accelerated = 3
}

export enum DiscountPriceTypeEnum {
  Price = 1,
  ShippingPrice = 2,
  TotalPrice = 3
}

export const DiscountPriceTypeMap = {
  [DiscountPriceTypeEnum.Price]: 'Price',
  [DiscountPriceTypeEnum.ShippingPrice]: 'Shipping Price',
  [DiscountPriceTypeEnum.TotalPrice]: 'Price + Shipping',
};

export enum SubscriptionDisplayType {
  Never = 1,
  Always = 2,
  AfterFirstCycle = 3
}

interface RelatedCampaignProductBase extends BaseModel {
  name: string;
  campaign_product_id: string;
  price: number;
  shipping_price: number;
  product_type: ProductTypeEnum;
  billing_cycle_type: BillingCycleTypeEnum;
  trial_type: TrialTypeEnum;
  subtext: string;
  image: Image;
  product_id: string | number;
}

export interface RelatedCampaignProduct extends RelatedCampaignProductBase {
  product: RelatedProduct;
}

export interface CampaignProduct extends RelatedCampaignProductBase {
  crm: string | number;
  crm_campaign: string | number;
  final_billing_cycle: number;
  product: Product;
  status: ProductStatusEnum;
  max_quantity: number;
  min_price: number;
  url: string;
  override_price: number;
  override_shipping_price: number;
  restock_fee: number;
  crm_product_type: ProductTypeEnum;
  override_product_type: ProductTypeEnum;
  discount_type: DiscountPriceTypeEnum;
  override_process_type: ProcessTypeEnum;
  subscription_display_type: SubscriptionDisplayType;
  show_next_bill_price: boolean;
  member_price: number;
  retail_price: number;
  return_days: number;
  exchange_days: number;
  max_extra_return_days: number;
  offer_name: string;
  third_party_recurring: boolean;
}
