import createApiClient from "./api.service";

class ClassesService {
  constructor(baseUrl = "/api/classes") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async getChildrenNoneClass(id) {
    return (await this.api.get(`/${id}/children-none-class`)).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async createAuto(data) {
    return (await this.api.post("/create-auto", data)).data;
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
  async addChild(id, data) {
    return (await this.api.put(`/${id}/add-child`, data)).data;
  }
  async removeChild(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async addChildAuto(id, data) {
    return (await this.api.put(`/${id}/add-child-auto`, data)).data;
  }
  async addChildMany(id, data) {
    return (await this.api.put(`/${id}/add-child-many`, data)).data;
  }
  async removeChildMany(id, data) {
    return (await this.api.put(`/${id}/remove-child-many`, data)).data;
  }
  async removeChild(id, data) {
    return (await this.api.put(`/${id}/remove-child`, data)).data;
  }
}

export default new ClassesService();
