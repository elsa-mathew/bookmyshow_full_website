from django.shortcuts import redirect
from authenticate.models import UserProfile

def admin_required(view_func):

    def wrapper(request, *args, **kwargs):

        if not request.user.is_authenticated:
            return redirect("login")

        if request.user.is_superuser:
            return view_func(request, *args, **kwargs)

        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return redirect("login")

        if profile.role != "admin":
            return redirect("login")

        return view_func(request, *args, **kwargs)

    return wrapper


def theatre_required(view_func):

    def wrapper(request, *args, **kwargs):

        if not request.user.is_authenticated:
            return redirect("login")

        if request.user.userprofile.role != "theatre":
            return redirect("login")

        return view_func(request, *args, **kwargs)

    return wrapper


def user_required(view_func):

    def wrapper(request, *args, **kwargs):

        if not request.user.is_authenticated:
            return redirect("login")

        if request.user.userprofile.role != "user":
            return redirect("login")

        return view_func(request, *args, **kwargs)

    return wrapper