import { BaseModel } from './index';

export const FunnelVariables = {
  first_name: 'Customer First Name',
  brand_name: 'Brand Name',
  price: 'Sale Price',
  shipping_price: 'Sale Shipping Price',
  total_price: 'Sale Total Price (price + shipping)',
  original_price: 'Original Price',
  original_shipping_price: 'Original Shipping Price',
  discount: 'Discount Amount',
  discount_price: 'Discounted Sale Price',
  discount_percent: 'Discount Percent',
  product_name: 'Product Name',
  next_bill_date: 'Next Bill Date',
  billing_interval_days: 'Billing Interval (in days)',
  return_by_date: 'Return By Date',
  rma_number: 'RMA Number',
  offer_terms: 'Offer Terms',
  restock_fee: 'Restocking Fee',
  refund: 'Refund Amount',
  product_image: 'Product Default Image',
  product_tagged_image: 'Product Tagged Image',
  upsale_name: 'Upsale Product Name',
  upsale_price: 'Upsale Product Price',
  upsale_shipping_price: 'Upsale Product Shipping Price',
  upsale_total_price: 'Upsale Product Total Price',
  upsale_quantity: 'Upsale Product Quantity',
  upsale_image: 'Upsale Product Image',
  full_name: 'Customer Full Name',
  customer_id: 'Customer ID',
  order_id: 'Order ID',
  email: 'Customer Email',
  unit_price: 'Unit Price',
  retail_price: 'Retail Price',
  retail_unit_price: 'Retail Unit Price',
  savings: 'Savings',
  unit_savings: 'Unit Savings',
  campaign_product_id: 'Campaign Product ID',
  return_days: 'Return Days Remaining',
  exchange_days: 'Exchange Days Remaining',
  support_email: 'Support Email',
  offer_name: 'Offer Name',
  phone_number: 'Customer Phone Number',
  order_shipping_price: 'Order Shipping Price',
  total_discount_percent: 'Discount Applied',
  order_create_date: 'Order Create Date'
};


export function getFunnelPathVariables() {
  let items = [];

  Object.keys(FunnelVariables).forEach(key => {
    items.push({value: '{' + key + '}', text: FunnelVariables[key]})
  });

  return items;
}

export enum FunnelStepMobileIconButtonType {
  TILE = 1,
  BOX = 2,
}

export let FunnelStepMobileIconButtonTypeLabels = {};
FunnelStepMobileIconButtonTypeLabels[FunnelStepMobileIconButtonType.TILE] = 'Tile - Buttons';
FunnelStepMobileIconButtonTypeLabels[FunnelStepMobileIconButtonType.BOX] = 'Box - Buttons';


export function getFunnelStepMobileIconButtonTypeOptions() {
  let items = [];

  Object.keys(FunnelStepMobileIconButtonTypeLabels).forEach(key => {
    items.push({value: key, text: FunnelStepMobileIconButtonTypeLabels[key]})
  });

  return items;
}
