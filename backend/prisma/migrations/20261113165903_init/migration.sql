-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SELLER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BLIK', 'CARD', 'TRANSFER', 'CASH_ON_DELIVERY');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProductReportReason" AS ENUM ('SCAM', 'FAKE', 'COPYRIGHT', 'WRONG_CATEGORY', 'OFFENSIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProductReportStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ParameterType" AS ENUM ('text', 'number', 'select');

-- CreateEnum
CREATE TYPE "IsSeller" AS ENUM ('0', '1');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "role" "UserRole" DEFAULT 'USER',
    "is_super_admin" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "phone" VARCHAR(9),
    "password_updated_at" VARCHAR(45),
    "is_seller" "IsSeller",

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "house_number" VARCHAR(50),
    "apartment_number" VARCHAR(50),
    "postal_code" VARCHAR(20) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) DEFAULT 'Polska',
    "is_default" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allegro_token" (
    "id" INTEGER NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "allegro_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "product_id" INTEGER,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "conversation_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "message" TEXT,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "type" VARCHAR(45),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_addresses" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL DEFAULT 'Polska',
    "phone" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,
    "order_id" INTEGER,

    CONSTRAINT "order_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER,
    "product_name" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "image" TEXT,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "delivery_method" VARCHAR(50) NOT NULL,
    "delivery_price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "locker_id" VARCHAR(50),
    "locker_name" VARCHAR(100),
    "locker_address" VARCHAR(255),
    "payment_method" "PaymentMethod" NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_number" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255),
    "customer_name" VARCHAR(100),
    "customer_last_name" VARCHAR(100),
    "customer_phone" VARCHAR(50),
    "customer_street" VARCHAR(255),
    "customer_postal_code" VARCHAR(20),
    "customer_city" VARCHAR(100),
    "customer_country" VARCHAR(100),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parameter_options" (
    "id" SERIAL NOT NULL,
    "parameter_id" INTEGER NOT NULL,
    "value" VARCHAR(100) NOT NULL,

    CONSTRAINT "parameter_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "is_main" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_reports" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "reporter_id" INTEGER NOT NULL,
    "reason" "ProductReportReason" NOT NULL,
    "description" TEXT,
    "status" "ProductReportStatus" DEFAULT 'PENDING',
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_reviews" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "seller_reply" TEXT,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "external_id" VARCHAR(255),
    "name" VARCHAR(255),
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_data" JSONB,
    "attributes" JSONB,
    "brand" VARCHAR(100),
    "model" VARCHAR(100),
    "seller_id" INTEGER,
    "category_id" INTEGER,
    "subcategory_id" INTEGER,
    "slug" TEXT,
    "type" VARCHAR(50),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "expires_at" TIMESTAMP(0) NOT NULL,
    "is_revoked" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "shop_name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "logo" VARCHAR(255),
    "banner" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "nip" VARCHAR(20),
    "company_name" VARCHAR(255),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "street" VARCHAR(255),
    "city" VARCHAR(100),
    "postal_code" VARCHAR(10),

    CONSTRAINT "seller_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specifications" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategories" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategory_parameters" (
    "id" SERIAL NOT NULL,
    "subcategory_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "type" "ParameterType" DEFAULT 'text',
    "required" BOOLEAN DEFAULT false,
    "sort_order" INTEGER DEFAULT 0,

    CONSTRAINT "subcategory_parameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategory_specifications" (
    "id" SERIAL NOT NULL,
    "subcategory_id" INTEGER NOT NULL,
    "specification_id" INTEGER NOT NULL,

    CONSTRAINT "subcategory_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_addresses_user" ON "addresses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE INDEX "cart_id" ON "cart_items"("cart_id");

-- CreateIndex
CREATE INDEX "cart_items_product_id_idx" ON "cart_items"("product_id");

-- CreateIndex
CREATE INDEX "seller_id" ON "conversations"("seller_id");

-- CreateIndex
CREATE INDEX "conversations_product_id_idx" ON "conversations"("product_id");

-- CreateIndex
CREATE INDEX "conversations_ibfk_1" ON "conversations"("user_id");

-- CreateIndex
CREATE INDEX "fk_favorite_user" ON "favorites"("user_id");

-- CreateIndex
CREATE INDEX "fk_favorite_product" ON "favorites"("product_id");

-- CreateIndex
CREATE INDEX "conversation_id" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "sender_id" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "idx_notifications_user" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "fk_order_items_orders" ON "order_items"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "fk_orders_users" ON "orders"("user_id");

-- CreateIndex
CREATE INDEX "parameter_id" ON "parameter_options"("parameter_id");

-- CreateIndex
CREATE INDEX "fk_product_images_product" ON "product_images"("product_id");

-- CreateIndex
CREATE INDEX "product_reports_product_id_idx" ON "product_reports"("product_id");

-- CreateIndex
CREATE INDEX "reporter_id" ON "product_reports"("reporter_id");

-- CreateIndex
CREATE INDEX "user_id" ON "product_reviews"("user_id");

-- CreateIndex
CREATE INDEX "idx_reviews_product" ON "product_reviews"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_reviews_product_id_user_id_key" ON "product_reviews"("product_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_external_id_key" ON "products"("external_id");

-- CreateIndex
CREATE INDEX "idx_price" ON "products"("price");

-- CreateIndex
CREATE INDEX "idx_stock" ON "products"("stock");

-- CreateIndex
CREATE INDEX "idx_createdAt" ON "products"("created_at");

-- CreateIndex
CREATE INDEX "fk_products_category" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "fk_products_subcategory" ON "products"("subcategory_id");

-- CreateIndex
CREATE INDEX "fk_products_seller" ON "products"("seller_id");

-- CreateIndex
CREATE INDEX "idx_refresh_user" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "seller_profiles_slug_key" ON "seller_profiles"("slug");

-- CreateIndex
CREATE INDEX "fk_seller_user" ON "seller_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subcategories_slug_key" ON "subcategories"("slug");

-- CreateIndex
CREATE INDEX "fk_subcategories_category" ON "subcategories"("category_id");

-- CreateIndex
CREATE INDEX "subcategory_id" ON "subcategory_parameters"("subcategory_id");

-- CreateIndex
CREATE INDEX "subcategory_specifications_subcategory_id_idx" ON "subcategory_specifications"("subcategory_id");

-- CreateIndex
CREATE INDEX "subcategory_specifications_specification_id_idx" ON "subcategory_specifications"("specification_id");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parameter_options" ADD CONSTRAINT "parameter_options_parameter_id_fkey" FOREIGN KEY ("parameter_id") REFERENCES "subcategory_parameters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reports" ADD CONSTRAINT "product_reports_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reports" ADD CONSTRAINT "product_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_profiles" ADD CONSTRAINT "seller_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategory_parameters" ADD CONSTRAINT "subcategory_parameters_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategory_specifications" ADD CONSTRAINT "subcategory_specifications_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategory_specifications" ADD CONSTRAINT "subcategory_specifications_specification_id_fkey" FOREIGN KEY ("specification_id") REFERENCES "specifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
