import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { createTenantHandler, getTenantHandler, listMyTenantsHandler, updateTenantHandler } from '../controllers/tenant.controller.js';
import { createApiKeyHandler, listApiKeysHandler, revokeApiKeyHandler } from '../controllers/apiKey.controller.js';

const router = Router();

router.use(requireAuth);

// Tenants
router.post('/', createTenantHandler);
router.get('/', listMyTenantsHandler);
router.get('/:tenantId', getTenantHandler);
router.patch('/:tenantId', updateTenantHandler);

// API Keys for a tenant
router.post('/:tenantId/keys', createApiKeyHandler);
router.get('/:tenantId/keys', listApiKeysHandler);
router.post('/:tenantId/keys/:keyId/revoke', revokeApiKeyHandler);

export default router;
