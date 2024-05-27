import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {
  AlertService,
  CampaignProductService,
  CRMCampaignService,
  CRMService
} from '../_services';
import {FormBuilder, Validators} from '@angular/forms';
import {CrudSaveComponent} from '../_directives';
import {
  BillingCycleTypeEnum,
  CampaignProduct,
  CRM,
  CRMCampaign,
  FulfillmentTypeEnum,
  ImageSize,
  ProcessTypeEnum,
  Product,
  ProductStatusEnum,
  ProductTypeEnum,
  SubscriptionDisplayType,
  TrialTypeEnum
} from '../_models';
import {forkJoin} from "rxjs";
import {getCampaignProductImageUrl} from "../_helpers";

@Component({
  moduleId: module.id.toString(),
  selector: 'campaign-product-form',
  templateUrl: './campaign-product-edit.component.html',
  styleUrls: [
    'campaign-product.component.css'
  ]
})
export class CampaignProductEditComponent extends CrudSaveComponent implements OnInit, OnChanges {
  crm: CRM;
  crmCampaign: CRMCampaign;
  statuses = [
    {label: "Normal", value: ProductStatusEnum.Normal},
    {label: "Cancellable", value: ProductStatusEnum.Cancellable},
    {label: "Read Only", value: ProductStatusEnum.ReadOnly},
    {label: "Hidden", value: ProductStatusEnum.Hidden}
  ];
  overrideProductTypes = [
    {label: "Offer", value: ProductTypeEnum.Offer},
    {label: "Upsell", value: ProductTypeEnum.Upsell},
    {label: "Linked Upsell", value: ProductTypeEnum.LinkedUpsell},
  ];
  processTypes = [
    {value: ProcessTypeEnum.Sale, label: 'Sale'},
    {value: ProcessTypeEnum.Fee, label: 'Fee'},
    {value: ProcessTypeEnum.Warranty, label: 'Warranty'},
    {value: ProcessTypeEnum.Installment, label: 'Installment'},
  ];
  subscriptionDisplayTypes = [
    {value: SubscriptionDisplayType.AfterFirstCycle, label: 'After First Cycle'},
    {value: SubscriptionDisplayType.Always, label: 'Always'},
    {value: SubscriptionDisplayType.Never, label: 'Never'}
  ];
  ready = false;

  @Input('campaignProduct') campaignProduct: CampaignProduct;
  @Output('save') onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output('cancel') onCancel: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected productService: CampaignProductService,
    private crmService: CRMService,
    private campaignService: CRMCampaignService,
    private formBuilder: FormBuilder,
    protected alertService: AlertService
  ) {
    super(router, location, route, productService, alertService);
    this.isNew = false;
    this.isPartial = true;
    this.objectName = 'Product';
  }

  ngOnInit() {
    this.setForm(this.formBuilder.group({
      name: [null],
      offer_name: [null],
      status: [ProductStatusEnum.Normal, Validators.required],
      max_quantity: [null, Validators.min(1)],
      min_price: [0, [Validators.required, Validators.min(0)]],
      override_price: [null, Validators.min(0)],
      override_shipping_price: [null, Validators.min(0)],
      retail_price: [null, Validators.min(0)],
      restock_fee: [null, Validators.min(0)],
      override_product_type: [null],
      override_process_type: [null],
      subscription_display_type: [SubscriptionDisplayType.AfterFirstCycle, Validators.required],
      show_next_bill_price: [true],
      return_days: [null, Validators.min(0)],
      exchange_days: [null, Validators.min(0)],
      max_extra_return_days: [null, Validators.min(0)],
      third_party_recurring: [false],
    }));

    this.updateForm();
  }

  ngOnChanges(): void {
    this.updateForm();
  }

  get allFormsValid() {
    return this.form.valid;
  }

  private updateForm() {
    this.ready = false;

    if (this.form) {
      this.resetForm();

      if (this.campaignProduct) {
        this.loading = true;
        this.id = this.campaignProduct.id;

        forkJoin([
          this.crmService.get(this.campaignProduct.crm),
          this.campaignService.get(this.campaignProduct.crm_campaign),
          this.productService.get(this.id)
        ]).subscribe(
          (data: [CRM, CRMCampaign, CampaignProduct]) => {
            this.crm = data[0];
            this.crmCampaign = data[1];
            this.campaignProduct = data[2];

            this.form.patchValue(this.campaignProduct);
            this.form.updateValueAndValidity();
            this.loading = false;
          },
          error => {
            this.handleError(error);
            this.loading = false;
          }
        );

      }

      setTimeout(() => this.ready = true, 0); // this is needed to force the tinymce editor to reload
    }
  }

  getProductImageUrl() {
    return getCampaignProductImageUrl(this.campaignProduct, ImageSize.original);
  }

  getCRMProductType() {
    let productTypes = {};

    productTypes[ProductTypeEnum.Offer] = 'Offer';
    productTypes[ProductTypeEnum.Upsell] = 'Upsell';

    return productTypes[this.campaignProduct.crm_product_type];
  }

  getBillingCycleType() {
    let billingCycleTypes = {};

    billingCycleTypes[BillingCycleTypeEnum.OneTime] = 'One Time';
    billingCycleTypes[BillingCycleTypeEnum.Recurring] = 'Recurring';
    billingCycleTypes[BillingCycleTypeEnum.MultiPay] = 'Multi-Pay';

    return billingCycleTypes[this.campaignProduct.billing_cycle_type];
  }

  getFulfillmentType() {
    let fulfillmentTypes = {};

    fulfillmentTypes[FulfillmentTypeEnum.Standard] = 'Standard';
    fulfillmentTypes[FulfillmentTypeEnum.NoShipment] = 'No Shipment';

    return fulfillmentTypes[this.campaignProduct.product.fulfillment_type];
  }

  getTrialType() {
    let trialTypes = {};

    trialTypes[TrialTypeEnum.None] = 'No Trial';
    trialTypes[TrialTypeEnum.Standard] = 'Standard';
    trialTypes[TrialTypeEnum.Delayed] = 'Delayed';
    trialTypes[TrialTypeEnum.Accelerated] = 'Accelerated';

    return trialTypes[this.campaignProduct.trial_type];
  }

  protected getFormData() {
    let data: {} = Object.assign({}, this.form.value);
    const allow_blank_fields = ['override_price', 'override_shipping_price', 'restock_fee', 'member_price',
      'retail_price', 'return_days', 'exchange_days', 'max_extra_return_days'];

    //convert empty strings to null for certain fields so the api will accept them
    allow_blank_fields.forEach((field: string) => {
      if (field in data) {
        let value = data[field];

        if (typeof(value) == 'string') {
          if (value.trim().length == 0) {
            data[field] = null;
          }
        }
      }
    });

    return data;
  }

  protected onSaveComplete(data) {
    this.loading = false;
    this.onSave.emit(data);
  }
}
