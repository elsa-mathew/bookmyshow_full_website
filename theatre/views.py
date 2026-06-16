from django.shortcuts import render,redirect

def dashboard(request):
    
    user = request.user
    context = {
        'user' : user
    }
    return render(request,'theatre/theatre_dashboard.html', context)
