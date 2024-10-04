const express = require('express');
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');

const app = express();

app.get('/otp-tele', async (req, res) => {
  const config = {
    imap: {
      user: 'dobachkhoa2k1@gmail.com',
      password: 'ygnc ahfm npdq mytw',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }, // Bỏ qua lỗi chứng chỉ tự ký
      authTimeout: 3000,
    },
  };

  try {
    // Kết nối đến Gmail qua IMAP
    const connection = await imaps.connect(config);
    
    // Mở hộp thư đến
    await connection.openBox('INBOX');

    // Tìm email chưa đọc từ Telegram
    // const searchCriteria = ['UNSEEN', ['FROM', 'telegram.org']];
    const searchCriteria = [ ['FROM', 'telegram.org']];

    const fetchOptions = { bodies: ['HEADER'] };
    const results = await connection.search(searchCriteria, fetchOptions);

    let otp = 'No new OTP found';
    if (results.length > 0) {
      const latestEmail = results[results.length - 1];
      const headers = latestEmail.parts.filter(part => part.which === 'HEADER')[0].body;
      const subject = headers.subject[0];

      // Tìm mã OTP từ tiêu đề (mã gồm 6 chữ số)
      const otpMatch = subject.match(/\b\d{6}\b/);
      if (otpMatch) {
        otp = otpMatch[0]; // Lấy mã OTP
      }
    }

    // Đóng kết nối
    connection.end();

    // Trả về OTP
    res.status(200).json({ otp: otp });

  } catch (error) {
    // Xử lý ngoại lệ và trả về lỗi
    res.status(500).json({ error: error.message });
  }
});


app.get('/otp-gmail', async (req, res) => {
    const config = {
      imap: {
        user: 'dobachkhoa2k1@gmail.com',
        password: 'ygnc ahfm npdq mytw',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }, // Bỏ qua lỗi chứng chỉ tự ký
        authTimeout: 3000,
      },
    };
  
    try {
      // Kết nối đến Gmail qua IMAP
      const connection = await imaps.connect(config);
      
      // Mở hộp thư đến
      await connection.openBox('INBOX');
  
      // Tìm email chưa đọc từ Telegram
      // const searchCriteria = ['UNSEEN', ['FROM', 'telegram.org']];
      const searchCriteria = [ ['FROM', 'google']];
  
      const fetchOptions = { bodies: ['HEADER'] };
      const results = await connection.search(searchCriteria, fetchOptions);
      console.log(results)
      let otp = 'No new OTP found';
      if (results.length > 0) {
        const latestEmail = results[results.length - 1];
        const headers = latestEmail.parts.filter(part => part.which === 'HEADER')[0].body;
        const subject = headers.subject[0];
        console.log(subject)
        // Tìm mã OTP từ tiêu đề (mã gồm 6 chữ số)
        const otpMatch = subject.match(/\b\d{6}\b/);
        if (otpMatch) {
          otp = otpMatch[0]; // Lấy mã OTP
        }
      }
  
      // Đóng kết nối
      connection.end();
  
      // Trả về OTP
      res.status(200).json({ otp: otp });
  
    } catch (error) {
      // Xử lý ngoại lệ và trả về lỗi
      res.status(500).json({ error: error.message });
    }
  });

// Khởi chạy máy chủ Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
