from django.shortcuts import render,redirect

def dashboard(request):
    return render(request,'admin/admin_dashboard.html')
