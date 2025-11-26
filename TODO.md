# TODO: Add Partners Page with Admin Management

## Database and Schema
- [ ] Add Partner model to prisma/schema.prisma
- [ ] Run Prisma migration to update database

## API Routes
- [ ] Create app/api/partners/route.ts for GET/POST operations
- [ ] Create app/api/partners/[id]/route.ts for PUT/DELETE operations

## Admin Components
- [ ] Create app/admin/components/partners-manager.tsx (similar to leadership-manager.tsx)
- [ ] Update app/admin/page.tsx to add "Partners" tab and import PartnersManager

## Public Page
- [ ] Create app/partners/page.tsx for public-facing partners display
- [ ] Create app/partners/partners.module.css for styling

## Testing and Verification
- [ ] Test admin adding/editing/deleting partners
- [ ] Test public page displays partners correctly
- [ ] Ensure images upload properly via /api/upload
