// Example sample workspace data (clients, invoices, templates)
export const SAMPLE_WORKSPACE = {
  workspaceId: 'sample-workspace',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  clients: [
    {
      id: 'CL-000001',
      workspaceId: 'sample-workspace',
      name: 'Acme Corp',
      type: 'business',
      address: '123 Market St, Suite 200',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
      version: 1
    },
    {
      id: 'CL-000002',
      workspaceId: 'sample-workspace',
      name: 'Jane Doe',
      type: 'private',
      address: '45 Oak Drive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
      version: 1
    }
  ],
  invoices: [
    {
      id: 'INV-000001',
      workspaceId: 'sample-workspace',
      clientId: 'CL-000001',
      invoiceNumber: 'INV-000001',
      amount: 120,
      paid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
      version: 1
    },
    {
      id: 'INV-000002',
      workspaceId: 'sample-workspace',
      clientId: 'CL-000002',
      invoiceNumber: 'INV-000002',
      amount: 80,
      paid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
      version: 1
    }
  ],
  templates: [
    {
      id: 'TPL-INVOICE-1',
      name: 'Invoice (Simple)',
      supportedClientTypes: ['business','private'],
      content: '<div><h1>Invoice {{invoiceNumber}}</h1><p>Client: {{clientName}}</p><p>Total: {{amount}}</p></div>'
    }
  ]
}