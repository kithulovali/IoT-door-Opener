from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class ImagesAccess(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField( max_length=254 , blank=True)
    images = models.ImageField(upload_to='images')
    updated_at = models.DateField(auto_now=True)
    created_at = models.DateField(auto_now_add=True)
   
    def __str__(self):
       return self.owner.username