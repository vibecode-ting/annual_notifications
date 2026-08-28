import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import * as nodemailer from 'nodemailer';

admin.initializeApp();
const db = admin.firestore();

export const dailyMilestoneAlerts = functions.pubsub
  .schedule('0 9 * * *') // Every day at 9 AM
  .onRun(async (context) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const [month, day] = [today.getMonth() + 1, today.getDate()];

    // Note: Firestore doesn't support complex date queries well for birthdays
    // In a real production app, you might store dobMonth and dobDay as separate fields
    // For this implementation, we fetch all active employees and filter in memory (suitable for medium scale)
    const usersSnapshot = await db.collection('settings').get();

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const settings = userDoc.data();
      
      const employeesSnapshot = await db.collection('employees')
        .where('userId', '==', userId)
        .where('status', '==', 'active')
        .get();

      const milestones = [];

      for (const empDoc of employeesSnapshot.docs) {
        const emp = empDoc.data();
        const dob = new Date(emp.dob);
        const joined = new Date(emp.joinedDate);

        // Birthday check
        if (dob.getMonth() + 1 === month && dob.getDate() === day) {
          milestones.push({ emp, type: 'BIRTHDAY' });
        }

        // Anniversary check
        if (joined.getMonth() + 1 === month && joined.getDate() === day) {
          const years = today.getFullYear() - joined.getFullYear();
          if (years > 0) {
            milestones.push({ emp, type: 'ANNIVERSARY', years });
          }
        }
      }

      if (milestones.length > 0) {
        await dispatchAlerts(userId, settings, milestones);
      }
    }
  });

async function dispatchAlerts(userId: string, settings: any, milestones: any[]) {
  for (const milestone of milestones) {
    const { emp, type, years } = milestone;
    const template = type === 'BIRTHDAY' ? settings.templates.birthday : settings.templates.anniversary;
    
    let message = template
      .replace('{{employee_name}}', `${emp.firstName} ${emp.lastName}`)
      .replace('{{department}}', emp.department)
      .replace('{{job_title}}', emp.jobTitle);

    if (type === 'ANNIVERSARY') {
      message = message.replace('{{years_of_service}}', years.toString());
    }

    // 1. MS Teams
    if (settings.teams?.enabled && settings.teams.webhookUrl) {
      await axios.post(settings.teams.webhookUrl, {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": type === 'BIRTHDAY' ? "E11D48" : "4F46E5",
        "summary": "Employee Milestone",
        "sections": [{
          "activityTitle": type === 'BIRTHDAY' ? "🎂 Birthday Alert!" : "🎊 Work Anniversary!",
          "activitySubtitle": `${emp.firstName} ${emp.lastName} - ${emp.department}`,
          "text": message
        }]
      });
    }

    // 2. Telegram
    if (settings.telegram?.enabled && settings.telegram.botToken && settings.telegram.chatId) {
      const url = `https://api.telegram.org/bot${settings.telegram.botToken}/sendMessage`;
      await axios.post(url, {
        chat_id: settings.telegram.chatId,
        text: `*${type === 'BIRTHDAY' ? '🎂 Birthday' : '🎊 Anniversary'} Alert*\n\n${message}`,
        parse_mode: 'Markdown'
      });
    }

    // 3. Email (SMTP)
    if (settings.smtp?.enabled && settings.smtp.host) {
      const transporter = nodemailer.createTransport({
        host: settings.smtp.host,
        port: settings.smtp.port,
        secure: settings.smtp.port === 465,
        auth: {
          user: settings.smtp.user,
          pass: settings.smtp.pass, // Ideally fetched from Secret Manager
        },
      });

      await transporter.sendMail({
        from: '"Milestone Alerts" <alerts@company.com>',
        to: emp.email,
        subject: type === 'BIRTHDAY' ? 'Happy Birthday!' : 'Happy Work Anniversary!',
        text: message
      });
    }

    // Log the notification
    await admin.firestore().collection('notification_logs').add({
      userId,
      employeeId: emp.id || 'bulk',
      milestoneType: type,
      timestamp: admin.firestore.Timestamp.now(),
      status: 'success'
    });
  }
}
