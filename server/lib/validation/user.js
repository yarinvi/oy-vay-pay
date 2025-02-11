const { z } = require('zod');

const userIdValidation = z.string().regex(/^[0-9a-fA-F]{24}$/, {  
  message: 'Invalid user ID',
});

const usernameValidation = z
.string()
.min(3, {
  message: 'Username must be at least 3 characters long', 
})
.max(20, {
  message: 'Username must be at most 20 characters long', 
})
.regex(/^[a-zA-Z0-9_]+$/, {
  message: 'Username must contain only letters, numbers, and underscores', 
})

const passwordValidation = z
.string()
.min(8, {
  message: 'Password must be at least 8 characters long', 
})
.max(15, {
  message: 'Password must be at most 15 characters long', 
});

const signUpSchema = z.object({
  fullName: z
    .string()
    .min(4, {
      message: 'Full name must be at least 3 characters long', 
    })
    .max(20, {
      message: 'Full name must be at most 20 characters long', 
    })
    .regex(/^[a-zA-Z\s]*$/) 
    .refine((data) => data.trim().split(' ').length > 1, {
      message: 'Full name must contain only letters and spaces', 
    }),

  username: usernameValidation,

  email: z.string().email(), 

  password: passwordValidation
});

const signInSchema = z.object({
  username: usernameValidation,
  password: passwordValidation
});

const updateUserSchema = z.object({
  fullName: z.string().min(4, {
    message: 'Full name must be at least 4 characters long', 
  })
  .max(20, {
    message: 'Full name must be at most 20 characters long', 
  })
  .regex(/^[a-zA-Z\s]*$/, {
    message: 'Full name must contain only letters and spaces', 
  })
  .refine((data) => data.trim().split(' ').length > 1, {
    message: 'Full name must contain only letters and spaces', 
  })
  .optional(),
  username: usernameValidation.optional(), 
  email: z.string().email().optional(), 
  password: passwordValidation.optional() 
})

.refine(data => {
  return Object.values(data).some(value => value !== undefined);
}, {
  message: "At least one field must be provided for update" 
});

module.exports = {
  signUpSchema,
  signInSchema,
  updateUserSchema,
  userIdValidation,
};
