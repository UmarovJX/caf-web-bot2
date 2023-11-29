import Core from "@/services/helper/core.js";

class BranchService extends Core {
  constructor() {
    super();
  }

  getAllBranches(latitude, longitude) {
    return this.post("branches", { latitude, longitude });
  }

  fetchAllBranches(latitude, longitude) {
    return this.get("branches", { latitude, longitude });
  }
}

export default new BranchService();
