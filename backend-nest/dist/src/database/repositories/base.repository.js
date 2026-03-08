"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    prisma;
    modelName;
    constructor(prisma, modelName) {
        this.prisma = prisma;
        this.modelName = modelName;
    }
    async findAll(where) {
        return this.prisma[this.modelName].findMany({ where });
    }
    async findOne(where) {
        return this.prisma[this.modelName].findUnique({ where });
    }
    async create(data) {
        return this.prisma[this.modelName].create({ data });
    }
    async update(where, data) {
        return this.prisma[this.modelName].update({ where, data });
    }
    async delete(where) {
        return this.prisma[this.modelName].delete({ where });
    }
    async count(where) {
        return this.prisma[this.modelName].count({ where });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map