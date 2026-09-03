/**
 * Order & Product Matching Utilities for ECO MART
 */

export const isBuyerOrder = (order, user) => {
  if (!order) return false;
  if (!user) return true;

  const buyerId = String(order.buyerId || '').toLowerCase();
  const buyerEmail = String(order.buyerEmail || '').toLowerCase();
  const buyerName = String(order.buyerName || '').toLowerCase();

  const userId = String(user.id || user._id || '').toLowerCase();
  const userEmail = String(user.email || '').toLowerCase();
  const userName = String(user.name || '').toLowerCase();

  // Direct matches
  if (userId && (buyerId === userId || buyerId.replace('user-', '') === userId.replace('user-', ''))) return true;
  if (userEmail && buyerEmail && buyerEmail === userEmail) return true;
  if (userName && buyerName && (buyerName.includes(userName) || userName.includes(buyerName))) return true;

  // Demo buyer equivalences
  const isDemoUser = userId.includes('buyer') || userEmail === 'buyer@ecomart.in';
  const isDemoOrder = buyerId.includes('buyer') || buyerEmail === 'buyer@ecomart.in' || buyerName.includes('anand') || buyerName.includes('eco buyer') || buyerName.includes('recyclers hub') || buyerName.includes('apex');
  if (isDemoUser && isDemoOrder) return true;

  return false;
};

export const isSellerOrder = (order, user) => {
  if (!order) return false;
  if (!user) return true;

  const sellerId = String(order.sellerId || '').toLowerCase();
  const sellerEmail = String(order.sellerEmail || '').toLowerCase();
  const sellerName = String(order.sellerName || '').toLowerCase();

  const userId = String(user.id || user._id || '').toLowerCase();
  const userEmail = String(user.email || '').toLowerCase();
  const userName = String(user.name || '').toLowerCase();

  if (userId && (sellerId === userId || sellerId.replace('user-', '') === userId.replace('user-', ''))) return true;
  if (userEmail && sellerEmail && sellerEmail === userEmail) return true;
  if (userName && sellerName && (sellerName.includes(userName) || userName.includes(sellerName))) return true;

  const isDemoUser = userId.includes('seller') || userEmail === 'seller@ecomart.in';
  const isDemoOrder = sellerId.includes('seller') || sellerEmail === 'seller@ecomart.in' || sellerName.includes('green earth') || sellerName.includes('eco seller');
  if (isDemoUser && isDemoOrder) return true;

  return false;
};

export const isSellerProduct = (product, user) => {
  if (!product) return false;
  if (!user) return true;

  const sellerId = String(product.sellerId || '').toLowerCase();
  const sellerName = String(product.sellerName || '').toLowerCase();

  const userId = String(user.id || user._id || '').toLowerCase();
  const userName = String(user.name || '').toLowerCase();
  const userEmail = String(user.email || '').toLowerCase();

  if (userId && (sellerId === userId || sellerId.replace('user-', '') === userId.replace('user-', ''))) return true;
  if (userName && sellerName && (sellerName.includes(userName) || userName.includes(sellerName))) return true;

  const isDemoUser = userId.includes('seller') || userEmail === 'seller@ecomart.in';
  const isDemoProduct = sellerId.includes('seller') || sellerName.includes('green earth') || sellerName.includes('eco seller');
  if (isDemoUser && isDemoProduct) return true;

  return false;
};
