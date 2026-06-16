from django.shortcuts import render,redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Subcatagories
from .serializers import CategorySerializer , SubcatagoriesSerializer
from rest_framework import status
from django.contrib.auth import logout

def dashboard(request):
    
    user = request.user
    context = {
        'user' : user
    }
    return render(request,'admin/admin_dashboard.html', context)

def category_list(request):

    categories = Category.objects.all()

    context = {'categories': categories}

    return render(request,'admin/category_list.html',context)

@api_view(['GET'])
def get_categories(request):

    categories = Category.objects.all()

    serializer = CategorySerializer(
        categories,
        many=True
    )

    return Response(serializer.data)

@api_view(['POST'])
def add_category(request):

    serializer = CategorySerializer(data=request.data)

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['PUT'])
def update_category(request, id):

    category = Category.objects.get(id=id)

    serializer = CategorySerializer(
        category,
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(serializer.data)

    return Response(serializer.errors)

@api_view(['DELETE'])
def delete_category(request, id):

    try:

        category = Category.objects.get(id=id)

        if Subcatagories.objects.filter(
            category=category
        ).exists():

            return Response(
                {
                    'error':
                    'Cannot delete category with subcategories'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        category.delete()

        return Response(
            {
                'message':
                'Category deleted successfully'
            },
            status=status.HTTP_200_OK
        )

    except Category.DoesNotExist:

        return Response(
            {
                'error':
                'Category not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
@api_view(['GET'])
def get_subcategories(request, category_id):

    subcategories = Subcatagories.objects.filter(
        category_id=category_id
    )

    serializer = SubcatagoriesSerializer(
        subcategories,
        many=True
    )

    return Response(serializer.data)

@api_view(['POST'])
def add_subcategory(request):

    print("REQUEST DATA:", request.data)

    serializer = SubcatagoriesSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=201
        )

    print("ERRORS:", serializer.errors)

    return Response(
        serializer.errors,
        status=400
    )

@api_view(['PUT'])
def update_subcategory(request, id):

    try:

        subcategory = Subcatagories.objects.get(id=id)

        serializer = SubcatagoriesSerializer(
            subcategory,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )

    except Subcatagories.DoesNotExist:

        return Response(
            {"error": "Subcategory not found"},
            status=404
        )
    
def logout_view(request):

    logout(request)

    return redirect('login')