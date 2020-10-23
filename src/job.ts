export function simplify(n: number): number {
    return Math.floor(parseFloat(n.toFixed(2)) + 0.5)
}

export function calculate(salary: number): { net: number, tax: number } {
    const rates: any = {
        socialContributionTax: {
            type: 'gross',
            rate: 0.155,// 15.5%
            partOfGross: false
        },
        vocationalTrainingContribution: {
            type: 'gross',
            rate: 0.015,// 1.5%
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

    const p = parseFloat(Object.keys(rates)
        .map(k => rates[k])
        .filter(i => i.partOfGross === false)
        .map(i => i.rate)
        .reduce((a,b) => a + b, 0)
        .toFixed(2))

    const gross = simplify(salary / (1 + p))

    const tax = Object.keys(rates)
        .map(k => simplify(rates[k].rate * gross))
        .reduce((a,b) => a + b, 0)

    const net = salary - tax

    return {
        net,
        tax
    }
}
