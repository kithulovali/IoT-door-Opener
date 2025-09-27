from django.shortcuts import render , redirect
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm , UserChangeForm , AuthenticationForm
from django.contrib.auth import login

# Create your views here.

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

def ProfilePage(request , id):
    return render(request , "webServer/Profile.html")