class HtmlProcessingService {
  async generateResetPasswordMessage(username: string, token: string) {
    return `
    <html>
      <body>
        <p>Hi ${username},</p>
        <p>Click <a href="http://${process.env.HOST_STRING}/reset-password/${token}">here</a> to reset your password.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      </body>
    </html>`;
  }
}

export default new HtmlProcessingService();