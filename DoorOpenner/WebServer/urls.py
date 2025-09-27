from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('login/', views.loginPage , name = 'loginUser'),
    path('', views.welcomePage , name = "welcomeUser"),
    path('register/' ,views.registerPage , name = "registerUser"),
    path('profile/<int:id>/', views.ProfilePage , name= "profileUser"),
    path("logout/", views.logoutUser, name="logoutUser")
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)