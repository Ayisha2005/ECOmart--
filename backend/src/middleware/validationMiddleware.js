/**
 * Middleware: Validate Registration Payload
 */
export const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Validation Error: Full Name is required' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Validation Error: Valid email address is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, error: 'Validation Error: Password must be at least 6 characters' });
  }
  next();
};

/**
 * Middleware: Validate Login Payload
 */
export const validateLogin = (req, res, next) => {
  const { email, identifier, password } = req.body;
  const userIdentifier = email || identifier;

  if (!userIdentifier || !userIdentifier.trim()) {
    return res.status(400).json({ success: false, error: 'Validation Error: Email or User Identifier is required' });
  }
  if (!password || !password.trim()) {
    return res.status(400).json({ success: false, error: 'Validation Error: Password is required' });
  }
  next();
};

/**
 * Middleware: Validate Product Creation
 */
export const validateProduct = (req, res, next) => {
  const { title, price, weightKg } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, error: 'Validation Error: Product title is required' });
  }
  if (price === undefined || price < 0) {
    return res.status(400).json({ success: false, error: 'Validation Error: Valid price is required' });
  }
  if (weightKg === undefined || weightKg <= 0) {
    return res.status(400).json({ success: false, error: 'Validation Error: Valid weight (kg) is required' });
  }
  next();
};
