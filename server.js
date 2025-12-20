/**
 * 邮件发送服务器
 * 使用 Node.js + Express + Nodemailer
 */

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname)));

let transporter;

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
      }
    });
  }

  return transporter;
}

// 验证邮件配置
try {
  getTransporter().verify(function(error, success) {
    if (error) {
      console.log('邮件服务配置错误:', error);
    } else {
      console.log('邮件服务已就绪');
    }
  });
} catch (error) {
  console.log('邮件服务未配置:', error.message);
}

// 发送邮件API
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 验证必填字段
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: '请填写所有必填项'
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }

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
          <h2 style="color: #8B5CF6; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px;">
            📮 收到新的网站留言
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>👤 发送者：</strong>${name}</p>
            <p style="margin: 10px 0;"><strong>📧 邮箱：</strong><a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>📝 主题：</strong>${subject}</p>
          </div>
          <div style="background: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 10px;">
            <h3 style="color: #333; margin-top: 0;">💬 留言内容：</h3>
            <p style="color: #555; line-height: 1.8; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px; text-align: center;">
            此邮件来自「我的小天地」个人网站
          </p>
        </div>
      `
    };

    // 发送邮件
    await getTransporter().sendMail(mailOptions);

    // 发送自动回复给访客
    const autoReplyOptions = {
      from: `"我的小天地" <${emailUser}>`,
      to: email,
      subject: '感谢你的留言！',
      html: `
        <div style="font-family: 'Microsoft YaHei', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B5CF6;">嗨 ${name}，感谢你的留言！ 💜</h2>
          <p style="color: #555; line-height: 1.8;">
            我已经收到你的消息啦，会尽快回复你的～
          </p>
          <p style="color: #555; line-height: 1.8;">
            如果有急事，也可以直接加我微信：<strong>wxlin52o1314</strong>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            —— 来自「我的小天地」
          </p>
        </div>
      `
    };

    // 发送自动回复（不等待结果）
    getTransporter().sendMail(autoReplyOptions).catch(err => {
      console.log('自动回复发送失败:', err);
    });

    res.json({
      success: true,
      message: '留言发送成功'
    });

  } catch (error) {
    console.error('发送邮件失败:', error);
    res.status(500).json({
      success: false,
      message: '发送失败，请稍后重试'
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
