from django.urls import path
from . import views
urlpatterns = [
    path('login/', views.loginPage , name = 'loginUser'),
    path('welcome/', views.welcomePage , name = "welcomeUser"),
    path('register/' ,views.registerPage , name = "registerUser"),
    path('profile/<int:id>', views.ProfilePage , name= "profile")
]
