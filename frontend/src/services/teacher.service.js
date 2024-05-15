import createApiClient from "./api.service";

class TeacherService {
  constructor(baseUrl = "/api/teacher") {
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
  async deleteDiploma(id, data) {
    return (await this.api.put(`/${id}/diploma/delete`, data)).data;
  }
  async addDiploma(id, data) {
    return (await this.api.put(`/${id}/diploma/add`, data)).data;
  }
  async transfer_work(data) {
    return (await this.api.post("/workTransferHistory", data)).data;
  }
}

export default new TeacherService();
