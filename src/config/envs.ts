import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  SECRET_JWT_TOKEN: string;
  RESEND_API_KEY: string;
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  FRONTEND_URL: string;
  OAUTH_CALLBACK_URL: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    SECRET_JWT_TOKEN: joi.string().required(),
    RESEND_API_KEY: joi.string().required(),
    OAUTH_CLIENT_ID: joi.string().required(),
    OAUTH_CLIENT_SECRET: joi.string().required(),
    CLOUDINARY_CLOUD_NAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
    FRONTEND_URL: joi.string().optional().default('http://localhost:3001'),
    OAUTH_CALLBACK_URL: joi.string().optional().default('http://localhost:3000/api/auth/google/callback'),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  secretJwtToken: envVars.SECRET_JWT_TOKEN,
  resendApiKey: envVars.RESEND_API_KEY,
  oauthClientId: envVars.OAUTH_CLIENT_ID,
  oauthClientSecret: envVars.OAUTH_CLIENT_SECRET,
  cloudinaryCloudName: envVars.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: envVars.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: envVars.CLOUDINARY_API_SECRET,
  frontendUrl: envVars.FRONTEND_URL,
  oauthCallbackUrl: envVars.OAUTH_CALLBACK_URL,
};
