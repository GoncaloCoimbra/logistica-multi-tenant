"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeProductStatus = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.listProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listProducts = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const { status, search } = req.query;
        const where = {
            companyId: req.user.companyId,
        };
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { internalCode: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const products = await prisma.product.findMany({
            where,
            include: {
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        nif: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(products);
    }
    catch (error) {
        console.error('List products error:', error);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
};
exports.listProducts = listProducts;
const getProduct = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const { id } = req.params;
        const product = await prisma.product.findFirst({
            where: {
                id,
                companyId: req.user.companyId,
            },
            include: {
                supplier: true,
                movements: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!product) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        res.json(product);
    }
    catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Erro ao obter produto' });
    }
};
exports.getProduct = getProduct;
const createProduct = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const { internalCode, description, quantity, unit, totalWeight, totalVolume, currentLocation, supplierId, observations, } = req.body;
        if (!internalCode || !description || !quantity || !unit || !supplierId) {
            res.status(400).json({ error: 'Campos obrigatórios em falta' });
            return;
        }
        const existingProduct = await prisma.product.findFirst({
            where: {
                internalCode,
                companyId: req.user.companyId,
            },
        });
        if (existingProduct) {
            res.status(409).json({ error: 'Código interno já existe' });
            return;
        }
        const product = await prisma.product.create({
            data: {
                internalCode,
                description,
                quantity: parseFloat(quantity),
                unit,
                totalWeight: totalWeight ? parseFloat(totalWeight) : null,
                totalVolume: totalVolume ? parseFloat(totalVolume) : null,
                currentLocation,
                supplierId,
                observations,
                status: client_1.ProductStatus.RECEIVED,
                companyId: req.user.companyId,
            },
            include: {
                supplier: true,
            },
        });
        await prisma.productMovement.create({
            data: {
                productId: product.id,
                newStatus: client_1.ProductStatus.RECEIVED,
                quantity: product.quantity,
                location: currentLocation,
                reason: 'Produto recebido',
                userId: req.user.id,
            },
        });
        await prisma.auditLog.create({
            data: {
                action: 'CREATE',
                entity: 'Product',
                entityId: product.id,
                userId: req.user.id,
                companyId: req.user.companyId,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const { id } = req.params;
        const updateData = req.body;
        const existingProduct = await prisma.product.findFirst({
            where: {
                id,
                companyId: req.user.companyId,
            },
        });
        if (!existingProduct) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date(),
            },
            include: {
                supplier: true,
            },
        });
        await prisma.auditLog.create({
            data: {
                action: 'UPDATE',
                entity: 'Product',
                entityId: product.id,
                userId: req.user.id,
                companyId: req.user.companyId,
            },
        });
        res.json(product);
    }
    catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const { id } = req.params;
        const existingProduct = await prisma.product.findFirst({
            where: {
                id,
                companyId: req.user.companyId,
            },
        });
        if (!existingProduct) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        await prisma.product.delete({
            where: { id },
        });
        await prisma.auditLog.create({
            data: {
                action: 'DELETE',
                entity: 'Product',
                entityId: id,
                userId: req.user.id,
                companyId: req.user.companyId,
            },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Erro ao eliminar produto' });
    }
};
exports.deleteProduct = deleteProduct;
const changeProductStatus = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }
        const { id } = req.params;
        const { newStatus, reason, location } = req.body;
        if (!newStatus) {
            res.status(400).json({ error: 'Novo status é obrigatório' });
            return;
        }
        const existingProduct = await prisma.product.findFirst({
            where: {
                id,
                companyId: req.user.companyId,
            },
        });
        if (!existingProduct) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        const product = await prisma.product.update({
            where: { id },
            data: {
                status: newStatus,
                currentLocation: location || existingProduct.currentLocation,
                lastMovedAt: new Date(),
            },
            include: {
                supplier: true,
            },
        });
        await prisma.productMovement.create({
            data: {
                productId: product.id,
                previousStatus: existingProduct.status,
                newStatus: newStatus,
                quantity: product.quantity,
                location: location || existingProduct.currentLocation,
                reason: reason || 'Mudança de status',
                userId: req.user.id,
            },
        });
        res.json(product);
    }
    catch (error) {
        console.error('Change product status error:', error);
        res.status(500).json({ error: 'Erro ao mudar status do produto' });
    }
};
exports.changeProductStatus = changeProductStatus;
