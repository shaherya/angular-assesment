import {
  CampaignProductFormData, ImageSize, RelatedProduct,
  TimeData
} from '../_models';
import * as moment from "moment-timezone";

export function plainText(content, keep_line_breaks = false) {
  if (keep_line_breaks) {
    return content.replace(/<(?!br\s*\/?)[^>]+>/g, '');
  }

  return content.replace(/<[^>]*>/g, '');
}

export function formatMoney(number, decPlaces?, decSep?, thouSep?) {
  decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
  decSep = typeof decSep === 'undefined' ? '.' : decSep;
  thouSep = typeof thouSep === 'undefined' ? ',' : thouSep;
  const sign = number < 0 ? '-' : '';
  const intVal = parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces));
  const i = String(intVal);
  const j = (i.length) > 3 ? i.length % 3 : 0;

  return sign +
    (j ? i.substr(0, j) + thouSep : '') +
    i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, '$1' + thouSep) +
    (decPlaces ? decSep + Math.abs(number - intVal).toFixed(decPlaces).slice(2) : '');
}

export function getDatePart(part) {
  return ('0' + part.toString()).slice(-2)
}

export function parseISODateString(dateStr: string) {
  //dateStr is in YYYY-MM-DD format
  let ds = dateStr.split('-');

  return new Date(parseInt(ds[0]), parseInt(ds[1]) - 1, parseInt(ds[2]), 0, 0, 0, 0);
}

export function formatDateForQuery(date: Date, includeTime: boolean = false) {
  //query expects a date in UTC YYYY-MM-DD HH:MM:SS format
  let result =  date.getUTCFullYear().toString() +
    '-' + getDatePart(date.getUTCMonth() + 1) +
    '-' + getDatePart(date.getUTCDate())

  if (includeTime) {
    result += ' ' + getDatePart(date.getUTCHours()) +
      ':' + getDatePart(date.getUTCMinutes()) +
      ':' + getDatePart(date.getUTCSeconds())
  }

  return result;
}

export function getPlaceholderImageUrl(size: ImageSize) {
  const sizes = {
    original: 400,
    small: 100,
    medium: 200,
    large: 400
  };
  const sizeString = sizes[size].toString();

  return 'https://via.placeholder.com/' + sizeString + 'x' + sizeString + '?text=No+Image';
}

export function getProductImageUrl(product: RelatedProduct, size: ImageSize = ImageSize.original) {
  let image = product.default_image;

  return image && image.file ? image.file[size] : getPlaceholderImageUrl(size);
}

export function getCampaignProductImageUrl(campaignProduct, size: ImageSize = ImageSize.original) {
  if (campaignProduct.image && campaignProduct.image.file) {
    return campaignProduct.image.file[size];
  }

  return getProductImageUrl(campaignProduct.product, size);
}

export function getOrdinal(n: number) {
  const s = ["th","st","nd","rd"];
  const v = n % 100;

  return n.toString() + (s[(v-20)%10] || s[v] || s[0]);
}

export function tinyMCETTextOnly(editor) {
  //if there's a root wrapper element, remove it and replace all line break html elements with text line breaks
  const body = editor.getBody();

  if (body.children.length === 1) {
    const root = body.children[0];

    if (root.tagName.toLowerCase() === 'div') {
      body.style.cssText = root.style.cssText;
      body.removeChild(root);
      body.innerHTML = root.innerHTML;
    }
  }
}

export function tinyMCESingleLine(editor) {
  editor.on('keydown', function (event) {
    if (event.keyCode == 13)  {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
}

export function formatISODate(timestamp) {
  const dt = new Date(timestamp);

  return (dt.getMonth() + 1).toString() + '/' + dt.getDate().toString() + '/' + dt.getFullYear();
}

export function formatISOTimestamp(timestamp, includeSeconds = true) {
  const dt = new Date(timestamp);
  const am_pm = dt.getHours() >= 12 ? 'PM' : 'AM';
  const hours = (dt.getHours() === 0) ? 12 : (dt.getHours() > 12) ? dt.getHours() - 12 : dt.getHours();
  const seconds = includeSeconds ? ':' + ('0' + dt.getSeconds().toString()).slice(-2) : '';

  return (dt.getMonth() + 1).toString() + '/' + dt.getDate().toString() + ' ' + hours.toString() + ':' +
    ('0' + dt.getMinutes().toString()).slice(-2) + seconds + ' ' + am_pm;
}

export function timezoneAwareToUtc(timestamp, timezone) {
  return moment.tz(timestamp, timezone).utc();
}

export function normalizeDateForQuery(date: Date, timezone: string = 'UTC') {
  let thisMoment = timezoneAwareToUtc(date.getTime(), timezone);
  return thisMoment.format(TimeData.DefaultFormat);
}

export function normalizeMomentForQuery(date, timezone = 'UTC') {
  if (typeof date === 'string') {
    return date;
  }
  let thisMoment = timezoneAwareToUtc(date.valueOf(), timezone);
  return thisMoment.format(TimeData.DefaultFormat);
}

export function generateFilterQuery(formData: CampaignProductFormData) {
  let data = {};
  const accounts = [];
  if (Array.isArray(formData.account)) {
    formData.account.forEach(item => {
      accounts.push(item.id);
    });
  } else if (formData.account) {
    accounts.push(formData.account);
  }
  if (accounts && accounts.length) {
    data['accounts'] = accounts;
  }

  if (formData.crm) {
    data['crm'] = formData.crm;
  }

  let formFilters = formData.filtersData;
  let selectedFilters = formData.filters || {};

  Object.keys(selectedFilters).forEach(key => {
    if (selectedFilters[key]) {
      let value = formFilters[key];

      if (value) {
        if (Array.isArray(value)) {
          if (value.length) {
            data[key] = [];
            value.forEach(val => {
              data[key].push(((typeof val === 'object') && ('id' in val)) ? val['id'] : val);
            });

            if (value.length > 1) {
              data[key + '__in'] = data[key].join(',');
              delete data[key];
            } else {
              data[key] = data[key][0];
            }
          }
        } else {
          data[key] = (value && (typeof value === 'object') && ('id' in value)) ? value['id'] : value;
        }
      }
    }
  });

  return data;
}
