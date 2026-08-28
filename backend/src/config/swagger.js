export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ECO MART REST API Documentation',
    version: '2.5.0',
    description: 'Interactive API Documentation for ECO MART India Eco Scrap Marketplace & 3rd-Party Logistics Fleet Platform',
    contact: {
      name: 'ECO MART Platform Engineering',
      email: 'admin@ecomart.in'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local Express Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from /auth/login or /auth/register'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user-seller-1' },
          name: { type: 'string', example: 'Green Earth Recyclers Pvt Ltd' },
          email: { type: 'string', example: 'seller@ecomart.in' },
          phone: { type: 'string', example: '+91 98765 43210' },
          role: { type: 'string', example: 'SELLER', enum: ['ADMIN', 'SELLER', 'BUYER', 'TRANSPORT_MANAGER', 'TRANSPORT_DRIVER'] },
          state: { type: 'string', example: 'Tamil Nadu' },
          city: { type: 'string', example: 'Chennai' },
          pincode: { type: 'string', example: '600028' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'PROD-101' },
          title: { type: 'string', example: 'High-Grade PET Plastic Bottle Bundles' },
          category: { type: 'string', example: 'plastic' },
          description: { type: 'string', example: 'Compressed PET clear bottles, cleaned and sorted.' },
          price: { type: 'number', example: 12500 },
          weightKg: { type: 'number', example: 500 },
          sellerId: { type: 'string', example: 'user-seller-1' },
          sellerName: { type: 'string', example: 'Green Earth Recyclers Pvt Ltd' },
          state: { type: 'string', example: 'Tamil Nadu' },
          city: { type: 'string', example: 'Chennai' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'ORD-1718001' },
          productId: { type: 'string', example: 'PROD-101' },
          productTitle: { type: 'string', example: 'High-Grade PET Plastic Bottle Bundles' },
          quantityKg: { type: 'number', example: 500 },
          totalPrice: { type: 'number', example: 12500 },
          buyerId: { type: 'string', example: 'user-buyer-1' },
          sellerId: { type: 'string', example: 'user-seller-1' },
          status: { type: 'string', example: 'Pending' }
        }
      },
      Partner: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'comp-greenroute' },
          companyName: { type: 'string', example: 'GreenRoute Logistics Pvt Ltd' },
          registrationNo: { type: 'string', example: 'TN-LOG-2024-8891' },
          contactPerson: { type: 'string', example: 'Santhosh Kumar' },
          phone: { type: 'string', example: '+91 98401 11223' },
          email: { type: 'string', example: 'contact@greenroute.in' },
          city: { type: 'string', example: 'Chennai' },
          partnerStatus: { type: 'string', example: 'ACTIVE' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['System Health'],
        summary: 'API Server Health Check',
        description: 'Returns API operational status, version, and database mode',
        responses: {
          200: {
            description: 'Server is healthy',
            content: {
              'application/json': {
                example: {
                  ok: true,
                  service: 'ECO MART REST API',
                  version: '2.5.0',
                  database: 'In-Memory Store',
                  swaggerDocs: 'http://localhost:5000/api-docs'
                }
              }
            }
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Authentication & Users'],
        summary: 'Public User Registration (Seller / Buyer)',
        description: 'Registers a new Seller or Buyer account in the ECO MART marketplace',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                name: 'Ramesh Kumar',
                email: 'ramesh.seller@ecomart.in',
                phone: '+91 98765 43210',
                password: 'Seller@123',
                role: 'SELLER',
                state: 'Tamil Nadu',
                city: 'Chennai',
                pincode: '600001'
              }
            }
          }
        },
        responses: {
          201: { description: 'User account created successfully' },
          400: { description: 'Validation error' },
          409: { description: 'User already exists' }
        }
      }
    },
    '/auth/admin/register': {
      post: {
        tags: ['Authentication & Users'],
        summary: 'Protected Admin Registration (Requires Key)',
        description: 'Registers a Platform Administrator account using the Admin Security Key (ECO-ADMIN-2026)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                securityKey: 'ECO-ADMIN-2026',
                name: 'Platform Admin',
                email: 'admin.super@ecomart.in',
                phone: '+91 98765 00000',
                password: 'Admin@123'
              }
            }
          }
        },
        responses: {
          201: { description: 'Admin account created successfully' },
          403: { description: 'Invalid Admin Security Key' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication & Users'],
        summary: 'User & Portal Login',
        description: 'Authenticates any user role (ADMIN, SELLER, BUYER, TRANSPORT_MANAGER, TRANSPORT_DRIVER) and returns JWT bearer token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                email: 'admin@ecomart.in',
                password: 'Admin@123'
              }
            }
          }
        },
        responses: {
          200: { description: 'Authentication successful, token issued' },
          401: { description: 'Invalid credentials' },
          403: { description: 'Role portal mismatch' }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Authentication & Users'],
        summary: 'Get Logged-in User Profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Current user profile details' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/users': {
      get: {
        tags: ['Authentication & Users'],
        summary: 'Get All Registered Users (Admin Only)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of all system users' }
        }
      }
    },
    '/products': {
      get: {
        tags: ['Scrap Marketplace Products'],
        summary: 'Browse Recyclable Scrap Listings',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category (plastic, paper, metal, ewaste, glass, rubber)' },
          { name: 'sellerId', in: 'query', schema: { type: 'string' }, description: 'Filter by specific Seller ID' }
        ],
        responses: {
          200: { description: 'List of available scrap listings' }
        }
      },
      post: {
        tags: ['Scrap Marketplace Products'],
        summary: 'Create New Scrap Product Listing',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                title: 'Clean Compressed PET Bottle Bales',
                category: 'plastic',
                description: '96% pure clear PET bottles ready for recycling factory.',
                price: 15000,
                weightKg: 600,
                state: 'Tamil Nadu',
                city: 'Chennai',
                pincode: '600028',
                address: 'Industrial Zone 1'
              }
            }
          }
        },
        responses: {
          201: { description: 'Product published to marketplace' }
        }
      }
    },
    '/products/{id}': {
      delete: {
        tags: ['Scrap Marketplace Products'],
        summary: 'Delete Scrap Product Listing',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'PROD-101' }
        ],
        responses: {
          200: { description: 'Product deleted' }
        }
      }
    },
    '/orders': {
      get: {
        tags: ['Marketplace Orders'],
        summary: 'Get Orders List',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of role-accessible orders' }
        }
      },
      post: {
        tags: ['Marketplace Orders'],
        summary: 'Place Scrap Purchase Order (Buyer Only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                productId: 'PROD-101',
                quantityKg: 500,
                buyerName: 'Anand Polymers India',
                buyerAddress: 'Ambattur Industrial Estate, Chennai'
              }
            }
          }
        },
        responses: {
          201: { description: 'Order created successfully' }
        }
      }
    },
    '/orders/{id}/status': {
      patch: {
        tags: ['Marketplace Orders'],
        summary: 'Update Order Status',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'ORD-101' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: { status: 'CONFIRMED' }
            }
          }
        },
        responses: {
          200: { description: 'Order status updated' }
        }
      }
    },
    '/orders/{id}/assign-partner': {
      patch: {
        tags: ['Marketplace Orders'],
        summary: 'Assign Transport Partner Company to Order (Admin Only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'ORD-101' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: { transportCompanyId: 'comp-greenroute' }
            }
          }
        },
        responses: {
          200: { description: 'Transport partner assigned to order' }
        }
      }
    },
    '/partners': {
      get: {
        tags: ['3rd-Party Transport Logistics'],
        summary: 'Get 3rd-Party Transport Partner Companies',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of registered transportation partner companies' }
        }
      },
      post: {
        tags: ['3rd-Party Transport Logistics'],
        summary: 'Add Transport Partner Company (Admin Only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                companyName: 'GreenRoute Logistics Pvt Ltd',
                registrationNo: 'TN-LOG-2026-9901',
                contactPerson: 'Santhosh Kumar',
                phone: '+91 98401 11223',
                email: 'manager@greenroute.in',
                state: 'Tamil Nadu',
                city: 'Chennai',
                serviceAreas: 'Chennai Metropolitan'
              }
            }
          }
        },
        responses: {
          201: { description: 'Transport partner created & invitation generated' }
        }
      }
    },
    '/fleet': {
      get: {
        tags: ['3rd-Party Transport Logistics'],
        summary: 'Get Logistics Fleet Vehicles',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of fleet vehicles' }
        }
      },
      post: {
        tags: ['3rd-Party Transport Logistics'],
        summary: 'Add Vehicle to Transport Fleet',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                vehicleNumber: 'TN 01 AB 9988',
                vehicleType: 'Tata Ace EV Electric',
                capacity: '1.5 Tons',
                driverName: 'Ramesh Kumar'
              }
            }
          }
        },
        responses: {
          201: { description: 'Fleet vehicle registered' }
        }
      }
    },
    '/drivers': {
      get: {
        tags: ['3rd-Party Transport Logistics'],
        summary: 'Get Registered Fleet Drivers',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of transport drivers' }
        }
      },
      post: {
        tags: ['3rd-Party Transport Logistics'],
        summary: 'Register New Fleet Driver',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                name: 'Karthik Subramanian',
                phone: '+91 98765 11223',
                licenseNumber: 'TN01-2022-998877',
                assignedVehicleNumber: 'TN 01 AB 9988'
              }
            }
          }
        },
        responses: {
          201: { description: 'Driver registered successfully' }
        }
      }
    },
    '/impact': {
      get: {
        tags: ['Analytics & Impact'],
        summary: 'Get Environmental Impact Metrics',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Environmental metrics (CO2 saved, waste recycled, trees preserved)' }
        }
      }
    },
    '/dashboard': {
      get: {
        tags: ['Analytics & Impact'],
        summary: 'Get Platform Dashboard Summary Metrics',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Platform summary metrics' }
        }
      }
    }
  }
};
