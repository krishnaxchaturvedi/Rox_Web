import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
const transporter=nodemailer.createTransport({host:env.mailHost,port:env.mailPort,secure:env.mailPort===465,auth:env.mailUser&&env.mailPassword?{user:env.mailUser,pass:env.mailPassword}:undefined});
export async function sendPasswordResetOtp(to,otp){
 if(!env.mailUser||!env.mailPassword)throw new Error('Email service is not configured.');
 await transporter.sendMail({from:env.mailFrom,to,subject:'RoxRatings password reset OTP',text:'Your RoxRatings password reset OTP is '+otp+'. It expires in 10 minutes. If you did not request this, ignore this email.',html:'<h2>RoxRatings password reset</h2><p>Your one-time password is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">'+otp+'</p><p>This OTP expires in 10 minutes.</p>'});
}