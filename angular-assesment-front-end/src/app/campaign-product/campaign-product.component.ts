import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {
  AlertService,
  CampaignProductService,
  CRMCampaignService,
  CRMService,
} from '../_services';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CrudPagedListComponent} from '../_directives';
import {
  CampaignProduct,
  CRM,
  CRMCampaign,
  ImageSize,
  Pager, BillingCycleTypeMap, DiscountPriceTypeMap, Campaign
} from '../_models';
import {forkJoin, Observable} from "rxjs";
import {config} from '../../config/config';
import {takeUntil} from "rxjs/operators";
import {generateFilterQuery, getCampaignProductImageUrl} from '../_helpers';
import {NgxSmartModalService} from 'ngx-smart-modal';
import get from 'lodash-es/get';
import {campaignProductFieldData} from './campaign-product-field-data';

@Component({
  moduleId: module.id.toString(),
  templateUrl: './campaign-product.component.html',
  styleUrls: ['./campaign-product.component.css']
})
export class CampaignProductComponent extends CrudPagedListComponent implements OnInit {
  campaignProducts$: Observable<CampaignProduct[]> = this.data$;
  crmCampaigns: any[] = [];
  crms: CRM[];
  crmNames: {} = {};
  allCRMCampaigns: {} = {};
  selectProductsFlag = false;
  loading = false;
  selectedCampaignProduct: CampaignProduct | null = null;
  selectedCRMCampaign: CRMCampaign | null = null;
  idPrefix = '';
  checkedFields: string[] = [];
  @Input('crmId') defaultCRMId: string | number;
  @Input('campaignId') defaultCRMCampaignId: string | number;

  protected crmCampaignsMap: {} = {};
  pageSize = 50;

  orderingFieldsMap = {
    'price': '_price',
    'name': 'name',
    'base_product_id': 'product__product_id',
    'product_name': 'product__name',
    'crm_campaign_id': 'crm_campaign__crm_campaign_id',
    'crm_campaign_name': 'crm_campaign__name',
    'crm': 'crm__name',
    'image': 'product__images__isnull',
    'product_sku': 'product__sku',
  };

  protected fieldData = campaignProductFieldData;
  public filtersDynamicOptions = {
    crm: [],
    campaign_id: [],
    product_categories: [],
  };

  public fields = {
    dimensions: [
      [
        {model: "image", label: "Image", default: true, disabled: false},
        {model: "name", label: "Product Name", default: true, disabled: false, sortable: true},
        {model: "crm_campaign_name", label: "Campaign", default: true, disabled: false, sortable: true},
        {model: "crm_campaign_id", label: "CRM Campaign ID", default: true, disabled: false, sortable: true},
        {model: "campaign_product_id", label: "Product ID", default: true, disabled: false, sortable: true},
        {model: "base_product_id", label: "Base Product ID", default: true, disabled: false, sortable: true},
        {model: "product_name", label: "Base Product Name", default: false, disabled: false, sortable: true},
        {model: "crm", label: "CRM", default: true, disabled: false},
        {model: "product_sku", label: "SKU", default: false, disabled: false, sortable: true},
        {model: "price", label: "Price", default: false, disabled: false, sortable: true},
        {model: "min_price", label: "Minimum Price", default: false, disabled: false, sortable: true},
        {model: "billing_cycle_type", label: "Billing Cycle Type", default: false, disabled: false},
        {model: "discount_type", label: "Discount Type", default: false, disabled: false},
        {model: "fulfillment_quantity", label: "Fulfillment Quantity", default: false, disabled: false, sortable: true},
      ]
    ],
    filters: [
      [
        {model: "crm_campaign", label: "CRM Campaign", default: false, disabled: false},
        {model: "name__icontains", label: "Name", default: false, disabled: false},
        {model: "product__name__icontains", label: "Base Product Name", default: false, disabled: false},
        {model: "product__sku__icontains", label: "SKU", default: false, disabled: false},
        {model: "campaign_product_id", label: "Campaign Product ID", default: false, disabled: false},
        {model: "product__product_id", label: "Base Product ID", default: false, disabled: false},
        {model: "billing_cycle_type", label: "Billing Cycle Type", default: false, disabled: false},
        {model: "discount_type", label: "Discount Type", default: false, disabled: false},
        {model: "crm_campaign__campaign", label: "Brand", default: false, disabled: false},
      ]
    ],
    filtersData: [
      [
        {model: "name__icontains", filter: "name__icontains", type: "input", label: "Name", default: ""},
        {model: "product__name__icontains", filter: "product__name__icontains", type: "input", label: "Base Product Name", default: ""},
        {model: "product__sku__icontains", filter: "product__sku__icontains", type: "input", label: "SKU", default: ""},
        {model: "product__product_id", filter: "product__product_id", type: "input", label: "Base Product ID", default: ""},
        {model: "crm_campaign", filter: "crm_campaign", type: "multi-select", label: "CRM campaign", default: "", options: []},
        {model: "campaign_product_id", filter: "campaign_product_id", type: "input", label: "Campaign Product ID", default: ""},
        {model: "crm_campaign__campaign", filter: "crm_campaign__campaign", type: "multi-select", label: "Brand", default: "", options: []},
        {model: "billing_cycle_type", filter: "billing_cycle_type", type: "select", label: "Billing Cycle Type", default: "", options:
          [{ label: 'All', value: "" }].concat(
            Object.keys(BillingCycleTypeMap).map((type) => {
              return { label: BillingCycleTypeMap[type], value: type };
            })
          )},
        {model: "discount_type", filter: "discount_type", type: "select", label: "Discount Type", default: "", options:
          [{ label: 'All', value: "" }].concat(
            Object.keys(DiscountPriceTypeMap).map((type) => {
              return { label: DiscountPriceTypeMap[type], value: type };
            })
          )},
      ],
    ]
  };

  constructor(
    protected router: Router,
    protected location: Location,
    protected route: ActivatedRoute,
    protected campaignProductService: CampaignProductService,
    protected alertService: AlertService,
    protected crmService: CRMService,
    protected crmCampaignService: CRMCampaignService,
    protected modalService: NgxSmartModalService,
    protected formBuilder: FormBuilder
  ) {
    super(router, location, route, campaignProductService, alertService);
    this.objectName = 'product';
    this.title = 'Products';
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      crm: [this.defaultCRMId ? this.defaultCRMId : null]
    });

    for (let key of Object.keys(this.fields)) {
      let currentFieldsList = this.fields[key];
      let formGroupName = key;
      let formGroupFields = {};
      for (let group of currentFieldsList) {
        for (let field of group) {
          formGroupFields[field.model] = new FormControl({value: field.default, disabled: field.disabled});
        }
      }
      this.form.addControl(formGroupName, new FormGroup(formGroupFields));
    }

    super.ngOnInit();
    this.fetchCRMRelatedData();
    this.fetchCampaignProducts();
  }

  setupFilterEvents() {}

  anyFieldChecked() {
    let fieldsThatMustBeChecked = ['dimensions'];
    let formData = this.form.value;
    let anyFieldChecked = false;

    Object.keys(formData).forEach(mainKey => {
      if (fieldsThatMustBeChecked.indexOf(mainKey) > -1) {
        let fields = formData[mainKey];
        Object.keys(fields).forEach(key => {
          if (fields[key]) {
            anyFieldChecked = true;
          }
        })
      }
    });

    return anyFieldChecked;
  }

  getCampaignProducts(event = null) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.submitted = true;
    if (!this.form.valid) {
      this.alertService.error("Please see the errors and try again");
      return;
    }
    if (!this.anyFieldChecked()) {
      this.loading = false;
      this.alertService.error("Please select any of the fields to fetch campaign products")
      return;
    }

    let dimensionFields = this.form.value.dimensions;
    this.checkedFields = [];
    let scopedFields = [];

    Object.keys(dimensionFields).forEach(key => {
      if (dimensionFields[key]) {
        scopedFields.push(key);
      }
    });

    this.checkedFields = scopedFields;
  }

  fetchCRMRelatedData() {
    let crmQueryParams = {page: 1, page_size: config.maxPageSize};
    let crmCampaignQueryParams = {page: 1, page_size: config.maxPageSize};

    forkJoin([
      this.crmService.list(crmQueryParams),
      this.crmCampaignService.list(crmCampaignQueryParams)
    ]).subscribe(
      (data: [Pager, Pager]) => {
        if (data) {
          this.crms = data[0].results;
          this.crms.forEach((crm: CRM) => {
            this.crmNames[crm.id.toString()] = crm.name;
            this.crmCampaignsMap[crm.id.toString()] = [];
          });

          this.filtersDynamicOptions['crm_campaign'] = [];

          // fill in the list of crm campaigns for each crm
          data[1].results.forEach((campaign: CRMCampaign) => {
            const campaignMap = {
              id: campaign.id,
              text: `${campaign.name} (${campaign.crm_campaign_id})`
            };
            if (!this.crmCampaignsMap[campaign.crm.toString()]) {
              this.crmCampaignsMap[campaign.crm.toString()] = [];
            }
            this.crmCampaignsMap[campaign.crm.toString()].push(campaignMap);
            this.allCRMCampaigns[campaign.id] = campaign;

            if (!this.filtersDynamicOptions['crm_campaign']) {
              this.filtersDynamicOptions['crm_campaign'] = [];
            }
            this.filtersDynamicOptions['crm_campaign'].push(campaignMap);
          });

          if (this.crms.length == 1) {
            // we only have 1 crm, so select it as the default
            this.defaultCRMId = this.crms[0].id.toString();
            this.form.get('crm').setValue(this.crms[0].id);
          }

          this.filtersDynamicOptions['crm'] = data[0].results;
          this.setDefaultCampaignList();
          this.form.patchValue({
            crm: this.defaultCRMId,
            crm_campaign: this.getDefaultCampaignValue()
          });
        }
        this.fetchCampaignProducts();
      },
      error => {
        this.handleError(error);
      }
    );
  }

  protected setDefaultCampaignList() {
    if (!!this.defaultCRMId) {
      if (this.defaultCRMId.toString() in this.crmCampaignsMap) {
        this.crmCampaigns = this.crmCampaignsMap[this.defaultCRMId.toString()];
      }
    }
  }

  protected getDefaultCampaignValue() {
    let campaignVal = null;

    if (this.defaultCRMCampaignId) {
      const campaignId = this.defaultCRMCampaignId.toString();

      this.crmCampaigns.some(value => {
        if (value.id.toString() === campaignId) {
          campaignVal = [value];
          return true;
        }

        return false;
      });
    }

    return campaignVal;
  }

  protected onRouteParams(params: {}) {
    this.title = 'Products';
    this.selectProductsFlag = false;

    if ('crm' in params) {
      this.defaultCRMId = params['crm'];
      this.form.get('crm').setValue(this.defaultCRMId);
      this.setDefaultCampaignList();
    }
  }

  protected onFilterFieldChange(field: string, value) {
    if (field === 'crm') {
      if (!this.selectProductsFlag) {
        this.setTitleFromCRM(value)
      }

      if (value) {
        this.crmCampaigns = this.crmCampaignsMap[value.toString()];
      } else {
        this.crmCampaigns = [];
      }

      this.form.patchValue({crm_campaign: null});
    }
  }

  protected setTitleFromCRM(crm) {
    if (crm) {
      crm = crm.toString();
    }

    if (crm && crm in this.crmNames) {
      this.title = this.crmNames[crm] + ' Products';
    } else {
      this.title = 'All Products';
    }
  }

  getProductImageThumbnailUrl(campaignProduct) {
    return getCampaignProductImageUrl(campaignProduct, ImageSize.original);
  }

  getProductImageUrl(campaignProduct) {
    return getCampaignProductImageUrl(campaignProduct, ImageSize.original);
  }

  editCampaignProduct(campaignProduct: CampaignProduct) {
    this.selectedCampaignProduct = campaignProduct;
    this.modalService.getModal('editCampaignProductDialog').open();
  }

  onSaveCampaignProduct(campaignProduct: CampaignProduct) {
    this.selectedCampaignProduct = null;
    this.modalService.getModal('editCampaignProductDialog').close();
    this.queryData();
  }

  onCancelEditCampaignProduct() {
    this.selectedCampaignProduct = null;
  }

  editCRMCampaign(campaign: CRMCampaign) {
    this.selectedCRMCampaign = campaign;
    this.openEditCRMCampaignDialog();
  }

  protected openEditCRMCampaignDialog() {
    this.modalService.getModal('editCRMCampaignDialog').open();
  }

  onSaveCRMCampaign(campaign: CRMCampaign) {
    this.modalService.getModal('editCRMCampaignDialog').close();
    this.allCRMCampaigns[campaign.id] = campaign;
  }

  onCloseCRMCampaignDialog() {
    this.selectedCRMCampaign = null;
  }

  cancel() {
    !this.loading && this.goBack();
  }

  getFieldLabel(field: string) : string {
    if (field.startsWith('exclude_')) {
      return ''
    }
    return this.fieldData[field].label;
  }

  getFieldValue(campaignProduct: CampaignProduct, field: string) {
    if (field.startsWith('exclude_')) {
      return ''
    }
    let value = get(campaignProduct, field);
    if ('getter' in this.fieldData[field]) {
      value = this.fieldData[field].getter(campaignProduct, value, field == 'crm' ? this.crmNames : this.allCRMCampaigns);
    }

    return value;
  }

  toggleBooleanField(event, fieldname: string) {
    event.preventDefault();
    event.stopPropagation();
    super.toggleBooleanField(event, fieldname);
  }

  showColumnWithoutLink(field: string) {
    return !([
      'name', 'image', 'price', 'min_price',
      'crm_campaign_name', 'crm_campaign_id'
    ].includes(field));
  }

  fetchCampaignProducts(event = null) {
    this.getCampaignProducts(event);
    this.queryData();
  }

  public queryData() {
    this.loading = true;
    let data = Object.assign(generateFilterQuery(this.form.value), {page: this.page, page_size: this.pageSize});
    if (this.ordering.length > 0) {
      data['ordering'] = this.ordering;
    }
    this.campaignProductService.list(data)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (data: Pager) => {
          this.pageCount = data.num_pages;
          this.page = data.page;
          this._data$.next(data.results);
          if (this.page === 1) {
            this.totalResultCount = data.count;
          }
          this.loading = false;
        },
        error => {
          this.handleError(error);
          this._data$.error(error);
          this.loading = false;
        });
  }

}
