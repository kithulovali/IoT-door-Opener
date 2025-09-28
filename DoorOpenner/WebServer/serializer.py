from rest_framework import serializers 
from .models import ImagesAccess 

class ImagesAcessSerializers(serializers.ModelSerializer):
    class Meta :
        model = ImagesAccess
        fields = ['id', 'owner', 'email', 'images']