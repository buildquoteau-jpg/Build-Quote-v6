export interface SupplierEntry {
  name: string
  email: string
  accountNumberLabel?: string
  phone?: string
}

export const SUPPLIERS: SupplierEntry[] = [
  // Bunnings
  { name: 'Bunnings Busselton', email: 'busselton@bunnings.com.au', phone: '08 9754 7000' },
  { name: 'Bunnings Bunbury', email: 'bunbury@bunnings.com.au', phone: '08 9721 7000' },
  { name: 'Bunnings Margaret River', email: 'margaretriver@bunnings.com.au', phone: '08 9758 7000' },
  { name: 'Bunnings Albany', email: 'albany@bunnings.com.au', phone: '08 9842 7000' },
  { name: 'Bunnings Mandurah', email: 'mandurah@bunnings.com.au', phone: '08 9581 7000' },

  // Midalia Steel
  { name: 'Midalia Steel Bunbury', email: 'bunbury@midalia.com.au', phone: '08 9721 5000' },
  { name: 'Midalia Steel Mandurah', email: 'mandurah@midalia.com.au', phone: '08 9581 5000' },

  // BGC
  { name: 'BGC Building Products Bunbury', email: 'bunbury.sales@bgc.com.au', phone: '08 9726 5000' },
  { name: 'BGC Building Products Perth', email: 'perth.sales@bgc.com.au', phone: '08 9377 4000' },

  // Bowens / Timber suppliers
  { name: 'Namba Timber Busselton', email: 'sales@nambatimber.com.au', phone: '08 9754 8000' },
  { name: 'Carter Holt Harvey Bunbury', email: 'bunbury@chh.com.au', phone: '08 9721 6000' },

  // Plumbing
  { name: 'Reece Plumbing Busselton', email: 'busselton@reece.com.au', phone: '08 9754 9000' },
  { name: 'Reece Plumbing Bunbury', email: 'bunbury@reece.com.au', phone: '08 9721 9000' },
  { name: 'Tradelink Bunbury', email: 'bunbury@tradelink.com.au', phone: '08 9721 8500' },

  // Electrical
  { name: 'Rexel Bunbury', email: 'bunbury@rexel.com.au', phone: '08 9721 3000' },
  { name: 'Middy\'s Busselton', email: 'busselton@middys.com.au', phone: '08 9754 3000' },

  // Bricks & Masonry
  { name: 'Brikmakers Bunbury', email: 'bunbury@brikmakers.com.au', phone: '08 9725 5000' },
  { name: 'Austral Bricks Bunbury', email: 'bunbury@australbricks.com.au', phone: '08 9721 4000' },

  // Roofing
  { name: 'Stramit Bunbury', email: 'bunbury@stramit.com.au', phone: '08 9721 2000' },
  { name: 'Lysaght Bunbury', email: 'bunbury@lysaght.com.au', phone: '08 9726 3000' },

  // Hardware & Trade
  { name: 'M&B Trade Centre Bunbury', email: 'sales@mbtradecentre.com.au', phone: '08 9721 1000' },
  { name: 'Total Tools Bunbury', email: 'bunbury@totaltools.com.au', phone: '08 9721 7500' },

  // Insulation
  { name: 'CSR Bradford Bunbury', email: 'bunbury@bradford.com.au', phone: '08 9721 5500' },
]
