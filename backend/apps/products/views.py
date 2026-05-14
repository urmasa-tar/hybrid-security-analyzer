from rest_framework import generics
from django.db import connection
from .models import Product
from .serializers import ProductSerializer

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        category = self.request.query_params.get('category', '')
        # SQL injection vulnerability (intentional)
        if category:
            with connection.cursor() as cursor:
                cursor.execute(f"SELECT * FROM products_product WHERE category_id = {category}")
                columns = [col[0] for col in cursor.description]
                return [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Product.objects.all()