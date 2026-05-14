from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home_view(request):
    return HttpResponse("""
        <h1>Auto Parts Store API</h1>
        <p>Сервер работает успешно!</p>
        <p>Доступные эндпоинты:</p>
        <ul>
            <li><a href='/admin/'>/admin/</a> - панель администратора</li>
            <li><a href='/api/users/register/'>/api/users/register/</a> - регистрация</li>
            <li><a href='/api/users/login/'>/api/users/login/</a> - вход</li>
            <li><a href='/api/products/'>/api/products/</a> - товары (SQLi уязвим)</li>
            <li><a href='/api/analyze/'>/api/analyze/</a> - Security Analyzer</li>
        </ul>
    """)

urlpatterns = [
    path('', home_view),
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/cart/', include('apps.cart.urls')),
    path('api/analyze/', include('apps.analyzer.urls')),
]