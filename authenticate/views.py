from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import UserProfile

def login_page(request):

    if request.method == "POST":
        
        username=request.POST.get('username')
        password=request.POST.get('password')
        role=request.POST.get('role')

        user=authenticate(
            username=username,
            password=password
        )

        if user is not None:

            login(request,user)

            if user.is_superuser and role=='admin':
                return redirect("/admin_dashboard/")
            
            profile=UserProfile.objects.get(user=user)

            if profile.role=='theatre' and role=='theatre':
                return redirect("/theatre_dashboard/")
            
            elif profile.role=='user' and role=='user':
                return redirect("/user_dashboard/")
            

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
            


