import {BillingCycleTypeMap, CampaignProduct, DiscountPriceTypeMap, ImageSize} from '../_models';
import {getCampaignProductImageUrl} from '../_helpers';


export const campaignProductFieldData = {
  image: {
    label: 'IMAGE', getter: (campaignProduct: CampaignProduct, value: any) =>
      getCampaignProductImageUrl(campaignProduct, ImageSize.original)
  },
  name: {
    label: 'PRODUCT NAME', getter: (campaignProduct: CampaignProduct, value: any) => value
  },
  product_name: {
    label: 'BASE PRODUCT NAME', getter: (campaignProduct: CampaignProduct, value: any) => campaignProduct.product ? campaignProduct.product.name : ''
  },
  billing_cycle_type: {
    label: 'BILLING CYCLE TYPE', getter: (campaignProduct: CampaignProduct, value: any) => BillingCycleTypeMap[value]
  },
  discount_type: {
    label: 'DISCOUNT TYPE', getter: (campaignProduct: CampaignProduct, value: any) => DiscountPriceTypeMap[campaignProduct.discount_type]
  },
  crm: {
    label: 'CRM', getter: (campaignProduct: CampaignProduct, value: any, crms: any) => crms[campaignProduct.crm] || ''
  },
  campaign_product_id: {
    label: 'PRODUCT ID', getter: (campaignProduct: CampaignProduct, value: any) => value
  },
  price: {
    label: 'PRICE', getter: (campaignProduct: CampaignProduct, value: any) => value
  },
  fulfillment_quantity: {
    label: 'FULFILLMENT QUANTITY', getter: (campaignProduct: CampaignProduct, value: any) => campaignProduct.product ? campaignProduct.product.quantity : ''
  },
  min_price: {
    label: 'MIN. PRICE', getter: (campaignProduct: CampaignProduct, value: any) => value
  },
  base_product_id: {
    label: 'BASE PRODUCT ID',
    getter: (campaignProduct: CampaignProduct, value: any) => campaignProduct.product ? campaignProduct.product.product_id : ''
  },
  product_sku: {
    label: 'SKU',
    getter: (campaignProduct: CampaignProduct, value: any) => campaignProduct.product ? campaignProduct.product.sku : ''
  },
  crm_campaign_name: {
    label: 'CAMPAIGN',
    getter: (campaignProduct: CampaignProduct, value: any, crmCampaigns: any) => crmCampaigns[campaignProduct.crm_campaign] ? crmCampaigns[campaignProduct.crm_campaign].name : ''
  },
  crm_campaign_id: {
    label: 'CRM CAMPAIGN ID',
    getter: (campaignProduct: CampaignProduct, value: any, crmCampaigns: any) => crmCampaigns[campaignProduct.crm_campaign] ? crmCampaigns[campaignProduct.crm_campaign].crm_campaign_id : ''
  },
};
