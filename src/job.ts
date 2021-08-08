interface TaxRates {
  [name: string]: {
    type: 'gross'
    rate: number
    partOfGross: boolean
  }
}

// https://www.nav.gov.hu/nav/ado/szocialis_hozzajarulasi_ado/ado_merteke.html
function getSocialContributionTaxRate(year: number) {
  switch (year) {
    case 2022:
      return 0.15
    case 2021:
      return 0.155
    case 2020:
      return 0.155
    case 2019:
      return 0.175
    case 2018:
      return 0.195
    case 2017:
      return 0.22
    case 2016:
      return 0.27
    case 2015:
      return 0.27
    case 2014:
      return 0.27
    case 2013:
      return 0.27
    case 2012:
      return 0.27
    default:
      if (year >= 2022) {
        return 0.15
      } else {
        return 0.27
      }
  }
}

export function calculate(params: {
  wageCost: number
  year: number
}): { net: number, tax: number } {
  const {wageCost, year} = params
  const taxRates: TaxRates = {
    socialContributionTax: {
      type: 'gross',
      rate: getSocialContributionTaxRate(year),
      partOfGross: false
    },
    personalIncomeTax: {
      type: 'gross',
      rate: 0.15,// 15%
      partOfGross: true
    },
    socialInsuranceTax: {
      type: 'gross',
      rate: 0.185,// 18.5%
      partOfGross: true
    },
  }

  if (year < 2022) {
    taxRates.vocationalTrainingContribution = {
      type: 'gross',
      rate: 0.015,// 1.5%
      partOfGross: false
    }
  }

  const p = parseFloat(Object.keys(taxRates)
    .map(k => taxRates[k])
    .filter(i => i.partOfGross === false)
    .map(i => i.rate)
    .reduce((a, b) => a + b, 0)
    .toFixed(2))

  const gross = Math.round(wageCost / (1 + p))

  const tax = Object.keys(taxRates)
    .map(k => Math.round(taxRates[k].rate * gross))
    .reduce((a, b) => a + b, 0)

  const net = wageCost - tax

  return {
    net,
    tax
  }
}
