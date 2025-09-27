
from .models import ImagesAccess
from django import forms

class ImageAccessForm(forms.ModelForm):
    class Meta :
     model  = ImagesAccess
     fields = ["email ","images"]
    