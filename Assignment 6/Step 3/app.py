import time, random, os
from flask import Flask, jsonify, request

app = Flask(__name__)

def fake_latency(base_ms=20, jitter_ms=30):
    time.sleep((base_ms + random.randint(0, jitter_ms)) / 1000)

@app.route("/health")
def health():
    return jsonify({"status": "ok"}), 200

@app.route("/api/v1/products")
def products():
    fake_latency(15, 25)
    items = [{"id": i, "name": f"Product-{i}", "price": round(random.uniform(9.99, 299.99), 2)}
             for i in range(1, random.randint(8, 20))]
    return jsonify({"products": items, "total": len(items)}), 200

@app.route("/api/v1/products/<int:pid>")
def product_detail(pid):
    fake_latency(10, 20)
    return jsonify({"id": pid, "name": f"Product-{pid}", "stock": random.randint(0, 500)}), 200

@app.route("/api/v1/cart", methods=["POST"])
def add_to_cart():
    fake_latency(20, 40)
    return jsonify({"cart_id": "cart-abc123", "items_count": random.randint(1, 10)}), 201

@app.route("/api/v1/checkout", methods=["POST"])
def checkout():
    fake_latency(80, 120)   # heavier DB + payment simulation
    if random.random() < 0.03:   # 3 % synthetic error
        return jsonify({"error": "Payment gateway timeout"}), 504
    return jsonify({"order_id": f"ORD-{random.randint(10000,99999)}", "status": "confirmed"}), 200

@app.route("/api/v1/search")
def search():
    fake_latency(30, 60)
    q = request.args.get("q", "")
    return jsonify({"query": q, "results": random.randint(0, 200), "page": 1}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)