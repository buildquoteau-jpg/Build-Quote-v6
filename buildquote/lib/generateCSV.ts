import { RFQPayload } from './types'

export function generateCSVString(payload: RFQPayload): string {
  const { builder, supplier, items, delivery, siteAddress, siteSuburb, dateRequired, rfqId, projectReference } = payload

  const deliveryLine = delivery === 'delivery'
    ? `Delivery${siteAddress ? ': ' + siteAddress : ''}${siteSuburb ? ', ' + siteSuburb : ''}`
    : 'Store Pick-up'

  const meta = [
    ['RFQ Reference', rfqId],
    ['Date', new Date().toLocaleDateString('en-AU')],
    [],
    ['BUILDER DETAILS'],
    ['Name', builder.builderName],
    ['Company', builder.company],
    ['ABN', builder.abn],
    ['Phone', builder.phone],
    ['Email', builder.email],
    [],
    ['SUPPLIER DETAILS'],
    ['Supplier', supplier.supplierName],
    ['Supplier Email', supplier.supplierEmail],
    ['Account Number', supplier.accountNumber],
    [],
    ['DELIVERY'],
    ['Method', deliveryLine],
    ['Date Required', dateRequired || 'ASAP'],
    ['Project Reference', projectReference || ''],
    [],
    ['LINE ITEMS'],
    ['#', 'Product Name', 'SKU', 'Description/Specs', 'Unit of Measure', 'Quantity'],
  ]

  const itemRows = items.map((item, i) => [
    String(i + 1),
    item.name,
    item.sku,
    item.desc,
    item.uom,
    item.qty,
  ])

  const allRows = [...meta, ...itemRows]

  return allRows
    .map(row => row.map(val => `"${(String(val || '')).replace(/"/g, '""')}"`).join(','))
    .join('\n')
}
