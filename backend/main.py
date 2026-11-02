"""Stateless demonstration API. Never submits real orders or persists personal data."""
from __future__ import annotations

import json
import os
import re
from decimal import Decimal
from pathlib import Path
from typing import Annotated, Literal
from urllib.parse import urlencode
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, field_validator

CATALOG = json.loads((Path(__file__).resolve().parent.parent / 'shared' / 'catalog.json').read_text())
PRODUCTS = CATALOG['products']
BY_ID = {p['id']: p for p in PRODUCTS}
WHATSAPP = os.getenv('MATE_WHATSAPP_NUMBER', '919322172834')
CONTACT_NOTICE = 'Unverified contact number supplied for this demonstration. Confirm with the store before contacting.'
DEMO_NOTICE = 'Demonstration only. No order has been placed, no payment collected, and no customer details stored.'

app = FastAPI(title='Mate Electricals Demo API', version='1.0.0', description=DEMO_NOTICE)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[s.strip() for s in os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',') if s.strip()],
    allow_credentials=False,
    allow_methods=['GET', 'POST'],
    allow_headers=['Content-Type'],
)


class InputModel(BaseModel):
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)


class CartItem(InputModel):
    product_id: str = Field(min_length=1, max_length=100)
    quantity: int = Field(ge=1, le=99, strict=True)


class CartRequest(InputModel):
    items: list[CartItem] = Field(min_length=1, max_length=100)


class Customer(InputModel):
    full_name: str = Field(min_length=2, max_length=100)
    mobile: str
    email: str = Field(max_length=254)
    address: str = Field(min_length=10, max_length=500)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    pin_code: str

    @field_validator('mobile')
    @classmethod
    def mobile_valid(cls, value: str) -> str:
        return validate_mobile(value)

    @field_validator('email')
    @classmethod
    def email_valid(cls, value: str) -> str:
        if not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', value):
            raise ValueError('Enter a valid email address.')
        return value

    @field_validator('pin_code')
    @classmethod
    def pin_valid(cls, value: str) -> str:
        if not re.fullmatch(r'[1-9]\d{5}', value):
            raise ValueError('Enter a valid six-digit Indian PIN code.')
        return value


class CheckoutRequest(CartRequest):
    customer: Customer
    demo_acknowledged: Literal[True]


class ContactRequest(InputModel):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(max_length=254)
    phone: str = ''
    message: str = Field(min_length=10, max_length=3000)
    demo_acknowledged: Literal[True]

    @field_validator('email')
    @classmethod
    def email_valid(cls, value: str) -> str:
        return Customer.email_valid(value)

    @field_validator('phone')
    @classmethod
    def phone_valid(cls, value: str) -> str:
        return validate_mobile(value) if value else ''


class BulkRequest(InputModel):
    name: str = Field(min_length=2, max_length=100)
    company: str = Field(default='', max_length=150)
    phone: str
    requirements: str = Field(min_length=10, max_length=3000)
    quantity: int = Field(ge=1, le=100000, strict=True)
    message: str = Field(default='', max_length=3000)
    demo_acknowledged: Literal[True]

    @field_validator('phone')
    @classmethod
    def phone_valid(cls, value: str) -> str:
        return validate_mobile(value)


def validate_mobile(value: str) -> str:
    digits = re.sub(r'[\s()-]', '', value)
    if digits.startswith('+91'):
        digits = digits[3:]
    elif len(digits) == 12 and digits.startswith('91'):
        digits = digits[2:]
    if not re.fullmatch(r'[6-9]\d{9}', digits):
        raise ValueError('Enter a valid ten-digit Indian mobile number.')
    return digits


def quote(items: list[CartItem]) -> dict:
    """Recompute from trusted demo prices; never accept client-supplied totals."""
    consolidated: dict[str, int] = {}
    for item in items:
        if item.product_id not in BY_ID:
            raise HTTPException(status_code=422, detail=f'Unknown product: {item.product_id}')
        consolidated[item.product_id] = consolidated.get(item.product_id, 0) + item.quantity
        if consolidated[item.product_id] > 99:
            raise HTTPException(status_code=422, detail='Maximum quantity is 99 per product.')
    lines = []
    subtotal = Decimal('0')
    for product_id, quantity in consolidated.items():
        product = BY_ID[product_id]
        price = Decimal(str(product['price']))
        total = price * quantity
        subtotal += total
        lines.append({'product_id': product_id, 'name': product['name'], 'quantity': quantity, 'unit_price': float(price), 'line_total': float(total)})
    return {'items': lines, 'item_count': sum(consolidated.values()), 'subtotal': float(subtotal), 'shipping': 0, 'total': float(subtotal), 'currency': 'INR', 'demo': True, 'notice': CATALOG['pricingNotice'], 'shipping_notice': 'Shipping is not charged or arranged in this demonstration.'}


@app.get('/health')
def health():
    return {'status': 'ok', 'demo': True, 'version': '1.0.0'}


@app.get('/api/categories')
def categories():
    return {'categories': CATALOG['categories'], 'demo': True}


@app.get('/api/products')
def products(q: str = Query(default='', max_length=200), category: str | None = None, brand: str | None = None, min_price: float = Query(default=0, ge=0), max_price: float | None = Query(default=None, ge=0), sort: Literal['featured', 'price-asc', 'price-desc', 'name'] = 'featured'):
    if max_price is not None and min_price > max_price:
        raise HTTPException(status_code=422, detail='Minimum price cannot exceed maximum price.')
    terms = q.strip().lower()
    result = [p for p in PRODUCTS if (not terms or terms in f"{p['name']} {p['description']} {p['brand']}".lower()) and (not category or p['category'] == category) and (not brand or p['brand'] == brand) and p['price'] >= min_price and (max_price is None or p['price'] <= max_price)]
    key = {'featured': lambda p: (not p['featured'], p['name']), 'price-asc': lambda p: p['price'], 'price-desc': lambda p: -p['price'], 'name': lambda p: p['name']}[sort]
    result.sort(key=key)
    return {'products': result, 'count': len(result), 'currency': 'INR', 'demo': True, 'pricing_notice': CATALOG['pricingNotice']}


@app.get('/api/products/{slug}')
def product(slug: str):
    match = next((p for p in PRODUCTS if p['slug'] == slug), None)
    if not match:
        raise HTTPException(status_code=404, detail='Product not found.')
    return match


@app.post('/api/cart/quote')
def cart_quote(request: CartRequest):
    return quote(request.items)


@app.post('/api/demo-checkout')
def demo_checkout(request: CheckoutRequest):
    calculated = quote(request.items)
    return {'reference': f'DEMO-{uuid4().hex[:8].upper()}', 'status': 'demo_confirmation', 'demo': True, 'notice': DEMO_NOTICE, 'order': calculated}


@app.post('/api/contact')
def contact(request: ContactRequest):
    return {'status': 'demo_validated', 'demo': True, 'notice': 'Demo form validated. No message was sent and no details were stored.'}


@app.post('/api/bulk-enquiry')
def bulk_enquiry(request: BulkRequest):
    message = '\n'.join(['Hello Mate Electricals, I would like to enquire about a bulk requirement.', f'Name: {request.name}', f'Company: {request.company or "Not provided"}', f'Phone: {request.phone}', f'Requirements: {request.requirements}', f'Quantity: {request.quantity}', f'Additional notes: {request.message or "None"}', '', 'Please confirm availability, specifications and quotation.'])
    if not re.fullmatch(r'[1-9]\d{7,14}', WHATSAPP):
        raise HTTPException(status_code=503, detail='Business WhatsApp number is not configured correctly.')
    return {'status': 'demo_validated', 'demo': True, 'notice': 'No request has been sent. Opening WhatsApp prepares a message; you choose whether to send it.', 'whatsapp_url': f'https://wa.me/{WHATSAPP}?{urlencode({"text": message})}', 'contact_verified': False, 'contact_notice': CONTACT_NOTICE}
