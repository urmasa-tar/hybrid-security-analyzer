from django.urls import path
from . import views

urlpatterns = [
    path('', views.AnalyzeView.as_view(), name='analyze'),
]