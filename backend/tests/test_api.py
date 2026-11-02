from urllib.parse import parse_qs, urlparse
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)
ITEM = {'product_id': 'warm-led-bulb-9w', 'quantity': 2}
CUSTOMER = {'full_name': 'Demo Customer', 'mobile': '9000000000', 'email': 'demo@example.com', 'address': 'Example address for demo', 'city': 'Nagpur', 'state': 'Maharashtra', 'pin_code': '440001'}


def test_catalog_categories_and_filters():
    assert len(client.get('/api/categories').json()['categories']) == 8
    all_products = client.get('/api/products').json()['products']
    assert len(all_products) == 16
    result = client.get('/api/products', params={'category': 'led-lighting', 'max_price': 300}).json()
    assert [p['id'] for p in result['products']] == ['warm-led-bulb-9w']
    assert client.get('/api/products', params={'q': 'pendant'}).json()['count'] == 2
    prices = [p['price'] for p in client.get('/api/products?sort=price-desc').json()['products']]
    assert prices == sorted(prices, reverse=True)
    assert client.get('/api/products?min_price=1000&max_price=1').status_code == 422
    assert client.get('/api/products/nonexistent').status_code == 404


def test_quote_recomputes_totals_and_consolidates():
    response = client.post('/api/cart/quote', json={'items': [ITEM, ITEM]})
    assert response.status_code == 200
    result = response.json()
    assert result['item_count'] == 4
    assert result['subtotal'] == result['total'] == 796
    assert len(result['items']) == 1
    assert result['demo'] is True


def test_quote_rejects_unknown_invalid_and_tampered_input():
    for item in [{'product_id': 'unknown', 'quantity': 1}, {'product_id': ITEM['product_id'], 'quantity': 0}, {'product_id': ITEM['product_id'], 'quantity': -1}, {'product_id': ITEM['product_id'], 'quantity': True}, {'product_id': ITEM['product_id'], 'quantity': 1, 'price': 1}]:
        assert client.post('/api/cart/quote', json={'items': [item]}).status_code == 422
    assert client.post('/api/cart/quote', json={'items': [dict(ITEM, quantity=99), ITEM]}).status_code == 422
    assert client.post('/api/cart/quote', json={'items': []}).status_code == 422


def test_checkout_demo_confirmation_does_not_echo_personal_data():
    payload = {'items': [ITEM], 'customer': CUSTOMER, 'demo_acknowledged': True}
    response = client.post('/api/demo-checkout', json=payload)
    assert response.status_code == 200
    result = response.json()
    assert result['reference'].startswith('DEMO-')
    assert result['status'] == 'demo_confirmation'
    assert result['order']['total'] == 398
    assert CUSTOMER['email'] not in response.text
    assert 'No order has been placed' in result['notice']
    payload['customer'] = dict(CUSTOMER, pin_code='000000')
    assert client.post('/api/demo-checkout', json=payload).status_code == 422
    payload['customer'] = dict(CUSTOMER, mobile='1234567890')
    assert client.post('/api/demo-checkout', json=payload).status_code == 422
    payload['customer'] = CUSTOMER
    payload['demo_acknowledged'] = False
    assert client.post('/api/demo-checkout', json=payload).status_code == 422


def test_contact_is_validation_only():
    payload = {'name': 'Demo Customer', 'email': 'demo@example.com', 'phone': '', 'message': 'Please check availability.', 'demo_acknowledged': True}
    result = client.post('/api/contact', json=payload)
    assert result.status_code == 200
    assert 'No message was sent' in result.json()['notice']
    payload['email'] = 'bad-email'
    assert client.post('/api/contact', json=payload).status_code == 422


def test_bulk_whatsapp_encoded_message_and_contact_notice():
    payload = {'name': 'Demo & Customer', 'company': 'A+B & Co', 'phone': '9000000000', 'requirements': 'Switches & lights + fittings', 'quantity': 15, 'message': 'Quote please?', 'demo_acknowledged': True}
    response = client.post('/api/bulk-enquiry', json=payload)
    assert response.status_code == 200
    result = response.json()
    url = urlparse(result['whatsapp_url'])
    assert url.netloc == 'wa.me'
    assert url.path == '/919322172834'
    decoded = parse_qs(url.query)['text'][0]
    assert 'Switches & lights + fittings' in decoded
    assert 'A+B & Co' in decoded
    assert result['contact_verified'] is False
    assert 'Unverified' in result['contact_notice']


def test_indian_mobile_country_code_variants_are_normalized():
    for mobile in ['9000000000', '+91 90000 00000', '919000000000']:
        payload = {'items': [ITEM], 'customer': dict(CUSTOMER, mobile=mobile), 'demo_acknowledged': True}
        assert client.post('/api/demo-checkout', json=payload).status_code == 200
    invalid = {'items': [ITEM], 'customer': dict(CUSTOMER, mobile='91919000000000'), 'demo_acknowledged': True}
    assert client.post('/api/demo-checkout', json=invalid).status_code == 422
