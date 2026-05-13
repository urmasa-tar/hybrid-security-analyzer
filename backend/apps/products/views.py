from rest_framework import generics
from rest_framework.response import Response
from django.db import connection
from .models import Product, Category
from .serializers import ProductSerializer

# VULNERABILITY: SQL Injection in category filter
class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    
    def get_queryset):
        category = self.request.query_params.get('category', '')
        
        # SQL injection vulnerability - direct string interpolation
        # Attack payload: ' OR '1'='1
        if category:
            query = f"SELECT * FROM products_product WHERE category_id = {category}"
            with connection.cursor() as cursor:
                cursor.execute(query)
                columns = [col[0] for col in cursor.description]
                products = []
                for row in cursor.fetchall():
                    products.append(dict(zip(columns, row)))
            return products
        return Product.objects.all()