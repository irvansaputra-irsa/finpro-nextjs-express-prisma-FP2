import nodemailer from 'nodemailer';
import { NODEMAILER_EMAIL, NODEMAILER_PASS } from '../config';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = `${0}`;
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: String(NODEMAILER_EMAIL),
    pass: String(NODEMAILER_PASS),
  },
});
