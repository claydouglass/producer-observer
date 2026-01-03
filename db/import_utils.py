"""Utility functions for CSV import."""

from datetime import datetime
from decimal import Decimal


def parse_decimal(val):
    """Parse decimal from CSV, handling currency symbols and commas."""
    if not val:
        return None
    try:
        return Decimal(val.replace(",", "").replace("$", "").strip())
    except:
        return None


def parse_datetime(val):
    """Parse datetime from CSV."""
    if not val:
        return None
    try:
        return datetime.strptime(val.strip(), "%m/%d/%Y %I:%M:%S %p")
    except:
        try:
            return datetime.strptime(val.split()[0], "%m/%d/%Y")
        except:
            return None


def get_or_create(cur, table, name_col, name_val, extra_cols=None):
    """Get existing ID or create new record."""
    if not name_val:
        return None

    cur.execute(f"SELECT id FROM {table} WHERE {name_col} = %s", (name_val,))
    row = cur.fetchone()
    if row:
        return row[0]

    if extra_cols:
        cols = [name_col] + list(extra_cols.keys())
        vals = [name_val] + list(extra_cols.values())
        placeholders = ", ".join(["%s"] * len(vals))
        col_names = ", ".join(cols)
        cur.execute(
            f"INSERT INTO {table} ({col_names}) VALUES ({placeholders}) RETURNING id",
            vals,
        )
    else:
        cur.execute(
            f"INSERT INTO {table} ({name_col}) VALUES (%s) RETURNING id", (name_val,)
        )
    return cur.fetchone()[0]


def get_or_create_retailer(cur, name):
    """Get or create retailer, return ID."""
    cur.execute(
        "INSERT INTO retailers (name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING id",
        (name,),
    )
    row = cur.fetchone()
    if row:
        return row[0]
    cur.execute("SELECT id FROM retailers WHERE name = %s", (name,))
    return cur.fetchone()[0]


def get_or_create_product(cur, name, sku, brand_id, category_id):
    """Get or create product, return ID."""
    cur.execute(
        """INSERT INTO products (name, sku, brand_id, category_id)
           VALUES (%s, %s, %s, %s)
           ON CONFLICT DO NOTHING RETURNING id""",
        (name, sku or None, brand_id, category_id),
    )
    result = cur.fetchone()
    if result:
        return result[0]
    cur.execute(
        "SELECT id FROM products WHERE name = %s AND sku = %s", (name, sku or None)
    )
    row = cur.fetchone()
    return row[0] if row else None


def link_brand_supplier(cur, brand_id, supplier_id):
    """Create brand-supplier relationship if not exists."""
    if brand_id and supplier_id:
        cur.execute(
            """INSERT INTO brand_suppliers (brand_id, supplier_id)
               VALUES (%s, %s) ON CONFLICT DO NOTHING""",
            (brand_id, supplier_id),
        )
