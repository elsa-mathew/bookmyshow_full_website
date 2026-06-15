from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import UserProfile

def login_page(request):

    if request.method == "POST":

        print("post received")
        
        username=request.POST.get('username')
        password=request.POST.get('password')

        user=authenticate(
            username=username,
            password=password
        )

        if user is not None:

            print("user authenticated")

            login(request,user)

            if user.is_superuser:
                return redirect("/api/adminapp/")
            
            profile=UserProfile.objects.get(user=user)

            if profile.role=='theatre':
                return redirect("/api/theatre/")
            
            elif profile.role=='user':
                print(profile.role)
                print("redirecting to user dashboard")
                return redirect("/api/user/")
            

        else:
            return render(request, 'login.html')
        
    return render(request, 'login.html')
        
def register(request):

    if request.method == 'POST':

        username = request.POST.get('username')
        password = request.POST.get('password')
        role = request.POST.get('role')


        user = User.objects.create_user(
            username=username,
            password=password,
        )

        UserProfile.objects.create(
            user=user,
            role=role
        )

        return redirect('/')

    return render(request, 'register.html')
        
def logout_page(request):

    logout(request)

    return redirect('/')
            


