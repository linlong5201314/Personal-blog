/**
 * Vercel Serverless Function - 邮件发送
 */

const nodemailer = require('nodemailer');

let transporter;

// HTML 转义防止 XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 简易速率限制（基于内存，Serverless 环境下有限但聊胜于无）
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟
const RATE_LIMIT_MAX = 3; // 每分钟最多3次

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimit.get(ip);
  
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { timestamp: now, count: 1 });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
}

function getTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.163.com';
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpSecure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : smtpPort === 465;

  if (!emailUser || !emailPass) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASS');
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 100
    });
  }

  return transporter;
}

// 输入长度限制
const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 2000;

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: '方法不允许'
    });
  }

  // 速率限制检查
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      message: '请求过于频繁，请稍后再试'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    let { name, email, subject, message } = body;

    // 验证必填字段
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: '请填写所有必填项'
      });
    }

    // 去除首尾空格并限制长度
    name = String(name).trim().slice(0, MAX_NAME_LENGTH);
    email = String(email).trim().slice(0, MAX_EMAIL_LENGTH);
    subject = String(subject).trim().slice(0, MAX_SUBJECT_LENGTH);
    message = String(message).trim().slice(0, MAX_MESSAGE_LENGTH);

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }

    // 转义用户输入防止 XSS
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    // 邮件内容
    const emailUser = process.env.EMAIL_USER;
    const emailTo = process.env.EMAIL_TO || 'linlongxiansheng@163.com';
    const mailOptions = {
      from: `"我的小天地" <${emailUser}>`,
      to: emailTo,
      replyTo: email,
      subject: `[网站留言] ${subject}`,
      html: `
        <div style="font-family: 'Microsoft YaHei', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            📮 收到新的网站留言
          </h2>
          <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%); padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>👤 发送者：</strong>${safeName}</p>
            <p style="margin: 10px 0;"><strong>📧 邮箱：</strong><a href="mailto:${safeEmail}" style="color: #10b981;">${safeEmail}</a></p>
            <p style="margin: 10px 0;"><strong>📝 主题：</strong>${safeSubject}</p>
          </div>
          <div style="background: #fff; padding: 20px; border: 1px solid #d1fae5; border-radius: 12px;">
            <h3 style="color: #333; margin-top: 0;">💬 留言内容：</h3>
            <p style="color: #555; line-height: 1.8; white-space: pre-wrap;">${safeMessage}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px; text-align: center;">
            此邮件来自「林龙的小天地」个人网站
          </p>
        </div>
      `
    };

    // 发送邮件
    await getTransporter().sendMail(mailOptions);

    // 发送自动回复给访客
    const autoReplyOptions = {
      from: `"林龙的小天地" <${emailUser}>`,
      to: email,
      subject: '感谢你的留言！ 💚',
      html: `
        <div style="font-family: 'Microsoft YaHei', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #10b981;">嗨 ${safeName}，感谢你的留言！ �</h2>
          <p style="color: #555; line-height: 1.8;">
            我已经收到你的消息啦，会尽快回复你的～
          </p>
          <p style="color: #555; line-height: 1.8;">
            如果有急事，也可以直接加我微信：<strong style="color: #10b981;">wxlin52o1314</strong>
          </p>
          <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%); border-radius: 10px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              期待与你成为朋友！ ✨
            </p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            —— 来自「林龙的小天地」
          </p>
        </div>
      `
    };

    // 发送自动回复（不阻塞响应）
    getTransporter().sendMail(autoReplyOptions).catch(err => {
      console.log('自动回复发送失败:', err);
    });

    res.status(200).json({
      success: true,
      message: '留言发送成功'
    });

  } catch (error) {
    console.error('发送邮件失败:', error);

    const errorCode = error && error.code ? String(error.code) : undefined;
    const errorMessage = error && error.message ? String(error.message) : '';

    let clientMessage = '发送失败，请稍后重试';
    if (errorMessage.includes('Missing EMAIL_USER or EMAIL_PASS')) {
      clientMessage = '服务端未配置邮箱环境变量（EMAIL_USER / EMAIL_PASS）';
    } else if (errorCode === 'EAUTH') {
      clientMessage = 'SMTP 认证失败：请检查 163 邮箱授权码是否正确';
    } else if (errorCode === 'ECONNECTION' || errorCode === 'ETIMEDOUT' || errorCode === 'ESOCKET') {
      clientMessage = '邮件服务连接失败：可能是 Vercel 环境限制 SMTP 出站端口（建议改用邮件服务的 HTTP API）';
    }

    res.status(500).json({
      success: false,
      message: clientMessage,
      errorCode
    });
  }
};
