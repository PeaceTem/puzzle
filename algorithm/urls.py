from django.urls import path
from .views import HomePage, my_json_view

urlpatterns = [
    path("", HomePage.as_view(), name="home"),
    path('api/post-json/', my_json_view, name='json_view'),
]

