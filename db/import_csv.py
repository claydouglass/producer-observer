#!/usr/bin/env python3
"""
Import Sold Items CSV into PostgreSQL database.

Usage:
    python db/import_csv.py --csv src/data/Sold\ Items*.csv --db postgresql://localhost/producer_observer
"""

import argparse
import csv

import psycopg2
from import_utils import (
    get_or_create,
    get_or_create_product,
    get_or_create_retailer,
    link_brand_supplier,
    parse_datetime,
    parse_decimal,
)
from psycopg2.extras import execute_values


def import_csv(csv_path, db_url):
    """Import CSV data into database."""
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    # Cache for lookups
    brands = {}
    suppliers = {}
    categories = {}
    products = {}

    # Create retailer
    retailer_id = get_or_create_retailer(cur, "Miracle Greens Bend")

    # Find revenue column
    with open(csv_path, "r") as f:
        reader = csv.DictReader(f)
        rev_col = [
            c
            for c in reader.fieldnames
            if "Total Collected" in c and "Post-Discount" in c
        ][0]

    sales_batch = []
    row_count = 0

    with open(csv_path, "r") as f:
        reader = csv.DictReader(f)

        for row in reader:
            row_count += 1

            # Get or create brand
            brand_name = row.get("Brand", "").strip()
            if brand_name and brand_name not in brands:
                brands[brand_name] = get_or_create(cur, "brands", "name", brand_name)
            brand_id = brands.get(brand_name)

            # Get or create supplier
            supplier_license = row.get("Supplier License", "").strip()
            supplier_name = row.get("Supplier Name", "").strip()
            supplier_key = f"{supplier_license}|{supplier_name}"
            if supplier_key and supplier_key not in suppliers:
                if supplier_license and supplier_name:
                    suppliers[supplier_key] = get_or_create(
                        cur,
                        "suppliers",
                        "license",
                        supplier_license,
                        {"name": supplier_name},
                    )
            supplier_id = suppliers.get(supplier_key)

            # Get or create category
            category_name = row.get("Category", "").strip()
            if category_name and category_name not in categories:
                categories[category_name] = get_or_create(
                    cur, "categories", "name", category_name
                )
            category_id = categories.get(category_name)

            # Get or create product
            product_name = row.get("Product", "").strip()
            sku = row.get("SKU", "").strip()
            product_key = f"{product_name}|{sku}"
            if product_key and product_key not in products:
                products[product_key] = get_or_create_product(
                    cur, product_name, sku, brand_id, category_id
                )
            product_id = products.get(product_key)

            # Link brand to supplier
            link_brand_supplier(cur, brand_id, supplier_id)

            # Build sale record
            sale = (
                row.get("Receipt ID", "").strip() or None,
                retailer_id,
                product_id,
                brand_id,
                supplier_id,
                row.get("Customer ID", "").strip() or None,
                parse_decimal(row.get("Quantity Sold")),
                parse_decimal(row.get(rev_col)),
                parse_decimal(row.get("Cost")),
                parse_decimal(row.get("Net Profit")),
                parse_datetime(row.get("Completed At")),
                row.get("Customer Type", "").strip() or None,
                row.get("Strain Species", "").strip() or None,
                parse_decimal(row.get("Weight Sold")),
                row.get("Unit of Measure", "").strip() or None,
            )
            sales_batch.append(sale)

            # Batch insert every 1000 rows
            if len(sales_batch) >= 1000:
                insert_sales_batch(cur, sales_batch)
                sales_batch = []
                print(f"Imported {row_count} rows...")

    # Insert remaining
    if sales_batch:
        insert_sales_batch(cur, sales_batch)

    conn.commit()
    print_summary(row_count, brands, suppliers, categories, products)

    cur.close()
    conn.close()


def insert_sales_batch(cur, batch):
    """Insert batch of sales records."""
    execute_values(
        cur,
        """INSERT INTO sales (
            receipt_id, retailer_id, product_id, brand_id, supplier_id,
            customer_id, quantity, revenue, cost, profit, sold_at,
            customer_type, strain_species, weight_sold, unit_of_measure
        ) VALUES %s""",
        batch,
    )


def print_summary(row_count, brands, suppliers, categories, products):
    """Print import summary."""
    print(f"\nImport complete!")
    print(f"  Rows: {row_count}")
    print(f"  Brands: {len(brands)}")
    print(f"  Suppliers: {len(suppliers)}")
    print(f"  Categories: {len(categories)}")
    print(f"  Products: {len(products)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import CSV to PostgreSQL")
    parser.add_argument("--csv", required=True, help="Path to CSV file")
    parser.add_argument("--db", required=True, help="PostgreSQL connection URL")
    args = parser.parse_args()

    import_csv(args.csv, args.db)
