import createApiClient from "./api.service";

class ChildrenService {
  constructor(baseUrl = "/api/children") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
  async create_statusChange(data) {
    return (await this.api.post("/historyStatus", data)).data;
  }
  async transfer_school(data) {
    return (await this.api.post("/schoolTransferHistory", data)).data;
  }
}

export default new ChildrenService();
