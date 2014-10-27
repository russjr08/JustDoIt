from django.core import serializers
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from app.models import ToDoItem

import json
import requests

# Create your views here.

def login(username, token):

    data = {'username': username, 'auth_token': token}
    req = requests.post('http://auth.kronosad.com/api/check_token/', data)
    if req.json()['message'] == 'Authentication Token is valid.':
        return True
    else:
        return False

def get_user_uuid(username):
    data = {'username': username}
    req = requests.post('http://auth.kronosad.com/api/get_user/' + username + '/', data)
    return req.json()['uuid']

# Regular Views

def index(request):
    return render(request, 'app/index.html')

def demo(request):
    return render(request, 'app/demo.html')

# API methods

# /api/items/
@csrf_exempt
def api_get_items(request):
    username = request.POST.get('username', 'NONE')
    token = request.POST.get('token', 'NONE')
    if login(username, token):
        if not ToDoItem.objects.filter(owner=get_user_uuid(username)):
            return HttpResponse(json.dumps({'message': 'No Items found.'}), content_type="application/json", status=404)
        else:
            #data = serializers.serialize('python', ToDoItem.objects.filter(owner=get_user_uuid(username)))
            #actual_data = [d['fields'] for d in data]
            return HttpResponse(serializers.serialize('json', ToDoItem.objects.filter(owner=get_user_uuid(username))), content_type="application/json", status=200)
    else:
        return HttpResponse(json.dumps({'message': 'Authentication Server rejected token.'}), content_type="application/json", status=501)

# /api/items/add/
@csrf_exempt
def api_add_item(request):
    username = request.POST.get('username', 'NONE')
    token = request.POST.get('token', 'NONE')

    name = request.POST.get('name', 'NONE')
    description = request.POST.get('description', 'NONE')
    completed = request.POST.get('completed', False)
    if login(username, token):
        owner = get_user_uuid(username)
        item = ToDoItem()
        item.owner = owner
        item.name = name
        item.description = description
        item.completed = completed
        item.save()
        return HttpResponse(json.dumps({'message': 'Item saved.'}))
    else:
        return HttpResposne(json.dumps({'message': 'Authentication Server rejected token.'}), content_type="application/json", status=501)

# /api/items/modify/
@csrf_exempt
def api_modify_item(request):
    username = request.POST.get('username', 'NONE')
    token = request.POST.get('token', 'NONE')

    if login(username, token):
        if request.POST.get('pk'):
            items = ToDoItem.objects.filter(pk=request.POST.get('pk'))
            if items.first():
                i = items.first()
                if i.owner == get_user_uuid(username):
                    if request.POST.get('name'):
                        i.name = request.POST.get('name')
                        i.save()
                    if request.POST.get('description'):
                        i.description = request.POST.get('description')
                        i.save()
                    if request.POST.get('completed'):
                        if request.POST.get('completed') == 'true':
                            i.completed = True;
                        else:
                            i.completed = False;
                        i.save()
                    return HttpResponse(json.dumps({'message': 'Item saved.'}), content_type="application/json", status=200)
                else:
                    return HttpResponse(json.dumps({'message': 'No item found with that pk'}), content_type="application/json", status=403)
            else:
                return HttpResponse(json.dumps({'message': 'No item found with that pk'}), content_type="application/json", status=404)
        else:
            return HttpResponse(json.dumps({'message': 'No pk specified'}), content_type="application/json", status=500)
    else:
        return HttpResponse(json.dumps({'message': 'Authentication Server rejected token.'}), content_type="application/json", status=501)

# /api/items/delete/
@csrf_exempt
def api_delete_item(request):
    username = request.POST.get('username', 'NONE')
    token = request.POST.get('token', 'NONE')

    if login(username, token):
        if request.POST.get('pk'):
            items = ToDoItem.objects.filter(pk=request.POST.get('pk'))
            if items.first():
                i = items.first()
                if i.owner == get_user_uuid(username):
                    i.delete()
                    return HttpResponse(json.dumps({'message': 'Item deleted.'}), content_type="application/json", status=200)
                else:
                    return HttpResponse(json.dumps({'message': 'No item found with that pk'}), content_type="application/json", status=403)
            else:
                return HttpResponse(json.dumps({'message': 'No item found with that pk'}), content_type="application/json", status=403)

        else:
            return HttpResponse(json.dumps({'message': 'No pk specified.'}), content_type="application/json", status=500)
