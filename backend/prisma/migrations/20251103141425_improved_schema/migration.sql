
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_companyId_fkey";


ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";


ALTER TABLE "Product" DROP CONSTRAINT "Product_companyId_fkey";


ALTER TABLE "Product" DROP CONSTRAINT "Product_supplierId_fkey";


ALTER TABLE "ProductMovement" DROP CONSTRAINT "ProductMovement_productId_fkey";


ALTER TABLE "ProductMovement" DROP CONSTRAINT "ProductMovement_userId_fkey";


ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_companyId_fkey";


ALTER TABLE "Transport" DROP CONSTRAINT "Transport_companyId_fkey";


ALTER TABLE "Transport" DROP CONSTRAINT "Transport_vehicleId_fkey";


ALTER TABLE "TransportProduct" DROP CONSTRAINT "TransportProduct_productId_fkey";


ALTER TABLE "TransportProduct" DROP CONSTRAINT "TransportProduct_transportId_fkey";


ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";


ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_companyId_fkey";


DROP TABLE "AuditLog";


DROP TABLE "Company";


DROP TABLE "Product";


DROP TABLE "ProductMovement";


DROP TABLE "Supplier";


DROP TABLE "Transport";


DROP TABLE "TransportProduct";


DROP TABLE "User";


DROP TABLE "Vehicle";

CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OPERATOR',
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "address" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "companyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "internalCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "totalWeight" DOUBLE PRECISION,
    "totalVolume" DOUBLE PRECISION,
    "currentLocation" TEXT,
    "supplierId" TEXT NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'RECEIVED',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMovedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shippedAt" TIMESTAMP(3),
    "observations" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_movements" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "previousStatus" "ProductStatus",
    "newStatus" "ProductStatus" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "location" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" DOUBLE PRECISION NOT NULL,
    "year" INTEGER,
    "observations" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transports" (
    "id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "expectedDate" TIMESTAMP(3) NOT NULL,
    "actualDate" TIMESTAMP(3),
    "driver" TEXT,
    "status" "TransportStatus" NOT NULL DEFAULT 'PENDING',
    "vehicleId" TEXT,
    "companyId" TEXT NOT NULL,
    "destinationCompanyId" TEXT,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_products" (
    "id" TEXT NOT NULL,
    "transportId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transport_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "changes" JSONB,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_nif_key" ON "companies"("nif");

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_companyId_idx" ON "users"("companyId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "suppliers_companyId_idx" ON "suppliers"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_nif_companyId_key" ON "suppliers"("nif", "companyId");

-- CreateIndex
CREATE INDEX "products_companyId_idx" ON "products"("companyId");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "products_supplierId_idx" ON "products"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "products_internalCode_companyId_key" ON "products"("internalCode", "companyId");

-- CreateIndex
CREATE INDEX "product_movements_productId_idx" ON "product_movements"("productId");

-- CreateIndex
CREATE INDEX "product_movements_companyId_idx" ON "product_movements"("companyId");

-- CreateIndex
CREATE INDEX "product_movements_createdAt_idx" ON "product_movements"("createdAt");

-- CreateIndex
CREATE INDEX "vehicles_companyId_idx" ON "vehicles"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_licensePlate_companyId_key" ON "vehicles"("licensePlate", "companyId");

-- CreateIndex
CREATE INDEX "transports_companyId_idx" ON "transports"("companyId");

-- CreateIndex
CREATE INDEX "transports_status_idx" ON "transports"("status");

-- CreateIndex
CREATE INDEX "transports_expectedDate_idx" ON "transports"("expectedDate");

-- CreateIndex
CREATE INDEX "transport_products_transportId_idx" ON "transport_products"("transportId");

-- CreateIndex
CREATE INDEX "transport_products_productId_idx" ON "transport_products"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "transport_products_transportId_productId_key" ON "transport_products"("transportId", "productId");

-- CreateIndex
CREATE INDEX "audit_logs_companyId_idx" ON "audit_logs"("companyId");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_movements" ADD CONSTRAINT "product_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_movements" ADD CONSTRAINT "product_movements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transports" ADD CONSTRAINT "transports_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transports" ADD CONSTRAINT "transports_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_products" ADD CONSTRAINT "transport_products_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_products" ADD CONSTRAINT "transport_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
