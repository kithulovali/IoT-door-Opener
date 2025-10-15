from django.shortcuts import render , redirect , get_object_or_404
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm , UserChangeForm , AuthenticationForm
from django.contrib.auth import login , logout
from django.contrib.auth.decorators import login_required
from .forms import ImageAccessForm
from .models import ImagesAccess
from .serializer import ImagesAcessSerializers
from rest_framework.decorators import api_view 
from rest_framework.response import Response
# Create your views here.

# api to the arduino board
@api_view(['GET'])
def user_images_api(request):
    images = ImagesAccess.objects.all()
    serializer = ImagesAcessSerializers(images , many=True ,context={'request':request})
    return Response(serializer.data)

#logout user
@login_required
def logoutUser(request):
    logout(request)
    return redirect("loginUser")

#login a user 
def loginPage(request):
    if request.method == "POST":
        form  = AuthenticationForm(request , data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect("welcomeUser")
    else :
        form = AuthenticationForm()
    return render(request , "WebServer/LoginPage.html",{"form" :form})

def welcomePage(request):
    return render(request ,"WebServer/Welcome.html")

# registration 
def registerPage(request):
    if request.method == 'POST':
        form  = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('loginUser')
    else :
        form = UserCreationForm()
    return render( request ,"WebServer/register.html",{"form":form})

#profile for images upload
@login_required
def ProfilePage(request, id):
    profile_user = get_object_or_404(User, id=id)
    # Only allow user to access their own profile
    if request.user.id != profile_user.id:
        return redirect('profileUser', id=request.user.id)
    # Get all images for this user
    images = ImagesAccess.objects.filter(owner=profile_user)
    # images upload
    if request.method == "POST":
        form = ImageAccessForm(request.POST, request.FILES)
        if form.is_valid():
            img = form.save(commit=False)
            img.owner = request.user
            img.save()
            return redirect('profileUser', id=request.user.id)
    else:
        form = ImageAccessForm(initial={'email': request.user.email})

    return render(request, 'WebServer/Profile.html', {
        'form': form,
        'images': images,
        'profile_user': profile_user
    })