from locust import HttpUser, task, between
import random


class EcommerceUser(HttpUser):
    wait_time = between(0.5, 2)

    @task(5)
    def browse_products(self):
        self.client.get("/api/v1/products", name="/api/v1/products")

    @task(4)
    def search(self):
        terms = ["laptop", "phone", "shirt", "shoes", "headphones", "desk"]
        self.client.get(f"/api/v1/search?q={random.choice(terms)}", name="/api/v1/search")

    @task(3)
    def view_product(self):
        pid = random.randint(1, 100)
        self.client.get(f"/api/v1/products/{pid}", name="/api/v1/products/[id]")

    @task(2)
    def add_to_cart(self):
        self.client.post(
            "/api/v1/cart",
            json={"product_id": random.randint(1, 100), "qty": random.randint(1, 3)},
            name="/api/v1/cart",
        )

    @task(1)
    def checkout(self):
        self.client.post(
            "/api/v1/checkout",
            json={
                "cart_id": "cart-abc123",
                "payment": {"type": "card", "token": "tok_test"},
            },
            name="/api/v1/checkout",
        )

    def on_start(self):
        self.client.get("/health")


class SpikeSurge(HttpUser):
    wait_time = between(0.1, 0.3)
    weight = 1   # lower weight than EcommerceUser

    @task
    def flood_search(self):
        self.client.get("/api/v1/search?q=sale", name="/api/v1/search [spike]")

    @task
    def flood_products(self):
        self.client.get("/api/v1/products", name="/api/v1/products [spike]")