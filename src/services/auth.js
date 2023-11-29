import Core from "@/services/helper/core.js";

class AuthService extends Core {
  constructor() {
    super();
  }

  signIn(clientId) {
    console.log(clientId, "clientId");
    return this.post(`login`, {
      telegram_id: clientId,
    });
  }
}

export default new AuthService();
