"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Устанавливаем переменную окружения для настроек Django
# Здесь 'config.settings' — это путь к вашему файлу настроек
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Создаем WSGI приложение, которое будет обрабатывать запросы
application = get_wsgi_application()